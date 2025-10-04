-- Master migration file
-- Run this file to create all tables in the correct order
-- Usage: psql your_database < backend/migrations/00_run_all_migrations.sql

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create users table (authentication)
\i 01_create_users_table.sql

-- 2. Create categorias table
\i 02_create_categorias_table.sql

-- 3. Create proveedores table
\i 03_create_proveedores_table.sql

-- 4. Create productos table (depends on categorias)
\i 04_create_productos_table.sql

-- 5. Create producto_proveedores junction table (depends on productos and proveedores)
\i 05_create_producto_proveedores_table.sql

-- 6. Create settings table
\i 06_create_settings_table.sql

-- 7. Fix productos schema (remove old columns if exist)
\i 07_fix_productos_schema.sql

-- Verification queries
SELECT 'Users table created' AS status, COUNT(*) AS count FROM users;
SELECT 'Categorias table created' AS status, COUNT(*) AS count FROM categorias;
SELECT 'Proveedores table created' AS status, COUNT(*) AS count FROM proveedores;
SELECT 'Productos table created' AS status, COUNT(*) AS count FROM productos;
SELECT 'Producto_proveedores table created' AS status, COUNT(*) AS count FROM producto_proveedores;
SELECT 'Settings table created' AS status, COUNT(*) AS count FROM settings;
