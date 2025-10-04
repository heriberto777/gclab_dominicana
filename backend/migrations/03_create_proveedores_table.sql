-- Migration: Create proveedores table
-- Description: Table for product suppliers/vendors

CREATE TABLE IF NOT EXISTS proveedores (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  descripcion TEXT,
  logo_url TEXT,
  sitio_web TEXT,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_proveedores_slug ON proveedores(slug);
CREATE INDEX IF NOT EXISTS idx_proveedores_activo ON proveedores(activo);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_proveedores_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_proveedores_timestamp
BEFORE UPDATE ON proveedores
FOR EACH ROW
EXECUTE FUNCTION update_proveedores_updated_at();

-- Insertar proveedores de ejemplo
INSERT INTO proveedores (nombre, slug, descripcion, activo) VALUES
  ('Agilent', 'agilent', 'Líder mundial en equipos de cromatografía y espectroscopia', true),
  ('Thermo Fisher', 'thermo-fisher', 'Proveedor global de equipos científicos', true),
  ('Waters', 'waters', 'Especialista en cromatografía líquida', true),
  ('Mettler Toledo', 'mettler-toledo', 'Líder en balanzas de precisión', true)
ON CONFLICT (slug) DO NOTHING;
