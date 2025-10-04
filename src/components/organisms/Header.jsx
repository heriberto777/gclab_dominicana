import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../lib/api';
import Logo from '../atoms/Logo';
import NavItem from '../molecules/NavItem';
import Icon from '../atoms/Icon';
import './Header.css';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    loadCategorias();
  }, []);

  const loadCategorias = async () => {
    try {
      const { data } = await apiClient.getCategorias(true);

      if (data) {
        setCategorias(data);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const mercadoItems = [
    { to: '/mercado/industria-farmaceutica', label: 'Industria Farmacéutica' },
    { to: '/mercado/alimentos', label: 'Alimentos' },
    { to: '/mercado/energia-minas-cemento', label: 'Energía, Minas y Cemento' },
    { to: '/mercado/industria-quimica', label: 'Industria Química' },
    { to: '/mercado/medio-ambiente', label: 'Medio Ambiente' },
    { to: '/mercado/life-sciences', label: 'Life Sciences' },
    { to: '/mercado/investigacion-desarrollo', label: 'Investigación y Desarrollo' },
  ];

  const productosItems = categorias.map(cat => ({
    to: `/productos/${cat.slug}`,
    label: cat.nombre
  }));

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/">
          <Logo />
        </Link>

        <nav className={`nav ${mobileMenuOpen ? 'nav-open' : ''}`}>
          <NavItem to="/">Inicio</NavItem>
          <NavItem to="/quienes-somos">Quienes Somos</NavItem>
          <NavItem to="/mercado/industria-farmaceutica" hasDropdown dropdownItems={mercadoItems}>
            Mercado
          </NavItem>
          <NavItem to="/productos" hasDropdown dropdownItems={productosItems}>
            Productos
          </NavItem>
          <NavItem to="/soporte">Soporte y Servicio Técnico</NavItem>
        </nav>

        <button
          className="mobile-menu-button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <Icon name={mobileMenuOpen ? 'close' : 'menu'} size={28} />
        </button>
      </div>
    </header>
  );
};

export default Header;
