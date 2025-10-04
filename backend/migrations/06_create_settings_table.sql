-- Migration: Create settings table
-- Description: System configuration and settings storage

CREATE TABLE IF NOT EXISTS settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(255) UNIQUE NOT NULL,
  value TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_settings_timestamp
BEFORE UPDATE ON settings
FOR EACH ROW
EXECUTE FUNCTION update_settings_updated_at();

-- Insertar configuraciones por defecto
INSERT INTO settings (key, value, description) VALUES
  ('n8n_webhook_url', '', 'URL del webhook de n8n para el chatbot'),
  ('contact_webhook_url', '', 'URL del webhook de n8n para el formulario de contacto'),
  ('site_name', 'GC Lab', 'Nombre del sitio web'),
  ('site_email', 'info@gclab.com', 'Email de contacto del sitio'),
  ('site_phone', '809-000-0000', 'Teléfono de contacto del sitio')
ON CONFLICT (key) DO NOTHING;
