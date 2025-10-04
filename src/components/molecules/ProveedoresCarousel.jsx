import { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api';
import './ProveedoresCarousel.css';

const ProveedoresCarousel = () => {
  const [proveedores, setProveedores] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    loadProveedores();
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || proveedores.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.ceil(proveedores.length / getVisibleCount()));
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, proveedores.length]);

  const loadProveedores = async () => {
    try {
      const { data } = await apiClient.getProveedores(true);
      if (data) {
        setProveedores(data);
      }
    } catch (error) {
      console.error('Error loading proveedores:', error);
    }
  };

  const getVisibleCount = () => {
    if (window.innerWidth >= 1024) return 5;
    if (window.innerWidth >= 768) return 3;
    return 2;
  };

  const [visibleCount, setVisibleCount] = useState(getVisibleCount());

  useEffect(() => {
    const handleResize = () => {
      setVisibleCount(getVisibleCount());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.ceil(proveedores.length / visibleCount) - 1;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    setIsAutoPlaying(false);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    setIsAutoPlaying(false);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  if (proveedores.length === 0) {
    return null;
  }

  const startIndex = currentIndex * visibleCount;
  const visibleProveedores = proveedores.slice(startIndex, startIndex + visibleCount);

  return (
    <div className="proveedores-carousel">
      <h2 className="proveedores-carousel-title">Nuestros Proveedores</h2>

      <div className="carousel-container">
        <button
          className="carousel-button carousel-button-prev"
          onClick={handlePrev}
          aria-label="Anterior"
        >
          ‹
        </button>

        <div className="carousel-track">
          {visibleProveedores.map((proveedor) => (
            <div key={proveedor.id} className="carousel-slide">
              <div className="proveedor-card">
                {proveedor.logo_url ? (
                  <img
                    src={proveedor.logo_url}
                    alt={proveedor.nombre}
                    className="proveedor-logo"
                  />
                ) : (
                  <div className="proveedor-placeholder">
                    {proveedor.nombre}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          className="carousel-button carousel-button-next"
          onClick={handleNext}
          aria-label="Siguiente"
        >
          ›
        </button>
      </div>

      <div className="carousel-dots">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={index}
            className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Ir a grupo ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProveedoresCarousel;
