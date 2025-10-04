const express = require("express");
const pool = require("../db/connection");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Obtener todas las redes sociales (públicas)
router.get("/", async (req, res) => {
  try {
    const { activo } = req.query;
    let query = "SELECT * FROM social_media WHERE 1=1";

    if (activo !== "false") {
      query += " AND activo = true";
    }

    query += " ORDER BY orden ASC";

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener redes sociales:", error);
    res.status(500).json({ error: "Error al obtener redes sociales" });
  }
});

// Obtener una red social específica
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM social_media WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Red social no encontrada" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener red social:", error);
    res.status(500).json({ error: "Error al obtener red social" });
  }
});

// Crear nueva red social (requiere autenticación)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { nombre, url, logo_url, orden, activo } = req.body;

    if (!nombre || !url) {
      return res.status(400).json({ error: "Nombre y URL son requeridos" });
    }

    const result = await pool.query(
      `INSERT INTO social_media (nombre, url, logo_url, orden, activo, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING *`,
      [nombre, url, logo_url || null, orden || 0, activo !== false]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al crear red social:", error);
    res.status(500).json({ error: "Error al crear red social" });
  }
});

// Actualizar red social (requiere autenticación)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, url, logo_url, orden, activo } = req.body;

    const result = await pool.query(
      `UPDATE social_media SET
        nombre = COALESCE($1, nombre),
        url = COALESCE($2, url),
        logo_url = $3,
        orden = COALESCE($4, orden),
        activo = COALESCE($5, activo),
        updated_at = NOW()
       WHERE id = $6
       RETURNING *`,
      [nombre, url, logo_url, orden, activo, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Red social no encontrada" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al actualizar red social:", error);
    res.status(500).json({ error: "Error al actualizar red social" });
  }
});

// Eliminar red social (requiere autenticación)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM social_media WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Red social no encontrada" });
    }

    res.json({ message: "Red social eliminada exitosamente" });
  } catch (error) {
    console.error("Error al eliminar red social:", error);
    res.status(500).json({ error: "Error al eliminar red social" });
  }
});

module.exports = router;
