# Configuración de la Base de Datos

Este documento explica cómo configurar la base de datos PostgreSQL para el backend.

## Requisitos Previos

- PostgreSQL 12 o superior instalado
- Acceso a `psql` o herramienta similar

## Opción 1: Ejecutar Todas las Migraciones (Recomendado)

### Desde la línea de comandos:

```bash
# 1. Crear la base de datos
createdb gclab_db

# 2. Ejecutar todas las migraciones desde el archivo maestro
cd backend/migrations
psql gclab_db -f 01_create_users_table.sql
psql gclab_db -f 02_create_categorias_table.sql
psql gclab_db -f 03_create_proveedores_table.sql
psql gclab_db -f 04_create_productos_table.sql
psql gclab_db -f 05_create_producto_proveedores_table.sql
psql gclab_db -f 06_create_settings_table.sql
```

### O ejecutar todas de una vez:

```bash
# Desde la raíz del proyecto
cat backend/migrations/01_create_users_table.sql \
    backend/migrations/02_create_categorias_table.sql \
    backend/migrations/03_create_proveedores_table.sql \
    backend/migrations/04_create_productos_table.sql \
    backend/migrations/05_create_producto_proveedores_table.sql \
    backend/migrations/06_create_settings_table.sql \
    | psql gclab_db
```

## Opción 2: Usando herramientas GUI

Si usas **pgAdmin**, **DBeaver**, o similar:

1. Crea una nueva base de datos llamada `gclab_db`
2. Ejecuta cada archivo de migración en orden:
   - `01_create_users_table.sql`
   - `02_create_categorias_table.sql`
   - `03_create_proveedores_table.sql`
   - `04_create_productos_table.sql`
   - `05_create_producto_proveedores_table.sql`
   - `06_create_settings_table.sql`

## Estructura de Tablas

### 1. `users` - Usuarios del sistema
- `id` - ID único del usuario
- `email` - Email único
- `password_hash` - Contraseña encriptada con bcrypt
- `created_at`, `updated_at` - Timestamps

### 2. `categorias` - Categorías de productos
- `id` - ID único
- `nombre` - Nombre de la categoría
- `slug` - URL amigable (único)
- `descripcion` - Descripción opcional
- `icono_url` - URL del icono
- `orden` - Orden de visualización
- `activo` - Estado activo/inactivo

### 3. `proveedores` - Proveedores/Marcas
- `id` - ID único
- `nombre` - Nombre del proveedor
- `slug` - URL amigable (único)
- `descripcion` - Descripción opcional
- `logo_url` - URL del logo
- `sitio_web` - Sitio web del proveedor
- `activo` - Estado activo/inactivo

### 4. `productos` - Productos
- `id` - ID único
- `nombre` - Nombre del producto
- `slug` - URL amigable (único)
- `descripcion` - Descripción del producto
- `categoria_id` - Referencia a categorías
- `imagen_principal` - URL de imagen principal
- `imagenes_adicionales` - Array de URLs de imágenes
- `activo` - Estado activo/inactivo
- `destacado` - Si es producto destacado

### 5. `producto_proveedores` - Relación productos-proveedores
- `id` - ID único
- `producto_id` - Referencia al producto
- `proveedor_id` - Referencia al proveedor
- `precio` - Precio del producto
- `moneda` - Moneda (USD, MXN, EUR)
- `codigo_producto` - Código del proveedor
- `disponible` - Disponibilidad

### 6. `settings` - Configuración del sistema
- `id` - ID único
- `key` - Clave única de configuración
- `value` - Valor de configuración
- `description` - Descripción

## Datos de Ejemplo

Las migraciones incluyen datos de ejemplo:

### Categorías:
- Cromatografía
- Espectroscopia
- Balanzas
- Equipos de Laboratorio

### Proveedores:
- Agilent
- Thermo Fisher
- Waters
- Mettler Toledo

### Productos:
- HPLC Serie 1200
- Balanza Analítica XPR

### Settings:
- `n8n_webhook_url` - URL del webhook del chatbot
- `contact_webhook_url` - URL del webhook de contacto
- `site_name`, `site_email`, `site_phone` - Información del sitio

## Verificación

Para verificar que todo se instaló correctamente:

```sql
-- Listar todas las tablas
\dt

-- Ver datos de ejemplo
SELECT * FROM categorias;
SELECT * FROM proveedores;
SELECT * FROM productos;
SELECT * FROM settings;
```

## Siguientes Pasos

1. Configura el archivo `.env` en la carpeta `backend/`:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=gclab_db
   DB_USER=tu_usuario
   DB_PASSWORD=tu_password
   JWT_SECRET=genera_un_secreto_aleatorio_seguro
   PORT=3001
   FRONTEND_URL=http://localhost:5173
   ```

2. Instala las dependencias del backend:
   ```bash
   cd backend
   npm install
   ```

3. Inicia el servidor:
   ```bash
   npm start
   ```

## Notas Importantes

- Todas las tablas tienen triggers para actualizar automáticamente `updated_at`
- Los slugs se generan automáticamente si no se proporcionan
- Las tablas usan índices para optimizar consultas frecuentes
- Las relaciones usan `ON DELETE CASCADE` o `SET NULL` según corresponda
