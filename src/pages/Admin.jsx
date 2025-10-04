import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import Button from '../components/atoms/Button';
import './Admin.css';

const Admin = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('productos');
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [savingWebhook, setSavingWebhook] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/admin/login');
      return;
    }
    loadData();
  }, [user, navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [productosRes, categoriasRes, proveedoresRes, settingsRes] = await Promise.all([
        supabase.from('productos').select('*, categorias(nombre)').order('created_at', { ascending: false }),
        supabase.from('categorias').select('*').order('orden'),
        supabase.from('proveedores').select('*').order('nombre'),
        supabase.from('settings').select('*'),
      ]);

      if (productosRes.data) setProductos(productosRes.data);
      if (categoriasRes.data) setCategorias(categoriasRes.data);
      if (proveedoresRes.data) setProveedores(proveedoresRes.data);

      if (settingsRes.data) {
        const settingsMap = {};
        settingsRes.data.forEach(setting => {
          settingsMap[setting.key] = setting;
        });
        setSettings(settingsMap);
        setWebhookUrl(settingsMap['n8n_webhook_url']?.value || '');
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const handleToggleActivo = async (table, id, currentValue) => {
    const { error } = await supabase
      .from(table)
      .update({ activo: !currentValue })
      .eq('id', id);

    if (!error) {
      loadData();
    }
  };

  const handleDelete = async (table, id) => {
    if (!confirm('¿Está seguro de eliminar este elemento?')) return;

    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);

    if (!error) {
      loadData();
    }
  };

  const handleSaveWebhook = async () => {
    setSavingWebhook(true);
    try {
      const { error } = await supabase
        .from('settings')
        .update({ value: webhookUrl })
        .eq('key', 'n8n_webhook_url');

      if (error) {
        console.error('Error saving webhook:', error);
        alert('Error al guardar la configuración');
      } else {
        alert('Configuración guardada exitosamente');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar la configuración');
    } finally {
      setSavingWebhook(false);
    }
  };

  if (loading) {
    return <div className="admin-loading">Cargando...</div>;
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <div className="admin-header-content">
          <h1>Panel de Administración</h1>
          <div className="admin-header-actions">
            <span className="admin-user">{user?.email}</span>
            <Button onClick={handleSignOut} variant="secondary">
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>

      <div className="admin-container">
        <div className="admin-tabs">
          <button
            className={`admin-tab ${activeTab === 'productos' ? 'active' : ''}`}
            onClick={() => setActiveTab('productos')}
          >
            Productos ({productos.length})
          </button>
          <button
            className={`admin-tab ${activeTab === 'categorias' ? 'active' : ''}`}
            onClick={() => setActiveTab('categorias')}
          >
            Categorías ({categorias.length})
          </button>
          <button
            className={`admin-tab ${activeTab === 'proveedores' ? 'active' : ''}`}
            onClick={() => setActiveTab('proveedores')}
          >
            Proveedores ({proveedores.length})
          </button>
          <button
            className={`admin-tab ${activeTab === 'configuracion' ? 'active' : ''}`}
            onClick={() => setActiveTab('configuracion')}
          >
            Configuración
          </button>
        </div>

        <div className="admin-content">
          {activeTab === 'productos' && (
            <div className="admin-section">
              <div className="section-header">
                <h2>Gestión de Productos</h2>
                <Button onClick={() => navigate('/admin/productos/nuevo')}>
                  Nuevo Producto
                </Button>
              </div>

              <div className="data-table">
                <table>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Categoría</th>
                      <th>Estado</th>
                      <th>Destacado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productos.map((producto) => (
                      <tr key={producto.id}>
                        <td>{producto.nombre}</td>
                        <td>{producto.categorias?.nombre || 'Sin categoría'}</td>
                        <td>
                          <span className={`status-badge ${producto.activo ? 'active' : 'inactive'}`}>
                            {producto.activo ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge ${producto.destacado ? 'featured' : ''}`}>
                            {producto.destacado ? 'Sí' : 'No'}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn-sm btn-edit"
                              onClick={() => navigate(`/admin/productos/${producto.id}`)}
                            >
                              Editar
                            </button>
                            <button
                              className="btn-sm btn-toggle"
                              onClick={() => handleToggleActivo('productos', producto.id, producto.activo)}
                            >
                              {producto.activo ? 'Desactivar' : 'Activar'}
                            </button>
                            <button
                              className="btn-sm btn-delete"
                              onClick={() => handleDelete('productos', producto.id)}
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'categorias' && (
            <div className="admin-section">
              <div className="section-header">
                <h2>Gestión de Categorías</h2>
                <Button onClick={() => navigate('/admin/categorias/nueva')}>
                  Nueva Categoría
                </Button>
              </div>

              <div className="data-table">
                <table>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Slug</th>
                      <th>Orden</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categorias.map((categoria) => (
                      <tr key={categoria.id}>
                        <td>{categoria.nombre}</td>
                        <td><code>{categoria.slug}</code></td>
                        <td>{categoria.orden}</td>
                        <td>
                          <span className={`status-badge ${categoria.activo ? 'active' : 'inactive'}`}>
                            {categoria.activo ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn-sm btn-edit"
                              onClick={() => navigate(`/admin/categorias/${categoria.id}`)}
                            >
                              Editar
                            </button>
                            <button
                              className="btn-sm btn-toggle"
                              onClick={() => handleToggleActivo('categorias', categoria.id, categoria.activo)}
                            >
                              {categoria.activo ? 'Desactivar' : 'Activar'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'proveedores' && (
            <div className="admin-section">
              <div className="section-header">
                <h2>Gestión de Proveedores</h2>
                <Button onClick={() => navigate('/admin/proveedores/nuevo')}>
                  Nuevo Proveedor
                </Button>
              </div>

              <div className="data-table">
                <table>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Sitio Web</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {proveedores.map((proveedor) => (
                      <tr key={proveedor.id}>
                        <td>{proveedor.nombre}</td>
                        <td>
                          {proveedor.sitio_web && (
                            <a href={proveedor.sitio_web} target="_blank" rel="noopener noreferrer">
                              {proveedor.sitio_web}
                            </a>
                          )}
                        </td>
                        <td>
                          <span className={`status-badge ${proveedor.activo ? 'active' : 'inactive'}`}>
                            {proveedor.activo ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn-sm btn-edit"
                              onClick={() => navigate(`/admin/proveedores/${proveedor.id}`)}
                            >
                              Editar
                            </button>
                            <button
                              className="btn-sm btn-toggle"
                              onClick={() => handleToggleActivo('proveedores', proveedor.id, proveedor.activo)}
                            >
                              {proveedor.activo ? 'Desactivar' : 'Activar'}
                            </button>
                            <button
                              className="btn-sm btn-delete"
                              onClick={() => handleDelete('proveedores', proveedor.id)}
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'configuracion' && (
            <div className="admin-section">
              <div className="section-header">
                <h2>Configuración del Sistema</h2>
              </div>

              <div className="settings-form">
                <div className="form-group">
                  <label htmlFor="webhook-url" className="form-label">
                    URL del Webhook de n8n
                  </label>
                  <p className="form-help-text">
                    Esta URL se utilizará para conectar el chatbot con n8n. Asegúrate de que el webhook esté activo en tu instancia de n8n.
                  </p>
                  <input
                    id="webhook-url"
                    type="url"
                    className="form-input"
                    placeholder="https://tu-instancia.n8n.cloud/webhook/tu-webhook-id"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                  />
                </div>

                <div className="form-actions">
                  <Button
                    onClick={handleSaveWebhook}
                    disabled={savingWebhook}
                  >
                    {savingWebhook ? 'Guardando...' : 'Guardar Configuración'}
                  </Button>
                </div>

                <div className="settings-info">
                  <h3>Cómo configurar el webhook en n8n:</h3>
                  <ol>
                    <li>Crea un nuevo workflow en n8n</li>
                    <li>Agrega un nodo "Webhook" al inicio</li>
                    <li>Configura el webhook con método POST</li>
                    <li>Copia la URL del webhook y pégala arriba</li>
                    <li>Agrega los nodos necesarios para procesar el mensaje</li>
                    <li>Asegúrate de que la respuesta tenga el formato: <code>{`{ "response": "texto de respuesta" }`}</code></li>
                  </ol>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
