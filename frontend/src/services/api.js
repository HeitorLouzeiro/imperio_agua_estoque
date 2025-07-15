import axios from 'axios';

// URL base da API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Configuração do axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Serviços da API

// Autenticação
export const authAPI = {
  login: (email, senha) => api.post('/usuarios/login', { email, senha }),
  register: (userData) => api.post('/usuarios/registrar', userData),
};

// Produtos
export const productsAPI = {
  getAll: () => api.get('/produtos'),
  getById: (id) => api.get(`/produtos/${id}`),
  create: (product) => api.post('/produtos', product),
  update: (id, product) => api.put(`/produtos/${id}`, product),
  delete: (id) => api.delete(`/produtos/${id}`),
};

// Usuários
export const usersAPI = {
  getAll: () => api.get('/usuarios'),
  getById: (id) => api.get(`/usuarios/${id}`),
  create: (user) => api.post('/usuarios', user),
  update: (id, user) => api.put(`/usuarios/${id}`, user),
  delete: (id) => api.delete(`/usuarios/${id}`),
};

export default api;
