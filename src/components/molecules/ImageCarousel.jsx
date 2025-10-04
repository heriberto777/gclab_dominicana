import { useState, useEffect } from 'react';
import './ImageCarousel.css';

const ImageCarousel = ({ images = [], interval = 5000, alt = 'Product image' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const validImages = images.filter(img => img && img.trim() !== '');

  useEffect(() => {
    if (validImages.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % validImages.length);
    }, interval);

    return () => clearInterval(timer);
  }, [validImages.length, interval]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? validImages.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % validImages.length);
  };

  if (validImages.length === 0) {
    return (
      <div className="image-carousel">
        <div className="carousel-placeholder">
          Sin imagen
        </div>
      </div>
    );
  }

  // if (validImages.length === 1) {
  //   return (
  //     <div className="image-carousel">
  //       <div className="carousel-slide active">
  //         <img src={validImages[0]} alt={alt} />
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="image-carousel">
      <div className="carousel-container">
        {validImages.map((image, index) => (
          <div
            key={index}
            className={`carousel-slide ${index === currentIndex ? 'active' : ''}`}
          >
            <img src={image} alt={`${alt} ${index + 1}`} />
          </div>
        ))}

        <button
          className="carousel-button carousel-button-prev"
          onClick={goToPrevious}
          aria-label="Previous image"
        >
          ‹
        </button>

        <button
          className="carousel-button carousel-button-next"
          onClick={goToNext}
          aria-label="Next image"
        >
          ›
        </button>
      </div>

      <div className="carousel-indicators">
        {validImages.map((_, index) => (
          <button
            key={index}
            className={`carousel-indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
