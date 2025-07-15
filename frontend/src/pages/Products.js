import React, { useState } from 'react';
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
  Fab,
  Alert,
  Snackbar,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';

const Products = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      codigo: 'AG001',
      marca: 'Água Crystal',
      volume: '500ml',
      preco: 2.50,
      quantidade: 150,
      categoria: 'Agua Mineral',
      dataValidade: '2025-12-31',
      status: 'ativo'
    },
    {
      id: 2,
      codigo: 'AG002',
      marca: 'Água Pura',
      volume: '1L',
      preco: 4.00,
      quantidade: 80,
      categoria: 'Agua Mineral',
      dataValidade: '2025-11-30',
      status: 'ativo'
    },
    {
      id: 3,
      codigo: 'AG003',
      marca: 'H2O Natural',
      volume: '2L',
      preco: 6.50,
      quantidade: 5,
      categoria: 'Agua Mineral',
      dataValidade: '2025-10-15',
      status: 'ativo'
    },
  ]);

  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    codigo: '',
    marca: '',
    volume: '',
    preco: '',
    quantidade: '',
    categoria: '',
    dataValidade: '',
    status: 'ativo'
  });

  const columns = [
    { field: 'codigo', headerName: 'Código', width: 100 },
    { field: 'marca', headerName: 'Marca', width: 150 },
    { field: 'volume', headerName: 'Volume', width: 100 },
    {
      field: 'preco',
      headerName: 'Preço',
      width: 100,
      renderCell: (params) => `R$ ${params.value.toFixed(2)}`,
    },
    {
      field: 'quantidade',
      headerName: 'Estoque',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value < 10 ? 'error' : params.value < 50 ? 'warning' : 'success'}
          size="small"
        />
      ),
    },
    { field: 'categoria', headerName: 'Categoria', width: 130 },
    { field: 'dataValidade', headerName: 'Validade', width: 120 },
    {
      field: 'status',
      headerName: 'Status',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === 'ativo' ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton size="small" onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton size="small" onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({
      codigo: '',
      marca: '',
      volume: '',
      preco: '',
      quantidade: '',
      categoria: '',
      dataValidade: '',
      status: 'ativo'
    });
    setOpen(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData(product);
    setOpen(true);
  };

  const handleDelete = (id) => {
    setProducts(products.filter(p => p.id !== id));
    setSnackbar({
      open: true,
      message: 'Produto excluído com sucesso!',
      severity: 'success'
    });
  };

  const handleSave = () => {
    if (editingProduct) {
      // Editando produto existente
      setProducts(products.map(p => 
        p.id === editingProduct.id 
          ? { ...formData, id: editingProduct.id, preco: parseFloat(formData.preco), quantidade: parseInt(formData.quantidade) }
          : p
      ));
      setSnackbar({
        open: true,
        message: 'Produto atualizado com sucesso!',
        severity: 'success'
      });
    } else {
      // Adicionando novo produto
      const newProduct = {
        ...formData,
        id: Math.max(...products.map(p => p.id)) + 1,
        preco: parseFloat(formData.preco),
        quantidade: parseInt(formData.quantidade)
      };
      setProducts([...products, newProduct]);
      setSnackbar({
        open: true,
        message: 'Produto criado com sucesso!',
        severity: 'success'
      });
    }
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Gestão de Produtos
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          size="large"
        >
          Novo Produto
        </Button>
      </Box>

      <Paper sx={{ height: 600, width: '100%', mb: 2 }}>
        <DataGrid
          rows={products}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
          disableSelectionOnClick
          sx={{
            '& .MuiDataGrid-cell:hover': {
              color: 'primary.main',
            },
          }}
        />
      </Paper>

      {/* Dialog para adicionar/editar produto */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingProduct ? 'Editar Produto' : 'Novo Produto'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Código"
                value={formData.codigo}
                onChange={handleChange('codigo')}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
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
                label="Volume"
                value={formData.volume}
                onChange={handleChange('volume')}
                placeholder="Ex: 500ml, 1L, 2L"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Categoria"
                value={formData.categoria}
                onChange={handleChange('categoria')}
                placeholder="Ex: Água Mineral"
              />
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
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Data de Validade"
                type="date"
                value={formData.dataValidade}
                onChange={handleChange('dataValidade')}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Status"
                select
                value={formData.status}
                onChange={handleChange('status')}
                SelectProps={{ native: true }}
              >
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained">
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
  );
};

export default Products;
