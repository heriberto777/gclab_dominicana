-- Migration: Create heroes table
-- Description: Table for managing hero sections dynamically

CREATE TABLE IF NOT EXISTS heroes (
  id SERIAL PRIMARY KEY,
  seccion VARCHAR(255) UNIQUE NOT NULL,
  titulo VARCHAR(500),
  subtitulo TEXT,
  imagen_url TEXT,
  cta_texto VARCHAR(255),
  cta_link VARCHAR(500),
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_heroes_seccion ON heroes(seccion);
CREATE INDEX IF NOT EXISTS idx_heroes_activo ON heroes(activo);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_heroes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_heroes_timestamp
BEFORE UPDATE ON heroes
FOR EACH ROW
EXECUTE FUNCTION update_heroes_updated_at();

-- Insertar heroes de ejemplo
INSERT INTO heroes (seccion, titulo, subtitulo, imagen_url, cta_texto, cta_link, activo) VALUES
  (
    'home',
    'Soluciones Científicas de Vanguardia',
    'Equipos e instrumentos de laboratorio de alta precisión',
    'https://images.pexels.com/photos/3825540/pexels-photo-3825540.jpeg?auto=compress&cs=tinysrgb&w=1600',
    'Explorar Productos',
    '/productos',
    true
  ),
  (
    'productos',
    'Nuestros Productos',
    'Tecnología de vanguardia para su laboratorio',
    'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=1600',
    '',
    '',
    true
  ),
  (
    'quienes-somos',
    'Quienes Somos',
    'Expertos en soluciones para laboratorios',
    'https://images.pexels.com/photos/2280568/pexels-photo-2280568.jpeg?auto=compress&cs=tinysrgb&w=1600',
    '',
    '',
    true
  ),
  (
    'soporte',
    'Soporte y Servicio Técnico',
    'Mantenimiento, calibración y soporte técnico especializado',
    'https://images.pexels.com/photos/8326726/pexels-photo-8326726.jpeg?auto=compress&cs=tinysrgb&w=1600',
    '',
    '',
    true
  )
ON CONFLICT (seccion) DO NOTHING;