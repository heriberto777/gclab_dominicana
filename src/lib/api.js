const API_URL = import.meta.env.VITE_API_URL || 'http://10.0.10.98:3001/api';

class ApiClient {
  constructor() {
    this.token = localStorage.getItem("auth_token");
    this.refreshToken = localStorage.getItem("refresh_token");
  }

  setToken(accessToken, refreshToken) {
    this.token = accessToken;
    this.refreshToken = refreshToken;
    localStorage.setItem("auth_token", accessToken);
    if (refreshToken) {
      localStorage.setItem("refresh_token", refreshToken);
    }
  }

  clearTokens() {
    this.token = null;
    this.refreshToken = null;
    localStorage.removeItem("auth_token");
    localStorage.removeItem("refresh_token");
  }

  clearToken() {
    this.clearTokens();
  }

  getToken() {
    return this.token;
  }

  getRefreshToken() {
    return this.refreshToken;
  }

  async refreshAccessToken() {
    if (!this.refreshToken) {
      return false;
    }

    try {
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });

      if (!response.ok) {
        this.clearTokens();
        return false;
      }

      const data = await response.json();
      this.token = data.accessToken;
      localStorage.setItem("auth_token", data.accessToken);
      return true;
    } catch (error) {
      console.error("Token refresh error:", error);
      this.clearTokens();
      return false;
    }
  }

  async request(endpoint, options = {}) {
    const headers = {
      "Content-Type": "application/json",
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (
        response.status === 401 &&
        this.refreshToken &&
        !endpoint.includes("/auth/")
      ) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          headers.Authorization = `Bearer ${this.token}`;
          const retryResponse = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers,
          });
          if (!retryResponse.ok) {
            const errorData = await retryResponse.json().catch(() => ({}));
            throw new Error(
              errorData.error || `HTTP error! status: ${retryResponse.status}`
            );
          }
          return retryResponse.json();
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      return response.json();
    } catch (error) {
      console.error("API Request Error:", error);
      throw error;
    }
  }

  async signUp(email, password) {
    const data = await this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.accessToken, data.refreshToken);
    return { user: data.user, error: null };
  }

  async signIn(email, password) {
    const data = await this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.accessToken, data.refreshToken);
    return { user: data.user, error: null };
  }

  async signOut() {
    try {
      await this.request("/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      this.clearTokens();
    }
    return { error: null };
  }

  async refreshToken() {
    return await this.refreshAccessToken();
  }

  async getUser() {
    if (!this.token) {
      return { user: null, error: null };
    }

    try {
      const data = await this.request("/auth/me");
      return { user: data.user, error: null };
    } catch (error) {
      this.clearTokens();
      return { user: null, error };
    }
  }

  async getProductos(filters = {}) {
    const params = new URLSearchParams();
    if (filters.categoria) params.append("categoria", filters.categoria);
    if (filters.destacado) params.append("destacado", "true");
    if (filters.activo !== undefined) params.append("activo", filters.activo);

    const queryString = params.toString();
    const data = await this.request(
      `/productos${queryString ? `?${queryString}` : ""}`
    );
    return { data, error: null };
  }

  async getProducto(id) {
    const data = await this.request(`/productos/${id}`);
    return { data, error: null };
  }

  async createProducto(producto) {
    const data = await this.request("/productos", {
      method: "POST",
      body: JSON.stringify(producto),
    });
    return { data, error: null };
  }

  async updateProducto(id, producto) {
    const data = await this.request(`/productos/${id}`, {
      method: "PUT",
      body: JSON.stringify(producto),
    });
    return { data, error: null };
  }

  async deleteProducto(id) {
    const data = await this.request(`/productos/${id}`, {
      method: "DELETE",
    });
    return { data, error: null };
  }

  async getCategorias(activo = true) {
    const data = await this.request(
      `/categorias${activo !== false ? "?activo=true" : ""}`
    );
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
    const data = await this.request("/categorias", {
      method: "POST",
      body: JSON.stringify(categoria),
    });
    return { data, error: null };
  }

  async updateCategoria(id, categoria) {
    const data = await this.request(`/categorias/${id}`, {
      method: "PUT",
      body: JSON.stringify(categoria),
    });
    return { data, error: null };
  }

  async deleteCategoria(id) {
    const data = await this.request(`/categorias/${id}`, {
      method: "DELETE",
    });
    return { data, error: null };
  }

  async getProveedores(activo = true) {
    const data = await this.request(
      `/proveedores${activo !== false ? "?activo=true" : ""}`
    );
    return { data, error: null };
  }

  async getProveedor(id) {
    const data = await this.request(`/proveedores/${id}`);
    return { data, error: null };
  }

  async createProveedor(proveedor) {
    const data = await this.request("/proveedores", {
      method: "POST",
      body: JSON.stringify(proveedor),
    });
    return { data, error: null };
  }

  async updateProveedor(id, proveedor) {
    const data = await this.request(`/proveedores/${id}`, {
      method: "PUT",
      body: JSON.stringify(proveedor),
    });
    return { data, error: null };
  }

  async deleteProveedor(id) {
    const data = await this.request(`/proveedores/${id}`, {
      method: "DELETE",
    });
    return { data, error: null };
  }

  async getSettings() {
    const data = await this.request("/settings");
    return { data, error: null };
  }

  async getSetting(key) {
    const data = await this.request(`/settings/${key}`);
    return { data, error: null };
  }

  async updateSetting(key, value) {
    const data = await this.request(`/settings/${key}`, {
      method: "PUT",
      body: JSON.stringify({ value }),
    });
    return { data, error: null };
  }

  async getSocialMedia(activo = true) {
    const data = await this.request(
      `/social-media${activo !== false ? "?activo=true" : ""}`
    );
    return { data, error: null };
  }

  async getSocialMediaItem(id) {
    const data = await this.request(`/social-media/${id}`);
    return { data, error: null };
  }

  async createSocialMedia(socialMedia) {
    const data = await this.request("/social-media", {
      method: "POST",
      body: JSON.stringify(socialMedia),
    });
    return { data, error: null };
  }

  async updateSocialMedia(id, socialMedia) {
    const data = await this.request(`/social-media/${id}`, {
      method: "PUT",
      body: JSON.stringify(socialMedia),
    });
    return { data, error: null };
  }

  async deleteSocialMedia(id) {
    const data = await this.request(`/social-media/${id}`, {
      method: "DELETE",
    });
    return { data, error: null };
  }

  async getIndustrias(activo = true) {
    const data = await this.request(
      `/industrias${activo !== false ? "?activo=true" : ""}`
    );
    return { data, error: null };
  }

  async getIndustria(id) {
    const data = await this.request(`/industrias/${id}`);
    return { data, error: null };
  }

  async createIndustria(industria) {
    const data = await this.request("/industrias", {
      method: "POST",
      body: JSON.stringify(industria),
    });
    return { data, error: null };
  }

  async updateIndustria(id, industria) {
    const data = await this.request(`/industrias/${id}`, {
      method: "PUT",
      body: JSON.stringify(industria),
    });
    return { data, error: null };
  }

  async deleteIndustria(id) {
    const data = await this.request(`/industrias/${id}`, {
      method: "DELETE",
    });
    return { data, error: null };
  }

  async getHeroes(activo = true) {
    const data = await this.request(
      `/heroes${activo !== false ? "?activo=true" : ""}`
    );
    return { data, error: null };
  }

  async getHeroBySeccion(seccion) {
    const data = await this.request(`/heroes/seccion/${seccion}`);
    return { data, error: null };
  }

  async getHero(id) {
    const data = await this.request(`/heroes/${id}`);
    return { data, error: null };
  }

  async createHero(hero) {
    const data = await this.request("/heroes", {
      method: "POST",
      body: JSON.stringify(hero),
    });
    return { data, error: null };
  }

  async updateHero(id, hero) {
    const data = await this.request(`/heroes/${id}`, {
      method: "PUT",
      body: JSON.stringify(hero),
    });
    return { data, error: null };
  }

  async deleteHero(id) {
    const data = await this.request(`/heroes/${id}`, {
      method: "DELETE",
    });
    return { data, error: null };
  }

  async getMercados(activo = true) {
    const data = await this.request(
      `/mercados${activo !== false ? "?activo=true" : ""}`
    );
    return { data, error: null };
  }

  async getMercadoBySlug(slug) {
    const data = await this.request(`/mercados/slug/${slug}`);
    return { data, error: null };
  }

  async getMercado(id) {
    const data = await this.request(`/mercados/${id}`);
    return { data, error: null };
  }

  async createMercado(mercado) {
    const data = await this.request("/mercados", {
      method: "POST",
      body: JSON.stringify(mercado),
    });
    return { data, error: null };
  }

  async updateMercado(id, mercado) {
    const data = await this.request(`/mercados/${id}`, {
      method: "PUT",
      body: JSON.stringify(mercado),
    });
    return { data, error: null };
  }

  async deleteMercado(id) {
    const data = await this.request(`/mercados/${id}`, {
      method: "DELETE",
    });
    return { data, error: null };
  }
}

export const apiClient = new ApiClient();
export const api = {
  get: (endpoint) => apiClient.request(endpoint),
  post: (endpoint, data) => apiClient.request(endpoint, { method: 'POST', body: JSON.stringify(data) }),
  put: (endpoint, data) => apiClient.request(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (endpoint) => apiClient.request(endpoint, { method: 'DELETE' })
};
export default apiClient;
