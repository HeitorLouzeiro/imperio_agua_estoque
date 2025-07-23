import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Chip,
  IconButton,
  Alert,
  Snackbar,
  Card,
  CardContent,
  InputAdornment,
  MenuItem,
  Tooltip,
  Fab,
  Slide,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Inventory as InventoryIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { productService } from '../services';
import Layout from '../components/common/Layout';
import { useAuth } from '../contexts/AuthContext';

const Products = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    nome: '',
    categoria: '',
    preco: '',
    quantidade: '',
    descricao: '',
    fornecedor: '',
  });

  const categories = ['Água Mineral', 'Água com Gás', 'Água Saborizada', 'Galão', 'Acessórios'];

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      // Simulando dados até a API estar pronta
      const mockProducts = [
        {
          id: 1,
          nome: 'Água Crystal 500ml',
          categoria: 'Água Mineral',
          preco: 2.50,
          quantidade: 150,
          fornecedor: 'Distribuidora Sul',
          status: 'ativo',
        },
        {
          id: 2,
          nome: 'Água Pura 1L',
          categoria: 'Água Mineral',
          preco: 4.00,
          quantidade: 80,
          fornecedor: 'Água Limpa Ltda',
          status: 'ativo',
        },
        {
          id: 3,
          nome: 'Galão 20L Premium',
          categoria: 'Galão',
          preco: 15.00,
          quantidade: 25,
          fornecedor: 'Mega Água',
          status: 'ativo',
        },
        {
          id: 4,
          nome: 'Água com Gás 500ml',
          categoria: 'Água com Gás',
          preco: 3.00,
          quantidade: 5,
          fornecedor: 'Gás & Água',
          status: 'ativo',
        },
      ];
      setProducts(mockProducts);
    } catch (error) {
      showSnackbar('Erro ao carregar produtos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({
      nome: '',
      categoria: '',
      preco: '',
      quantidade: '',
      descricao: '',
      fornecedor: '',
    });
    setOpen(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData(product);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        setProducts(products.filter(p => p.id !== id));
        showSnackbar('Produto excluído com sucesso!');
      } catch (error) {
        showSnackbar('Erro ao excluir produto', 'error');
      }
    }
  };

  const handleSave = async () => {
    try {
      if (editingProduct) {
        // Atualizar produto existente
        setProducts(products.map(p => 
          p.id === editingProduct.id 
            ? { ...formData, id: editingProduct.id, preco: parseFloat(formData.preco), quantidade: parseInt(formData.quantidade) }
            : p
        ));
        showSnackbar('Produto atualizado com sucesso!');
      } else {
        // Criar novo produto
        const newProduct = {
          ...formData,
          id: Math.max(...products.map(p => p.id)) + 1,
          preco: parseFloat(formData.preco),
          quantidade: parseInt(formData.quantidade),
          status: 'ativo',
        };
        setProducts([...products, newProduct]);
        showSnackbar('Produto criado com sucesso!');
      }
      setOpen(false);
    } catch (error) {
      showSnackbar('Erro ao salvar produto', 'error');
    }
  };

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.categoria.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || product.categoria === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const columns = [
    { 
      field: 'nome', 
      headerName: 'Nome', 
      width: 200,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" fontWeight="medium">
            {params.value}
          </Typography>
        </Box>
      )
    },
    { 
      field: 'categoria', 
      headerName: 'Categoria', 
      width: 150,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small" 
          variant="outlined"
          color="primary"
        />
      )
    },
    {
      field: 'preco',
      headerName: 'Preço',
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="medium" color="success.main">
          R$ {params.value?.toFixed(2)}
        </Typography>
      ),
    },
    {
      field: 'quantidade',
      headerName: 'Estoque',
      width: 120,
      renderCell: (params) => {
        const isLowStock = params.value < 20;
        const isOutOfStock = params.value === 0;
        
        return (
          <Chip
            label={params.value}
            color={isOutOfStock ? 'error' : isLowStock ? 'warning' : 'success'}
            size="small"
            icon={isLowStock || isOutOfStock ? <WarningIcon /> : null}
          />
        );
      },
    },
    { 
      field: 'fornecedor', 
      headerName: 'Fornecedor', 
      width: 150,
    },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Visualizar">
            <IconButton size="small" onClick={() => handleEdit(params.row)}>
              <ViewIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Editar">
            <IconButton size="small" onClick={() => handleEdit(params.row)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          {user?.tipo === 'admin' && (
            <Tooltip title="Excluir">
              <IconButton 
                size="small" 
                color="error" 
                onClick={() => handleDelete(params.row.id)}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ];

  return (
    <Layout>
      <Box>
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Produtos
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Gerencie o catálogo de produtos do seu estoque
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            sx={{ borderRadius: 2 }}
          >
            Novo Produto
          </Button>
        </Box>

        {/* Filtros */}
        <Card sx={{ mb: 3, borderRadius: 3 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  select
                  label="Categoria"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <MenuItem value="">Todas</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={loadProducts}
                >
                  Atualizar
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Tabela de Produtos */}
        <Paper sx={{ height: 600, borderRadius: 3 }}>
          <DataGrid
            rows={filteredProducts}
            columns={columns}
            loading={loading}
            pageSizeOptions={[10, 25, 50]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            disableRowSelectionOnClick
            sx={{
              border: 'none',
              '& .MuiDataGrid-main': {
                borderRadius: 3,
              },
            }}
          />
        </Paper>

        {/* Dialog para adicionar/editar produto */}
        <Dialog 
          open={open} 
          onClose={() => setOpen(false)} 
          maxWidth="md" 
          fullWidth
          TransitionComponent={Slide}
          TransitionProps={{ direction: "up" }}
        >
          <DialogTitle>
            {editingProduct ? 'Editar Produto' : 'Novo Produto'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nome do Produto"
                  value={formData.nome}
                  onChange={handleChange('nome')}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Categoria"
                  value={formData.categoria}
                  onChange={handleChange('categoria')}
                  required
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Preço (R$)"
                  type="number"
                  value={formData.preco}
                  onChange={handleChange('preco')}
                  inputProps={{ step: 0.01, min: 0 }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Quantidade em Estoque"
                  type="number"
                  value={formData.quantidade}
                  onChange={handleChange('quantidade')}
                  inputProps={{ min: 0 }}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Fornecedor"
                  value={formData.fornecedor}
                  onChange={handleChange('fornecedor')}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descrição"
                  value={formData.descricao}
                  onChange={handleChange('descricao')}
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSave} 
              variant="contained"
            >
              {editingProduct ? 'Atualizar' : 'Criar'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar para feedbacks */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
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
