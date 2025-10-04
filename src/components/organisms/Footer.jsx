import { Link } from 'react-router-dom';
import Logo from '../atoms/Logo';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-column">
            <Logo />
            <p className="footer-description">
              Soluciones integrales para laboratorios científicos y de análisis.
              Equipos, reactivos y servicios técnicos especializados.
            </p>
          </div>

          <div className="footer-column">
            <h4 className="footer-title">Mercado</h4>
            <ul className="footer-links">
              <li><Link to="/mercado/industria-farmaceutica">Industria Farmacéutica</Link></li>
              <li><Link to="/mercado/alimentos">Alimentos</Link></li>
              <li><Link to="/mercado/energia-minas-cemento">Energía, Minas y Cemento</Link></li>
              <li><Link to="/mercado/medio-ambiente">Medio Ambiente</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4 className="footer-title">Productos</h4>
            <ul className="footer-links">
              <li><Link to="/productos/instrumentos-analiticos">Instrumentos Analíticos</Link></li>
              <li><Link to="/productos/equipos-miscelaneos">Equipos Misceláneos</Link></li>
              <li><Link to="/productos/material-consumibles">Material y Consumibles</Link></li>
              <li><Link to="/productos/reactivos">Reactivos</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4 className="footer-title">Empresa</h4>
            <ul className="footer-links">
              <li><Link to="/quienes-somos">Quienes Somos</Link></li>
              <li><Link to="/soporte">Soporte Técnico</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 GC Lab. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
