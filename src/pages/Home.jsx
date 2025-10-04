import { useState } from 'react';
import Hero from '../components/organisms/Hero';
import PageSection from '../components/templates/PageSection';
import Button from '../components/atoms/Button';
import './Home.css';

const Home = () => {
  const [activeTab, setActiveTab] = useState('equipos');

  const industrias = [
    { title: 'INDUSTRIA\nFARMACÉUTICA', link: '/mercado/industria-farmaceutica' },
    { title: 'MINAS\nY CEMENTO', link: '/mercado/energia-minas-cemento' },
    { title: 'INDUSTRIA\nQUÍMICA', link: '/mercado/industria-quimica' },
    { title: 'LIFE\nSCIENCE', link: '/mercado/life-sciences' },
    { title: 'INVESTIGACIÓN\nY DESARROLLO', link: '/mercado/investigacion-desarrollo' },
    { title: 'MEDIO\nAMBIENTE', link: '/mercado/medio-ambiente' },
    { title: 'ALIMENTOS\nY BEBIDAS', link: '/mercado/alimentos' },
    { title: 'MEDICAL\nDEVICES', link: '/mercado/industria-farmaceutica' }
  ];

  const marcas = [
    'https://images.pexels.com/photos/3825586/pexels-photo-3825586.jpeg?auto=compress&cs=tinysrgb&w=300&h=100',
    'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=300&h=100',
    'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=300&h=100',
    'https://images.pexels.com/photos/3825517/pexels-photo-3825517.jpeg?auto=compress&cs=tinysrgb&w=300&h=100',
    'https://images.pexels.com/photos/954585/pexels-photo-954585.jpeg?auto=compress&cs=tinysrgb&w=300&h=100',
    'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=300&h=100'
  ];

  return (
    <div className="home">
      <Hero
        title=""
        subtitle=""
        image="https://images.pexels.com/photos/3825540/pexels-photo-3825540.jpeg?auto=compress&cs=tinysrgb&w=1600"
      />

      <PageSection>
        <div className="quienes-somos-section">
          <p className="mission-text">
            Nuestra misión es ayudar a nuestros clientes a hacer que el mundo sea más saludable, más limpio y más seguro.
          </p>
          <Button variant="primary" onClick={() => window.location.href = '/quienes-somos'}>
            ¿Quienes Somos?
          </Button>
        </div>
      </PageSection>

      <PageSection background="gray">
        <div className="seguridad-section">
          <h2 className="section-main-title">Seguridad y Confianza</h2>
          <p className="intro-text">
            Ofrecemos soluciones analíticas, instrumentos científicos de alto rendimiento, equipos menores y consumibles para laboratorios en la Industria, Investigación y Docencia para apoyar en los procesos de control de calidad que ayudan a garantizar que nuestras vidas estén más seguras, libres de preocupaciones.
          </p>
          <div className="industrias-grid">
            {industrias.map((industria, index) => (
              <div key={index} className="industria-card">
                <div className="industria-icon">
                  <div className="icon-placeholder"></div>
                </div>
                <h3 className="industria-title">{industria.title}</h3>
                <a href={industria.link} className="saber-mas-btn">Saber Más</a>
              </div>
            ))}
          </div>
        </div>
      </PageSection>

      <PageSection>
        <div className="productos-servicios-section">
          <h2 className="section-main-title">Productos y Servicios</h2>

          <div className="tabs-container">
            <div className="tabs-header">
              <button
                className={`tab-button ${activeTab === 'equipos' ? 'active' : ''}`}
                onClick={() => setActiveTab('equipos')}
              >
                Equipos
              </button>
              <button
                className={`tab-button ${activeTab === 'soporte' ? 'active' : ''}`}
                onClick={() => setActiveTab('soporte')}
              >
                Soporte Técnico
              </button>
            </div>

            <div className="tabs-content">
              {activeTab === 'equipos' && (
                <div className="tab-panel">
                  <div className="tab-image">
                    <img
                      src="https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=800"
                      alt="Equipos"
                    />
                  </div>
                  <div className="tab-text">
                    <p>
                      Instrumentos de alta tecnología, equipos menores y consumibles para laboratorios en la industria, la investigación y la docencia.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'soporte' && (
                <div className="tab-panel">
                  <div className="tab-image">
                    <img
                      src="https://images.pexels.com/photos/8326726/pexels-photo-8326726.jpeg?auto=compress&cs=tinysrgb&w=800"
                      alt="Soporte Técnico"
                    />
                  </div>
                  <div className="tab-text">
                    <p>
                      Presentamos un enfoque de servicio global, no solo orientado a la venta e instalación de sus instrumentos sino a mejorar el desempeño de su laboratorio, buscando mejorar la eficiencia y la calidad reduciendo costos.
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
          <h2 className="section-main-title">Protección. Prevención.</h2>

          <div className="proteccion-item">
            <div className="proteccion-image">
              <img
                src="https://images.pexels.com/photos/3825540/pexels-photo-3825540.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Cabinas de Bioseguridad"
              />
            </div>
            <div className="proteccion-content">
              <h3>CABINAS DE BIOSEGURIDAD</h3>
              <p>
                El CDC y la OMS actualmente recomiendan que se utilicen las Cabinas de Bioseguridad de Clase II (BSC) cada vez que un procedimiento de laboratorio tenga el potencial de generar aerosoles o gotitas como resultado de vórtice, pipeteo, centrifugación u otras técnicas. Las Cabinas de Bioseguridad de Clase II de Labconco Corporation son una opción ideal para manipular muestras de COVID-19, ya que proveen 3 niveles de protección: protección del personal (el usuario), protección del producto (la muestra) y protección del medio ambiente (el laboratorio).
              </p>
            </div>
          </div>

          <div className="proteccion-item proteccion-item-reverse">
            <div className="proteccion-content">
              <h3>NEVERAS, CONGELADORES Y EQUIPOS DE CRÍO-PRESERVACIÓN</h3>
              <p>
                No se deben hacer concesiones cuando se trata de almacenar vacunas, razón por la cual proporcionamos refrigeradores, congeladores y ultracongeladores de alto rendimiento especialmente diseñados para cumplir con los estándares actuales e inminentes de los CDC, la OMS, NSF 456 y otras agencias mundiales para el almacenamiento de vacunas. Investigadores de todo el mundo protegen más de dos mil millones de muestras dentro de equipos de almacenamiento en frío Thermo Scientific. Con soluciones que van desde refrigeradores de +4 °C hasta congeladores criogénicos de -196 °C y los consumibles Thermo Scientific, podrá concentrarse en su trabajo sin necesidad de preocuparse por sus valiosas muestras.
              </p>
            </div>
            <div className="proteccion-image">
              <img
                src="https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Neveras y Congeladores"
              />
            </div>
          </div>
        </div>
      </PageSection>

      <PageSection>
        <div className="marcas-section">
          <h2 className="section-main-title">Nuestras Marcas</h2>
          <div className="marcas-carousel">
            <div className="marcas-track">
              {marcas.concat(marcas).map((marca, index) => (
                <div key={index} className="marca-item">
                  <img src={marca} alt={`Marca ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </PageSection>
    </div>
  );
};

export default Home;
