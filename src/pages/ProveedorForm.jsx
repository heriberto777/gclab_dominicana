import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import Button from '../components/atoms/Button';
import './AdminForm.css';

const ProveedorForm = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    nombre: '',
    slug: '',
    descripcion: '',
    logo_url: '',
    sitio_web: '',
    activo: true,
  });

  useEffect(() => {
    if (!user) {
      navigate('/admin/login');
      return;
    }
    if (isEdit && id) {
      loadProveedor();
    }
  }, [user, navigate, id]);

  const loadProveedor = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('proveedores')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          nombre: data.nombre || '',
          slug: data.slug || '',
          descripcion: data.descripcion || '',
          logo_url: data.logo_url || '',
          sitio_web: data.sitio_web || '',
          activo: data.activo,
        });
      }
    } catch (err) {
      setError('Error al cargar el proveedor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (name === 'nombre' && !isEdit) {
      const slug = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const dataToSave = {
        nombre: formData.nombre,
        slug: formData.slug,
        descripcion: formData.descripcion,
        logo_url: formData.logo_url,
        sitio_web: formData.sitio_web,
        activo: formData.activo,
      };

      if (isEdit) {
        const { error: updateError } = await supabase
          .from('proveedores')
          .update(dataToSave)
          .eq('id', id);

        if (updateError) throw updateError;
        setSuccess('Proveedor actualizado exitosamente');
      } else {
        const { error: insertError } = await supabase
          .from('proveedores')
          .insert([dataToSave]);

        if (insertError) throw insertError;
        setSuccess('Proveedor creado exitosamente');
      }

      setTimeout(() => {
        navigate('/admin');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Error al guardar el proveedor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return (
      <div className="admin-form-page">
        <div className="form-container">
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-form-page">
      <div className="form-container">
        <div className="form-header">
          <h1>{isEdit ? 'Editar Proveedor' : 'Nuevo Proveedor'}</h1>
          <Button onClick={() => navigate('/admin')} variant="secondary">
            Volver
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="admin-form">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="nombre">
                Nombre del Proveedor <span className="required">*</span>
              </label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                value={formData.nombre}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="slug">
                Slug (URL) <span className="required">*</span>
              </label>
              <input
                id="slug"
                name="slug"
                type="text"
                value={formData.slug}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="sitio_web">Sitio Web</label>
              <input
                id="sitio_web"
                name="sitio_web"
                type="url"
                value={formData.sitio_web}
                onChange={handleChange}
                disabled={loading}
                placeholder="https://ejemplo.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="logo_url">URL del Logo</label>
              <input
                id="logo_url"
                name="logo_url"
                type="url"
                value={formData.logo_url}
                onChange={handleChange}
                disabled={loading}
                placeholder="https://ejemplo.com/logo.png"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows="4"
              disabled={loading}
            />
          </div>

          <div className="form-group-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="activo"
                checked={formData.activo}
                onChange={handleChange}
                disabled={loading}
              />
              <span>Proveedor Activo</span>
            </label>
          </div>

          <div className="form-actions">
            <Button type="button" variant="secondary" onClick={() => navigate('/admin')}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Guardando...' : isEdit ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProveedorForm;
