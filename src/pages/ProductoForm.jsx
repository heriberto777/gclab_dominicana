import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../lib/api';
import Button from '../components/atoms/Button';
import './AdminForm.css';

const ProductoForm = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    nombre: '',
    slug: '',
    categoria_id: '',
    descripcion: '',
    imagen_principal: '',
    activo: true,
    destacado: false,
  });

  const [imagenes, setImagenes] = useState(['']);
  const [selectedProveedores, setSelectedProveedores] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/admin/login');
      return;
    }
    loadData();
  }, [user, navigate, id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [categoriasRes, proveedoresRes] = await Promise.all([
        apiClient.getCategorias(false),
        apiClient.getProveedores(false),
      ]);

      if (categoriasRes.data) setCategorias(categoriasRes.data);
      if (proveedoresRes.data) setProveedores(proveedoresRes.data);

      if (isEdit && id) {
        const { data: producto } = await apiClient.getProducto(id);

        if (producto) {
          setFormData({
            nombre: producto.nombre || '',
            slug: producto.slug || '',
            categoria_id: producto.categoria_id || '',
            descripcion: producto.descripcion || '',
            imagen_principal: producto.imagen_principal || '',
            activo: producto.activo,
            destacado: producto.destacado,
          });

          if (producto.imagenes_adicionales && Array.isArray(producto.imagenes_adicionales) && producto.imagenes_adicionales.length > 0) {
            setImagenes(producto.imagenes_adicionales);
          } else if (producto.imagen_principal) {
            setImagenes([producto.imagen_principal]);
          }
        }
      }
    } catch (err) {
      setError('Error al cargar datos');
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

  const handleProveedorToggle = (proveedorId) => {
    setSelectedProveedores((prev) => {
      const exists = prev.find((p) => p.proveedor_id === proveedorId);
      if (exists) {
        return prev.filter((p) => p.proveedor_id !== proveedorId);
      } else {
        return [
          ...prev,
          {
            proveedor_id: proveedorId,
            precio: '',
            moneda: 'USD',
            codigo_producto: '',
            disponible: true,
          },
        ];
      }
    });
  };

  const handleProveedorDataChange = (proveedorId, field, value) => {
    setSelectedProveedores((prev) =>
      prev.map((p) =>
        p.proveedor_id === proveedorId ? { ...p, [field]: value } : p
      )
    );
  };

  const handleImagenChange = (index, value) => {
    setImagenes((prev) => {
      const newImagenes = [...prev];
      newImagenes[index] = value;
      return newImagenes;
    });
  };

  const addImagenField = () => {
    setImagenes((prev) => [...prev, '']);
  };

  const removeImagenField = (index) => {
    if (imagenes.length > 1) {
      setImagenes((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const validImagenes = imagenes.filter(img => img && img.trim() !== '');
      const imagenPrincipal = validImagenes[0] || '';

      const productoData = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        categoria_id: formData.categoria_id || null,
        imagen_principal: imagenPrincipal,
        imagenes_adicionales: validImagenes,
        activo: formData.activo,
        destacado: formData.destacado,
      };

      if (isEdit) {
        await apiClient.updateProducto(id, productoData);
      } else {
        await apiClient.createProducto(productoData);
      }

      setSuccess(
        isEdit
          ? 'Producto actualizado exitosamente'
          : 'Producto creado exitosamente'
      );

      setTimeout(() => {
        navigate('/admin');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Error al guardar el producto');
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
          <h1>{isEdit ? 'Editar Producto' : 'Nuevo Producto'}</h1>
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
                Nombre del Producto <span className="required">*</span>
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
              <label htmlFor="categoria_id">Categoría</label>
              <select
                id="categoria_id"
                name="categoria_id"
                value={formData.categoria_id}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="">Sin categoría</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
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

          <div className="form-section">
            <div className="section-header">
              <h3>Imágenes del Producto</h3>
              <Button
                type="button"
                variant="secondary"
                onClick={addImagenField}
                disabled={loading}
              >
                + Agregar Imagen
              </Button>
            </div>
            <div className="imagenes-list">
              {imagenes.map((imagen, index) => (
                <div key={index} className="imagen-item">
                  <div className="imagen-input-group">
                    <label>Imagen {index + 1}</label>
                    <div className="imagen-input-container">
                      <input
                        type="url"
                        value={imagen}
                        onChange={(e) => handleImagenChange(index, e.target.value)}
                        placeholder="https://ejemplo.com/imagen.jpg"
                        disabled={loading}
                      />
                      {imagenes.length > 1 && (
                        <button
                          type="button"
                          className="remove-imagen-btn"
                          onClick={() => removeImagenField(index)}
                          disabled={loading}
                          aria-label="Quitar imagen"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="helper-text">
              La primera imagen será la imagen principal del producto. Las imágenes se mostrarán en un carrusel automático.
            </p>
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
              <span>Producto Activo</span>
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                name="destacado"
                checked={formData.destacado}
                onChange={handleChange}
                disabled={loading}
              />
              <span>Producto Destacado</span>
            </label>
          </div>

          <div className="form-section">
            <h3>Proveedores</h3>
            <div className="proveedores-list">
              {proveedores.map((proveedor) => {
                const selected = selectedProveedores.find(
                  (sp) => sp.proveedor_id === proveedor.id
                );
                return (
                  <div key={proveedor.id} className="proveedor-item">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={Boolean(selected)}
                        onChange={() => handleProveedorToggle(proveedor.id)}
                        disabled={loading}
                      />
                      <span>{proveedor.nombre}</span>
                    </label>

                    {selected && (
                      <div className="proveedor-details">
                        <input
                          type="number"
                          step="0.01"
                          placeholder="Precio"
                          value={selected.precio}
                          onChange={(e) =>
                            handleProveedorDataChange(
                              proveedor.id,
                              'precio',
                              e.target.value
                            )
                          }
                          disabled={loading}
                        />
                        <select
                          value={selected.moneda}
                          onChange={(e) =>
                            handleProveedorDataChange(
                              proveedor.id,
                              'moneda',
                              e.target.value
                            )
                          }
                          disabled={loading}
                        >
                          <option value="USD">USD</option>
                          <option value="MXN">MXN</option>
                          <option value="EUR">EUR</option>
                        </select>
                        <input
                          type="text"
                          placeholder="Código"
                          value={selected.codigo_producto}
                          onChange={(e) =>
                            handleProveedorDataChange(
                              proveedor.id,
                              'codigo_producto',
                              e.target.value
                            )
                          }
                          disabled={loading}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
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

export default ProductoForm;
