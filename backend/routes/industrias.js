const express = require("express");
const pool = require("../db/connection");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Obtener todas las industrias (públicas)
router.get("/", async (req, res) => {
  try {
    const { activo } = req.query;
    let query = "SELECT * FROM industrias WHERE 1=1";

    if (activo !== "false") {
      query += " AND activo = true";
    }

    query += " ORDER BY orden ASC";

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener industrias:", error);
    res.status(500).json({ error: "Error al obtener industrias" });
  }
});

// Obtener una industria específica
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM industrias WHERE id = $1", [
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Industria no encontrada" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener industria:", error);
    res.status(500).json({ error: "Error al obtener industria" });
  }
});

// Crear nueva industria (requiere autenticación)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { nombre, slug, icono_url, orden, activo } = req.body;

    if (!nombre || !slug) {
      return res.status(400).json({ error: "Nombre y slug son requeridos" });
    }

    const existingSlug = await pool.query(
      "SELECT id FROM industrias WHERE slug = $1",
      [slug]
    );
    if (existingSlug.rows.length > 0) {
      return res.status(400).json({ error: "El slug ya existe" });
    }

    const result = await pool.query(
      `INSERT INTO industrias (nombre, slug, icono_url, orden, activo, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING *`,
      [nombre, slug, icono_url || "", orden || 0, activo !== false]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al crear industria:", error);
    res.status(500).json({ error: "Error al crear industria" });
  }
});

// Actualizar industria (requiere autenticación)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, slug, icono_url, orden, activo } = req.body;

    if (slug) {
      const existingSlug = await pool.query(
        "SELECT id FROM industrias WHERE slug = $1 AND id != $2",
        [slug, id]
      );
      if (existingSlug.rows.length > 0) {
        return res.status(400).json({ error: "El slug ya existe" });
      }
    }

    const result = await pool.query(
      `UPDATE industrias SET
        nombre = COALESCE($1, nombre),
        slug = COALESCE($2, slug),
        icono_url = COALESCE($3, icono_url),
        orden = COALESCE($4, orden),
        activo = COALESCE($5, activo),
        updated_at = NOW()
       WHERE id = $6
       RETURNING *`,
      [nombre, slug, icono_url, orden, activo, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Industria no encontrada" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al actualizar industria:", error);
    res.status(500).json({ error: "Error al actualizar industria" });
  }
});

// Eliminar industria (requiere autenticación)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM industrias WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Industria no encontrada" });
    }

    res.json({ message: "Industria eliminada exitosamente" });
  } catch (error) {
    console.error("Error al eliminar industria:", error);
    res.status(500).json({ error: "Error al eliminar industria" });
  }
});

module.exports = router;
