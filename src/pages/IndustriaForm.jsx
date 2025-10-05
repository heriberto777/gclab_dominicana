import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { apiClient } from "../lib/api";
import Button from "../components/atoms/Button";
import "./AdminForm.css";

const IndustriaForm = () => {
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
    icono_url: "",
    orden: 0,
    activo: true,
  });

  useEffect(() => {
    if (!user) {
      navigate("/admin/login");
      return;
    }
    if (isEdit && id) {
      loadIndustria();
    }
  }, [user, navigate, id]);

  const loadIndustria = async () => {
    setLoading(true);
    try {
      const { data, error } = await apiClient.getIndustria(id);

      if (error) throw error;

      if (data) {
        setFormData({
          nombre: data.nombre || "",
          slug: data.slug || "",
          icono_url: data.icono_url || "",
          orden: data.orden || 0,
          activo: data.activo,
        });
      }
    } catch (err) {
      setError("Error al cargar la industria");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const dataToSave = {
        nombre: formData.nombre,
        slug: formData.slug,
        icono_url: formData.icono_url,
        orden: parseInt(formData.orden) || 0,
        activo: formData.activo,
      };

      if (isEdit) {
        await apiClient.updateIndustria(id, dataToSave);
        setSuccess("Industria actualizada exitosamente");
      } else {
        await apiClient.createIndustria(dataToSave);
        setSuccess("Industria creada exitosamente");
      }

      setTimeout(() => {
        navigate("/admin");
      }, 1500);
    } catch (err) {
      setError(err.message || "Error al guardar la industria");
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
          <h1>{isEdit ? "Editar Industria" : "Nueva Industria"}</h1>
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
                Nombre de la Industria <span className="required">*</span>
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
              <label htmlFor="icono_url">URL del Icono</label>
              <input
                id="icono_url"
                name="icono_url"
                type="url"
                value={formData.icono_url}
                onChange={handleChange}
                disabled={loading}
                placeholder="https://ejemplo.com/icono.svg"
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
              <span>Industria Activa</span>
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

export default IndustriaForm;
