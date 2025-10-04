-- Migration: Create industrias table
-- Description: Table for managing industry sectors displayed on home page

CREATE TABLE IF NOT EXISTS industrias (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  icono_url TEXT,
  orden INTEGER DEFAULT 0,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_industrias_slug ON industrias(slug);
CREATE INDEX IF NOT EXISTS idx_industrias_activo ON industrias(activo);
CREATE INDEX IF NOT EXISTS idx_industrias_orden ON industrias(orden);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_industrias_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_industrias_timestamp
BEFORE UPDATE ON industrias
FOR EACH ROW
EXECUTE FUNCTION update_industrias_updated_at();

-- Insertar industrias de ejemplo
INSERT INTO industrias (nombre, slug, icono_url, orden, activo) VALUES
  ('Industria Farmacéutica', 'industria-farmaceutica', '', 1, true),
  ('Minas y Cemento', 'energia-minas-cemento', '', 2, true),
  ('Industria Química', 'industria-quimica', '', 3, true),
  ('Life Science', 'life-sciences', '', 4, true),
  ('Investigación y Desarrollo', 'investigacion-desarrollo', '', 5, true),
  ('Medio Ambiente', 'medio-ambiente', '', 6, true),
  ('Alimentos y Bebidas', 'alimentos', '', 7, true),
  ('Medical Devices', 'industria-farmaceutica', '', 8, true)
ON CONFLICT (slug) DO NOTHING;