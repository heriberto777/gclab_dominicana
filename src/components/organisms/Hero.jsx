import Button from '../atoms/Button';
import './Hero.css';

const Hero = ({ title, subtitle, image, ctaText, ctaLink }) => {
  return (
    <section className="hero" style={{ backgroundImage: `url(${image})` }}>
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1 className="hero-title">{title}</h1>
        {subtitle && <p className="hero-subtitle">{subtitle}</p>}
        {ctaText && ctaLink && (
          <Button variant="primary" onClick={() => window.location.href = ctaLink}>
            {ctaText}
          </Button>
        )}
      </div>
    </section>
  );
};

export default Hero;
