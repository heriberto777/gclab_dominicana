import { useState, useEffect } from 'react';
import Hero from '../components/organisms/Hero';
import PageSection from '../components/templates/PageSection';
import Button from '../components/atoms/Button';
import { apiClient } from '../lib/api';
import covidVirusIcon from '../assets/covid_virus.avif';
import neverasImage from '../assets/neveras_congeladores.avif';
import cabinasImage from "../assets/cabinas_bioseguridad.avif";
import soporteImage from "../assets/producto_sevicios.avif";
import soporteTec2Image from "../assets/soporte_tecnico.avif";
import './Home.css';

const Home = () => {
  const [activeTab, setActiveTab] = useState('equipos');
  const [proveedores, setProveedores] = useState([]);
  const [industrias, setIndustrias] = useState([]);
  const [loadingProveedores, setLoadingProveedores] = useState(true);
  const [loadingIndustrias, setLoadingIndustrias] = useState(true);

   useEffect(() => {
     loadProveedores();
     loadIndustrias();
   }, []);

  const loadProveedores = async () => {
    try {
      const { data } = await apiClient.getProveedores(true);
      if (data) {
        setProveedores(data);
      }
    } catch (error) {
      console.error('Error loading proveedores:', error);
    } finally {
      setLoadingProveedores(false);
    }
  };

   const loadIndustrias = async () => {
     try {
       const { data } = await apiClient.getIndustrias(true);
       if (data) {
         setIndustrias(data);
       }
     } catch (error) {
       console.error("Error loading industrias:", error);
     } finally {
       setLoadingIndustrias(false);
     }
   };

  return (
    <div className="home">
      <Hero seccion="home" />

      <PageSection>
        <div className="quienes-somos-section">
          <p className="mission-text">
            Nuestra misión es ayudar a nuestros clientes a hacer que el mundo
            sea más saludable, más limpio y más seguro.
          </p>
          <Button
            variant="primary"
            onClick={() => (window.location.href = "/quienes-somos")}
          >
            ¿Quienes Somos?
          </Button>
        </div>
      </PageSection>

      <PageSection background="gray">
        <div className="seguridad-section">
          <h2 className="section-main-title">Seguridad y Confianza</h2>
          <p className="intro-text">
            Ofrecemos soluciones analíticas, instrumentos científicos de alto
            rendimiento, equipos menores y consumibles para laboratorios en la
            Industria, Investigación y Docencia para apoyar en los procesos de
            control de calidad que ayudan a garantizar que nuestras vidas estén
            más seguras, libres de preocupaciones.
          </p>

          {loadingIndustrias ? (
            <div className="industrias-loading">
              <p>Cargando industrias...</p>
            </div>
          ) : industrias.length > 0 ? (
            <div className="industrias-grid">
              {industrias.map((industria) => (
                <div key={industria.id} className="industria-card">
                  <div className="industria-icon">
                    {industria.icono_url ? (
                      <img
                        src={industria.icono_url}
                        alt={industria.nombre}
                        className="industria-icon-img"
                      />
                    ) : (
                      <div className="icon-placeholder"></div>
                    )}
                  </div>
                  <h3 className="industria-title">{industria.nombre}</h3>
                  <a
                    href={`/mercado/${industria.slug}`}
                    className="saber-mas-btn"
                  >
                    Saber Más
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="industrias-empty">
              <p>No hay industrias disponibles en este momento.</p>
            </div>
          )}
        </div>
      </PageSection>

      <PageSection>
        <div className="productos-servicios-section">
          <h2 className="section-main-title">Productos y Servicios</h2>

          <div className="tabs-container">
            <div className="tabs-header">
              <button
                className={`tab-button ${
                  activeTab === "equipos" ? "active" : ""
                }`}
                onClick={() => setActiveTab("equipos")}
              >
                Equipos
              </button>
              <button
                className={`tab-button ${
                  activeTab === "soporte" ? "active" : ""
                }`}
                onClick={() => setActiveTab("soporte")}
              >
                Soporte Técnico
              </button>
            </div>

            <div className="tabs-content">
              {activeTab === "equipos" && (
                <div className="tab-panel">
                  <div className="tab-image">
                    <img src={soporteImage} alt="Equipos" />
                  </div>
                  <div className="tab-text">
                    <p>
                      Instrumentos de alta tecnología, equipos menores y
                      consumibles para laboratorios en la industria, la
                      investigación y la docencia.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "soporte" && (
                <div className="tab-panel">
                  <div className="tab-image">
                    <img src={soporteTec2Image} alt="Soporte Técnico" />
                  </div>
                  <div className="tab-text">
                    <p>
                      Presentamos un enfoque de servicio global, no solo
                      orientado a la venta e instalación de sus instrumentos
                      sino a mejorar el desempeño de su laboratorio, buscando
                      mejorar la eficiencia y la calidad reduciendo costos.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </PageSection>

      <PageSection background="gray">
        <div className="proteccion-section">
          <div className="proteccion-header">
            <img
              src={covidVirusIcon}
              alt="Virus icon"
              className="virus-icon virus-icon-left"
            />
            <h2 className="section-main-title proteccion-title">
              Protección. Prevención
            </h2>
            <img
              src={covidVirusIcon}
              alt="Virus icon"
              className="virus-icon virus-icon-right"
            />
          </div>

          <p className="proteccion-subtitle">
            Luchemos Juntos Contra El SARS-CoV-2 Y COVID-19
          </p>

          <div className="proteccion-item">
            <div className="proteccion-image-container">
              <img
                src={cabinasImage}
                alt="Cabinas de Bioseguridad"
                className="proteccion-product-image"
              />
            </div>
            <div className="proteccion-content">
              <h3 className="proteccion-item-title">CABINAS DE BIOSEGURIDAD</h3>
              <p className="proteccion-item-text">
                El CDC y la OMS actualmente recomiendan que se utilicen las
                Cabinas de Bioseguridad de Clase II (BSC) cada vez que un
                procedimiento de laboratorio tenga el potencial de generar
                aerosoles o gotitas como resultado de vórtice, pipeteo,
                centrifugación u otras técnicas. Las Cabinas de Bioseguridad de
                Clase II de Labconco Corporation son una opción ideal para
                manipular muestras de COVID-19, ya que proveen 3 niveles de
                protección: protección del personal (el usuario), protección del
                producto (la muestra) y protección del medio ambiente (el
                laboratorio).
              </p>
            </div>
          </div>

          <div className="proteccion-item proteccion-item-reverse">
            <div className="proteccion-content">
              <h3 className="proteccion-item-title">
                NEVERAS, CONGELADORES Y EQUIPOS DE CRÍO-PRESERVACIÓN
              </h3>
              <p className="proteccion-item-text">
                No se deben hacer concesiones cuando se trata de almacenar
                vacunas, razón por la cual proporcionamos refrigeradores,
                congeladores y ultracongeladores de alto rendimiento
                especialmente diseñados para cumplir con los estándares actuales
                e inminentes de los CDC, la OMS, NSF 456 y otras agencias
                mundiales para el almacenamiento de vacunas. Investigadores de
                todo el mundo protegen más de dos mil millones de muestras
                dentro de equipos de almacenamiento en frío Thermo Scientific.
                Con soluciones que van desde refrigeradores de +4 °C hasta
                congeladores criogénicos de -196 °C y los consumibles Thermo
                Scientific, podrá concentrarse en su trabajo sin necesidad de
                preocuparse por sus valiosas muestras.
              </p>
            </div>
            <div className="proteccion-image-container">
              <img
                src={neverasImage}
                alt="Neveras y Congeladores"
                className="proteccion-product-image"
              />
            </div>
          </div>
        </div>
      </PageSection>

      <PageSection>
        <div className="marcas-section">
          {/* <h2 className="section-main-title">Nuestras Marcas</h2> */}

          {loadingProveedores ? (
            <div className="marcas-loading">
              <p>Cargando marcas...</p>
            </div>
          ) : proveedores.length > 0 ? (
            <div className="marcas-carousel">
              <div className="marcas-track">
                {proveedores.concat(proveedores).map((proveedor, index) => (
                  <div key={`${proveedor.id}-${index}`} className="marca-item">
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
            </div>
          ) : (
            <div className="marcas-empty">
              <p>No hay marcas disponibles en este momento.</p>
            </div>
          )}
        </div>
      </PageSection>
    </div>
  );
};

export default Home;