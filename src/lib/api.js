const API_URL = import.meta.env.VITE_API_URL || 'http://10.0.10.98:3001/api';

class ApiClient {
  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  getToken() {
    return this.token;
  }

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  async signUp(email, password) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.token);
    return { user: data.user, error: null };
  }

  async signIn(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.token);
    return { user: data.user, error: null };
  }

  async signOut() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearToken();
    }
    return { error: null };
  }

  async getUser() {
    if (!this.token) {
      return { user: null, error: null };
    }

    try {
      const data = await this.request('/auth/me');
      return { user: data.user, error: null };
    } catch (error) {
      this.clearToken();
      return { user: null, error };
    }
  }

  async getProductos(filters = {}) {
    const params = new URLSearchParams();
    if (filters.categoria) params.append('categoria', filters.categoria);
    if (filters.destacado) params.append('destacado', 'true');
    if (filters.activo !== undefined) params.append('activo', filters.activo);

    const queryString = params.toString();
    const data = await this.request(`/productos${queryString ? `?${queryString}` : ''}`);
    return { data, error: null };
  }

  async getProducto(id) {
    const data = await this.request(`/productos/${id}`);
    return { data, error: null };
  }

  async createProducto(producto) {
    const data = await this.request('/productos', {
      method: 'POST',
      body: JSON.stringify(producto),
    });
    return { data, error: null };
  }

  async updateProducto(id, producto) {
    const data = await this.request(`/productos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(producto),
    });
    return { data, error: null };
  }

  async deleteProducto(id) {
    const data = await this.request(`/productos/${id}`, {
      method: 'DELETE',
    });
    return { data, error: null };
  }

  async getCategorias(activo = true) {
    const data = await this.request(`/categorias${activo !== false ? '?activo=true' : ''}`);
    return { data, error: null };
  }

  async getCategoria(id) {
    const data = await this.request(`/categorias/${id}`);
    return { data, error: null };
  }

  async getCategoriaBySlug(slug) {
    const data = await this.request(`/categorias/slug/${slug}`);
    return { data, error: null };
  }

  async createCategoria(categoria) {
    const data = await this.request('/categorias', {
      method: 'POST',
      body: JSON.stringify(categoria),
    });
    return { data, error: null };
  }

  async updateCategoria(id, categoria) {
    const data = await this.request(`/categorias/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoria),
    });
    return { data, error: null };
  }

  async deleteCategoria(id) {
    const data = await this.request(`/categorias/${id}`, {
      method: 'DELETE',
    });
    return { data, error: null };
  }

  async getProveedores(activo = true) {
    const data = await this.request(`/proveedores${activo !== false ? '?activo=true' : ''}`);
    return { data, error: null };
  }

  async getProveedor(id) {
    const data = await this.request(`/proveedores/${id}`);
    return { data, error: null };
  }

  async createProveedor(proveedor) {
    const data = await this.request('/proveedores', {
      method: 'POST',
      body: JSON.stringify(proveedor),
    });
    return { data, error: null };
  }

  async updateProveedor(id, proveedor) {
    const data = await this.request(`/proveedores/${id}`, {
      method: 'PUT',
      body: JSON.stringify(proveedor),
    });
    return { data, error: null };
  }

  async deleteProveedor(id) {
    const data = await this.request(`/proveedores/${id}`, {
      method: 'DELETE',
    });
    return { data, error: null };
  }

  async getSettings() {
    const data = await this.request('/settings');
    return { data, error: null };
  }

  async getSetting(key) {
    const data = await this.request(`/settings/${key}`);
    return { data, error: null };
  }

  async updateSetting(key, value) {
    const data = await this.request(`/settings/${key}`, {
      method: 'PUT',
      body: JSON.stringify({ value }),
    });
    return { data, error: null };
  }
}

export const apiClient = new ApiClient();
export default apiClient;
