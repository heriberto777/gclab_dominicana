import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../lib/api';
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
  const [contactWebhookUrl, setContactWebhookUrl] = useState('');
  const [chatbotEnabled, setChatbotEnabled] = useState(true);
  const [savingWebhook, setSavingWebhook] = useState(false);
  const [socialMedia, setSocialMedia] = useState([]);
  const [industrias, setIndustrias] = useState([]);
  const [heroes, setHeroes] = useState([]);
  const [mercados, setMercados] = useState([]);
  const [serviciosTecnicos, setServiciosTecnicos] = useState([]);

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
        apiClient.getProductos({ activo: false }),
        apiClient.getCategorias(false),
        apiClient.getProveedores(false),
        apiClient.getSettings(),
      ]);

      const socialMediaRes = await apiClient.getSocialMedia(false);
      const industriasRes = await apiClient.getIndustrias(false);
      const heroesRes = await apiClient.getHeroes(false);
      const mercadosRes = await apiClient.getMercados(false);
      const serviciosTecnicosRes = await apiClient.getServiciosTecnicos(false);

      if (serviciosTecnicosRes.data)
        setServiciosTecnicos(serviciosTecnicosRes.data);
      if (mercadosRes.data) setMercados(mercadosRes.data);
      if (heroesRes.data) setHeroes(heroesRes.data);
      if (industriasRes.data) setIndustrias(industriasRes.data);
      if (socialMediaRes.data) setSocialMedia(socialMediaRes.data);
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
        setContactWebhookUrl(settingsMap['contact_webhook_url']?.value || '');
        setChatbotEnabled(settingsMap['chatbot_enabled']?.value === 'true');
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
    try {
      const updateMethods = {
        productos: apiClient.updateProducto,
        categorias: apiClient.updateCategoria,
        proveedores: apiClient.updateProveedor,
        social_media: apiClient.updateSocialMedia,
        industrias: apiClient.updateIndustria,
        heroes: apiClient.updateHero,
        mercados: apiClient.updateMercado,
        "servicios-tecnicos": apiClient.updateServicioTecnico,
      };

      const updateMethod = updateMethods[table];
      if (updateMethod) {
        await updateMethod.call(apiClient, id, { activo: !currentValue });
        loadData();
      }
    } catch (error) {
      console.error('Error toggling activo:', error);
      alert('Error al actualizar el estado');
    }
  };

  const handleDelete = async (table, id) => {
    if (!confirm('¿Está seguro de eliminar este elemento?')) return;

    try {
      const deleteMethods = {
        productos: apiClient.deleteProducto,
        categorias: apiClient.deleteCategoria,
        proveedores: apiClient.deleteProveedor,
        social_media: apiClient.deleteSocialMedia,
        industrias: apiClient.deleteIndustria,
        heroes: apiClient.deleteHero,
        mercados: apiClient.deleteMercado,
        "servicios-tecnicos": apiClient.deleteServicioTecnico,
      };

      const deleteMethod = deleteMethods[table];
      if (deleteMethod) {
        await deleteMethod.call(apiClient, id);
        loadData();
      }
    } catch (error) {
      console.error('Error deleting:', error);
      alert(error.message || 'Error al eliminar el elemento');
    }
  };

  const handleSaveWebhook = async () => {
    setSavingWebhook(true);
    try {
      await Promise.all([
        apiClient.updateSetting('n8n_webhook_url', webhookUrl),
        apiClient.updateSetting('contact_webhook_url', contactWebhookUrl),
        apiClient.updateSetting('chatbot_enabled', chatbotEnabled ? 'true' : 'false')
      ]);
      alert('Configuración guardada exitosamente');
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
            className={`admin-tab ${activeTab === "productos" ? "active" : ""}`}
            onClick={() => setActiveTab("productos")}
          >
            Productos ({productos.length})
          </button>
          <button
            className={`admin-tab ${
              activeTab === "categorias" ? "active" : ""
            }`}
            onClick={() => setActiveTab("categorias")}
          >
            Categorías ({categorias.length})
          </button>
          <button
            className={`admin-tab ${
              activeTab === "proveedores" ? "active" : ""
            }`}
            onClick={() => setActiveTab("proveedores")}
          >
            Proveedores ({proveedores.length})
          </button>
          <button
            className={`admin-tab ${
              activeTab === "configuracion" ? "active" : ""
            }`}
            onClick={() => setActiveTab("configuracion")}
          >
            Configuración
          </button>
          <button
            className={`admin-tab ${activeTab === "redes" ? "active" : ""}`}
            onClick={() => setActiveTab("redes")}
          >
            Redes Sociales ({socialMedia.length})
          </button>
          <button
            className={`admin-tab ${
              activeTab === "industrias" ? "active" : ""
            }`}
            onClick={() => setActiveTab("industrias")}
          >
            Industrias ({industrias.length})
          </button>
          <button
            className={`admin-tab ${activeTab === "heroes" ? "active" : ""}`}
            onClick={() => setActiveTab("heroes")}
          >
            Heroes ({heroes.length})
          </button>
          <button
            className={`admin-tab ${activeTab === "mercados" ? "active" : ""}`}
            onClick={() => setActiveTab("mercados")}
          >
            Mercados ({mercados.length})
          </button>
          <button
            className={`admin-tab ${
              activeTab === "servicios-tecnicos" ? "active" : ""
            }`}
            onClick={() => setActiveTab("servicios-tecnicos")}
          >
            Servicios Técnicos ({serviciosTecnicos.length})
          </button>
        </div>

        <div className="admin-content">
          {activeTab === "productos" && (
            <div className="admin-section">
              <div className="section-header">
                <h2>Gestión de Productos</h2>
                <Button onClick={() => navigate("/admin/productos/nuevo")}>
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
                        <td>
                          {producto.categorias?.nombre || "Sin categoría"}
                        </td>
                        <td>
                          <span
                            className={`status-badge ${
                              producto.activo ? "active" : "inactive"
                            }`}
                          >
                            {producto.activo ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`status-badge ${
                              producto.destacado ? "featured" : ""
                            }`}
                          >
                            {producto.destacado ? "Sí" : "No"}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn-sm btn-edit"
                              onClick={() =>
                                navigate(`/admin/productos/${producto.id}`)
                              }
                            >
                              Editar
                            </button>
                            <button
                              className="btn-sm btn-toggle"
                              onClick={() =>
                                handleToggleActivo(
                                  "productos",
                                  producto.id,
                                  producto.activo
                                )
                              }
                            >
                              {producto.activo ? "Desactivar" : "Activar"}
                            </button>
                            <button
                              className="btn-sm btn-delete"
                              onClick={() =>
                                handleDelete("productos", producto.id)
                              }
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

          {activeTab === "categorias" && (
            <div className="admin-section">
              <div className="section-header">
                <h2>Gestión de Categorías</h2>
                <Button onClick={() => navigate("/admin/categorias/nueva")}>
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
                        <td>
                          <code>{categoria.slug}</code>
                        </td>
                        <td>{categoria.orden}</td>
                        <td>
                          <span
                            className={`status-badge ${
                              categoria.activo ? "active" : "inactive"
                            }`}
                          >
                            {categoria.activo ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn-sm btn-edit"
                              onClick={() =>
                                navigate(`/admin/categorias/${categoria.id}`)
                              }
                            >
                              Editar
                            </button>
                            <button
                              className="btn-sm btn-toggle"
                              onClick={() =>
                                handleToggleActivo(
                                  "categorias",
                                  categoria.id,
                                  categoria.activo
                                )
                              }
                            >
                              {categoria.activo ? "Desactivar" : "Activar"}
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

          {activeTab === "proveedores" && (
            <div className="admin-section">
              <div className="section-header">
                <h2>Gestión de Proveedores</h2>
                <Button onClick={() => navigate("/admin/proveedores/nuevo")}>
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
                            <a
                              href={proveedor.sitio_web}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {proveedor.sitio_web}
                            </a>
                          )}
                        </td>
                        <td>
                          <span
                            className={`status-badge ${
                              proveedor.activo ? "active" : "inactive"
                            }`}
                          >
                            {proveedor.activo ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn-sm btn-edit"
                              onClick={() =>
                                navigate(`/admin/proveedores/${proveedor.id}`)
                              }
                            >
                              Editar
                            </button>
                            <button
                              className="btn-sm btn-toggle"
                              onClick={() =>
                                handleToggleActivo(
                                  "proveedores",
                                  proveedor.id,
                                  proveedor.activo
                                )
                              }
                            >
                              {proveedor.activo ? "Desactivar" : "Activar"}
                            </button>
                            <button
                              className="btn-sm btn-delete"
                              onClick={() =>
                                handleDelete("proveedores", proveedor.id)
                              }
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

          {activeTab === "configuracion" && (
            <div className="admin-section">
              <div className="section-header">
                <h2>Configuración del Sistema</h2>
              </div>

              <div className="settings-form">
                <div className="form-group">
                  <label htmlFor="webhook-url" className="form-label">
                    URL del Webhook de n8n para Chatbot
                  </label>
                  <p className="form-help-text">
                    Esta URL se utilizará para conectar el chatbot con n8n.
                    Asegúrate de que el webhook esté activo en tu instancia de
                    n8n.
                  </p>
                  <input
                    id="webhook-url"
                    type="url"
                    className="form-input"
                    placeholder="https://tu-instancia.n8n.cloud/webhook/chatbot"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact-webhook-url" className="form-label">
                    URL del Webhook de n8n para Formulario de Contacto
                  </label>
                  <p className="form-help-text">
                    Esta URL se utilizará para enviar los datos del formulario
                    de contacto a n8n y redirigirlos al departamento
                    correspondiente.
                  </p>
                  <input
                    id="contact-webhook-url"
                    type="url"
                    className="form-input"
                    placeholder="https://tu-instancia.n8n.cloud/webhook/contacto"
                    value={contactWebhookUrl}
                    onChange={(e) => setContactWebhookUrl(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={chatbotEnabled}
                      onChange={(e) => setChatbotEnabled(e.target.checked)}
                    />
                    <span>Activar Chatbot en el Sitio</span>
                  </label>
                  <p className="form-help-text">
                    Cuando está activado, el chatbot aparecerá en la esquina
                    inferior derecha del sitio web. Asegúrate de configurar la
                    URL del webhook antes de activarlo.
                  </p>
                </div>

                <div className="form-actions">
                  <Button onClick={handleSaveWebhook} disabled={savingWebhook}>
                    {savingWebhook ? "Guardando..." : "Guardar Configuración"}
                  </Button>
                </div>

                <div className="settings-info">
                  <h3>Cómo configurar los webhooks en n8n:</h3>

                  <h4>Webhook del Chatbot:</h4>
                  <ol>
                    <li>Crea un nuevo workflow en n8n</li>
                    <li>Agrega un nodo "Webhook" al inicio</li>
                    <li>Configura el webhook con método POST</li>
                    <li>Copia la URL del webhook y pégala arriba</li>
                    <li>
                      Agrega los nodos necesarios para procesar el mensaje
                    </li>
                    <li>
                      Asegúrate de que la respuesta tenga el formato:{" "}
                      <code>{`{ "response": "texto de respuesta" }`}</code>
                    </li>
                  </ol>

                  <h4>Webhook del Formulario de Contacto:</h4>
                  <ol>
                    <li>Crea otro workflow en n8n</li>
                    <li>Agrega un nodo "Webhook" al inicio</li>
                    <li>
                      El webhook recibirá: nombre, email, departamento, mensaje
                    </li>
                    <li>
                      Usa un nodo "Switch" para enrutar según el departamento
                    </li>
                    <li>
                      Conecta cada rama a diferentes nodos de email o
                      notificación
                    </li>
                    <li>
                      La respuesta debe ser:{" "}
                      <code>{`{ "success": true, "message": "Mensaje enviado" }`}</code>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {activeTab === "redes" && (
            <div className="admin-section">
              <div className="section-header">
                <h2>Gestión de Redes Sociales</h2>
                <Button onClick={() => navigate("/admin/redes-sociales/nueva")}>
                  Nueva Red Social
                </Button>
              </div>

              <div className="data-table">
                <table>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>URL</th>
                      <th>Orden</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {socialMedia.map((social) => (
                      <tr key={social.id}>
                        <td>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                            }}
                          >
                            {social.logo_url && (
                              <img
                                src={social.logo_url}
                                alt={social.nombre}
                                style={{
                                  width: "24px",
                                  height: "24px",
                                  objectFit: "contain",
                                }}
                              />
                            )}
                            {social.nombre}
                          </div>
                        </td>
                        <td>
                          <a
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {social.url}
                          </a>
                        </td>
                        <td>{social.orden}</td>
                        <td>
                          <span
                            className={`status-badge ${
                              social.activo ? "active" : "inactive"
                            }`}
                          >
                            {social.activo ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn-sm btn-edit"
                              onClick={() =>
                                navigate(`/admin/redes-sociales/${social.id}`)
                              }
                            >
                              Editar
                            </button>
                            <button
                              className="btn-sm btn-toggle"
                              onClick={() =>
                                handleToggleActivo(
                                  "social_media",
                                  social.id,
                                  social.activo
                                )
                              }
                            >
                              {social.activo ? "Desactivar" : "Activar"}
                            </button>
                            <button
                              className="btn-sm btn-delete"
                              onClick={() =>
                                handleDelete("social_media", social.id)
                              }
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

          {activeTab === "industrias" && (
            <div className="admin-section">
              <div className="section-header">
                <h2>Gestión de Industrias</h2>
                <Button onClick={() => navigate("/admin/industrias/nueva")}>
                  Nueva Industria
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
                    {industrias.map((industria) => (
                      <tr key={industria.id}>
                        <td>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                            }}
                          >
                            {industria.icono_url && (
                              <img
                                src={industria.icono_url}
                                alt={industria.nombre}
                                style={{
                                  width: "32px",
                                  height: "32px",
                                  objectFit: "contain",
                                }}
                              />
                            )}
                            {industria.nombre}
                          </div>
                        </td>
                        <td>
                          <code>/mercado/{industria.slug}</code>
                        </td>
                        <td>{industria.orden}</td>
                        <td>
                          <span
                            className={`status-badge ${
                              industria.activo ? "active" : "inactive"
                            }`}
                          >
                            {industria.activo ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn-sm btn-edit"
                              onClick={() =>
                                navigate(`/admin/industrias/${industria.id}`)
                              }
                            >
                              Editar
                            </button>
                            <button
                              className="btn-sm btn-toggle"
                              onClick={() =>
                                handleToggleActivo(
                                  "industrias",
                                  industria.id,
                                  industria.activo
                                )
                              }
                            >
                              {industria.activo ? "Desactivar" : "Activar"}
                            </button>
                            <button
                              className="btn-sm btn-delete"
                              onClick={() =>
                                handleDelete("industrias", industria.id)
                              }
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

          {activeTab === "heroes" && (
            <div className="admin-section">
              <div className="section-header">
                <h2>Gestión de Heroes</h2>
                <Button onClick={() => navigate("/admin/heroes/nuevo")}>
                  Nuevo Hero
                </Button>
              </div>

              <div className="data-table">
                <table>
                  <thead>
                    <tr>
                      <th>Sección</th>
                      <th>Título</th>
                      <th>Subtítulo</th>
                      <th>CTA</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {heroes.map((hero) => (
                      <tr key={hero.id}>
                        <td>
                          <code>{hero.seccion}</code>
                        </td>
                        <td>{hero.titulo || "-"}</td>
                        <td>
                          {hero.subtitulo
                            ? hero.subtitulo.length > 50
                              ? hero.subtitulo.substring(0, 50) + "..."
                              : hero.subtitulo
                            : "-"}
                        </td>
                        <td>{hero.cta_texto || "-"}</td>
                        <td>
                          <span
                            className={`status-badge ${
                              hero.activo ? "active" : "inactive"
                            }`}
                          >
                            {hero.activo ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn-sm btn-edit"
                              onClick={() =>
                                navigate(`/admin/heroes/${hero.id}`)
                              }
                            >
                              Editar
                            </button>
                            <button
                              className="btn-sm btn-toggle"
                              onClick={() =>
                                handleToggleActivo(
                                  "heroes",
                                  hero.id,
                                  hero.activo
                                )
                              }
                            >
                              {hero.activo ? "Desactivar" : "Activar"}
                            </button>
                            <button
                              className="btn-sm btn-delete"
                              onClick={() => handleDelete("heroes", hero.id)}
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

          {activeTab === "mercados" && (
            <div className="admin-section">
              <div className="section-header">
                <h2>Gestión de Mercados</h2>
                <Button onClick={() => navigate("/admin/mercados/nuevo")}>
                  Nuevo Mercado
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
                    {mercados.map((mercado) => (
                      <tr key={mercado.id}>
                        <td>{mercado.nombre}</td>
                        <td>
                          <code>/mercado/{mercado.slug}</code>
                        </td>
                        <td>{mercado.orden}</td>
                        <td>
                          <span
                            className={`status-badge ${
                              mercado.activo ? "active" : "inactive"
                            }`}
                          >
                            {mercado.activo ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn-sm btn-edit"
                              onClick={() =>
                                navigate(`/admin/mercados/${mercado.id}`)
                              }
                            >
                              Editar
                            </button>
                            <button
                              className="btn-sm btn-toggle"
                              onClick={() =>
                                handleToggleActivo(
                                  "mercados",
                                  mercado.id,
                                  mercado.activo
                                )
                              }
                            >
                              {mercado.activo ? "Desactivar" : "Activar"}
                            </button>
                            <button
                              className="btn-sm btn-delete"
                              onClick={() =>
                                handleDelete("mercados", mercado.id)
                              }
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
          {activeTab === "servicios-tecnicos" && (
            <div className="admin-section">
              <div className="section-header">
                <h2>Gestión de Servicios Técnicos</h2>
                <Button
                  onClick={() => navigate("/admin/servicios-tecnicos/nuevo")}
                >
                  Nuevo Servicio
                </Button>
              </div>

              <div className="data-table">
                <table>
                  <thead>
                    <tr>
                      <th>Título</th>
                      <th>Slug</th>
                      <th>Orden</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {serviciosTecnicos.map((servicio) => (
                      <tr key={servicio.id}>
                        <td>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                            }}
                          >
                            {servicio.imagen_url && (
                              <img
                                src={servicio.imagen_url}
                                alt={servicio.titulo}
                                style={{
                                  width: "60px",
                                  height: "40px",
                                  objectFit: "cover",
                                  borderRadius: "4px",
                                }}
                              />
                            )}
                            {servicio.titulo}
                          </div>
                        </td>
                        <td>
                          <code>{servicio.slug}</code>
                        </td>
                        <td>{servicio.orden}</td>
                        <td>
                          <span
                            className={`status-badge ${
                              servicio.activo ? "active" : "inactive"
                            }`}
                          >
                            {servicio.activo ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn-sm btn-edit"
                              onClick={() =>
                                navigate(
                                  `/admin/servicios-tecnicos/${servicio.id}`
                                )
                              }
                            >
                              Editar
                            </button>
                            <button
                              className="btn-sm btn-toggle"
                              onClick={() =>
                                handleToggleActivo(
                                  "servicios-tecnicos",
                                  servicio.id,
                                  servicio.activo
                                )
                              }
                            >
                              {servicio.activo ? "Desactivar" : "Activar"}
                            </button>
                            <button
                              className="btn-sm btn-delete"
                              onClick={() =>
                                handleDelete("servicios-tecnicos", servicio.id)
                              }
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
        </div>
      </div>
    </div>
  );
};

export default Admin;
