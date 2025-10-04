import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { apiClient } from '../lib/api';
import Hero from '../components/organisms/Hero';
import PageSection from '../components/templates/PageSection';
import Button from '../components/atoms/Button';
import ImageCarousel from '../components/molecules/ImageCarousel';
import './ProductoDetail.css';

const ProductoDetail = () => {
  const { categoria } = useParams();
  const [categoriaData, setCategoriaData] = useState(null);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [categoria]);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: catData, error: catError} = await apiClient.getCategoriaBySlug(categoria);

      if (catData && !catError) {
        setCategoriaData(catData);

        const { data: productsData, error: productsError } = await apiClient.getProductos({
          categoria: categoria,
          activo: true
        });

        if (productsData && !productsError) {
          setProductos(productsData);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="producto-detail-page">
        <Hero
          title="Cargando..."
          subtitle=""
          image=""
        />
        <PageSection>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>Cargando productos...</p>
          </div>
        </PageSection>
      </div>
    );
  }

  if (!categoriaData) {
    return (
      <div className="producto-detail-page">
        <Hero
          title="Categoría no encontrada"
          subtitle=""
          image=""
        />
        <PageSection>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>La categoría solicitada no existe.</p>
          </div>
        </PageSection>
      </div>
    );
  }

  return (
    <div className="producto-detail-page">
      <Hero
        title={categoriaData.nombre}
        subtitle={categoriaData.descripcion || ''}
        image={categoriaData.icono_url || ''}
      />

      <PageSection>
        <h1 className="producto-page-title">{categoriaData.nombre.toUpperCase()}</h1>

        {productos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>No hay productos disponibles en esta categoría.</p>
          </div>
        ) : (
          productos.map((producto) => (
            <div key={producto.id} className="producto-categoria-section">
              <div className="producto-categoria-content">
                <div className="producto-categoria-info">
                  <h2 className="producto-categoria-titulo">{producto.nombre.toUpperCase()}</h2>

                  {producto.descripcion && (
                    <div
                      className="producto-descripcion"
                      dangerouslySetInnerHTML={{ __html: producto.descripcion }}
                    />
                  )}

                  {producto.proveedores && producto.proveedores.length > 0 && (
                    <div className="producto-proveedores-section">
                      <div className="proveedores-logos-row">
                        {producto.proveedores
                          .filter(prov => prov.disponible !== false)
                          .map((proveedor, idx) => (
                            <a
                              key={idx}
                              href={proveedor.sitio_web}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="proveedor-logo-link"
                              title={`Ver ${proveedor.nombre}`}
                            >
                              {proveedor.logo_url ? (
                                <img
                                  src={proveedor.logo_url}
                                  alt={proveedor.nombre}
                                />
                              ) : (
                                <div className="proveedor-name-text">
                                  {proveedor.nombre}
                                </div>
                              )}
                            </a>
                          ))}
                      </div>
                      {/* <div className="proveedores-buttons-row">
                        {producto.proveedores
                          .filter(prov => prov.disponible !== false)
                          .map((proveedor, idx) => (
                            <Button
                              key={idx}
                              onClick={() => window.open(proveedor.sitio_web, '_blank', 'noopener,noreferrer')}
                              variant="primary"
                            >
                              Saber más
                            </Button>
                          ))}
                      </div> */}
                    </div>
                  )}
                </div>

                <div className="producto-categoria-imagen">
                  <ImageCarousel
                    images={
                      producto.imagenes_adicionales && Array.isArray(producto.imagenes_adicionales) && producto.imagenes_adicionales.length > 0
                        ? producto.imagenes_adicionales
                        : producto.imagen_principal
                        ? [producto.imagen_principal]
                        : []
                    }
                    alt={producto.nombre}
                    interval={5000}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </PageSection>
    </div>
  );
};

export default ProductoDetail;
