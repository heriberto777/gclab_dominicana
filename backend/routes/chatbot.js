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

router.post("/proxy-webhook", async (req, res) => {
  try {
    const { webhookUrl, payload } = req.body;

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error en proxy webhook:", error);
    res.status(500).json({
      error: "Error al comunicarse con n8n",
      response:
        "Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.",
    });
  }
});

router.post("/conversation/create", async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: "sessionId es requerido" });
    }

    // Crear conversación (o actualizarla si ya existe)
    const result = await pool.query(
      `INSERT INTO chatbot_conversations (session_id, estado, created_at)
       VALUES ($1, 'activa', CURRENT_TIMESTAMP)
       ON CONFLICT (session_id)
       DO UPDATE SET updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [sessionId]
    );

    console.log("✅ Conversación creada:", result.rows[0]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error("❌ Error al crear conversación:", error);
    res.status(500).json({ error: "Error al crear conversación" });
  }
});

// Endpoint para guardar mensajes
router.post("/message/save", async (req, res) => {
  try {
    const { sessionId, sender, message, metadata } = req.body;

    // Obtener conversation_id desde session_id
    const conversation = await pool.query(
      "SELECT id FROM chatbot_conversations WHERE session_id = $1",
      [sessionId]
    );

    if (conversation.rows.length === 0) {
      return res.status(404).json({ error: "Conversación no encontrada" });
    }

    const conversationId = conversation.rows[0].id;

    // Guardar mensaje
    const result = await pool.query(
      `INSERT INTO chatbot_messages (conversation_id, sender, message, metadata, created_at)
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
       RETURNING *`,
      [
        conversationId,
        sender,
        message,
        metadata ? JSON.stringify(metadata) : null,
      ]
    );

    console.log("✅ Mensaje guardado:", result.rows[0]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error("❌ Error al guardar mensaje:", error);
    res.status(500).json({ error: "Error al guardar mensaje" });
  }
});
module.exports = router;
