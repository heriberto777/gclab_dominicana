import Hero from '../components/organisms/Hero';
import PageSection from '../components/templates/PageSection';
import SectionTitle from '../components/molecules/SectionTitle';
import Button from '../components/atoms/Button';
import './Soporte.css';

const Soporte = () => {
  return (
    <div className="soporte">
      <Hero
        title="Soporte y Servicio Técnico"
        subtitle="Mantenimiento, calibración y soporte técnico especializado"
        image="https://images.pexels.com/photos/8326726/pexels-photo-8326726.jpeg?auto=compress&cs=tinysrgb&w=1600"
      />

      <PageSection>
        <SectionTitle
          title="Nuestros Servicios"
          subtitle="Ofrecemos soporte técnico integral para garantizar el óptimo funcionamiento de sus equipos"
        />
        <div className="servicios-grid">
          <div className="servicio-card">
            <h3>Instalación y Puesta en Marcha</h3>
            <p>
              Instalación profesional de equipos, validación inicial y capacitación
              del personal operativo para garantizar el correcto funcionamiento desde el inicio.
            </p>
          </div>
          <div className="servicio-card">
            <h3>Mantenimiento Preventivo</h3>
            <p>
              Programas de mantenimiento preventivo para maximizar la vida útil de sus equipos
              y prevenir paradas no planificadas en sus procesos.
            </p>
          </div>
          <div className="servicio-card">
            <h3>Calibración</h3>
            <p>
              Servicios de calibración trazables a estándares internacionales, con emisión
              de certificados que cumplen con normativas ISO y GMP.
            </p>
          </div>
          <div className="servicio-card">
            <h3>Reparación</h3>
            <p>
              Diagnóstico y reparación de equipos por técnicos certificados, utilizando
              repuestos originales para garantizar la calidad del servicio.
            </p>
          </div>
          <div className="servicio-card">
            <h3>Capacitación</h3>
            <p>
              Programas de capacitación técnica para el personal, abarcando operación,
              mantenimiento básico y mejores prácticas de uso.
            </p>
          </div>
          <div className="servicio-card">
            <h3>Soporte Remoto</h3>
            <p>
              Asistencia técnica remota para resolución rápida de consultas y solución
              de problemas básicos sin necesidad de visita presencial.
            </p>
          </div>
        </div>
      </PageSection>

      <PageSection background="gray">
        <div className="soporte-info">
          <div className="soporte-info-content">
            <SectionTitle
              title="¿Por Qué Elegirnos?"
              align="left"
            />
            <ul className="soporte-benefits">
              <li>Técnicos certificados y con amplia experiencia</li>
              <li>Respuesta rápida a solicitudes de servicio</li>
              <li>Repuestos originales en stock</li>
              <li>Contratos de mantenimiento flexibles</li>
              <li>Disponibilidad para emergencias</li>
              <li>Documentación completa y trazable</li>
            </ul>
          </div>
          <div className="soporte-info-image">
            <img
              src="https://images.pexels.com/photos/3825540/pexels-photo-3825540.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Técnico de laboratorio"
            />
          </div>
        </div>
      </PageSection>

      <PageSection>
        <div className="soporte-contact">
          <SectionTitle
            title="Solicite Soporte Técnico"
            subtitle="Complete el formulario y nuestro equipo se pondrá en contacto con usted"
          />
          <form className="soporte-form">
            <div className="form-row">
              <div className="form-group">
                <label>Nombre Completo</label>
                <input type="text" placeholder="Su nombre" />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" placeholder="correo@ejemplo.com" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Empresa</label>
                <input type="text" placeholder="Nombre de la empresa" />
              </div>
              <div className="form-group">
                <label>Teléfono</label>
                <input type="tel" placeholder="809-000-0000" />
              </div>
            </div>
            <div className="form-group">
              <label>Tipo de Servicio</label>
              <select>
                <option>Mantenimiento Preventivo</option>
                <option>Reparación</option>
                <option>Calibración</option>
                <option>Instalación</option>
                <option>Capacitación</option>
                <option>Consulta General</option>
              </select>
            </div>
            <div className="form-group">
              <label>Mensaje</label>
              <textarea rows="5" placeholder="Describa su solicitud o consulta"></textarea>
            </div>
            <Button variant="primary">Enviar Solicitud</Button>
          </form>
        </div>
      </PageSection>
    </div>
  );
};

export default Soporte;
