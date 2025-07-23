import api from './api';

export const authService = {
  login: async (email, senha) => {
    const response = await api.post('/usuarios/login', { email, senha });
    console.log('Login response:', response);
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/usuarios/registrar', userData);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/usuarios/perfil');
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await api.put('/usuarios/perfil', userData);
    return response.data;
  },

  // >>> ESSA FUNÇÃO PRECISA EXISTIR
  setToken: (token) => {
    localStorage.setItem('token', token);
  },

  logout: () => {
    localStorage.removeItem('token');
  }
};

export const productService = {
  getAll: async () => {
    const response = await api.get('/produtos');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/produtos/${id}`);
    return response.data;
  },

  create: async (productData) => {
    const response = await api.post('/produtos', productData);
    return response.data;
  },

  update: async (id, productData) => {
    const response = await api.put(`/produtos/${id}`, productData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/produtos/${id}`);
    return response.data;
  },

  getLowStock: async () => {
    const response = await api.get('/produtos/estoque-baixo');
    return response.data;
  },
};

export const userService = {
  getUsers: async () => {
    const response = await api.get('/usuarios');
    return response.data;
  },

  getUserById: async (id) => {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  },

  createUser: async (userData) => {
    const response = await api.post('/usuarios', userData);
    return response.data;
  },

  updateUser: async (id, userData) => {
    const response = await api.put(`/usuarios/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/usuarios/${id}`);
    return response.data;
  },

  changePassword: async (id, passwordData) => {
    const response = await api.put(`/usuarios/${id}/senha`, passwordData);
    return response.data;
  },

  toggleUserStatus: async (id) => {
    const response = await api.patch(`/usuarios/${id}/status`);
    return response.data;
  },
};

export const salesService = {
  // Estas rotas precisarão ser implementadas no backend
  getAll: async () => {
    const response = await api.get('/vendas');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/vendas/${id}`);
    return response.data;
  },

  create: async (saleData) => {
    const response = await api.post('/vendas', saleData);
    return response.data;
  },

  update: async (id, saleData) => {
    const response = await api.put(`/vendas/${id}`, saleData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/vendas/${id}`);
    return response.data;
  },

  getStatistics: async () => {
    const response = await api.get('/vendas/estatisticas');
    return response.data;
  },
};
