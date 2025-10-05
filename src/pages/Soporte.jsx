import { useState, useEffect } from "react";
import { apiClient } from "../lib/api";
import Hero from "../components/organisms/Hero";
import PageSection from "../components/templates/PageSection";
import Button from "../components/atoms/Button";
import "./Soporte.css";

const Soporte = () => {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    empresa: "",
    telefono: "",
    departamento: "",
    mensaje: "",
  });
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [serviciosRes, webhookRes] = await Promise.all([
        apiClient.getServiciosTecnicos(true),
        apiClient.getSetting("contact_webhook_url"),
      ]);

      if (serviciosRes.data) {
        setServicios(serviciosRes.data);
      }

      if (webhookRes.data) {
        setWebhookUrl(webhookRes.data.value);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    if (!webhookUrl) {
      setSubmitMessage(
        "El formulario de contacto no está configurado. Por favor, contacte al administrador."
      );
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Error al enviar el formulario");
      }

      const result = await response.json();

      setSubmitMessage(
        result.message ||
          "Mensaje enviado exitosamente. Nos pondremos en contacto pronto."
      );
      setFormData({
        nombre: "",
        email: "",
        empresa: "",
        telefono: "",
        departamento: "",
        mensaje: "",
      });
    } catch (error) {
      console.error("Error:", error);
      setSubmitMessage(
        "Hubo un error al enviar el mensaje. Por favor, intente de nuevo."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="soporte">
      <Hero seccion="soporte" />

      <PageSection>
        <div className="soporte-intro">
          <p className="soporte-intro-text">
            Desde la consulta técnica hasta la instalación, y durante toda la
            vida útil del instrumento, los servicios de GCLAB Dominicana brindan
            a nuestros clientes un soporte dedicado para mantener, optimizar y
            garantizar una óptima productividad de sus instrumentos y llevar al
            máximo el tiempo de actividad, bombeando el desempeño de su
            laboratorio.
          </p>
          <p className="soporte-intro-text">
            En GCLAB Dominicana entendemos que resultados confiables solo pueden
            ser obtenidos a través de equipos confiables y en las mejores
            condiciones de operación, para ellos contamos con un excelente
            equipo de profesionales formados en los servicios de entrenamiento
            de nuestras representadas.
          </p>
          <p className="soporte-intro-text">
            Les presentamos un enfoque de soporte no solo orientado a la venta,
            la instalación y la garantía de su equipo sino a mejorar el
            desempeño de su laboratorio, incorporando el servicio técnico
            integrado que busca mejorar la eficiencia, la calidad de los
            resultados y la reducción de costos de operación. Nuestro portafolio
            de actividades le permitirá potenciar el desempeño de su laboratorio
            y la efectividad de su personal técnico.
          </p>
        </div>
      </PageSection>

      {loading ? (
        <PageSection background="gray">
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <p>Cargando servicios...</p>
          </div>
        </PageSection>
      ) : servicios.length > 0 ? (
        servicios.map((servicio, index) => (
          <PageSection
            key={servicio.id}
            background={index % 2 === 0 ? "white" : "gray"}
          >
            <div className="servicio-section">
              <h2 className="servicio-titulo">{servicio.titulo}</h2>
              <div className="servicio-content">
                {servicio.imagen_url && (
                  <div className="servicio-imagen">
                    <img src={servicio.imagen_url} alt={servicio.titulo} />
                  </div>
                )}
                <div className="servicio-descripcion">
                  <p>{servicio.descripcion}</p>
                </div>
              </div>
            </div>
          </PageSection>
        ))
      ) : (
        <PageSection background="gray">
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <p>No hay servicios disponibles en este momento.</p>
          </div>
        </PageSection>
      )}

      <PageSection>
        <div className="soporte-contact">
          <h2 className="section-main-title">Solicite Soporte Técnico</h2>
          <p className="contact-subtitle">
            Complete el formulario y nuestro equipo se pondrá en contacto con
            usted
          </p>
          <form className="soporte-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Nombre Completo</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Su nombre"
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="correo@ejemplo.com"
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Empresa</label>
                <input
                  type="text"
                  name="empresa"
                  value={formData.empresa}
                  onChange={handleChange}
                  placeholder="Nombre de la empresa"
                />
              </div>
              <div className="form-group">
                <label>Teléfono</label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="809-000-0000"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Departamento</label>
              <select
                name="departamento"
                value={formData.departamento}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un departamento</option>
                <option value="ventas">Ventas</option>
                <option value="soporte">Soporte Técnico</option>
                <option value="calibracion">Calibración</option>
                <option value="mantenimiento">Mantenimiento</option>
                <option value="capacitacion">Capacitación</option>
                <option value="general">Consulta General</option>
              </select>
            </div>
            <div className="form-group">
              <label>Mensaje</label>
              <textarea
                name="mensaje"
                value={formData.mensaje}
                onChange={handleChange}
                rows="5"
                placeholder="Describa su solicitud o consulta"
                required
              ></textarea>
            </div>
            {submitMessage && (
              <div
                className={`form-message ${
                  submitMessage.includes("error") ||
                  submitMessage.includes("Error")
                    ? "error"
                    : "success"
                }`}
              >
                {submitMessage}
              </div>
            )}
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Enviar Solicitud"}
            </Button>
          </form>
        </div>
      </PageSection>
    </div>
  );
};

export default Soporte;
