const express = require("express");
const pool = require("../db/connection");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Obtener todos los servicios técnicos
router.get("/", async (req, res) => {
  try {
    const { activo } = req.query;
    let query = "SELECT * FROM servicios_tecnicos WHERE 1=1";

    if (activo !== "false") {
      query += " AND activo = true";
    }

    query += " ORDER BY orden ASC";

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener servicios técnicos:", error);
    res.status(500).json({ error: "Error al obtener servicios técnicos" });
  }
});

// Obtener un servicio técnico específico
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM servicios_tecnicos WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Servicio técnico no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener servicio técnico:", error);
    res.status(500).json({ error: "Error al obtener servicio técnico" });
  }
});

// Crear nuevo servicio técnico (requiere autenticación)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { titulo, slug, descripcion, imagen_url, orden, activo } = req.body;

    if (!titulo || !slug) {
      return res.status(400).json({ error: "Título y slug son requeridos" });
    }

    const existingSlug = await pool.query(
      "SELECT id FROM servicios_tecnicos WHERE slug = $1",
      [slug]
    );

    if (existingSlug.rows.length > 0) {
      return res.status(400).json({ error: "El slug ya existe" });
    }

    const result = await pool.query(
      `INSERT INTO servicios_tecnicos (titulo, slug, descripcion, imagen_url, orden, activo, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING *`,
      [
        titulo,
        slug,
        descripcion || "",
        imagen_url || "",
        orden || 0,
        activo !== false,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al crear servicio técnico:", error);
    res.status(500).json({ error: "Error al crear servicio técnico" });
  }
});

// Actualizar servicio técnico (requiere autenticación)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, slug, descripcion, imagen_url, orden, activo } = req.body;

    if (slug) {
      const existingSlug = await pool.query(
        "SELECT id FROM servicios_tecnicos WHERE slug = $1 AND id != $2",
        [slug, id]
      );
      if (existingSlug.rows.length > 0) {
        return res.status(400).json({ error: "El slug ya existe" });
      }
    }

    const result = await pool.query(
      `UPDATE servicios_tecnicos SET
        titulo = COALESCE($1, titulo),
        slug = COALESCE($2, slug),
        descripcion = COALESCE($3, descripcion),
        imagen_url = COALESCE($4, imagen_url),
        orden = COALESCE($5, orden),
        activo = COALESCE($6, activo),
        updated_at = NOW()
       WHERE id = $7
       RETURNING *`,
      [titulo, slug, descripcion, imagen_url, orden, activo, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Servicio técnico no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al actualizar servicio técnico:", error);
    res.status(500).json({ error: "Error al actualizar servicio técnico" });
  }
});

// Eliminar servicio técnico (requiere autenticación)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM servicios_tecnicos WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Servicio técnico no encontrado" });
    }

    res.json({ message: "Servicio técnico eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar servicio técnico:", error);
    res.status(500).json({ error: "Error al eliminar servicio técnico" });
  }
});

module.exports = router;
