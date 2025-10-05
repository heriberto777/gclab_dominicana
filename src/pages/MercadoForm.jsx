import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../lib/api';
import Button from '../components/atoms/Button';
import RichTextEditor from '../components/molecules/RichTextEditor';
import './AdminForm.css';

const MercadoForm = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    nombre: "",
    slug: "",
    titulo_hero: "",
    subtitulo_hero: "",
    imagen_hero_url: "",
    descripcion: "",
    contenido: "",
    soluciones: [""],
    orden: 0,
    activo: true,
  });

  useEffect(() => {
    if (!user) {
      navigate("/admin/login");
      return;
    }
    if (isEdit && id) {
      loadMercado();
    }
  }, [user, navigate, id]);

  const loadMercado = async () => {
    setLoading(true);
    try {
      const { data, error } = await apiClient.getMercado(id);

      if (error) throw error;

      if (data) {
        setFormData({
          nombre: data.nombre || "",
          slug: data.slug || "",
          titulo_hero: data.titulo_hero || "",
          subtitulo_hero: data.subtitulo_hero || "",
          imagen_hero_url: data.imagen_hero_url || "",
          descripcion: data.descripcion || "",
          contenido: data.contenido || "",
          soluciones:
            data.soluciones && data.soluciones.length > 0
              ? data.soluciones
              : [""],
          orden: data.orden || 0,
          activo: data.activo,
        });
      }
    } catch (err) {
      setError("Error al cargar el mercado");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "nombre" && !isEdit) {
      const slug = value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const handleSolucionChange = (index, value) => {
    setFormData((prev) => {
      const newSoluciones = [...prev.soluciones];
      newSoluciones[index] = value;
      return { ...prev, soluciones: newSoluciones };
    });
  };

  const addSolucion = () => {
    setFormData((prev) => ({
      ...prev,
      soluciones: [...prev.soluciones, ""],
    }));
  };

  const removeSolucion = (index) => {
    if (formData.soluciones.length > 1) {
      setFormData((prev) => ({
        ...prev,
        soluciones: prev.soluciones.filter((_, i) => i !== index),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const solucionesValidas = formData.soluciones.filter(
        (sol) => sol.trim() !== ""
      );

      const dataToSave = {
        nombre: formData.nombre,
        slug: formData.slug,
        titulo_hero: formData.titulo_hero,
        subtitulo_hero: formData.subtitulo_hero,
        imagen_hero_url: formData.imagen_hero_url,
        descripcion: formData.descripcion,
        contenido: formData.contenido,
        soluciones: solucionesValidas,
        orden: parseInt(formData.orden) || 0,
        activo: formData.activo,
      };

      if (isEdit) {
        await apiClient.updateMercado(id, dataToSave);
        setSuccess("Mercado actualizado exitosamente");
      } else {
        await apiClient.createMercado(dataToSave);
        setSuccess("Mercado creado exitosamente");
      }

      setTimeout(() => {
        navigate("/admin");
      }, 1500);
    } catch (err) {
      setError(err.message || "Error al guardar el mercado");
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
          <h1>{isEdit ? "Editar Mercado" : "Nuevo Mercado"}</h1>
          <Button onClick={() => navigate("/admin")} variant="secondary">
            Volver
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="admin-form">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="nombre">
                Nombre del Mercado <span className="required">*</span>
              </label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                value={formData.nombre}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Industria Farmacéutica"
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
                placeholder="industria-farmaceutica"
              />
              <p className="helper-text">
                Se usará como: /mercado/{formData.slug || "slug"}
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

          <div className="form-section">
            <h3>Configuración del Hero</h3>

            <div className="form-group">
              <label htmlFor="titulo_hero">Título del Hero</label>
              <input
                id="titulo_hero"
                name="titulo_hero"
                type="text"
                value={formData.titulo_hero}
                onChange={handleChange}
                disabled={loading}
                placeholder="Industria Farmacéutica y Medical Devices"
              />
            </div>

            <div className="form-group">
              <label htmlFor="subtitulo_hero">Subtítulo del Hero</label>
              <textarea
                id="subtitulo_hero"
                name="subtitulo_hero"
                value={formData.subtitulo_hero}
                onChange={handleChange}
                rows="2"
                disabled={loading}
                placeholder="Para una mejor calidad de los medicamentos..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="imagen_hero_url">URL de Imagen del Hero</label>
              <input
                id="imagen_hero_url"
                name="imagen_hero_url"
                type="url"
                value={formData.imagen_hero_url}
                onChange={handleChange}
                disabled={loading}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Contenido de la Página</h3>

            <div className="form-group">
              <label htmlFor="descripcion">Descripción</label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows="4"
                disabled={loading}
                placeholder="Descripción principal del mercado..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="contenido">Contenido Adicional (Opcional)</label>
              <RichTextEditor
                value={formData.contenido}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, contenido: value }))
                }
                placeholder="Contenido adicional en formato HTML..."
              />
            </div>
          </div>

          <div className="form-section">
            <div className="section-header">
              <h3>Soluciones</h3>
              <Button
                type="button"
                variant="secondary"
                onClick={addSolucion}
                disabled={loading}
              >
                + Agregar Solución
              </Button>
            </div>

            <div className="soluciones-list">
              {formData.soluciones.map((solucion, index) => (
                <div key={index} className="solucion-item">
                  <div className="solucion-input-group">
                    <label>Solución {index + 1}</label>
                    <div className="solucion-input-container">
                      <input
                        type="text"
                        value={solucion}
                        onChange={(e) =>
                          handleSolucionChange(index, e.target.value)
                        }
                        placeholder="LABORATORIO CONTROL DE CALIDAD"
                        disabled={loading}
                      />
                      {formData.soluciones.length > 1 && (
                        <button
                          type="button"
                          className="remove-solucion-btn"
                          onClick={() => removeSolucion(index)}
                          disabled={loading}
                          aria-label="Quitar solución"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
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
              <span>Mercado Activo</span>
            </label>
          </div>

          <div className="form-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/admin")}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Guardando..." : isEdit ? "Actualizar" : "Crear"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MercadoForm;