const express = require('express');
const pool = require('../db/connection');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { categoria, destacado, activo } = req.query;
    let query = `
      SELECT p.*, c.nombre as categoria_nombre, c.slug as categoria_slug
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    if (categoria) {
      query += ` AND c.slug = $${paramCount}`;
      params.push(categoria);
      paramCount++;
    }

    if (destacado === 'true') {
      query += ` AND p.destacado = true`;
    }

    if (activo !== 'false') {
      query += ` AND p.activo = true`;
    }

    query += ` ORDER BY p.created_at DESC`;

    const result = await pool.query(query, params);

    const productos = result.rows.map(row => ({
      ...row,
      categorias: row.categoria_nombre ? {
        nombre: row.categoria_nombre,
        slug: row.categoria_slug
      } : null
    }));

    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT p.*, c.nombre as categoria_nombre, c.slug as categoria_slug, pr.nombre as proveedor_nombre
       FROM productos p
       LEFT JOIN categorias c ON p.categoria_id = c.id
       LEFT JOIN proveedores pr ON p.proveedor_id = pr.id
       WHERE p.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const producto = {
      ...result.rows[0],
      categorias: result.rows[0].categoria_nombre ? {
        nombre: result.rows[0].categoria_nombre,
        slug: result.rows[0].categoria_slug
      } : null,
      proveedores: result.rows[0].proveedor_nombre ? {
        nombre: result.rows[0].proveedor_nombre
      } : null
    };

    res.json(producto);
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ error: 'Error al obtener producto' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      categoria_id,
      proveedor_id,
      imagen_principal,
      imagenes_adicionales,
      especificaciones,
      aplicaciones,
      destacado,
      activo
    } = req.body;

    if (!nombre || !descripcion || !categoria_id) {
      return res.status(400).json({ error: 'Nombre, descripción y categoría son requeridos' });
    }

    const result = await pool.query(
      `INSERT INTO productos (
        nombre, descripcion, categoria_id, proveedor_id, imagen_principal,
        imagenes_adicionales, especificaciones, aplicaciones, destacado, activo, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
      RETURNING *`,
      [
        nombre,
        descripcion,
        categoria_id,
        proveedor_id || null,
        imagen_principal || null,
        imagenes_adicionales ? JSON.stringify(imagenes_adicionales) : null,
        especificaciones ? JSON.stringify(especificaciones) : null,
        aplicaciones || null,
        destacado || false,
        activo !== false
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: 'Error al crear producto' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      descripcion,
      categoria_id,
      proveedor_id,
      imagen_principal,
      imagenes_adicionales,
      especificaciones,
      aplicaciones,
      destacado,
      activo
    } = req.body;

    const result = await pool.query(
      `UPDATE productos SET
        nombre = COALESCE($1, nombre),
        descripcion = COALESCE($2, descripcion),
        categoria_id = COALESCE($3, categoria_id),
        proveedor_id = $4,
        imagen_principal = $5,
        imagenes_adicionales = $6,
        especificaciones = $7,
        aplicaciones = $8,
        destacado = COALESCE($9, destacado),
        activo = COALESCE($10, activo)
      WHERE id = $11
      RETURNING *`,
      [
        nombre,
        descripcion,
        categoria_id,
        proveedor_id,
        imagen_principal,
        imagenes_adicionales ? JSON.stringify(imagenes_adicionales) : null,
        especificaciones ? JSON.stringify(especificaciones) : null,
        aplicaciones,
        destacado,
        activo,
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM productos WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

module.exports = router;
