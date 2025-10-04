-- Migration: Create social_media table
-- Description: Table for managing social media links

CREATE TABLE IF NOT EXISTS social_media (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  logo_url TEXT,
  orden INTEGER DEFAULT 0,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_social_media_activo ON social_media(activo);
CREATE INDEX IF NOT EXISTS idx_social_media_orden ON social_media(orden);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_social_media_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_social_media_timestamp
BEFORE UPDATE ON social_media
FOR EACH ROW
EXECUTE FUNCTION update_social_media_updated_at();

-- Insertar redes sociales de ejemplo
INSERT INTO social_media (nombre, url, logo_url, orden, activo) VALUES
  ('Facebook', 'https://facebook.com/gclabdominicana', 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/facebook.svg', 1, true),
  ('Instagram', 'https://instagram.com/gclabdominicana', 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/instagram.svg', 2, true),
  ('LinkedIn', 'https://linkedin.com/company/gclab', 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/linkedin.svg', 3, true),
  ('Twitter', 'https://twitter.com/gclabdominicana', 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/twitter.svg', 4, true)
ON CONFLICT DO NOTHING;