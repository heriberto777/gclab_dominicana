import './Card.css';

const Card = ({ image, title, description, link }) => {
  return (
    <div className="card">
      {image && (
        <div className="card-image">
          <img src={image} alt={title} />
        </div>
      )}
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        {description && <p className="card-description">{description}</p>}
        {link && (
          <a href={link} className="card-link">
            Ver más
          </a>
        )}
      </div>
    </div>
  );
};

export default Card;
