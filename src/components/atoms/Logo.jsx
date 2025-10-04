// src/components/atoms/Logo/Logo.jsx
import { useState } from "react";
import logoNavbarImg from "../../assets/gc-lab-logo-90.avif";
import logoFooterImg from "../../assets/gc-lab-logogris-vert-300.avif";
import "./Logo.css";

const Logo = ({
  size = "medium",
  variant = "default", // 'default' | 'white'
  type = "navbar", // 'navbar' | 'footer'
  className = "",
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeConfig = {
    small: { height: "35px", textSize: "18px", subtextSize: "10px" },
    medium: { height: "45px", textSize: "22px", subtextSize: "11px" },
    large: { height: "90px", textSize: "28px", subtextSize: "13px" },
  };

  const config = sizeConfig[size] || sizeConfig.medium;

  // Mapeo de imágenes
  const logoImages = {
    navbar: logoNavbarImg,
    footer: logoFooterImg,
  };

  const selectedLogo = logoImages[type];

  // Mostrar texto si no hay imagen o hubo error
  const showTextFallback = !selectedLogo || imageError;

  return (
    <div
      className={`logo-container logo-${variant} logo-type-${type} ${className}`}
    >
      <div className="logo-wrapper">
        {!showTextFallback ? (
          <img
            src={selectedLogo}
            alt={`GC Lab Dominicana ${type === "footer" ? "Footer" : ""}`}
            className={`logo-image logo-image-${type}`}
            style={{ height: config.height }}
            onError={() => {
              console.error(`Error cargando imagen del logo ${type}`);
              setImageError(true);
            }}
          />
        ) : (
          <div className={`logo-text-fallback logo-text-${type}`}>
            <div className="logo-text-group">
              <span
                className="logo-main-text"
                style={{ fontSize: config.textSize }}
              >
                GC LAB
              </span>
              <span
                className="logo-subtext"
                style={{ fontSize: config.subtextSize }}
              >
                DOMINICANA
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Logo;
