const express = require('express');
const pool = require('../db/connection');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { activo } = req.query;
    let query = 'SELECT * FROM categorias WHERE 1=1';

    if (activo !== 'false') {
      query += ' AND activo = true';
    }

    query += ' ORDER BY orden ASC';

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
});

router.get('/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const result = await pool.query('SELECT * FROM categorias WHERE slug = $1', [slug]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener categoría:', error);
    res.status(500).json({ error: 'Error al obtener categoría' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM categorias WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener categoría:', error);
    res.status(500).json({ error: 'Error al obtener categoría' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { nombre, descripcion, slug, icono, orden, activo } = req.body;

    if (!nombre || !slug) {
      return res.status(400).json({ error: 'Nombre y slug son requeridos' });
    }

    const existingSlug = await pool.query('SELECT id FROM categorias WHERE slug = $1', [slug]);
    if (existingSlug.rows.length > 0) {
      return res.status(400).json({ error: 'El slug ya existe' });
    }

    const result = await pool.query(
      `INSERT INTO categorias (nombre, descripcion, slug, icono_url, orden, activo, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING *`,
      [nombre, descripcion || '', slug, icono || '', orden || 0, activo !== false]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear categoría:', error);
    res.status(500).json({ error: 'Error al crear categoría' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, slug, icono, orden, activo } = req.body;

    if (slug) {
      const existingSlug = await pool.query(
        'SELECT id FROM categorias WHERE slug = $1 AND id != $2',
        [slug, id]
      );
      if (existingSlug.rows.length > 0) {
        return res.status(400).json({ error: 'El slug ya existe' });
      }
    }

    const result = await pool.query(
      `UPDATE categorias SET
        nombre = COALESCE($1, nombre),
        descripcion = COALESCE($2, descripcion),
        slug = COALESCE($3, slug),
        icono = COALESCE($4, icono),
        orden = COALESCE($5, orden),
        activo = COALESCE($6, activo)
       WHERE id = $7
       RETURNING *`,
      [nombre, descripcion, slug, icono, orden, activo, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    res.status(500).json({ error: 'Error al actualizar categoría' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const productsCheck = await pool.query(
      'SELECT COUNT(*) FROM productos WHERE categoria_id = $1',
      [id]
    );

    if (parseInt(productsCheck.rows[0].count) > 0) {
      return res.status(400).json({
        error: 'No se puede eliminar la categoría porque tiene productos asociados'
      });
    }

    const result = await pool.query('DELETE FROM categorias WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    res.json({ message: 'Categoría eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    res.status(500).json({ error: 'Error al eliminar categoría' });
  }
});

module.exports = router;
