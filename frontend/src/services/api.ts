import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// Descobre a URL base da API: usa REACT_APP_API_URL em produção e fallback local em dev
const API_BASE_URL =
  // Variável de ambiente do CRA (defina no Render para apontar para o backend)
  process.env.REACT_APP_API_URL ||
  // Fallback: se houver window, tenta mesma origem + /api
  (typeof window !== 'undefined' ? `${window.location.origin}/api` : undefined) ||
  // Último recurso: ambiente local
  'http://localhost:5000/api';

// Configuração base do axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para tratar respostas
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    // Só redirecionar para login em casos específicos de erro 401
    if (error.response?.status === 401) {
      const errorMessage = error.response?.data?.erro || error.response?.data?.message || '';
      
      // Não redirecionar se for erro de senha atual incorreta
      if (errorMessage.includes('Senha atual incorreta') || 
          errorMessage.includes('senha atual') ||
          error.config?.url?.includes('/perfil')) {
        // Apenas retornar o erro sem redirecionar
        return Promise.reject(error);
      }
      
      // Para outros tipos de erro 401 (token inválido, expirado, etc)
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
