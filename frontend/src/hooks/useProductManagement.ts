import { useState, useEffect, ChangeEvent } from 'react';
import { productService } from '../services';
import { Product, CreateProductRequest } from '../types';

interface ProductFormData {
  codigo: string;
  nome: string;
  marca: string;
  preco: number | string;
  quantidade: number | string;
}

interface UseProductManagementReturn {
  // States
  products: Product[];
  loading: boolean;
  categories: string[];
  searchTerm: string;
  filterCategory: string;
  open: boolean;
  editingProduct: Product | null;
  viewProduct: Product | null;
  formData: ProductFormData;
  snackbar: {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning';
  };
  
  // Computed
  filteredProducts: Product[];
  
  // Actions
  setSearchTerm: (value: string) => void;
  setFilterCategory: (value: string) => void;
  loadProducts: () => Promise<void>;
  handleAdd: () => void;
  handleEdit: (product: Product) => void;
  handleView: (id: string | number) => Promise<void>;
  handleDelete: (id: string | number) => Promise<void>;
  handleSave: () => Promise<void>;
  handleChange: (field: keyof ProductFormData) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  getFieldError: (field: keyof ProductFormData) => string;
  showSnackbar: (message: string, severity?: 'success' | 'error' | 'warning') => void;
  closeDialog: () => void;
  closeViewDialog: () => void;
  closeSnackbar: () => void;
}

