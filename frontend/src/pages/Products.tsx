import React, { useState, useEffect, ChangeEvent } from 'react';
import {
  Box, Paper, Typography, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Grid, Chip, IconButton, Alert, Snackbar,
  Card, CardContent, InputAdornment, MenuItem, Tooltip, Slide
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { productService } from '../services/index';
import { Product, CreateProductRequest } from '../types';
import Layout from '../components/common/Layout';

// Interface local para o formulário
interface ProductFormData {
  codigo: string;
  nome: string;
  marca: string;
  preco: number | string;
  quantidade: number | string;
}

const Products: React.FC = () => {
  // Estados
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'warning' }>({
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
  const [categories, setCategories] = useState<string[]>([]);

  // Carrega produtos ao montar componente
  useEffect(() => {
    loadProducts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Carregar produtos da API
  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAll();
      // Mapeia resposta para Product com id para DataGrid
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

      // Extrai categorias/marcas únicas para filtro
      const uniqueMarcas = Array.from(new Set(formatted.map(p => p.marca).filter(Boolean))) as string[];
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

  // Criar novo produto - abrir modal
  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({ codigo: '', nome: '', marca: '', preco: '', quantidade: '' });
    setOpen(true);
  };

  // Editar produto - abrir modal com dados preenchidos
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

  // Visualizar produto - abrir modal
  const handleView = async (id: string | number) => {
    try {
      const rawProduct = await productService.getById(id);
      // Mapear retorno para Product
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

  // Excluir produto
  const handleDelete = async (id: string | number) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await productService.delete(id);
        showSnackbar('Produto excluído com sucesso!');
        loadProducts();
      } catch (error) {
        console.error('Erro ao excluir produto:', error);
        showSnackbar('Erro ao excluir produto', 'error');
      }
    }
  };

  // Salvar produto (criar ou atualizar)
  const handleSave = async () => {
    try {
      if (!formData.codigo.trim() || !formData.nome.trim() || !formData.marca.trim()) {
        showSnackbar('Preencha todos os campos obrigatórios', 'warning');
        return;
      }

      // Validar e converter preço
      const preco = typeof formData.preco === 'string' ? parseFloat(formData.preco) : formData.preco;
      if (isNaN(preco) || preco < 0) {
        showSnackbar('Preço deve ser um valor válido maior ou igual a zero', 'warning');
        return;
      }

      // Validar e converter quantidade
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
        // Use o ID original sem conversão, pois o backend espera ObjectId (string)
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
      
      // Verificar se é um erro de duplicação de código
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

  // Função para validar campos em tempo real
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
  const handleChange =
    (field: keyof ProductFormData) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      let value: string | number = event.target.value;
      
      // Para campos numéricos, permite valores vazios ou válidos
      if (field === 'preco' || field === 'quantidade') {
        // Se estiver vazio, mantém como string vazia para permitir edição
        if (value === '') {
          value = '';
        } else {
          // Converte para número apenas se for um valor válido
          const numValue = Number(value);
          if (!isNaN(numValue) && numValue >= 0) {
            value = field === 'preco' ? value : Math.floor(numValue); // Quantidade deve ser inteiro
          } else {
            return; // Não atualiza se for um valor inválido
          }
        }
      }
      
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

  // Filtra produtos pelo termo e categoria
  const filteredProducts = products.filter((product) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      (product.codigo || '').toLowerCase().includes(search) ||
      (product.nome || '').toLowerCase().includes(search) ||
      (product.marca || '').toLowerCase().includes(search);
    const matchesCategory = !filterCategory || product.marca === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Colunas do DataGrid com tipagem
  const columns = [
    { field: 'codigo', headerName: 'Código', width: 130 },
    { field: 'nome', headerName: 'Nome', width: 200 },
    { field: 'marca', headerName: 'Marca', width: 150 },
    {
      field: 'preco',
      headerName: 'Preço',
      width: 100,
      renderCell: (params: any) => `R$ ${(params.value || 0).toFixed(2)}`,
    },
    {
      field: 'quantidade',
      headerName: 'Estoque',
      width: 120,
      renderCell: (params: any) => (
        <Chip
          label={params.value || 0}
          color={params.value === 0 ? 'error' : params.value < 20 ? 'warning' : 'success'}
          icon={params.value !== undefined && params.value < 20 ? <WarningIcon /> : undefined}
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 150,
      sortable: false,
      renderCell: (params: any) => (
        <Box>
          <Tooltip title="Visualizar">
            <IconButton size="small" onClick={() => handleView(params.row.id)}>
              <ViewIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Editar">
            <IconButton size="small" onClick={() => handleEdit(params.row as Product)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Excluir">
            <IconButton size="small" color="error" onClick={() => handleDelete(params.row.id)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Layout>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h4">Produtos</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
            Novo Produto
          </Button>
        </Box>

        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  placeholder="Buscar por código, nome ou marca"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  select
                  fullWidth
                  label="Filtrar por marca"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <MenuItem value="">Todas</MenuItem>
                  {categories.map((c) => (
                    <MenuItem key={c} value={c}>
                      {c}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={2}>
                <Button fullWidth variant="outlined" startIcon={<RefreshIcon />} onClick={loadProducts}>
                  Atualizar
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Paper sx={{ height: 500 }}>
          <DataGrid
            rows={filteredProducts}
            columns={columns}
            loading={loading}
            pageSizeOptions={[10, 25, 50]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            disableRowSelectionOnClick
          />
        </Paper>

        {/* Modal de Formulário */}
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          maxWidth="sm"
          fullWidth
          TransitionComponent={Slide}
          // @ts-ignore: MUI Slide transitionProps workaround
          TransitionProps={{ direction: 'up' }}
        >
          <DialogTitle>{editingProduct ? 'Editar Produto' : 'Novo Produto'}</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Código"
                  value={formData.codigo}
                  onChange={handleChange('codigo')}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nome"
                  value={formData.nome}
                  onChange={handleChange('nome')}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Marca"
                  value={formData.marca}
                  onChange={handleChange('marca')}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Preço (R$)"
                  type="number"
                  value={formData.preco}
                  onChange={handleChange('preco')}
                  placeholder="0.00"
                  inputProps={{ 
                    min: 0, 
                    step: 0.01,
                    'data-testid': 'preco-input'
                  }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                  }}
                  helperText={getFieldError('preco') || "Digite o preço (ex: 12.50)"}
                  error={!!getFieldError('preco')}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Quantidade"
                  type="number"
                  value={formData.quantidade}
                  onChange={handleChange('quantidade')}
                  placeholder="0"
                  inputProps={{ 
                    min: 0,
                    step: 1,
                    'data-testid': 'quantidade-input'
                  }}
                  helperText={getFieldError('quantidade') || "Digite a quantidade em estoque"}
                  error={!!getFieldError('quantidade')}
                  required
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} variant="contained">
              {editingProduct ? 'Atualizar' : 'Criar'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Modal de Visualização */}
        <Dialog open={!!viewProduct} onClose={() => setViewProduct(null)} maxWidth="sm" fullWidth>
          <DialogTitle>Detalhes do Produto</DialogTitle>
          <DialogContent dividers>
            {viewProduct && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Código:</Typography>
                  <Typography>{viewProduct.codigo}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Nome:</Typography>
                  <Typography>{viewProduct.nome}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Marca:</Typography>
                  <Typography>{viewProduct.marca}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Preço:</Typography>
                  <Typography>R$ {(viewProduct.preco || 0).toFixed(2)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Quantidade:</Typography>
                  <Typography>{viewProduct.quantidade || 0}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">
                    Criado em: {new Date(viewProduct.createdAt || '').toLocaleString()}<br />
                    Atualizado em: {new Date(viewProduct.updatedAt || '').toLocaleString()}
                  </Typography>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewProduct(null)}>Fechar</Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            severity={snackbar.severity}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Layout>
  );
};

export default Products;
