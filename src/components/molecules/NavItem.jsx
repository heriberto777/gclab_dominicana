import { Link } from 'react-router-dom';
import './NavItem.css';

const NavItem = ({ to, children, hasDropdown, dropdownItems }) => {
  return (
    <div className="nav-item">
      <Link to={to} className="nav-link">
        {children}
      </Link>
      {hasDropdown && dropdownItems && (
        <div className="nav-dropdown">
          {dropdownItems.map((item, index) => (
            <Link key={index} to={item.to} className="nav-dropdown-item">
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default NavItem;
