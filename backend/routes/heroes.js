const express = require("express");
const pool = require("../db/connection");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Obtener todos los heroes (públicas)
router.get("/", async (req, res) => {
  try {
    const { activo } = req.query;
    let query = "SELECT * FROM heroes WHERE 1=1";

    if (activo !== "false") {
      query += " AND activo = true";
    }

    query += " ORDER BY seccion ASC";

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener heroes:", error);
    res.status(500).json({ error: "Error al obtener heroes" });
  }
});

// Obtener hero por sección
router.get("/seccion/:seccion", async (req, res) => {
  try {
    const { seccion } = req.params;
    const result = await pool.query(
      "SELECT * FROM heroes WHERE seccion = $1 AND activo = true",
      [seccion]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Hero no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener hero:", error);
    res.status(500).json({ error: "Error al obtener hero" });
  }
});

// Obtener un hero específico por ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM heroes WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Hero no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener hero:", error);
    res.status(500).json({ error: "Error al obtener hero" });
  }
});

// Crear nuevo hero (requiere autenticación)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      seccion,
      titulo,
      subtitulo,
      imagen_url,
      cta_texto,
      cta_link,
      activo,
    } = req.body;

    if (!seccion) {
      return res.status(400).json({ error: "Sección es requerida" });
    }

    const existingSeccion = await pool.query(
      "SELECT id FROM heroes WHERE seccion = $1",
      [seccion]
    );

    if (existingSeccion.rows.length > 0) {
      return res.status(400).json({ error: "La sección ya existe" });
    }

    const result = await pool.query(
      `INSERT INTO heroes (seccion, titulo, subtitulo, imagen_url, cta_texto, cta_link, activo, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
       RETURNING *`,
      [
        seccion,
        titulo || "",
        subtitulo || "",
        imagen_url || "",
        cta_texto || "",
        cta_link || "",
        activo !== false,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al crear hero:", error);
    res.status(500).json({ error: "Error al crear hero" });
  }
});

// Actualizar hero (requiere autenticación)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      seccion,
      titulo,
      subtitulo,
      imagen_url,
      cta_texto,
      cta_link,
      activo,
    } = req.body;

    if (seccion) {
      const existingSeccion = await pool.query(
        "SELECT id FROM heroes WHERE seccion = $1 AND id != $2",
        [seccion, id]
      );
      if (existingSeccion.rows.length > 0) {
        return res.status(400).json({ error: "La sección ya existe" });
      }
    }

    const result = await pool.query(
      `UPDATE heroes SET
        seccion = COALESCE($1, seccion),
        titulo = COALESCE($2, titulo),
        subtitulo = COALESCE($3, subtitulo),
        imagen_url = COALESCE($4, imagen_url),
        cta_texto = COALESCE($5, cta_texto),
        cta_link = COALESCE($6, cta_link),
        activo = COALESCE($7, activo),
        updated_at = NOW()
       WHERE id = $8
       RETURNING *`,
      [seccion, titulo, subtitulo, imagen_url, cta_texto, cta_link, activo, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Hero no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al actualizar hero:", error);
    res.status(500).json({ error: "Error al actualizar hero" });
  }
});

// Eliminar hero (requiere autenticación)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM heroes WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Hero no encontrado" });
    }

    res.json({ message: "Hero eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar hero:", error);
    res.status(500).json({ error: "Error al eliminar hero" });
  }
});

module.exports = router;
