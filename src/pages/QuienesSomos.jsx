import { useState, useEffect } from 'react';
import Hero from '../components/organisms/Hero';
import PageSection from '../components/templates/PageSection';
import SectionTitle from '../components/molecules/SectionTitle';
import { api } from '../lib/api';
import './QuienesSomos.css';

const QuienesSomos = () => {
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const data = await api.get('/proveedores?activo=true');
        setProveedores(data);
      } catch (error) {
        console.error('Error al cargar proveedores:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProveedores();
  }, []);

  return (
    <div className="quienes-somos">
      <Hero
        title="Quienes Somos"
        subtitle="Expertos en soluciones para laboratorios"
        image="https://images.pexels.com/photos/2280568/pexels-photo-2280568.jpeg?auto=compress&cs=tinysrgb&w=1600"
      />

      <PageSection>
        <div className="intro-section">
          <p className="intro-paragraph">
            En GCLAB, creemos en una mejor manera de satisfacer las necesidades de nuestros clientes. Una forma más valiosa y menos invasiva.
          </p>
          <p className="intro-paragraph highlight">
            Nuestra misión es colaborar con nuestros clientes para lograr que el mundo sea más saludable, más limpio y más seguro.<br />
            No hay motivación más poderosa.
          </p>
          <p className="intro-paragraph">
            Nos importan nuestros clientes y cuidándolos es cómo nos ocupamos de nuestro negocio.
          </p>
          <p className="intro-paragraph">
            Nos importa la calidad. En todos los departamentos, en todos los niveles, cada colaborador de GCLab Dominicana, se siente orgulloso de hacer todo lo posible para entregar el mejor producto.
          </p>
          <p className="intro-paragraph">
            Nos importa nuestra gente. Para nosotros, GCLab significa familia. Creemos en tratarlos con el mismo cuidado y atención que le damos a nuestros clientes porque gracias a ellos es que podemos alcanzar la excelencia.
          </p>
        </div>
      </PageSection>

      <PageSection background="gray">
        <SectionTitle title="NUESTRA HISTORIA" />
        <div className="historia-content">
          <p>
            En el año 1962 fue fundada la empresa Equilab C.A. Para proveer soluciones en el mercado analítico, de la salud y de telecomunicaciones en Venezuela y su área de influencia en el Caribe. Movidos por el crecimiento de estos mercados y con el fin de proporcionar a nuestros clientes la excelencia tecnológica, en el año 1996 creamos Equilab Científica C.A. incorporando a las líneas tradicionales que representábamos, innovadoras líneas de productos, adecuadas para satisfacer la demanda en áreas como Control de Calidad, Investigación y Medio Ambiente, alcanzando el liderazgo en el mercado Venezolano en la distribución de instrumentos analíticos, científicos y material de laboratorio.
          </p>
          <p>
            En el año 2011, identificando oportunidades y asumiendo el reto de cubrir nuevos mercados, decidimos constituir GCLab Dominicana SRL., trayendo al mercado farmacéutico, industrial y universitario de la Republica Dominicana nuestra experiencia de más 50 años de trayectoria en la venta y soporte de productos de calidad.
          </p>
        </div>
      </PageSection>

      <PageSection>
        <SectionTitle title="NUESTRO COMPROMISO" />
        <div className="compromiso-content">
          <p className="compromiso-intro">
            Nos comprometemos en hacer lo correcto. En cada decisión que tomamos y producto que vendemos, nos hacemos responsables de vender lo correcto, de la manera correcta.
          </p>

          <h3 className="compromiso-subtitle">¿Qué puedes esperar de nosotros?</h3>

          <div className="compromiso-grid">
            <div className="compromiso-item">
              <h4>Personas reales</h4>
              <p>Cuando llamas a nuestra oficina obtienes un profesional listo para enfocarse en ti.</p>
            </div>

            <div className="compromiso-item">
              <h4>Conocimiento</h4>
              <p>Hemos acumulado años de experiencia y conocimiento. Podemos ayudarte a encontrar respuesta y soluciones. Estamos felices de compartir nuestra experiencia contigo.</p>
            </div>

            <div className="compromiso-item">
              <h4>Veracidad</h4>
              <p>Nunca exageraremos el nivel de rendimiento de un producto. Siempre podrás confiar que nuestra recomendación será la mejor opción para tu necesidad.</p>
            </div>
          </div>

          <p className="compromiso-footer">
            Somos una empresa que se preocupa por ti
          </p>
        </div>
      </PageSection>

      <PageSection background="gray">
        <SectionTitle title="NUESTROS PROVEEDORES" />
        <div className="proveedores-content">
          {loading ? (
            <p className="loading-message">Cargando proveedores...</p>
          ) : proveedores.length > 0 ? (
            <div className="proveedores-grid">
              {proveedores.map((proveedor) => (
                <a
                  key={proveedor.id}
                  href={proveedor.sitio_web}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="proveedor-logo"
                  title={proveedor.nombre}
                >
                  {proveedor.logo_url ? (
                    <img
                      src={proveedor.logo_url}
                      alt={proveedor.nombre}
                    />
                  ) : (
                    <div className="proveedor-name-fallback">
                      {proveedor.nombre}
                    </div>
                  )}
                </a>
              ))}
            </div>
          ) : (
            <p className="no-proveedores">No hay proveedores disponibles en este momento.</p>
          )}
        </div>
      </PageSection>
    </div>
  );
};

export default QuienesSomos;
