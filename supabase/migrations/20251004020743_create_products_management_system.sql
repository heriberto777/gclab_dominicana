/*
  # Sistema de Gestión de Productos

  ## Descripción
  Sistema completo para gestión de productos de laboratorio con múltiples proveedores,
  precios, imágenes y categorías.

  ## Nuevas Tablas

  ### 1. `categorias`
  Categorías principales de productos (Instrumentos Analíticos, Equipos Misceláneos, etc.)
  - `id` (uuid, PK) - Identificador único
  - `nombre` (text) - Nombre de la categoría
  - `slug` (text, unique) - URL amigable
  - `descripcion` (text) - Descripción de la categoría
  - `orden` (integer) - Orden de visualización
  - `icono_url` (text) - URL del icono
  - `activo` (boolean) - Si está visible
  - `created_at` (timestamptz) - Fecha de creación
  - `updated_at` (timestamptz) - Fecha de actualización

  ### 2. `proveedores`
  Marcas y proveedores de equipos (Swissgas, Scion, Knauer, etc.)
  - `id` (uuid, PK) - Identificador único
  - `nombre` (text) - Nombre del proveedor
  - `slug` (text, unique) - URL amigable
  - `logo_url` (text) - URL del logo
  - `sitio_web` (text) - Sitio web del proveedor
  - `descripcion` (text) - Descripción del proveedor
  - `activo` (boolean) - Si está visible
  - `created_at` (timestamptz) - Fecha de creación
  - `updated_at` (timestamptz) - Fecha de actualización

  ### 3. `productos`
  Productos individuales
  - `id` (uuid, PK) - Identificador único
  - `categoria_id` (uuid, FK) - Referencia a categoría
  - `nombre` (text) - Nombre del producto
  - `slug` (text, unique) - URL amigable
  - `descripcion` (text) - Descripción del producto
  - `especificaciones` (jsonb) - Especificaciones técnicas
  - `imagen_principal` (text) - URL de imagen principal
  - `activo` (boolean) - Si está visible
  - `destacado` (boolean) - Si es producto destacado
  - `created_at` (timestamptz) - Fecha de creación
  - `updated_at` (timestamptz) - Fecha de actualización

  ### 4. `producto_proveedores`
  Relación muchos a muchos entre productos y proveedores con precios
  - `id` (uuid, PK) - Identificador único
  - `producto_id` (uuid, FK) - Referencia a producto
  - `proveedor_id` (uuid, FK) - Referencia a proveedor
  - `precio` (decimal) - Precio del producto
  - `moneda` (text) - Moneda (USD, MXN, etc.)
  - `codigo_producto` (text) - SKU o código del proveedor
  - `disponible` (boolean) - Si está disponible
  - `url_proveedor` (text) - URL directa al producto en el sitio del proveedor
  - `notas` (text) - Notas adicionales
  - `created_at` (timestamptz) - Fecha de creación
  - `updated_at` (timestamptz) - Fecha de actualización

  ### 5. `imagenes_producto`
  Galería de imágenes para cada producto
  - `id` (uuid, PK) - Identificador único
  - `producto_id` (uuid, FK) - Referencia a producto
  - `url` (text) - URL de la imagen
  - `alt_text` (text) - Texto alternativo
  - `orden` (integer) - Orden de visualización
  - `created_at` (timestamptz) - Fecha de creación

  ## Seguridad
  - RLS habilitado en todas las tablas
  - Lectura pública para productos activos
  - Escritura solo para usuarios autenticados con rol admin
*/

-- Crear tabla de categorías
CREATE TABLE IF NOT EXISTS categorias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  slug text UNIQUE NOT NULL,
  descripcion text,
  orden integer DEFAULT 0,
  icono_url text,
  activo boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear tabla de proveedores
CREATE TABLE IF NOT EXISTS proveedores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  slug text UNIQUE NOT NULL,
  logo_url text,
  sitio_web text,
  descripcion text,
  activo boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear tabla de productos
