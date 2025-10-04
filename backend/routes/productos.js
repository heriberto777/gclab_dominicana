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

    const productoResult = await pool.query(
      `SELECT p.*, c.nombre as categoria_nombre, c.slug as categoria_slug
       FROM productos p
       LEFT JOIN categorias c ON p.categoria_id = c.id
       WHERE p.id = $1`,
      [id]
    );

    if (productoResult.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const proveedoresResult = await pool.query(
      `SELECT pr.id, pr.nombre, pr.logo_url, pr.sitio_web, pp.precio, pp.moneda, pp.codigo_producto, pp.disponible
       FROM producto_proveedores pp
       JOIN proveedores pr ON pp.proveedor_id = pr.id
       WHERE pp.producto_id = $1 AND pr.activo = true`,
      [id]
    );

    const producto = {
      ...productoResult.rows[0],
      categorias: productoResult.rows[0].categoria_nombre ? {
        nombre: productoResult.rows[0].categoria_nombre,
        slug: productoResult.rows[0].categoria_slug
      } : null,
      proveedores: proveedoresResult.rows
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
      proveedores,
      imagen_principal,
      imagenes_adicionales,
      destacado,
      activo
    } = req.body;

    if (!nombre || !descripcion || !categoria_id) {
      return res.status(400).json({ error: 'Nombre, descripción y categoría son requeridos' });
    }

    const result = await pool.query(
      `INSERT INTO productos (
        nombre, descripcion, categoria_id, imagen_principal,
        imagenes_adicionales, destacado, activo, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING *`,
      [
        nombre,
        descripcion,
        categoria_id,
        imagen_principal || null,
        imagenes_adicionales || null,
        destacado || false,
        activo !== false
      ]
    );

    const producto = result.rows[0];

    if (proveedores && Array.isArray(proveedores)) {
      for (const proveedor of proveedores) {
        await pool.query(
          `INSERT INTO producto_proveedores (producto_id, proveedor_id, precio, moneda, codigo_producto, disponible)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            producto.id,
            proveedor.proveedor_id,
            proveedor.precio || null,
            proveedor.moneda || 'USD',
            proveedor.codigo_producto || null,
            proveedor.disponible !== false
          ]
        );
      }
    }

    res.status(201).json(producto);
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
      proveedores,
      imagen_principal,
      imagenes_adicionales,
      destacado,
      activo
    } = req.body;

    const result = await pool.query(
      `UPDATE productos SET
        nombre = COALESCE($1, nombre),
        descripcion = COALESCE($2, descripcion),
        categoria_id = COALESCE($3, categoria_id),
        imagen_principal = $4,
        imagenes_adicionales = $5,
        destacado = COALESCE($6, destacado),
        activo = COALESCE($7, activo),
        updated_at = NOW()
      WHERE id = $8
      RETURNING *`,
      [
        nombre,
        descripcion,
        categoria_id,
        imagen_principal,
        imagenes_adicionales,
        destacado,
        activo,
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    if (proveedores !== undefined) {
      await pool.query('DELETE FROM producto_proveedores WHERE producto_id = $1', [id]);

      if (Array.isArray(proveedores) && proveedores.length > 0) {
        for (const proveedor of proveedores) {
          await pool.query(
            `INSERT INTO producto_proveedores (producto_id, proveedor_id, precio, moneda, codigo_producto, disponible)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [
              id,
              proveedor.proveedor_id,
              proveedor.precio || null,
              proveedor.moneda || 'USD',
              proveedor.codigo_producto || null,
              proveedor.disponible !== false
            ]
          );
        }
      }
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
