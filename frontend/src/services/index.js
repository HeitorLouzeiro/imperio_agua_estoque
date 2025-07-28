import api from './api';

export const authService = {
  login: async (email, senha) => {
    const response = await api.post('/usuarios/login', { email, senha });
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

  getUsers: async () => {
    const response = await api.get('/usuarios/listuser');
    return response.data;
  },

  updateProfile: async (id, userData) => {
    const response = await api.put(`/usuarios/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id) => {
    if (!id) throw new Error('ID do usuário é necessário para exclusão');
    const response = await api.delete(`/usuarios/${id}`);
    return response.data;
  },

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

  getByCodigo: async (codigo) => {
    const response = await api.get(`/produtos/codigo/${codigo}`);
    return response.data;
  },

  getByMarca: async (marca) => {
    const response = await api.get(`/produtos/marca/${marca}`);
    return response.data;
  },

  // Remova ou implemente essa rota no backend se for usar
  getLowStock: async () => {
    const response = await api.get('/produtos/estoque-baixo');
    return response.data;
  },
};



export const salesService = {
  // Listar todas as vendas com filtros opcionais
  getAll: async (params = {}) => {
    const response = await api.get('/vendas/', { params });
    return response.data;
  },

  // Obter uma venda específica por ID
  getById: async (id) => {
    const response = await api.get(`/vendas/${id}`);
    return response.data;
  },

  // Criar uma nova venda
  create: async (saleData) => {
    console.log('Dados da venda:', saleData); // Debugging
    const response = await api.post('/vendas/criar', saleData);
    console.log('Resposta da criação de venda:', response); // Debugging
    return response.data;
  },

  // Cancelar uma venda existente
  cancel: async (id) => {
    const response = await api.patch(`/vendas/${id}/cancelar`);
    return response.data;
  },

  // Excluir venda
  delete: async (id) => {
    const response = await api.delete(`/vendas/${id}`);
    return response.data;
  },

  // Atualizar venda (opcional para futura edição)
  update: async (id, saleData) => {
    const response = await api.put(`/vendas/${id}`, saleData);
    return response.data;
  },


  // Obter estatísticas de vendas com filtros opcionais
  getStatistics: async (params = {}) => {
    const response = await api.get('/vendas/estatisticas', { params });
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
