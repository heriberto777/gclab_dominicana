import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { apiClient } from "../lib/api";
import Button from "../components/atoms/Button";
import "./AdminForm.css";

const ServicioTecnicoForm = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    titulo: "",
    slug: "",
    descripcion: "",
    imagen_url: "",
    orden: 0,
    activo: true,
  });

  useEffect(() => {
    if (!user) {
      navigate("/admin/login");
      return;
    }
    if (isEdit && id) {
      loadServicio();
    }
  }, [user, navigate, id]);

  const loadServicio = async () => {
    setLoading(true);
    try {
      const { data, error } = await apiClient.getServicioTecnico(id);

      if (error) throw error;

      if (data) {
        setFormData({
          titulo: data.titulo || "",
          slug: data.slug || "",
          descripcion: data.descripcion || "",
          imagen_url: data.imagen_url || "",
          orden: data.orden || 0,
          activo: data.activo,
        });
      }
    } catch (err) {
      setError("Error al cargar el servicio técnico");
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

    if (name === "titulo" && !isEdit) {
      const slug = value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const dataToSave = {
        titulo: formData.titulo,
        slug: formData.slug,
        descripcion: formData.descripcion,
        imagen_url: formData.imagen_url,
        orden: parseInt(formData.orden) || 0,
        activo: formData.activo,
      };

      if (isEdit) {
        await apiClient.updateServicioTecnico(id, dataToSave);
        setSuccess("Servicio técnico actualizado exitosamente");
      } else {
        await apiClient.createServicioTecnico(dataToSave);
        setSuccess("Servicio técnico creado exitosamente");
      }

      setTimeout(() => {
        navigate("/admin");
      }, 1500);
    } catch (err) {
      setError(err.message || "Error al guardar el servicio técnico");
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
          <h1>
            {isEdit ? "Editar Servicio Técnico" : "Nuevo Servicio Técnico"}
          </h1>
          <Button onClick={() => navigate("/admin")} variant="secondary">
            Volver
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="admin-form">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="titulo">
                Título del Servicio <span className="required">*</span>
              </label>
              <input
                id="titulo"
                name="titulo"
                type="text"
                value={formData.titulo}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="SERVICIO TÉCNICO"
              />
            </div>

            <div className="form-group">
              <label htmlFor="slug">
                Slug (Identificador) <span className="required">*</span>
              </label>
              <input
                id="slug"
                name="slug"
                type="text"
                value={formData.slug}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="servicio-tecnico"
              />
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
              <p className="helper-text">
                Número que determina el orden de aparición (menor número aparece
                primero)
              </p>
            </div>

            <div className="form-group">
              <label htmlFor="imagen_url">URL de Imagen (Opcional)</label>
              <input
                id="imagen_url"
                name="imagen_url"
                type="url"
                value={formData.imagen_url}
                onChange={handleChange}
                disabled={loading}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="descripcion">
              Descripción <span className="required">*</span>
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows="8"
              required
              disabled={loading}
              placeholder="Descripción detallada del servicio técnico..."
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
              <span>Servicio Activo</span>
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

export default ServicioTecnicoForm;
