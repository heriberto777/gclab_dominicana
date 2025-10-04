import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
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
      const { data: catData } = await supabase
        .from('categorias')
        .select('*')
        .eq('slug', categoria)
        .eq('activo', true)
        .single();

      if (catData) {
        setCategoriaData(catData);

        const { data: productsData } = await supabase
          .from('productos')
          .select(`
            *,
            producto_proveedores (
              proveedor_id,
              precio,
              moneda,
              codigo_producto,
              disponible,
              proveedores (
                id,
                nombre,
                slug,
                logo_url,
                sitio_web
              )
            )
          `)
          .eq('categoria_id', catData.id)
          .eq('activo', true)
          .order('destacado', { ascending: false })
          .order('nombre');

        if (productsData) {
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
                    <div className="producto-descripcion">
                      {producto.descripcion.split('\n').map((line, idx) => {
                        if (line.trim().startsWith('-') || line.trim().startsWith('•')) {
                          return <li key={idx}>{line.replace(/^[-•]\s*/, '')}</li>;
                        }
                        return null;
                      }).filter(Boolean).length > 0 ? (
                        <ul className="producto-categoria-lista">
                          {producto.descripcion.split('\n').map((line, idx) => {
                            if (line.trim().startsWith('-') || line.trim().startsWith('•')) {
                              return <li key={idx}>{line.replace(/^[-•]\s*/, '')}</li>;
                            }
                            return null;
                          })}
                        </ul>
                      ) : (
                        <p>{producto.descripcion}</p>
                      )}
                    </div>
                  )}

                  {producto.producto_proveedores && producto.producto_proveedores.length > 0 && (
                    <div className="producto-proveedores-container">
                      <div className="producto-proveedores-logos">
                        {producto.producto_proveedores
                          .filter(pp => pp.proveedores && pp.disponible)
                          .map((pp, idx) => (
                            <div key={idx} className="proveedor-logo-item">
                              {pp.proveedores.logo_url ? (
                                <img
                                  src={pp.proveedores.logo_url}
                                  alt={pp.proveedores.nombre}
                                  title={pp.proveedores.nombre}
                                />
                              ) : (
                                <div className="proveedor-logo-placeholder">
                                  {pp.proveedores.nombre}
                                </div>
                              )}
                            </div>
                          ))}
                      </div>

                      <div className="producto-proveedores-buttons">
                        {producto.producto_proveedores
                          .filter(pp => pp.proveedores && pp.disponible)
                          .map((pp, idx) => (
                            <Button
                              key={idx}
                              onClick={() => {
                                if (pp.proveedores.sitio_web) {
                                  window.open(pp.proveedores.sitio_web, '_blank', 'noopener,noreferrer');
                                }
                              }}
                            >
                              Saber más
                            </Button>
                          ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="producto-categoria-imagen">
                  <ImageCarousel
                    images={
                      producto.imagenes && Array.isArray(producto.imagenes) && producto.imagenes.length > 0
                        ? producto.imagenes
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