export const useProductManagement = (): UseProductManagementReturn => {
  // Estados
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [formData, setFormData] = useState<ProductFormData>({
    codigo: '',
    nome: '',
    marca: '',
    preco: '',
    quantidade: '',
  });

  // Carrega produtos ao montar
  useEffect(() => {
    loadProducts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Carregar produtos da API
  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAll();
      const formatted: Product[] = response.map((p: any) => ({
        id: p._id || p.id,
        codigo: p.codigo,
        name: p.nome || p.name || '',
        nome: p.nome,
        marca: p.marca,
        price: p.preco || p.price || 0,
        preco: p.preco,
        quantity: p.quantidade || p.quantity || 0,
        quantidade: p.quantidade,
        category: p.marca,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      }));
      setProducts(formatted);

      const uniqueMarcas = Array.from(
        new Set(formatted.map(p => p.marca).filter(Boolean))
      ) as string[];
      setCategories(uniqueMarcas);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      showSnackbar('Erro ao carregar produtos', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Snackbar helper
  const showSnackbar = (message: string, severity: 'success' | 'error' | 'warning' = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Criar novo produto
  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({ codigo: '', nome: '', marca: '', preco: '', quantidade: '' });
    setOpen(true);
  };

  // Editar produto
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      codigo: product.codigo || '',
      nome: product.nome || '',
      marca: product.marca || '',
      preco: product.preco?.toString() || '',
      quantidade: product.quantidade?.toString() || '',
    });
    setOpen(true);
  };

  // Visualizar produto
  const handleView = async (id: string | number) => {
    try {
      const rawProduct = await productService.getById(id);
      const product: Product = {
        id: (rawProduct as any)._id || rawProduct.id,
        codigo: (rawProduct as any).codigo,
        name: (rawProduct as any).nome || (rawProduct as any).name || '',
        nome: (rawProduct as any).nome,
        marca: (rawProduct as any).marca,
        price: (rawProduct as any).preco || (rawProduct as any).price || 0,
        preco: (rawProduct as any).preco,
        quantity: (rawProduct as any).quantidade || (rawProduct as any).quantity || 0,
        quantidade: (rawProduct as any).quantidade,
        category: (rawProduct as any).marca,
        createdAt: (rawProduct as any).createdAt,
        updatedAt: (rawProduct as any).updatedAt,
      };
      setViewProduct(product);
    } catch (error) {
      console.error('Erro ao carregar detalhes:', error);
      showSnackbar('Erro ao carregar detalhes do produto', 'error');
    }
  };

  // Excluir produto (soft delete)
  const handleDelete = async (id: string | number) => {
    if (window.confirm('Tem certeza que deseja desativar este produto?\n\nO produto ficará inativo mas seu histórico será preservado.')) {
      try {
        await productService.delete(id);
        showSnackbar('Produto desativado com sucesso!');
        loadProducts();
      } catch (error) {
        console.error('Erro ao desativar produto:', error);
        showSnackbar('Erro ao desativar produto', 'error');
      }
    }
  };

  // Salvar produto
  const handleSave = async () => {
    try {
      if (!formData.codigo.trim() || !formData.nome.trim() || !formData.marca.trim()) {
        showSnackbar('Preencha todos os campos obrigatórios', 'warning');
        return;
      }

      const preco = typeof formData.preco === 'string' ? parseFloat(formData.preco) : formData.preco;
      if (isNaN(preco) || preco < 0) {
        showSnackbar('Preço deve ser um valor válido maior ou igual a zero', 'warning');
        return;
      }

      const quantidade = typeof formData.quantidade === 'string' ? parseInt(formData.quantidade, 10) : formData.quantidade;
      if (isNaN(quantidade) || quantidade < 0 || !Number.isInteger(quantidade)) {
        showSnackbar('Quantidade deve ser um número inteiro maior ou igual a zero', 'warning');
        return;
      }

      const data: CreateProductRequest = {
        codigo: formData.codigo.trim(),
        nome: formData.nome.trim(),
        marca: formData.marca.trim(),
        preco: preco,
        quantidade: quantidade,
      };

      if (editingProduct) {
        const productId = editingProduct._id || editingProduct.id;
        await productService.update(productId, data);
        showSnackbar('Produto atualizado com sucesso!');
      } else {
        await productService.create(data);
        showSnackbar('Produto criado com sucesso!');
      }

      setOpen(false);
      loadProducts();
    } catch (error: any) {
      console.error('Erro ao salvar produto:', error);
      
      if (error.response?.data?.erro) {
        if (error.response.data.erro.includes('codigo')) {
          showSnackbar('Já existe um produto com este código', 'error');
        } else {
          showSnackbar(error.response.data.erro, 'error');
        }
      } else if (error.response?.data?.message) {
        showSnackbar(error.response.data.message, 'error');
      } else {
        showSnackbar('Erro ao salvar produto', 'error');
      }
    }
  };

  // Função para validar campos
  const getFieldError = (field: keyof ProductFormData): string => {
    const value = formData[field];
    
    switch (field) {
      case 'preco':
        if (value === '') return '';
        const preco = typeof value === 'string' ? parseFloat(value) : value;
        if (isNaN(preco) || preco < 0) return 'Preço deve ser maior ou igual a zero';
        return '';
      
      case 'quantidade':
        if (value === '') return '';
        const quantidade = typeof value === 'string' ? parseFloat(value) : value;
        if (isNaN(quantidade) || quantidade < 0 || !Number.isInteger(quantidade)) {
          return 'Quantidade deve ser um número inteiro maior ou igual a zero';
        }
        return '';
      
      default:
        return '';
    }
  };

  // Handle form changes
  const handleChange = (field: keyof ProductFormData) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let value: string | number = event.target.value;
    
    if (field === 'preco' || field === 'quantidade') {
      if (value === '') {
        value = '';
      } else {
        const numValue = Number(value);
        if (!isNaN(numValue) && numValue >= 0) {
          value = field === 'preco' ? value : Math.floor(numValue);
        } else {
          return;
        }
      }
    }
    
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Filtrar produtos
  const filteredProducts = products.filter((product) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      (product.codigo || '').toLowerCase().includes(search) ||
      (product.nome || '').toLowerCase().includes(search) ||
      (product.marca || '').toLowerCase().includes(search);
    const matchesCategory = !filterCategory || product.marca === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Close handlers
  const closeDialog = () => setOpen(false);
  const closeViewDialog = () => setViewProduct(null);
  const closeSnackbar = () => setSnackbar({ ...snackbar, open: false });

  return {
    // States
    products,
    loading,
    categories,
    searchTerm,
    filterCategory,
    open,
    editingProduct,
    viewProduct,
    formData,
    snackbar,
    
    // Computed
    filteredProducts,
    
    // Actions
    setSearchTerm,
    setFilterCategory,
    loadProducts,
    handleAdd,
    handleEdit,
    handleView,
    handleDelete,
    handleSave,
    handleChange,
    getFieldError,
    showSnackbar,
    closeDialog,
    closeViewDialog,
    closeSnackbar,
  };
};
