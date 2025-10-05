import { useState, useEffect } from "react";
import "./Carousel.css";

const Carousel = ({
  items = [],
  title = "",
  autoPlay = true,
  interval = 3000,
  visibleItems = { desktop: 5, tablet: 3, mobile: 2 },
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);
  const [visibleCount, setVisibleCount] = useState(visibleItems.desktop);

  const getVisibleCount = () => {
    if (window.innerWidth >= 1024) return visibleItems.desktop;
    if (window.innerWidth >= 768) return visibleItems.tablet;
    return visibleItems.mobile;
  };

  useEffect(() => {
    const handleResize = () => {
      setVisibleCount(getVisibleCount());
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || items.length === 0) return;

    const autoPlayInterval = setInterval(() => {
      setCurrentIndex(
        (prev) => (prev + 1) % Math.ceil(items.length / visibleCount)
      );
    }, interval);

    return () => clearInterval(autoPlayInterval);
  }, [isAutoPlaying, items.length, visibleCount, interval]);

  const maxIndex = Math.max(0, Math.ceil(items.length / visibleCount) - 1);

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

  if (items.length === 0) {
    return null;
  }

  const startIndex = currentIndex * visibleCount;
  const visibleSlides = items.slice(startIndex, startIndex + visibleCount);

  return (
    <div className="carousel">
      {title && <h2 className="carousel-title">{title}</h2>}

      <div className="carousel-wrapper">
        {items.length > visibleCount && (
          <button
            className="carousel-nav carousel-nav-prev"
            onClick={handlePrev}
            aria-label="Anterior"
          >
            ‹
          </button>
        )}

        <div className="carousel-slides">
          {visibleSlides.map((item, index) => (
            <div key={item.id || index} className="carousel-item">
              <div className="carousel-card">
                {item.imageUrl && item.imageUrl.trim() !== "" ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name || `Slide ${index + 1}`}
                    className="carousel-image"
                    onError={(e) => {
                      e.target.style.display = "none";
                      const placeholder = document.createElement("div");
                      placeholder.className = "carousel-placeholder";
                      placeholder.textContent = item.name || "N/A";
                      e.target.parentElement.appendChild(placeholder);
                    }}
                  />
                ) : (
                  <div className="carousel-placeholder">
                    {item.name || "N/A"}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {items.length > visibleCount && (
          <button
            className="carousel-nav carousel-nav-next"
            onClick={handleNext}
            aria-label="Siguiente"
          >
            ›
          </button>
        )}
      </div>

      {maxIndex > 0 && (
        <div className="carousel-indicators">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              className={`carousel-indicator ${
                index === currentIndex ? "active" : ""
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Ir a grupo ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;
