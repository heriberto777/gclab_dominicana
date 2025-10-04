const express = require('express');
const pool = require('../db/connection');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { activo } = req.query;
    let query = 'SELECT * FROM proveedores WHERE 1=1';

    if (activo !== 'false') {
      query += ' AND activo = true';
    }

    query += ' ORDER BY nombre ASC';

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener proveedores:', error);
    res.status(500).json({ error: 'Error al obtener proveedores' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM proveedores WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener proveedor:', error);
    res.status(500).json({ error: 'Error al obtener proveedor' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { nombre, slug, descripcion, logo_url, sitio_web, activo } = req.body;

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
      `INSERT INTO proveedores (nombre, slug, descripcion, logo_url, sitio_web, activo, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING *`,
      [nombre, generatedSlug, descripcion || null, logo_url || null, sitio_web || null, activo !== false]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear proveedor:', error);
    res.status(500).json({ error: 'Error al crear proveedor' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, slug, descripcion, logo_url, sitio_web, activo } = req.body;

    const result = await pool.query(
      `UPDATE proveedores SET
        nombre = COALESCE($1, nombre),
        slug = COALESCE($2, slug),
        descripcion = $3,
        logo_url = $4,
        sitio_web = $5,
        activo = COALESCE($6, activo),
        updated_at = NOW()
       WHERE id = $7
       RETURNING *`,
      [nombre, slug, descripcion, logo_url, sitio_web, activo, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar proveedor:', error);
    res.status(500).json({ error: 'Error al actualizar proveedor' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const productsCheck = await pool.query(
      'SELECT COUNT(*) FROM producto_proveedores WHERE proveedor_id = $1',
      [id]
    );

    if (parseInt(productsCheck.rows[0].count) > 0) {
      return res.status(400).json({
        error: 'No se puede eliminar el proveedor porque tiene productos asociados'
      });
    }

    const result = await pool.query('DELETE FROM proveedores WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    res.json({ message: 'Proveedor eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar proveedor:', error);
    res.status(500).json({ error: 'Error al eliminar proveedor' });
  }
});

module.exports = router;
