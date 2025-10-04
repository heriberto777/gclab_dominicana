import './PageSection.css';

const PageSection = ({ children, background = 'white', padding = 'normal' }) => {
  return (
    <section className={`page-section page-section-${background} page-section-padding-${padding}`}>
      <div className="page-section-container">
        {children}
      </div>
    </section>
  );
};

export default PageSection;
