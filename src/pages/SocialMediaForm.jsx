import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../lib/api';
import Button from '../components/atoms/Button';
import './AdminForm.css';

const SocialMediaForm = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    nombre: '',
    url: '',
    logo_url: '',
    orden: 0,
    activo: true,
  });

  useEffect(() => {
    if (!user) {
      navigate('/admin/login');
      return;
    }
    if (isEdit && id) {
      loadSocialMedia();
    }
  }, [user, navigate, id]);

  const loadSocialMedia = async () => {
    setLoading(true);
    try {
      const { data, error } = await apiClient.getSocialMediaItem(id);

      if (error) throw error;

      if (data) {
        setFormData({
          nombre: data.nombre || '',
          url: data.url || '',
          logo_url: data.logo_url || '',
          orden: data.orden || 0,
          activo: data.activo,
        });
      }
    } catch (err) {
      setError('Error al cargar la red social');
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const dataToSave = {
        nombre: formData.nombre,
        url: formData.url,
        logo_url: formData.logo_url,
        orden: parseInt(formData.orden) || 0,
        activo: formData.activo,
      };

      if (isEdit) {
        await apiClient.updateSocialMedia(id, dataToSave);
        setSuccess('Red social actualizada exitosamente');
      } else {
        await apiClient.createSocialMedia(dataToSave);
        setSuccess('Red social creada exitosamente');
      }

      setTimeout(() => {
        navigate('/admin');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Error al guardar la red social');
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
          <h1>{isEdit ? 'Editar Red Social' : 'Nueva Red Social'}</h1>
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
                Nombre de la Red Social <span className="required">*</span>
              </label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                value={formData.nombre}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Facebook, Instagram, LinkedIn..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="url">
                URL <span className="required">*</span>
              </label>
              <input
                id="url"
                name="url"
                type="url"
                value={formData.url}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="https://facebook.com/tunegocio"
              />
            </div>

            <div className="form-group">
              <label htmlFor="logo_url">URL del Logo/Icono</label>
              <input
                id="logo_url"
                name="logo_url"
                type="url"
                value={formData.logo_url}
                onChange={handleChange}
                disabled={loading}
                placeholder="https://ejemplo.com/icono.svg"
              />
              <p className="helper-text">
                Puedes usar iconos de{' '}
                <a
                  href="https://simpleicons.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#0066cc' }}
                >
                  Simple Icons
                </a>
              </p>
            </div>

            <div className="form-group">
              <label htmlFor="orden">Orden de Visualización</label>
              <input
                id="orden"
                name="orden"
                type="number"
                value={formData.orden}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
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
              <span>Red Social Activa</span>
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

export default SocialMediaForm;