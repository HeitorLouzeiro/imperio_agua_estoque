// Tipos globais para o projeto Imperio Água Estoque

export interface User {
  id: number | string;
  name: string;
  email: string;
  role: 'administrador' | 'funcionario';
  createdAt: string;
  updatedAt: string;
  ativo?: boolean;
  // Campos em português para compatibilidade com backend
  nome?: string;
  papel?: 'administrador' | 'funcionario';
  _id?: string;
}

export interface Product {
  id: number | string;
  codigo?: string;
  name: string;
  nome?: string;
  marca?: string;
  price: number;
  preco?: number;
  quantity: number;
  quantidade?: number;
  estoque?: number; // Adicionando estoque como alias para quantity/quantidade
  category?: string;
  createdAt: string;
  updatedAt: string;
  ativo?: boolean;
  // Campos específicos para compatibilidade
  _id?: string;
}

export interface Sale {
  id: number | string;
  productId: number;
  product?: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  // Campos específicos para vendas em português
  _id?: string;
  cliente?: string;
  numero?: string | number;
  dataVenda?: string;
  data?: string;
  vendedor?: {
    nome?: string;
    id?: number | string;
  };
  status?: 'pendente' | 'paga' | 'cancelada';
  formaPagamento?: string;
  desconto?: number;
  subtotal?: number;
  total?: number;
  observacoes?: string;
  itens?: SaleItem[];
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isAdmin: () => boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: 'administrador' | 'funcionario';
  // Campos em português para compatibilidade com backend
  nome?: string;
  senha?: string;
  papel?: 'administrador' | 'funcionario';
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  password?: string;
  role?: 'administrador' | 'funcionario';
  // Campos em português para compatibilidade com backend
  nome?: string;
  senha?: string;
  senhaAtual?: string;
  papel?: 'administrador' | 'funcionario';
}

export interface CreateProductRequest {
  codigo: string;
  nome: string;
  marca: string;
  preco: number;
  quantidade: number;
}

export interface UpdateProductRequest {
  codigo?: string;
  nome?: string;
  marca?: string;
  preco?: number;
  quantidade?: number;
}

export interface CreateSaleRequest {
  productId: number;
  quantity: number;
  unitPrice: number;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  notes?: string;
}

export interface UpdateSaleRequest {
  cliente?: string;
  itens?: Array<{
    produto: string | number;
    quantidade: number;
    precoUnitario?: number;
    subtotal?: number;
  }>;
  formaPagamento?: string;
  desconto?: number;
  observacoes?: string;
  status?: 'pendente' | 'paga' | 'cancelada';
}

export interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalSales: number;
  totalRevenue: number;
  recentSales: Sale[];
  lowStockProducts: Product[];
}

export interface ReportFilters {
  startDate?: Date;
  endDate?: Date;
  productId?: number;
  userId?: number;
}

export interface DailyRevenueData {
  date: string;
  revenue: number;
  salesCount: number;
}

// Tipos específicos para componentes
export interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
}

export interface UserFormData {
  nome: string;
  email: string;
  senha: string;
  papel: 'administrador' | 'funcionario';
}

// Interfaces específicas para vendas
export interface SaleItem {
  produto: number | string | Product;
  nome?: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
  product?: {
    nome?: string;
    name?: string;
    id?: number | string;
    codigo?: string;
  };
}

export interface SaleFormData {
  cliente: string;
  data: Date | null;
  observacoes: string;
  formaPagamento: string;
  desconto: number;
}

export interface SaleStatistics {
  totalVendas: number;
  vendasHoje: number;
  receitaTotal: number;
  receitaHoje: number;
  vendasPorStatus: {
    pendente: number;
    paga: number;
    cancelada: number;
  };
  produtoMaisVendido: {
    nome: string;
    quantidade: number;
    codigo: string;
  } | null;
}

export interface CreateSalePayload {
  cliente: string;
  formaPagamento: string;
  desconto: number;
  observacoes: string;
  itens: {
    produto: number | string;
    quantidade: number;
  }[];
}
