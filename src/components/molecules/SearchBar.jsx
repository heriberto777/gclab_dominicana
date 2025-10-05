import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../lib/api';
import './SearchBar.css';

const SearchBar = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState({
    productos: [],
    categorias: [],
    mercados: [],
    proveedores: []
  });
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchTerm.trim().length >= 2) {
      const timeoutId = setTimeout(() => {
        performSearch(searchTerm);
      }, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setResults({ productos: [], categorias: [], mercados: [], proveedores: [] });
      setShowResults(false);
    }
  }, [searchTerm]);

  const performSearch = async (query) => {
    setLoading(true);
    try {
      const [productosRes, categoriasRes, mercadosRes, proveedoresRes] = await Promise.all([
        apiClient.getProductos({ activo: true }),
        apiClient.getCategorias(true),
        apiClient.getMercados(true),
        apiClient.getProveedores(true)
      ]);

      const searchLower = query.toLowerCase();

      const filteredProductos = productosRes.data?.filter(p =>
        p.nombre.toLowerCase().includes(searchLower) ||
        p.descripcion?.toLowerCase().includes(searchLower)
      ).slice(0, 5) || [];

      const filteredCategorias = categoriasRes.data?.filter(c =>
        c.nombre.toLowerCase().includes(searchLower) ||
        c.descripcion?.toLowerCase().includes(searchLower)
      ).slice(0, 5) || [];

      const filteredMercados = mercadosRes.data?.filter(m =>
        m.nombre.toLowerCase().includes(searchLower) ||
        m.descripcion?.toLowerCase().includes(searchLower)
      ).slice(0, 5) || [];

      const filteredProveedores = proveedoresRes.data?.filter(p =>
        p.nombre.toLowerCase().includes(searchLower)
      ).slice(0, 5) || [];

      setResults({
        productos: filteredProductos,
        categorias: filteredCategorias,
        mercados: filteredMercados,
        proveedores: filteredProveedores
      });

      setShowResults(true);
    } catch (error) {
      console.error('Error en búsqueda:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = (type, slug) => {
    const routes = {
      productos: `/productos/${slug}`,
      categorias: `/productos/${slug}`,
      mercados: `/mercado/${slug}`,
      proveedores: `/productos`
    };

    navigate(routes[type] || '/');
    handleClose();
  };

  const handleClose = () => {
    setSearchTerm('');
    setResults({ productos: [], categorias: [], mercados: [], proveedores: [] });
    setShowResults(false);
    onClose();
  };

  const totalResults =
    results.productos.length +
    results.categorias.length +
    results.mercados.length +
    results.proveedores.length;

  return (
    <>
      <div className={`search-overlay ${isOpen ? 'active' : ''}`} onClick={handleClose} />

      <div className={`search-panel ${isOpen ? 'open' : ''}`}>
        <div className="search-panel-header">
          <h2>Buscar</h2>
          <button className="search-close-btn" onClick={handleClose} aria-label="Cerrar búsqueda">
            ×
          </button>
        </div>

        <div className="search-input-container">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            ref={searchInputRef}
            type="text"
            className="search-input"
            placeholder="Buscar productos, categorías, mercados..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {loading && <div className="search-loading">Buscando...</div>}
        </div>

        {showResults && (
          <div className="search-results">
            {totalResults === 0 ? (
              <div className="search-no-results">
                <p>No se encontraron resultados para "{searchTerm}"</p>
              </div>
            ) : (
              <>
                {results.productos.length > 0 && (
                  <div className="search-section">
                    <h3 className="search-section-title">Productos</h3>
                    <div className="search-items">
                      {results.productos.map((producto) => (
                        <div
                          key={producto.id}
                          className="search-item"
                          onClick={() => handleResultClick('productos', producto.categorias?.slug || 'productos')}
                        >
                          {producto.imagen_principal && (
                            <img
                              src={producto.imagen_principal}
                              alt={producto.nombre}
                              className="search-item-image"
                            />
                          )}
                          <div className="search-item-info">
                            <div className="search-item-name">{producto.nombre}</div>
                            {producto.categorias && (
                              <div className="search-item-meta">{producto.categorias.nombre}</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {results.categorias.length > 0 && (
                  <div className="search-section">
                    <h3 className="search-section-title">Categorías</h3>
                    <div className="search-items">
                      {results.categorias.map((categoria) => (
                        <div
                          key={categoria.id}
                          className="search-item"
                          onClick={() => handleResultClick('categorias', categoria.slug)}
                        >
                          {categoria.icono_url && (
                            <img
                              src={categoria.icono_url}
                              alt={categoria.nombre}
                              className="search-item-image"
                            />
                          )}
                          <div className="search-item-info">
                            <div className="search-item-name">{categoria.nombre}</div>
                            {categoria.descripcion && (
                              <div className="search-item-meta">
                                {categoria.descripcion.substring(0, 60)}...
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {results.mercados.length > 0 && (
                  <div className="search-section">
                    <h3 className="search-section-title">Mercados</h3>
                    <div className="search-items">
                      {results.mercados.map((mercado) => (
                        <div
                          key={mercado.id}
                          className="search-item"
                          onClick={() => handleResultClick('mercados', mercado.slug)}
                        >
                          <div className="search-item-info">
                            <div className="search-item-name">{mercado.nombre}</div>
                            {mercado.descripcion && (
                              <div className="search-item-meta">
                                {mercado.descripcion.substring(0, 60)}...
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {results.proveedores.length > 0 && (
                  <div className="search-section">
                    <h3 className="search-section-title">Proveedores</h3>
                    <div className="search-items">
                      {results.proveedores.map((proveedor) => (
                        <div
                          key={proveedor.id}
                          className="search-item"
                          onClick={() => handleResultClick('proveedores', proveedor.slug)}
                        >
                          {proveedor.logo_url && (
                            <img
                              src={proveedor.logo_url}
                              alt={proveedor.nombre}
                              className="search-item-image"
                            />
                          )}
                          <div className="search-item-info">
                            <div className="search-item-name">{proveedor.nombre}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default SearchBar;