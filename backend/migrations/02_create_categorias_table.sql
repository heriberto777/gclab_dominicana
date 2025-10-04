-- Migration: Create categorias table
-- Description: Table for product categories with ordering support

CREATE TABLE IF NOT EXISTS categorias (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  descripcion TEXT,
  icono_url TEXT,
  orden INTEGER DEFAULT 0,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_categorias_slug ON categorias(slug);
CREATE INDEX IF NOT EXISTS idx_categorias_activo ON categorias(activo);
CREATE INDEX IF NOT EXISTS idx_categorias_orden ON categorias(orden);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_categorias_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_categorias_timestamp
BEFORE UPDATE ON categorias
FOR EACH ROW
EXECUTE FUNCTION update_categorias_updated_at();

-- Insertar categorías de ejemplo
INSERT INTO categorias (nombre, slug, descripcion, orden, activo) VALUES
  ('Cromatografía', 'cromatografia', 'Equipos y consumibles para cromatografía líquida y de gases', 1, true),
  ('Espectroscopia', 'espectroscopia', 'Equipos de análisis espectroscópico', 2, true),
  ('Balanzas', 'balanzas', 'Balanzas analíticas y de precisión', 3, true),
  ('Equipos de Laboratorio', 'equipos-laboratorio', 'Equipamiento general de laboratorio', 4, true)
ON CONFLICT (slug) DO NOTHING;
