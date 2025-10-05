const express = require("express");
const pool = require("../db/connection");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Obtener todos los mercados (públicas)
router.get("/", async (req, res) => {
  try {
    const { activo } = req.query;
    let query = "SELECT * FROM mercados WHERE 1=1";

    if (activo !== "false") {
      query += " AND activo = true";
    }

    query += " ORDER BY orden ASC";

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener mercados:", error);
    res.status(500).json({ error: "Error al obtener mercados" });
  }
});

// Obtener mercado por slug
router.get("/slug/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const result = await pool.query("SELECT * FROM mercados WHERE slug = $1", [
      slug,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Mercado no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener mercado:", error);
    res.status(500).json({ error: "Error al obtener mercado" });
  }
});

// Obtener un mercado específico por ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM mercados WHERE id = $1", [
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Mercado no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener mercado:", error);
    res.status(500).json({ error: "Error al obtener mercado" });
  }
});

// Crear nuevo mercado (requiere autenticación)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      nombre,
      slug,
      titulo_hero,
      subtitulo_hero,
      imagen_hero_url,
      descripcion,
      contenido,
      soluciones,
      orden,
      activo,
    } = req.body;

    if (!nombre || !slug) {
      return res.status(400).json({ error: "Nombre y slug son requeridos" });
    }

    const existingSlug = await pool.query(
      "SELECT id FROM mercados WHERE slug = $1",
      [slug]
    );
    if (existingSlug.rows.length > 0) {
      return res.status(400).json({ error: "El slug ya existe" });
    }

    const result = await pool.query(
      `INSERT INTO mercados (
        nombre, slug, titulo_hero, subtitulo_hero, imagen_hero_url,
        descripcion, contenido, soluciones, orden, activo, created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
      RETURNING *`,
      [
        nombre,
        slug,
        titulo_hero || "",
        subtitulo_hero || "",
        imagen_hero_url || "",
        descripcion || "",
        contenido || "",
        soluciones || [],
        orden || 0,
        activo !== false,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al crear mercado:", error);
    res.status(500).json({ error: "Error al crear mercado" });
  }
});

// Actualizar mercado (requiere autenticación)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      slug,
      titulo_hero,
      subtitulo_hero,
      imagen_hero_url,
      descripcion,
      contenido,
      soluciones,
      orden,
      activo,
    } = req.body;

    if (slug) {
      const existingSlug = await pool.query(
        "SELECT id FROM mercados WHERE slug = $1 AND id != $2",
        [slug, id]
      );
      if (existingSlug.rows.length > 0) {
        return res.status(400).json({ error: "El slug ya existe" });
      }
    }

    const result = await pool.query(
      `UPDATE mercados SET
        nombre = COALESCE($1, nombre),
        slug = COALESCE($2, slug),
        titulo_hero = COALESCE($3, titulo_hero),
        subtitulo_hero = COALESCE($4, subtitulo_hero),
        imagen_hero_url = COALESCE($5, imagen_hero_url),
        descripcion = COALESCE($6, descripcion),
        contenido = COALESCE($7, contenido),
        soluciones = COALESCE($8, soluciones),
        orden = COALESCE($9, orden),
        activo = COALESCE($10, activo),
        updated_at = NOW()
       WHERE id = $11
       RETURNING *`,
      [
        nombre,
        slug,
        titulo_hero,
        subtitulo_hero,
        imagen_hero_url,
        descripcion,
        contenido,
        soluciones,
        orden,
        activo,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Mercado no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al actualizar mercado:", error);
    res.status(500).json({ error: "Error al actualizar mercado" });
  }
});

// Eliminar mercado (requiere autenticación)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM mercados WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Mercado no encontrado" });
    }

    res.json({ message: "Mercado eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar mercado:", error);
    res.status(500).json({ error: "Error al eliminar mercado" });
  }
});

module.exports = router;