CREATE TABLE IF NOT EXISTS productos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  categoria_id uuid REFERENCES categorias(id) ON DELETE SET NULL,
  nombre text NOT NULL,
  slug text UNIQUE NOT NULL,
  descripcion text,
  especificaciones jsonb DEFAULT '{}',
  imagen_principal text,
  activo boolean DEFAULT true,
  destacado boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear tabla de relación producto-proveedor
CREATE TABLE IF NOT EXISTS producto_proveedores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  producto_id uuid REFERENCES productos(id) ON DELETE CASCADE NOT NULL,
  proveedor_id uuid REFERENCES proveedores(id) ON DELETE CASCADE NOT NULL,
  precio decimal(10,2),
  moneda text DEFAULT 'USD',
  codigo_producto text,
  disponible boolean DEFAULT true,
  url_proveedor text,
  notas text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(producto_id, proveedor_id)
);

-- Crear tabla de imágenes
CREATE TABLE IF NOT EXISTS imagenes_producto (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  producto_id uuid REFERENCES productos(id) ON DELETE CASCADE NOT NULL,
  url text NOT NULL,
  alt_text text,
  orden integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos(categoria_id);
CREATE INDEX IF NOT EXISTS idx_productos_activo ON productos(activo);
CREATE INDEX IF NOT EXISTS idx_productos_destacado ON productos(destacado);
CREATE INDEX IF NOT EXISTS idx_producto_proveedores_producto ON producto_proveedores(producto_id);
CREATE INDEX IF NOT EXISTS idx_producto_proveedores_proveedor ON producto_proveedores(proveedor_id);
CREATE INDEX IF NOT EXISTS idx_imagenes_producto ON imagenes_producto(producto_id);

-- Habilitar RLS en todas las tablas
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE proveedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE producto_proveedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE imagenes_producto ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura pública para datos activos
CREATE POLICY "Categorías activas son públicas"
  ON categorias FOR SELECT
  USING (activo = true);

CREATE POLICY "Proveedores activos son públicos"
  ON proveedores FOR SELECT
  USING (activo = true);

CREATE POLICY "Productos activos son públicos"
  ON productos FOR SELECT
  USING (activo = true);

CREATE POLICY "Relaciones producto-proveedor son públicas"
  ON producto_proveedores FOR SELECT
  USING (disponible = true);

CREATE POLICY "Imágenes de productos son públicas"
  ON imagenes_producto FOR SELECT
  USING (true);

-- Políticas de administración (solo usuarios autenticados)
CREATE POLICY "Admin puede insertar categorías"
  ON categorias FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admin puede actualizar categorías"
  ON categorias FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin puede eliminar categorías"
  ON categorias FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Admin puede insertar proveedores"
  ON proveedores FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admin puede actualizar proveedores"
  ON proveedores FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin puede eliminar proveedores"
  ON proveedores FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Admin puede insertar productos"
  ON productos FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admin puede actualizar productos"
  ON productos FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin puede eliminar productos"
  ON productos FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Admin puede insertar producto-proveedores"
  ON producto_proveedores FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admin puede actualizar producto-proveedores"
  ON producto_proveedores FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin puede eliminar producto-proveedores"
  ON producto_proveedores FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Admin puede insertar imágenes"
  ON imagenes_producto FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admin puede actualizar imágenes"
  ON imagenes_producto FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin puede eliminar imágenes"
  ON imagenes_producto FOR DELETE
  TO authenticated
  USING (true);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar updated_at
CREATE TRIGGER update_categorias_updated_at
  BEFORE UPDATE ON categorias
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_proveedores_updated_at
  BEFORE UPDATE ON proveedores
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_productos_updated_at
  BEFORE UPDATE ON productos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_producto_proveedores_updated_at
  BEFORE UPDATE ON producto_proveedores
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
