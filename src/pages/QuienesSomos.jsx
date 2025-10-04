import Hero from '../components/organisms/Hero';
import PageSection from '../components/templates/PageSection';
import SectionTitle from '../components/molecules/SectionTitle';
import './QuienesSomos.css';

const QuienesSomos = () => {
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
          <div className="proveedores-grid">
            <div className="proveedor-logo"><img src="https://via.placeholder.com/150x80/ffffff/0066cc?text=TA+Instruments" alt="TA Instruments" /></div>
            <div className="proveedor-logo"><img src="https://via.placeholder.com/150x80/ffffff/0066cc?text=SCION+Instruments" alt="SCION Instruments" /></div>
            <div className="proveedor-logo"><img src="https://via.placeholder.com/150x80/ffffff/0066cc?text=KNAUER" alt="KNAUER" /></div>
            <div className="proveedor-logo"><img src="https://via.placeholder.com/150x80/ffffff/0066cc?text=BRUKER" alt="BRUKER" /></div>
            <div className="proveedor-logo"><img src="https://via.placeholder.com/150x80/ffffff/0066cc?text=ERWEKA" alt="ERWEKA" /></div>

            <div className="proveedor-logo"><img src="https://via.placeholder.com/150x80/ffffff/0066cc?text=Biotage" alt="Biotage" /></div>
            <div className="proveedor-logo"><img src="https://via.placeholder.com/150x80/ffffff/0066cc?text=GBC" alt="GBC" /></div>
            <div className="proveedor-logo"><img src="https://via.placeholder.com/150x80/ffffff/0066cc?text=MoistTech" alt="MoistTech Corp" /></div>
            <div className="proveedor-logo"><img src="https://via.placeholder.com/150x80/ffffff/0066cc?text=KRUSS" alt="KRUSS" /></div>
            <div className="proveedor-logo"><img src="https://via.placeholder.com/150x80/ffffff/0066cc?text=SWISSGAS" alt="SWISSGAS" /></div>

            <div className="proveedor-logo"><img src="https://via.placeholder.com/150x80/ffffff/0066cc?text=Thermo+Scientific" alt="Thermo Scientific" /></div>
            <div className="proveedor-logo"><img src="https://via.placeholder.com/150x80/ffffff/0066cc?text=Fisher+Scientific" alt="Fisher Scientific" /></div>
            <div className="proveedor-logo"><img src="https://via.placeholder.com/150x80/ffffff/0066cc?text=LABCONCO" alt="LABCONCO" /></div>
            <div className="proveedor-logo"><img src="https://via.placeholder.com/150x80/ffffff/0066cc?text=Lovibond" alt="Lovibond" /></div>
            <div className="proveedor-logo"><img src="https://via.placeholder.com/150x80/ffffff/0066cc?text=OHAUS" alt="OHAUS" /></div>

            <div className="proveedor-logo"><img src="https://via.placeholder.com/150x80/ffffff/0066cc?text=Cole-Parmer" alt="Cole-Parmer" /></div>
            <div className="proveedor-logo"><img src="https://via.placeholder.com/150x80/ffffff/0066cc?text=CORNING" alt="CORNING" /></div>
            <div className="proveedor-logo"><img src="https://via.placeholder.com/150x80/ffffff/0066cc?text=Cytiva" alt="Cytiva" /></div>
            <div className="proveedor-logo"><img src="https://via.placeholder.com/150x80/ffffff/0066cc?text=Honeywell" alt="Honeywell" /></div>
            <div className="proveedor-logo"><img src="https://via.placeholder.com/150x80/ffffff/0066cc?text=RAYPA" alt="RAYPA" /></div>

            <div className="proveedor-logo"><img src="https://via.placeholder.com/150x80/ffffff/0066cc?text=Environmental" alt="Environmental Express" /></div>
            <div className="proveedor-logo"><img src="https://via.placeholder.com/150x80/ffffff/0066cc?text=Koehler" alt="Koehler" /></div>
            <div className="proveedor-logo"><img src="https://via.placeholder.com/150x80/ffffff/0066cc?text=Leica" alt="Leica Microsystems" /></div>
            <div className="proveedor-logo"><img src="https://via.placeholder.com/150x80/ffffff/0066cc?text=Yamato" alt="Yamato" /></div>
            <div className="proveedor-logo"><img src="https://via.placeholder.com/150x80/ffffff/0066cc?text=Masterflex" alt="Masterflex" /></div>
          </div>
        </div>
      </PageSection>
    </div>
  );
};

export default QuienesSomos;
