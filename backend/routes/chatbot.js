// backend/routes/chatbot.js
const express = require("express");
const router = express.Router();
const pool = require("../db/connection");

// Obtener estadísticas del chatbot
router.get("/stats", async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT
        COUNT(*) as total_conversaciones,
        COUNT(*) FILTER (WHERE estado = 'activa') as activas,
        COUNT(*) FILTER (WHERE estado = 'cerrada') as cerradas,
        COUNT(*) FILTER (WHERE estado = 'esperando_contacto') as esperando_contacto,
        COUNT(*) FILTER (WHERE cliente_email IS NOT NULL) as con_datos_contacto
      FROM chatbot_conversations
    `);

    const messagesStats = await pool.query(`
      SELECT
        COUNT(*) as total_mensajes,
        COUNT(*) FILTER (WHERE sender = 'user') as mensajes_usuario,
        COUNT(*) FILTER (WHERE sender = 'bot') as mensajes_bot
      FROM chatbot_messages
    `);

    res.json({
      conversaciones: stats.rows[0],
      mensajes: messagesStats.rows[0],
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error al obtener estadísticas" });
  }
});

// Buscar productos (para n8n)
router.post("/search/productos", async (req, res) => {
  try {
    const { query, limit = 5 } = req.body;

    const result = await pool.query(
      `SELECT p.id, p.nombre, p.slug, p.descripcion, c.nombre as categoria
       FROM productos p
       LEFT JOIN categorias c ON p.categoria_id = c.id
       WHERE p.activo = true
       AND (p.nombre ILIKE $1 OR p.descripcion ILIKE $1)
       ORDER BY p.destacado DESC, p.nombre ASC
       LIMIT $2`,
      [`%${query}%`, limit]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error al buscar productos" });
  }
});

// Buscar categorías (para n8n)
router.post("/search/categorias", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, nombre, slug, descripcion
       FROM categorias
       WHERE activo = true
       ORDER BY orden ASC, nombre ASC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error al buscar categorías" });
  }
});

// Buscar mercados (para n8n)
router.post("/search/mercados", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, nombre, slug, descripcion, soluciones
       FROM mercados
       WHERE activo = true
       ORDER BY orden ASC, nombre ASC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error al buscar mercados" });
  }
});

// Buscar servicios técnicos (para n8n)
router.post("/search/servicios", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, titulo, descripcion
       FROM servicios_tecnicos
       WHERE activo = true
       ORDER BY orden ASC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error al buscar servicios" });
  }
});

module.exports = router;
