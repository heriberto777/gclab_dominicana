-- Migration: Create producto_proveedores table
-- Description: Junction table linking products with suppliers and their pricing

CREATE TABLE IF NOT EXISTS producto_proveedores (
  id SERIAL PRIMARY KEY,
  producto_id INTEGER NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  proveedor_id INTEGER NOT NULL REFERENCES proveedores(id) ON DELETE CASCADE,
  precio DECIMAL(10, 2),
  moneda VARCHAR(3) DEFAULT 'USD',
  codigo_producto VARCHAR(255),
  disponible BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(producto_id, proveedor_id)
);

CREATE INDEX IF NOT EXISTS idx_producto_proveedores_producto ON producto_proveedores(producto_id);
CREATE INDEX IF NOT EXISTS idx_producto_proveedores_proveedor ON producto_proveedores(proveedor_id);
CREATE INDEX IF NOT EXISTS idx_producto_proveedores_disponible ON producto_proveedores(disponible);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_producto_proveedores_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_producto_proveedores_timestamp
BEFORE UPDATE ON producto_proveedores
FOR EACH ROW
EXECUTE FUNCTION update_producto_proveedores_updated_at();

-- Insertar relaciones de ejemplo
INSERT INTO producto_proveedores (producto_id, proveedor_id, precio, moneda, codigo_producto, disponible)
SELECT
  p.id,
  prov.id,
  5999.99,
  'USD',
  'AGI-1200-HPLC',
  true
FROM productos p
CROSS JOIN proveedores prov
WHERE p.slug = 'hplc-serie-1200' AND prov.slug = 'agilent'
LIMIT 1
ON CONFLICT (producto_id, proveedor_id) DO NOTHING;

INSERT INTO producto_proveedores (producto_id, proveedor_id, precio, moneda, codigo_producto, disponible)
SELECT
  p.id,
  prov.id,
  1299.99,
  'USD',
  'MT-XPR220',
  true
FROM productos p
CROSS JOIN proveedores prov
WHERE p.slug = 'balanza-analitica-xpr' AND prov.slug = 'mettler-toledo'
LIMIT 1
ON CONFLICT (producto_id, proveedor_id) DO NOTHING;
