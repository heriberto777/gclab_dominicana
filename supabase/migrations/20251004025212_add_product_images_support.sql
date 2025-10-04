/*
  # Add Multiple Images Support for Products

  1. Changes
    - Add `imagenes` JSONB column to `productos` table to store array of image URLs
    - Keep `imagen_principal` for backward compatibility (will be used as primary image)
  
  2. Notes
    - imagenes will store array of image URL strings: ["url1", "url2", "url3"]
    - If imagenes is null or empty, will fallback to imagen_principal
*/

-- Add imagenes column to productos table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'productos' AND column_name = 'imagenes'
  ) THEN
    ALTER TABLE productos ADD COLUMN imagenes JSONB DEFAULT '[]'::jsonb;
  END IF;
END $$;
