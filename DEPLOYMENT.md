# Guía de Despliegue

## Requisitos Previos

Para desplegar esta aplicación en tu propio servidor, necesitas:

### 1. Base de Datos Supabase

**Opción A: Crear tu propia instancia de Supabase (Recomendado)**

1. Ve a [https://supabase.com](https://supabase.com)
2. Crea una cuenta gratuita
3. Crea un nuevo proyecto
4. Guarda las credenciales que te proporciona:
   - **Project URL** (ej: `https://tuproyecto.supabase.co`)
   - **anon/public key** (clave pública)
   - **service_role key** (clave privada - solo para backend)

**Opción B: Usar otro proveedor PostgreSQL**

Si prefieres usar otro proveedor de PostgreSQL (AWS RDS, DigitalOcean, etc.), necesitarás:
- Instalar las extensiones de PostgreSQL requeridas
- Configurar las políticas RLS manualmente
- Ajustar la configuración de autenticación

### 2. Migrar la Base de Datos

Las migraciones están en la carpeta `supabase/migrations/`. Necesitas ejecutarlas en orden:

**Con Supabase CLI:**

```bash
# Instalar Supabase CLI
npm install -g supabase

# Conectar a tu proyecto
supabase link --project-ref tu-project-ref

# Aplicar todas las migraciones
supabase db push
```

**Manualmente:**

1. Abre cada archivo en `supabase/migrations/` en orden cronológico
2. Copia el contenido SQL
3. Ejecuta cada migración en el editor SQL de Supabase Dashboard
4. Verifica que no haya errores

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con tus credenciales:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-publica-aqui
```

**IMPORTANTE:**
- **NUNCA** expongas la `service_role key` en el frontend
- Solo usa la `anon key` en las variables de entorno del frontend
- La `anon key` es segura para exponer públicamente porque las políticas RLS protegen los datos

### 4. Estructura de la Base de Datos

Tu base de datos incluye las siguientes tablas:

- **auth.users** - Tabla de autenticación de Supabase (automática)
- **categorias** - Categorías de productos
- **proveedores** - Proveedores de productos
- **productos** - Productos con imágenes y especificaciones
- **settings** - Configuración del sistema (webhooks, etc.)

Todas las tablas tienen **Row Level Security (RLS)** habilitada para proteger los datos.

### 5. Crear el Primer Usuario Administrador

**Opción A: Desde Supabase Dashboard**

1. Ve a Authentication → Users en tu dashboard de Supabase
2. Haz clic en "Add user"
3. Ingresa email y contraseña
4. El usuario podrá iniciar sesión en `/admin/login`

**Opción B: Usando la página de registro**

1. Ve a `/admin/register` en tu aplicación
2. Registra el primer usuario
3. (Opcional) Después del primer usuario, puedes deshabilitar el registro público

## Despliegue del Frontend

### Opción 1: Netlify (Recomendado)

```bash
# Build el proyecto
npm run build

# La carpeta dist/ contiene tu aplicación lista para desplegar
```

1. Ve a [Netlify](https://netlify.com)
2. Arrastra la carpeta `dist/` o conecta tu repositorio Git
3. Configura las variables de entorno en Netlify:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Netlify detectará automáticamente Vite y lo configurará

### Opción 2: Vercel

```bash
npm install -g vercel
vercel --prod
```

Agrega las variables de entorno en el dashboard de Vercel.

### Opción 3: Servidor Propio (Apache/Nginx)

```bash
# Build el proyecto
npm run build

# Copia el contenido de dist/ a tu servidor
scp -r dist/* usuario@tuservidor:/var/www/html/
```

**Configuración de Nginx:**

```nginx
server {
    listen 80;
    server_name tudominio.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Configuración de Apache (.htaccess):**

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### Opción 4: Docker

```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Configuración Post-Despliegue

1. **Inicia sesión en el admin** (`/admin/login`)
2. **Configura el webhook de n8n** en la pestaña "Configuración"
3. **Agrega categorías** para tus productos
4. **Agrega proveedores** si es necesario
5. **Agrega productos** con sus imágenes y especificaciones

## Seguridad

- ✅ Row Level Security (RLS) está habilitado en todas las tablas
- ✅ Solo usuarios autenticados pueden acceder al admin
- ✅ Las políticas RLS protegen contra acceso no autorizado
- ✅ Las claves públicas pueden exponerse de forma segura
- ⚠️ Cambia las contraseñas de admin periódicamente
- ⚠️ Mantén la `service_role key` completamente privada

## Backup de la Base de Datos

**Desde Supabase Dashboard:**

1. Ve a Database → Backups
2. Supabase hace backups automáticos diarios
3. Puedes restaurar desde cualquier backup

**Manual:**

```bash
# Exportar datos
supabase db dump -f backup.sql

# Importar datos
psql -h tu-host -U postgres -d postgres -f backup.sql
```

## Monitoreo

- **Supabase Dashboard** proporciona métricas en tiempo real
- Monitorea el uso de base de datos, API calls, y autenticación
- Configura alertas para detectar problemas

## Costos

**Supabase Tier Gratuito incluye:**
- 500 MB de almacenamiento de base de datos
- 1 GB de almacenamiento de archivos
- 50,000 usuarios activos mensuales
- 2 GB de ancho de banda

Para aplicaciones más grandes, considera el plan Pro ($25/mes).

## Soporte

Si tienes problemas durante el despliegue:

1. Verifica los logs del browser (F12 → Console)
2. Verifica los logs de Supabase Dashboard
3. Revisa que las variables de entorno estén correctas
4. Asegúrate de que todas las migraciones se aplicaron correctamente
