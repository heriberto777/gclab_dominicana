-- Migration: Create productos table
-- Description: Main products table with support for multiple images

CREATE TABLE IF NOT EXISTS productos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  descripcion TEXT,
  categoria_id INTEGER REFERENCES categorias(id) ON DELETE SET NULL,
  imagen_principal TEXT,
  imagenes_adicionales TEXT[],
  activo BOOLEAN DEFAULT true,
  destacado BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_productos_slug ON productos(slug);
CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos(categoria_id);
CREATE INDEX IF NOT EXISTS idx_productos_activo ON productos(activo);
CREATE INDEX IF NOT EXISTS idx_productos_destacado ON productos(destacado);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_productos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_productos_timestamp
BEFORE UPDATE ON productos
FOR EACH ROW
EXECUTE FUNCTION update_productos_updated_at();

-- Función para generar slug automático si no se proporciona
CREATE OR REPLACE FUNCTION generate_producto_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := lower(regexp_replace(NEW.nombre, '[^a-zA-Z0-9]+', '-', 'g'));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generate_producto_slug
BEFORE INSERT OR UPDATE ON productos
FOR EACH ROW
EXECUTE FUNCTION generate_producto_slug();

-- Insertar productos de ejemplo
INSERT INTO productos (nombre, slug, descripcion, categoria_id, activo, destacado) VALUES
  (
    'HPLC Serie 1200',
    'hplc-serie-1200',
    'Sistema de cromatografía líquida de alta resolución con detector UV-VIS',
    (SELECT id FROM categorias WHERE slug = 'cromatografia' LIMIT 1),
    true,
    true
  ),
  (
    'Balanza Analítica XPR',
    'balanza-analitica-xpr',
    'Balanza analítica de precisión con capacidad de 220g y resolución de 0.0001g',
    (SELECT id FROM categorias WHERE slug = 'balanzas' LIMIT 1),
    true,
    false
  )
ON CONFLICT (slug) DO NOTHING;
