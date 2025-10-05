import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { apiClient } from "../lib/api";
import Button from "../components/atoms/Button";
import "./AdminForm.css";

const HeroForm = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    seccion: "",
    titulo: "",
    subtitulo: "",
    imagen_url: "",
    cta_texto: "",
    cta_link: "",
    activo: true,
  });

  const seccionesDisponibles = [
    { value: "home", label: "Página Principal (Home)" },
    { value: "productos", label: "Productos" },
    { value: "quienes-somos", label: "Quienes Somos" },
    { value: "soporte", label: "Soporte Técnico" },
  ];

  useEffect(() => {
    if (!user) {
      navigate("/admin/login");
      return;
    }
    if (isEdit && id) {
      loadHero();
    }
  }, [user, navigate, id]);

  const loadHero = async () => {
    setLoading(true);
    try {
      const { data, error } = await apiClient.getHero(id);

      if (error) throw error;

      if (data) {
        setFormData({
          seccion: data.seccion || "",
          titulo: data.titulo || "",
          subtitulo: data.subtitulo || "",
          imagen_url: data.imagen_url || "",
          cta_texto: data.cta_texto || "",
          cta_link: data.cta_link || "",
          activo: data.activo,
        });
      }
    } catch (err) {
      setError("Error al cargar el hero");
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const dataToSave = {
        seccion: formData.seccion,
        titulo: formData.titulo,
        subtitulo: formData.subtitulo,
        imagen_url: formData.imagen_url,
        cta_texto: formData.cta_texto,
        cta_link: formData.cta_link,
        activo: formData.activo,
      };

      if (isEdit) {
        await apiClient.updateHero(id, dataToSave);
        setSuccess("Hero actualizado exitosamente");
      } else {
        await apiClient.createHero(dataToSave);
        setSuccess("Hero creado exitosamente");
      }

      setTimeout(() => {
        navigate("/admin");
      }, 1500);
    } catch (err) {
      setError(err.message || "Error al guardar el hero");
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
          <h1>{isEdit ? "Editar Hero" : "Nuevo Hero"}</h1>
          <Button onClick={() => navigate("/admin")} variant="secondary">
            Volver
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="admin-form">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="seccion">
                Sección <span className="required">*</span>
              </label>
              <select
                id="seccion"
                name="seccion"
                value={formData.seccion}
                onChange={handleChange}
                required
                disabled={loading || isEdit}
              >
                <option value="">Seleccione una sección</option>
                {seccionesDisponibles.map((sec) => (
                  <option key={sec.value} value={sec.value}>
                    {sec.label}
                  </option>
                ))}
              </select>
              {isEdit && (
                <p className="helper-text">
                  La sección no se puede cambiar después de creada
                </p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="imagen_url">URL de Imagen de Fondo</label>
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
            <label htmlFor="titulo">Título</label>
            <input
              id="titulo"
              name="titulo"
              type="text"
              value={formData.titulo}
              onChange={handleChange}
              disabled={loading}
              placeholder="Título principal del hero"
            />
          </div>

          <div className="form-group">
            <label htmlFor="subtitulo">Subtítulo</label>
            <textarea
              id="subtitulo"
              name="subtitulo"
              value={formData.subtitulo}
              onChange={handleChange}
              rows="3"
              disabled={loading}
              placeholder="Subtítulo o descripción breve"
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="cta_texto">Texto del Botón (CTA)</label>
              <input
                id="cta_texto"
                name="cta_texto"
                type="text"
                value={formData.cta_texto}
                onChange={handleChange}
                disabled={loading}
                placeholder="Ver Productos"
              />
            </div>

            <div className="form-group">
              <label htmlFor="cta_link">Enlace del Botón (CTA)</label>
              <input
                id="cta_link"
                name="cta_link"
                type="text"
                value={formData.cta_link}
                onChange={handleChange}
                disabled={loading}
                placeholder="/productos"
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
              <span>Hero Activo</span>
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

export default HeroForm;
