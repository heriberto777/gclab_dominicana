import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../atoms/Logo';
import { apiClient } from '../../lib/api';
import './Footer.css';

const Footer = () => {
  const [socialMedia, setSocialMedia] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSocialMedia();
  }, []);

  const loadSocialMedia = async () => {
    try {
      const { data } = await apiClient.getSocialMedia(true);
      if (data) {
        setSocialMedia(data);
      }
    } catch (error) {
      console.error('Error loading social media:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-column">
            <Logo type="footer" size="large" variant="white" />
            <p className="footer-description">
              Soluciones integrales para laboratorios científicos y de análisis.
              Equipos, reactivos y servicios técnicos especializados.
            </p>

            {!loading && socialMedia.length > 0 && (
              <div className="footer-social-media">
                {socialMedia.map((social) => (
                  <a /* ⬅️ ESTA LÍNEA FALTABA */
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-media-link"
                    title={social.nombre}
                  >
                    {social.logo_url ? (
                      <img
                        src={social.logo_url}
                        alt={social.nombre}
                        className="social-media-icon"
                      />
                    ) : (
                      <span className="social-media-text">{social.nombre}</span>
                    )}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="footer-column">
            <h4 className="footer-title">Mercado</h4>
            <ul className="footer-links">
              <li>
                <Link to="/mercado/industria-farmaceutica">
                  Industria Farmacéutica
                </Link>
              </li>
              <li>
                <Link to="/mercado/alimentos">Alimentos</Link>
              </li>
              <li>
                <Link to="/mercado/energia-minas-cemento">
                  Energía, Minas y Cemento
                </Link>
              </li>
              <li>
                <Link to="/mercado/medio-ambiente">Medio Ambiente</Link>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h4 className="footer-title">Productos</h4>
            <ul className="footer-links">
              <li>
                <Link to="/productos/instrumentos-analiticos">
                  Instrumentos Analíticos
                </Link>
              </li>
              <li>
                <Link to="/productos/equipos-miscelaneos">
                  Equipos Misceláneos
                </Link>
              </li>
              <li>
                <Link to="/productos/material-consumibles">
                  Material y Consumibles
                </Link>
              </li>
              <li>
                <Link to="/productos/reactivos">Reactivos</Link>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h4 className="footer-title">Empresa</h4>
            <ul className="footer-links">
              <li>
                <Link to="/quienes-somos">Quienes Somos</Link>
              </li>
              <li>
                <Link to="/soporte">Soporte Técnico</Link>
              </li>
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