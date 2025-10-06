-- backend/migrations/13_create_chatbot_tables.sql

-- Tabla para conversaciones del chatbot
CREATE TABLE IF NOT EXISTS chatbot_conversations (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(255) UNIQUE NOT NULL,
  cliente_nombre VARCHAR(255),
  cliente_email VARCHAR(255),
  cliente_telefono VARCHAR(50),
  estado VARCHAR(50) DEFAULT 'activa', -- activa, cerrada, esperando_contacto
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para mensajes del chatbot
CREATE TABLE IF NOT EXISTS chatbot_messages (
  id SERIAL PRIMARY KEY,
  conversation_id INTEGER NOT NULL REFERENCES chatbot_conversations(id) ON DELETE CASCADE,
  sender VARCHAR(20) NOT NULL, -- 'user' o 'bot'
  message TEXT NOT NULL,
  metadata JSONB, -- Para guardar datos adicionales
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_conversations_session ON chatbot_conversations(session_id);
CREATE INDEX idx_conversations_estado ON chatbot_conversations(estado);
CREATE INDEX idx_messages_conversation ON chatbot_messages(conversation_id);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_chatbot_conversations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_chatbot_conversations_timestamp
BEFORE UPDATE ON chatbot_conversations
FOR EACH ROW
EXECUTE FUNCTION update_chatbot_conversations_updated_at();