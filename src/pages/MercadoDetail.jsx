import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiClient } from "../lib/api";
import Hero from "../components/organisms/Hero";
import PageSection from "../components/templates/PageSection";
import Button from "../components/atoms/Button";
import Carousel from "../components/molecules/Carousel";
import "./MercadoDetail.css";

const MercadoDetail = () => {
  const { sector } = useParams();
  const navigate = useNavigate();
  const [mercado, setMercado] = useState(null);
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, [sector]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [mercadoRes, proveedoresRes] = await Promise.all([
        apiClient.getMercadoBySlug(sector),
        apiClient.getProveedores(true),
      ]);

      if (mercadoRes.data) {
        setMercado(mercadoRes.data);
      } else {
        setError("Mercado no encontrado");
      }

      if (proveedoresRes.data) {
        setProveedores(proveedoresRes.data);
      }
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Error al cargar el mercado");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mercado-detail">
        <PageSection>
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <p>Cargando...</p>
          </div>
        </PageSection>
      </div>
    );
  }

  if (error || !mercado) {
    return (
      <div className="mercado-detail">
        <PageSection>
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <h2>Mercado no encontrado</h2>
            <p>{error || "El mercado solicitado no existe"}</p>
            <Button onClick={() => navigate("/")}>Volver al inicio</Button>
          </div>
        </PageSection>
      </div>
    );
  }

  // Transformar proveedores al formato del carousel
  const carouselItems = proveedores.map((proveedor) => ({
    id: proveedor.id,
    name: proveedor.nombre,
    imageUrl: proveedor.logo_url,
  }));

  return (
    <div className="mercado-detail">
      <section
        className="hero"
        style={{ backgroundImage: `url(${mercado.imagen_hero_url})` }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">
            {mercado.titulo_hero || mercado.nombre}
          </h1>
          {mercado.subtitulo_hero && (
            <p className="hero-subtitle">{mercado.subtitulo_hero}</p>
          )}
        </div>
      </section>

      <PageSection>
        <div className="mercado-content">
          <h1 className="mercado-title">
            {mercado.titulo_hero || mercado.nombre}
          </h1>

          {mercado.subtitulo_hero && (
            <h2 className="mercado-subtitle">{mercado.subtitulo_hero}</h2>
          )}

          {mercado.descripcion && (
            <p className="mercado-description">{mercado.descripcion}</p>
          )}

          {mercado.contenido && (
            <div
              className="mercado-contenido"
              dangerouslySetInnerHTML={{ __html: mercado.contenido }}
            />
          )}

          {mercado.soluciones && mercado.soluciones.length > 0 && (
            <>
              <h3 className="soluciones-title">SOLUCIONES PARA:</h3>
              <ul className="soluciones-list">
                {mercado.soluciones.map((solucion, index) => (
                  <li key={index}>{solucion}</li>
                ))}
              </ul>
            </>
          )}

          <div className="productos-button-container">
            <Button onClick={() => navigate("/productos")}>Productos</Button>
          </div>
        </div>
      </PageSection>

      <PageSection background="white">
        <Carousel
          items={carouselItems}
          title="Nuestros Proveedores"
          autoPlay={true}
          interval={3000}
          visibleItems={{ desktop: 5, tablet: 3, mobile: 2 }}
        />
      </PageSection>
    </div>
  );
};

export default MercadoDetail;
