const express = require('express');
const pool = require('../db/connection');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { activo, categoria, destacado } = req.query;

    let query = `
      SELECT p.*, c.nombre as categoria_nombre, c.slug as categoria_slug
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      WHERE 1=1
    `;

    const params = [];
    let paramCount = 1;

    if (activo !== 'false') {
      query += ` AND p.activo = true`;
    }

    if (categoria) {
      query += ` AND c.slug = $${paramCount}`;
      params.push(categoria);
      paramCount++;
    }

    if (destacado === 'true') {
      query += ` AND p.destacado = true`;
    }

    query += ' ORDER BY p.nombre ASC';

    const result = await pool.query(query, params);

    const productosConProveedores = await Promise.all(
      result.rows.map(async (producto) => {
        const proveedoresResult = await pool.query(
          `SELECT pr.id, pr.nombre, pr.slug, pr.logo_url, pr.sitio_web,
                  pp.precio, pp.moneda, pp.codigo_producto, pp.disponible
           FROM proveedores pr
           INNER JOIN producto_proveedores pp ON pr.id = pp.proveedor_id
           WHERE pp.producto_id = $1 AND pp.disponible = true
           ORDER BY pr.nombre ASC`,
          [producto.id]
        );

        return {
          ...producto,
          categorias: producto.categoria_nombre ? {
            nombre: producto.categoria_nombre,
            slug: producto.categoria_slug
          } : null,
          proveedores: proveedoresResult.rows
        };
      })
    );

    res.json(productosConProveedores);
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
      `SELECT pr.id, pr.nombre, pr.slug, pr.logo_url, pr.sitio_web,
              pp.precio, pp.moneda, pp.codigo_producto, pp.disponible
       FROM proveedores pr
       INNER JOIN producto_proveedores pp ON pr.id = pp.proveedor_id
       WHERE pp.producto_id = $1
       ORDER BY pr.nombre ASC`,
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
      slug,
      descripcion,
      categoria_id,
      proveedores,
      imagen_principal,
      imagenes_adicionales,
      destacado,
      activo
    } = req.body;

    if (!nombre) {
      return res.status(400).json({ error: 'Nombre es requerido' });
    }

    const generatedSlug = slug || nombre
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const result = await pool.query(
      `INSERT INTO productos (
        nombre, slug, descripcion, categoria_id, imagen_principal,
        imagenes_adicionales, destacado, activo, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      RETURNING *`,
      [
        nombre,
        generatedSlug,
        descripcion || null,
        categoria_id || null,
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
      slug,
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
        slug = COALESCE($2, slug),
        descripcion = $3,
        categoria_id = $4,
        imagen_principal = $5,
        imagenes_adicionales = $6,
        destacado = COALESCE($7, destacado),
        activo = COALESCE($8, activo),
        updated_at = NOW()
      WHERE id = $9
      RETURNING *`,
      [
        nombre,
        slug,
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

      if (Array.isArray(proveedores)) {
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

    await pool.query('DELETE FROM producto_proveedores WHERE producto_id = $1', [id]);

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
