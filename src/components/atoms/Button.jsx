import './Button.css';

const Button = ({ children, variant = 'primary', onClick, className = '', type = 'submit', disabled = false }) => {
  return (
    <button
      type={type}
      className={`btn btn-${variant} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
