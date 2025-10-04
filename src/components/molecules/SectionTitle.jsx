import './SectionTitle.css';

const SectionTitle = ({ title, subtitle, align = 'center' }) => {
  return (
    <div className={`section-title section-title-${align}`}>
      <h2 className="section-title-main">{title}</h2>
      {subtitle && <p className="section-title-subtitle">{subtitle}</p>}
    </div>
  );
};

export default SectionTitle;
