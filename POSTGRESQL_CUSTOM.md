# Guía: PostgreSQL Propio + Backend Personalizado

## Advertencia Importante

Esta aplicación está diseñada para Supabase, que proporciona:
- Base de datos PostgreSQL
- Sistema de autenticación integrado
- APIs REST automáticas
- Row Level Security (RLS)
- Realtime subscriptions

Si quieres usar tu propio PostgreSQL, necesitarás reemplazar **toda la capa de backend**.

## Arquitectura Actual vs Nueva

### Arquitectura Actual (Supabase)
```
Frontend (React) → Supabase Client → Supabase API → PostgreSQL + Auth
```

### Arquitectura Nueva (PostgreSQL Propio)
```
Frontend (React) → Tu API Backend → PostgreSQL + Sistema de Auth
```

## Cambios Requeridos

### 1. Configurar PostgreSQL en tu Servidor

```bash
# Instalar PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Crear base de datos
sudo -u postgres psql
CREATE DATABASE tu_base_datos;
CREATE USER tu_usuario WITH PASSWORD 'tu_password';
GRANT ALL PRIVILEGES ON DATABASE tu_base_datos TO tu_usuario;
```

### 2. Ejecutar las Migraciones

Las migraciones en `supabase/migrations/` usan funciones específicas de Supabase como `auth.uid()`. Necesitarás:

**Eliminar/Modificar:**
- Todas las referencias a `auth.uid()`
- Todas las políticas RLS que usan `auth.jwt()`
- La función `gen_random_uuid()` (usar `uuid_generate_v4()` con extensión `uuid-ossp`)

**Instalar extensiones requeridas:**
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

### 3. Crear Backend API

Necesitas crear un servidor backend (Node.js + Express es recomendado):

```bash
mkdir backend
cd backend
npm init -y
npm install express pg bcrypt jsonwebtoken cors dotenv
```

**Estructura del backend:**
```
backend/
├── server.js
├── .env
├── routes/
│   ├── auth.js       # Login, registro, logout
│   ├── productos.js  # CRUD productos
│   ├── categorias.js # CRUD categorías
│   ├── proveedores.js # CRUD proveedores
│   └── settings.js   # Configuración
├── middleware/
│   └── auth.js       # Verificación JWT
└── db/
    └── connection.js # Conexión PostgreSQL
```

**Ejemplo: server.js**
```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const productosRoutes = require('./routes/productos');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/productos', productosRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

**Ejemplo: db/connection.js**
```javascript
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

module.exports = pool;
```

**Ejemplo: routes/auth.js**
```javascript
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db/connection');

const router = express.Router();

// Registro
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password, created_at) VALUES ($1, $2, NOW()) RETURNING id, email',
      [email, hashedPassword]
    );

    const token = jwt.sign(
      { userId: result.rows[0].id, email: result.rows[0].email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ user: result.rows[0], token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ user: { id: user.id, email: user.email }, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

**Ejemplo: middleware/auth.js**
```javascript
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

module.exports = authMiddleware;
```

### 4. Modificar el Frontend

**Crear un cliente API personalizado:**

```javascript
// src/lib/api.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiClient {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Auth
  async signUp(email, password) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.token);
    return data;
  }

  async signIn(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.token);
    return data;
  }

  async signOut() {
    this.clearToken();
  }

  // Productos
  async getProductos() {
    return this.request('/productos');
  }

  async createProducto(producto) {
    return this.request('/productos', {
      method: 'POST',
      body: JSON.stringify(producto),
    });
  }

  // ... más métodos según necesites
}

export const apiClient = new ApiClient();
```

**Reemplazar todas las llamadas a Supabase:**

Buscar y reemplazar en todos los archivos:
```javascript
// ANTES (Supabase)
import { supabase } from '../lib/supabase';
const { data } = await supabase.from('productos').select('*');

// DESPUÉS (API personalizado)
import { apiClient } from '../lib/api';
const data = await apiClient.getProductos();
```

### 5. Modificar el Context de Autenticación

```javascript
// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../lib/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un token guardado
    const token = localStorage.getItem('token');
    if (token) {
      // Aquí deberías validar el token con tu backend
      apiClient.setToken(token);
      // Por ahora, asumimos que el token es válido
      setUser({ token }); // Ajusta según tu estructura
    }
    setLoading(false);
  }, []);

  const signIn = async (email, password) => {
    const data = await apiClient.signIn(email, password);
    setUser(data.user);
  };

  const signUp = async (email, password) => {
    const data = await apiClient.signUp(email, password);
    setUser(data.user);
  };

  const signOut = async () => {
    await apiClient.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

### 6. Modificar las Tablas de Base de Datos

**Crear tabla de usuarios:**
```sql
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Eliminar las políticas RLS que usan auth.uid()
-- Reemplazar con lógica en el backend
```

**Las políticas RLS deben ser manejadas por tu backend**, no por PostgreSQL directamente.

### 7. Variables de Entorno

**Backend (.env):**
```env
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tu_base_datos
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_SSL=false
JWT_SECRET=tu_secreto_super_seguro_aqui
```

**Frontend (.env):**
```env
VITE_API_URL=http://tu-servidor.com:3001/api
VITE_N8N_WEBHOOK_URL=
```

### 8. Despliegue

**Backend:**
```bash
# En tu servidor
cd backend
npm install
npm install -g pm2
pm2 start server.js --name "api-backend"
pm2 save
pm2 startup
```

**Frontend:**
```bash
npm run build
# Copiar dist/ a /var/www/html/
```

**Nginx para el backend:**
```nginx
server {
    listen 80;
    server_name api.tudominio.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Resumen de Archivos a Modificar

1. **Eliminar:** `src/lib/supabase.js`
2. **Crear:** `src/lib/api.js` (cliente API personalizado)
3. **Modificar:** `src/contexts/AuthContext.jsx`
4. **Modificar:** Todos los componentes que usan `supabase.from()`
5. **Crear:** Todo el directorio `backend/`
6. **Modificar:** Todas las migraciones SQL (eliminar `auth.uid()`)

## Recomendación

**Usar Supabase es MUCHO más simple:**
- Autenticación lista para usar
- APIs automáticas
- Row Level Security integrado
- No necesitas mantener un backend
- Plan gratuito generoso

Si realmente necesitas PostgreSQL propio, considera:
1. **Supabase auto-hospedado** (más compatible, menos cambios)
2. **Crear backend desde cero** (mucho trabajo, pero control total)

## Esfuerzo Estimado

- Backend completo: 40-60 horas de desarrollo
- Modificar frontend: 20-30 horas
- Testing y debugging: 20-30 horas
- **Total: 80-120 horas de trabajo**

vs.

- Usar Supabase: 1-2 horas para desplegar
