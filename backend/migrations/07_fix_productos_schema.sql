-- Migration: Fix productos table schema
-- Description: Remove proveedor_id column if exists (should use producto_proveedores table)

-- Remove proveedor_id column if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'productos' AND column_name = 'proveedor_id'
  ) THEN
    ALTER TABLE productos DROP COLUMN proveedor_id;
  END IF;
END $$;

-- Remove especificaciones column if it exists (not in current schema)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'productos' AND column_name = 'especificaciones'
  ) THEN
    ALTER TABLE productos DROP COLUMN especificaciones;
  END IF;
END $$;

-- Remove aplicaciones column if it exists (not in current schema)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'productos' AND column_name = 'aplicaciones'
  ) THEN
    ALTER TABLE productos DROP COLUMN aplicaciones;
  END IF;
END $$;
