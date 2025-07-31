import api from './api';
import { 
  User, 
  Product, 
  Sale, 
  LoginResponse, 
  CreateUserRequest, 
  UpdateUserRequest,
  CreateProductRequest, 
  UpdateProductRequest,
  CreateSaleRequest,
  UpdateSaleRequest,
  ApiResponse 
} from '../types';

interface SalesParams {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  productId?: number;
  status?: string;
}

interface SalesResponse {
  vendas: Sale[];
  totalPaginas: number;
  paginaAtual: number;
  total: number;
}

export const authService = {
  login: async (email: string, senha: string): Promise<LoginResponse> => {
    const response = await api.post('/usuarios/login', { email, senha });
    return response.data;
  },

  register: async (userData: CreateUserRequest): Promise<User> => {
    const response = await api.post('/usuarios/registrar', userData);
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get('/usuarios/perfil');
    return response.data;
  },

  getUsers: async (): Promise<User[]> => {
    const response = await api.get('/usuarios/listuser');
    return response.data;
  },

  updateProfile: async (id: number, userData: UpdateUserRequest): Promise<User> => {
    const response = await api.put(`/usuarios/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id: number): Promise<ApiResponse<void>> => {
    if (!id) throw new Error('ID do usuário é necessário para exclusão');
    const response = await api.delete(`/usuarios/${id}`);
    return response.data;
  },

  setToken: (token: string | null): void => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  },

  logout: (): void => {
    localStorage.removeItem('token');
  }
};

export const productService = {
  getAll: async (): Promise<Product[]> => {
    const response = await api.get('/produtos');
    return response.data;
  },

  getById: async (id: string | number): Promise<Product> => {
    const response = await api.get(`/produtos/${id}`);
    return response.data;
  },

  create: async (productData: CreateProductRequest): Promise<Product> => {
    const response = await api.post('/produtos', productData);
    return response.data;
  },

  update: async (id: string | number, productData: UpdateProductRequest): Promise<Product> => {
    const response = await api.put(`/produtos/${id}`, productData);
    return response.data;
  },

  delete: async (id: string | number): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/produtos/${id}`);
    return response.data;
  },

  getByCodigo: async (codigo: string): Promise<Product> => {
    const response = await api.get(`/produtos/codigo/${codigo}`);
    return response.data;
  },

  getByMarca: async (marca: string): Promise<Product[]> => {
    const response = await api.get(`/produtos/marca/${marca}`);
    return response.data;
  },

  getLowStock: async (): Promise<Product[]> => {
    const response = await api.get('/produtos/estoque-baixo');
    return response.data;
  },
};

export const salesService = {
  // Listar todas as vendas com filtros opcionais
  getAll: async (params: SalesParams = {}): Promise<Sale[]> => {
    const response = await api.get('/vendas/', { params });
    // O backend retorna { vendas, totalPaginas, paginaAtual, total }
    // Retornamos apenas o array de vendas
    const data = response.data as SalesResponse;
    return data.vendas || (response.data as Sale[]);
  },

  // Obter uma venda específica por ID
  getById: async (id: number): Promise<Sale> => {
    const response = await api.get(`/vendas/${id}`);
    return response.data;
  },

  // Criar uma nova venda
  create: async (saleData: CreateSaleRequest): Promise<Sale> => {
    console.log('Dados da venda:', saleData); // Debugging
    const response = await api.post('/vendas/criar', saleData);
    console.log('Resposta da criação de venda:', response); // Debugging
    return response.data;
  },

  // Cancelar uma venda existente
  cancel: async (id: number): Promise<ApiResponse<Sale>> => {
    const response = await api.patch(`/vendas/${id}/cancelar`);
    return response.data;
  },

  // Excluir venda
  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/vendas/${id}`);
    return response.data;
  },

  // Atualizar status da venda
  updateStatus: async (id: string | number, status: string): Promise<Sale> => {
    const response = await api.patch(`/vendas/${id}`, { status });
    return response.data;
  },

  // Atualizar venda (opcional para futura edição)
  update: async (id: number, saleData: UpdateSaleRequest): Promise<Sale> => {
    const response = await api.put(`/vendas/${id}`, saleData);
    return response.data;
  },

  // Obter estatísticas de vendas com filtros opcionais
  getStatistics: async (params: Record<string, any> = {}): Promise<any> => {
    const response = await api.get('/vendas/estatisticas', { params });
    return response.data;
  },
};

export const userService = {
  getUsers: async (): Promise<User[]> => {
    const response = await api.get('/usuarios');
    return response.data;
  },

  getUserById: async (id: number): Promise<User> => {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  },

  createUser: async (userData: CreateUserRequest): Promise<User> => {
    const response = await api.post('/usuarios', userData);
    return response.data;
  },

  updateUser: async (id: number, userData: UpdateUserRequest): Promise<User> => {
    const response = await api.put(`/usuarios/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/usuarios/${id}`);
    return response.data;
  },

  changePassword: async (id: number, passwordData: { currentPassword: string; newPassword: string }): Promise<ApiResponse<void>> => {
    const response = await api.put(`/usuarios/${id}/senha`, passwordData);
    return response.data;
  },

  toggleUserStatus: async (id: number): Promise<User> => {
    const response = await api.patch(`/usuarios/${id}/status`);
    return response.data;
  },
};
