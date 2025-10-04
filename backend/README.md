# Backend API - Sistema de Gestión de Equipos de Laboratorio

API RESTful construida con Node.js, Express y PostgreSQL.

## Requisitos Previos

- Node.js 18 o superior
- PostgreSQL 12 o superior
- npm o yarn

## Instalación

1. **Instalar dependencias:**
```bash
cd backend
npm install
```

2. **Configurar variables de entorno:**
```bash
cp .env.example .env
```

Edita `.env` con tus credenciales:
```env
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tu_base_datos
DB_USER=tu_usuario
DB_PASSWORD=tu_password
JWT_SECRET=genera_un_secreto_seguro_aqui
FRONTEND_URL=http://localhost:5173
```

3. **Crear la base de datos:**
```bash
# Conectar a PostgreSQL
psql -U postgres

# Crear base de datos
CREATE DATABASE tu_base_datos;
\c tu_base_datos

# Ejecutar migración de usuarios
\i migrations/01_create_users_table.sql

# Ejecutar las migraciones existentes (sin RLS)
# Las migraciones en ../supabase/migrations/ deben ejecutarse
# pero ELIMINANDO todas las políticas RLS y referencias a auth.uid()
```

## Estructura del Proyecto

```
backend/
├── server.js              # Punto de entrada principal
├── package.json           # Dependencias
├── .env.example          # Plantilla de variables de entorno
├── db/
│   └── connection.js     # Configuración de PostgreSQL
├── middleware/
│   └── auth.js           # Middleware de autenticación JWT
├── routes/
│   ├── auth.js           # Login, registro, logout
│   ├── productos.js      # CRUD de productos
│   ├── categorias.js     # CRUD de categorías
│   ├── proveedores.js    # CRUD de proveedores
│   └── settings.js       # Gestión de configuración
└── migrations/
    └── 01_create_users_table.sql  # Migración de usuarios
```

## Iniciar el Servidor

### Modo Desarrollo (con auto-reload):
```bash
npm run dev
```

### Modo Producción:
```bash
npm start
```

El servidor estará disponible en `http://localhost:3001`

## Endpoints de la API

### Autenticación

#### POST `/api/auth/register`
Registrar nuevo usuario
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

#### POST `/api/auth/login`
Iniciar sesión
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

Respuesta:
```json
{
  "user": {
    "id": "uuid",
    "email": "usuario@ejemplo.com"
  },
  "token": "jwt_token_aqui"
}
```

#### POST `/api/auth/logout`
Cerrar sesión (requiere autenticación)

#### GET `/api/auth/me`
Obtener información del usuario actual (requiere autenticación)

### Productos

#### GET `/api/productos`
Obtener todos los productos
Query params: `?categoria=slug&destacado=true&activo=true`

#### GET `/api/productos/:id`
Obtener un producto específico

#### POST `/api/productos` (requiere autenticación)
Crear producto nuevo

#### PUT `/api/productos/:id` (requiere autenticación)
Actualizar producto

#### DELETE `/api/productos/:id` (requiere autenticación)
Eliminar producto

### Categorías

#### GET `/api/categorias`
Obtener todas las categorías
Query params: `?activo=true`

#### GET `/api/categorias/:id`
Obtener una categoría específica

#### POST `/api/categorias` (requiere autenticación)
Crear categoría nueva

#### PUT `/api/categorias/:id` (requiere autenticación)
Actualizar categoría

#### DELETE `/api/categorias/:id` (requiere autenticación)
Eliminar categoría

### Proveedores

#### GET `/api/proveedores`
Obtener todos los proveedores
Query params: `?activo=true`

#### GET `/api/proveedores/:id`
Obtener un proveedor específico

#### POST `/api/proveedores` (requiere autenticación)
Crear proveedor nuevo

#### PUT `/api/proveedores/:id` (requiere autenticación)
Actualizar proveedor

#### DELETE `/api/proveedores/:id` (requiere autenticación)
Eliminar proveedor

### Configuración

#### GET `/api/settings`
Obtener todas las configuraciones

#### GET `/api/settings/:key`
Obtener una configuración específica

#### PUT `/api/settings/:key` (requiere autenticación)
Actualizar configuración

## Autenticación

Esta API usa JWT (JSON Web Tokens) para autenticación.

Para endpoints protegidos, incluye el token en el header:
```
Authorization: Bearer tu_token_jwt
```

Los tokens expiran después de 24 horas.

## Manejo de Errores

Todos los errores siguen este formato:
```json
{
  "error": "Descripción del error"
}
```

Códigos de estado HTTP:
- `200` - OK
- `201` - Creado
- `400` - Solicitud inválida
- `401` - No autorizado
- `404` - No encontrado
- `500` - Error del servidor

## Despliegue en Producción

### Con PM2:
```bash
npm install -g pm2
pm2 start server.js --name "api-backend"
pm2 save
pm2 startup
```

### Con Docker:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3001
CMD ["node", "server.js"]
```

### Variables de Entorno en Producción:
- Usa un `JWT_SECRET` fuerte y aleatorio
- Configura `NODE_ENV=production`
- Usa SSL para PostgreSQL si es remoto
- Configura `FRONTEND_URL` con tu dominio real

## Seguridad

- Todas las contraseñas se hashean con bcrypt (10 rounds)
- JWT con expiración de 24 horas
- CORS configurado para el frontend específico
- Validación de entrada en todos los endpoints
- Rate limiting recomendado para producción (instalar `express-rate-limit`)

## Logs

Los logs se muestran en consola:
- Timestamp de cada request
- Método HTTP y ruta
- Errores detallados

Para producción, considera usar Winston o Pino para logs estructurados.

## Troubleshooting

### Error de conexión a PostgreSQL
- Verifica que PostgreSQL esté corriendo
- Revisa las credenciales en `.env`
- Asegúrate de que la base de datos existe

### Error "JWT_SECRET not defined"
- Asegúrate de tener un `JWT_SECRET` en tu archivo `.env`

### CORS errors
- Verifica que `FRONTEND_URL` en `.env` coincida con la URL de tu frontend

## Próximos Pasos

Después de configurar el backend:
1. Ejecutar todas las migraciones de base de datos
2. Crear el primer usuario admin
3. Configurar el frontend para usar esta API
4. Probar todos los endpoints con Postman o Thunder Client
