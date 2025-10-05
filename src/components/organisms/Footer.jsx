import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../atoms/Logo';
import { apiClient } from '../../lib/api';
import './Footer.css';

const Footer = () => {
  const [socialMedia, setSocialMedia] = useState([]);
  const [mercados, setMercados] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [socialRes, mercadosRes, categoriasRes] = await Promise.all([
        apiClient.getSocialMedia(true),
        apiClient.getMercados(true),
        apiClient.getCategorias(true)
      ]);

      if (socialRes.data) setSocialMedia(socialRes.data);
      if (mercadosRes.data) setMercados(mercadosRes.data.slice(0, 4)); // Primeros 4
      if (categoriasRes.data) setCategorias(categoriasRes.data.slice(0, 4)); // Primeros 4
    } catch (error) {
      console.error('Error loading footer data:', error);
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
                  <a
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
              {loading ? (
                <li>Cargando...</li>
              ) : mercados.length > 0 ? (
                mercados.map((mercado) => (
                  <li key={mercado.id}>
                    <Link to={`/mercado/${mercado.slug}`}>{mercado.nombre}</Link>
                  </li>
                ))
              ) : (
                <li>No hay mercados disponibles</li>
              )}
            </ul>
          </div>

          <div className="footer-column">
            <h4 className="footer-title">Productos</h4>
            <ul className="footer-links">
              {loading ? (
                <li>Cargando...</li>
              ) : categorias.length > 0 ? (
                categorias.map((categoria) => (
                  <li key={categoria.id}>
                    <Link to={`/productos/${categoria.slug}`}>{categoria.nombre}</Link>
                  </li>
                ))
              ) : (
                <li>No hay productos disponibles</li>
              )}
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