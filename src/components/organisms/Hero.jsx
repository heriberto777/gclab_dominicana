import { useState, useEffect } from "react";
import { apiClient } from "../../lib/api";
import Button from "../atoms/Button";
import "./Hero.css";

const Hero = ({ seccion = "home", fallbackData = {} }) => {
  const [heroData, setHeroData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHeroData();
  }, [seccion]);

  const loadHeroData = async () => {
    try {
      const { data } = await apiClient.getHeroBySeccion(seccion);
      if (data) {
        setHeroData(data);
      } else {
        setHeroData(fallbackData);
      }
    } catch (error) {
      console.error("Error loading hero:", error);
      setHeroData(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="hero hero-loading">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <p>Cargando...</p>
        </div>
      </section>
    );
  }

  const {
    titulo = "",
    subtitulo = "",
    imagen_url = "",
    cta_texto = "",
    cta_link = "",
  } = heroData || fallbackData;

  return (
    <section className="hero" style={{ backgroundImage: `url(${imagen_url})` }}>
      <div className="hero-overlay"></div>
      <div className="hero-content">
        {titulo && <h1 className="hero-title">{titulo}</h1>}
        {subtitulo && <p className="hero-subtitle">{subtitulo}</p>}
        {cta_texto && cta_link && (
          <Button
            variant="primary"
            onClick={() => (window.location.href = cta_link)}
          >
            {cta_texto}
          </Button>
        )}
      </div>
    </section>
  );
};

export default Hero;
