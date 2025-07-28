import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Grid, Chip, IconButton, Alert, Snackbar,
  Card, CardContent, InputAdornment, MenuItem, Tooltip, Slide
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
  Visibility as ViewIcon, Search as SearchIcon, Refresh as RefreshIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { productService } from '../services/index';
import Layout from '../components/common/Layout';

const Products = () => {
  // Estados principais
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewProduct, setViewProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    codigo: '',
    nome: '',
    marca: '',
    preco: '',
    quantidade: ''
  });
  const [categories, setCategories] = useState([]);

  // Carrega produtos no início e quando necessário
  useEffect(() => {
    loadProducts();
  }, []);

  // Função para carregar produtos da API
  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAll();
      console.log('Produtos recebidos:', response); // Debug: verificar se 'nome' está vindo

      // Formata produtos adicionando a propriedade id para o DataGrid
      const formatted = response.map(p => ({ id: p._id, ...p }));
      setProducts(formatted);

      // Extrai marcas únicas para filtro
      const uniqueMarcas = [...new Set(formatted.map(p => p.marca))];
      setCategories(uniqueMarcas);

    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      showSnackbar('Erro ao carregar produtos', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Exibe mensagem Snackbar
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Inicia criação de produto
  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({ codigo: '', nome: '', marca: '', preco: '', quantidade: '' });
    setOpen(true);
  };

  // Inicia edição de produto
  const handleEdit = (product) => {
    console.log('Editar produto:', product); // Debug
    setEditingProduct(product);
    setFormData({
      codigo: product.codigo || '',
      nome: product.nome || '',
      marca: product.marca || '',
      preco: product.preco?.toString() || '',
      quantidade: product.quantidade?.toString() || ''
    });
    setOpen(true);
  };

  // Visualizar detalhes do produto
  const handleView = async (id) => {
    try {
      const product = await productService.getById(id);
      console.log('Visualizar produto:', product); // Debug
      setViewProduct(product);
    } catch (error) {
      console.error('Erro ao carregar detalhes:', error);
      showSnackbar('Erro ao carregar detalhes do produto', 'error');
    }
  };

  // Excluir produto
  const handleDelete = async (id) => {
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

  // Salvar criação ou edição
  const handleSave = async () => {
    try {
      // Validações básicas
      if (!formData.codigo.trim() || !formData.nome.trim() || !formData.marca.trim()) {
        showSnackbar('Preencha todos os campos obrigatórios', 'warning');
        return;
      }

      const data = {
        codigo: formData.codigo.trim(),
        nome: formData.nome.trim(),
        marca: formData.marca.trim(),
        preco: parseFloat(formData.preco) || 0,
        quantidade: parseInt(formData.quantidade) || 0
      };

      if (editingProduct) {
        await productService.update(editingProduct.id, data);
        showSnackbar('Produto atualizado com sucesso!');
      } else {
        await productService.create(data);
        showSnackbar('Produto criado com sucesso!');
      }

      setOpen(false);
      loadProducts();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      showSnackbar('Erro ao salvar produto', 'error');
    }
  };

  // Atualiza estado do formulário conforme inputs
  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  // Filtra produtos pela busca e categoria
  const filteredProducts = products.filter(product => {
    const matchesSearch =
      product.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.marca.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || product.marca === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Configura colunas do DataGrid
  const columns = [
    { field: 'codigo', headerName: 'Código', width: 130 },
    { field: 'nome', headerName: 'Nome', width: 200 },
    { field: 'marca', headerName: 'Marca', width: 150 },
    {
      field: 'preco',
      headerName: 'Preço',
      width: 100,
      renderCell: (params) => `R$ ${params.value.toFixed(2)}`
    },
    {
      field: 'quantidade',
      headerName: 'Estoque',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === 0 ? 'error' : params.value < 20 ? 'warning' : 'success'}
          icon={(params.value < 20 || params.value === 0) ? <WarningIcon /> : null}
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Visualizar">
            <IconButton size="small" onClick={() => handleView(params.row.id)}>
              <ViewIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Editar">
            <IconButton size="small" onClick={() => handleEdit(params.row)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Excluir">
            <IconButton size="small" color="error" onClick={() => handleDelete(params.row.id)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
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
                  {categories.map(c => (
                    <MenuItem key={c} value={c}>{c}</MenuItem>
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
          TransitionProps={{ direction: "up" }}
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
                  inputProps={{ min: 0, step: 0.01 }}
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
                  inputProps={{ min: 0 }}
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
        <Dialog
          open={!!viewProduct}
          onClose={() => setViewProduct(null)}
          maxWidth="sm"
          fullWidth
        >
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
                  <Typography>R$ {viewProduct.preco?.toFixed(2)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Quantidade:</Typography>
                  <Typography>{viewProduct.quantidade}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">
                    Criado em: {new Date(viewProduct.createdAt).toLocaleString()}<br />
                    Atualizado em: {new Date(viewProduct.updatedAt).toLocaleString()}
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
