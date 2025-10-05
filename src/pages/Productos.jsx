import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../lib/api';
import Hero from '../components/organisms/Hero';
import PageSection from '../components/templates/PageSection';
import SectionTitle from '../components/molecules/SectionTitle';
import Button from '../components/atoms/Button';
import './Productos.css';

const Productos = () => {
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [categoriasRes, proveedoresRes] = await Promise.all([
        apiClient.getCategorias(true),
        apiClient.getProveedores(true),
      ]);

      if (categoriasRes.data) {
        setCategorias(categoriasRes.data);
      }

      if (proveedoresRes.data) {
        setProveedores(proveedoresRes.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="productos-page">
        <Hero seccion="productos" />
        <PageSection>
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p>Cargando productos...</p>
          </div>
        </PageSection>
      </div>
    );
  }

  return (
    <div className="productos-page">
      <Hero
        title="Productos"
        subtitle=""
        image="https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=1600"
      />

      <PageSection>
        <div className="productos-intro">
          <h1 className="productos-main-title">Productos</h1>
          <p className="productos-description">
            Soluciones analíticas, instrumentos científicos de alto rendimiento, equipos y consumibles para laboratorios en la industria, investigación y docencia para apoyar en los procesos de control de calidad que ayudan a garantizar que nuestras vidas estén mas seguras, libres de preocupaciones.
          </p>
        </div>

        <div className="categorias-grid">
          {categorias.map((categoria) => (
            <div key={categoria.id} className="categoria-card">
              <div className="categoria-icon">
                {categoria.icono_url ? (
                  <img src={categoria.icono_url} alt={categoria.nombre} />
                ) : (
                  <div className="categoria-placeholder">
                    {categoria.nombre.charAt(0)}
                  </div>
                )}
              </div>
              <h3 className="categoria-titulo">{categoria.nombre.toUpperCase()}</h3>
              <Button onClick={() => navigate(`/productos/${categoria.slug}`)}>
                Saber más
              </Button>
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection background="white">
        <SectionTitle title="Marcas Representadas" />
        <div className="marcas-grid">
          {proveedores.map((proveedor) => (
            <div key={proveedor.id} className="marca-item">
              {proveedor.logo_url ? (
                <img src={proveedor.logo_url} alt={proveedor.nombre} />
              ) : (
                <div className="marca-placeholder">
                  {proveedor.nombre}
                </div>
              )}
            </div>
          ))}
        </div>
      </PageSection>
    </div>
  );
};

export default Productos;
