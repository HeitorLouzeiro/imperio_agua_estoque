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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Autocomplete,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  ShoppingCart as CartIcon,
  Receipt as ReceiptIcon,
  Remove as RemoveIcon,
  AttachMoney as MoneyIcon,
  Print as PrintIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { salesService, productService } from '../services';
import Layout from '../components/common/Layout';
import DailyRevenueReport from '../components/reports/DailyRevenueReport';

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingSale, setEditingSale] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Estados para nova venda
  const [saleData, setSaleData] = useState({
    cliente: '',
    data: new Date(),
    observacoes: '',
  });
  const [saleItems, setSaleItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadSales();
    loadProducts();
  }, []);

  const loadSales = async () => {
    try {
      setLoading(true);
      // Simulando dados até a API estar pronta
      const mockSales = [
        {
          id: 1,
          cliente: 'João Silva',
          data: '2024-01-15',
          total: 125.50,
          status: 'finalizada',
          itens: [
            { produto: 'Água Crystal 500ml', quantidade: 50, preco: 2.50 },
          ],
        },
        {
          id: 2,
          cliente: 'Maria Santos',
          data: '2024-01-14',
          total: 89.90,
          status: 'finalizada',
          itens: [
            { produto: 'Água Pura 1L', quantidade: 20, preco: 4.00 },
            { produto: 'Água Crystal 500ml', quantidade: 4, preco: 2.50 },
          ],
        },
        {
          id: 3,
          cliente: 'Pedro Costa',
          data: '2024-01-14',
          total: 234.70,
          status: 'pendente',
          itens: [
            { produto: 'Galão 20L Premium', quantidade: 15, preco: 15.00 },
            { produto: 'Água com Gás 500ml', quantidade: 3, preco: 3.00 },
          ],
        },
      ];
      setSales(mockSales);
    } catch (error) {
      showSnackbar('Erro ao carregar vendas', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const mockProducts = [
        { id: 1, nome: 'Água Crystal 500ml', preco: 2.50, quantidade: 150 },
        { id: 2, nome: 'Água Pura 1L', preco: 4.00, quantidade: 80 },
        { id: 3, nome: 'Galão 20L Premium', preco: 15.00, quantidade: 25 },
        { id: 4, nome: 'Água com Gás 500ml', preco: 3.00, quantidade: 45 },
      ];
      setProducts(mockProducts);
    } catch (error) {
      showSnackbar('Erro ao carregar produtos', 'error');
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleNewSale = () => {
    setEditingSale(null);
    setSaleData({
      cliente: '',
      data: new Date(),
      observacoes: '',
    });
    setSaleItems([]);
    setSelectedProduct(null);
    setQuantity(1);
    setOpen(true);
  };

  const handleAddItem = () => {
    if (!selectedProduct || quantity <= 0) return;
    
    const existingItemIndex = saleItems.findIndex(item => item.produto === selectedProduct.nome);
    
    if (existingItemIndex >= 0) {
      const updatedItems = [...saleItems];
      updatedItems[existingItemIndex].quantidade += quantity;
      setSaleItems(updatedItems);
    } else {
      setSaleItems([
        ...saleItems,
        {
          produto: selectedProduct.nome,
          quantidade: quantity,
          preco: selectedProduct.preco,
          total: selectedProduct.preco * quantity,
        },
      ]);
    }
    
    setSelectedProduct(null);
    setQuantity(1);
  };

  const handleRemoveItem = (index) => {
    setSaleItems(saleItems.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return saleItems.reduce((sum, item) => sum + item.total, 0);
  };

  const handleSaveSale = async () => {
    if (!saleData.cliente || saleItems.length === 0) {
      showSnackbar('Preencha todos os campos obrigatórios', 'error');
      return;
    }

    try {
      const newSale = {
        id: Math.max(...sales.map(s => s.id)) + 1,
        ...saleData,
        data: saleData.data.toISOString().split('T')[0],
        itens: saleItems,
        total: calculateTotal(),
        status: 'finalizada',
      };

      setSales([newSale, ...sales]);
      showSnackbar('Venda registrada com sucesso!');
      setOpen(false);
    } catch (error) {
      showSnackbar('Erro ao registrar venda', 'error');
    }
  };

  const handleDeleteSale = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta venda?')) {
      try {
        setSales(sales.filter(s => s.id !== id));
        showSnackbar('Venda excluída com sucesso!');
      } catch (error) {
        showSnackbar('Erro ao excluir venda', 'error');
      }
    }
  };

  const filteredSales = sales.filter(sale => {
    const matchesSearch = sale.cliente.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !dateFilter || sale.data === dateFilter.toISOString().split('T')[0];
    return matchesSearch && matchesDate;
  });

  const columns = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'cliente', headerName: 'Cliente', width: 200 },
    { 
      field: 'data', 
      headerName: 'Data', 
      width: 120,
      renderCell: (params) => new Date(params.value).toLocaleDateString('pt-BR'),
    },
    {
      field: 'total',
      headerName: 'Total',
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="bold" color="success.main">
          R$ {params.value?.toFixed(2)}
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === 'finalizada' ? 'success' : 'warning'}
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
        <Box>
          <Tooltip title="Ver Detalhes">
            <IconButton size="small">
              <ViewIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Imprimir">
            <IconButton size="small">
              <PrintIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Excluir">
            <IconButton 
              size="small" 
              color="error" 
              onClick={() => handleDeleteSale(params.row.id)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
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
              Vendas
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Gerencie as vendas e faturamento da empresa
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNewSale}
            sx={{ borderRadius: 2 }}
          >
            Nova Venda
          </Button>
        </Box>

        {/* Filtros */}
        <Card sx={{ mb: 3, borderRadius: 3 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={5}>
                <TextField
                  fullWidth
                  placeholder="Buscar por cliente..."
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
                <DatePicker
                  label="Filtrar por data"
                  value={dateFilter}
                  onChange={setDateFilter}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => {
                    setSearchTerm('');
                    setDateFilter(null);
                  }}
                >
                  Limpar Filtros
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Estatísticas Rápidas */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center', py: 2 }}>
              <CardContent>
                <Typography variant="h4" color="primary" fontWeight="bold">
                  {sales.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total de Vendas
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center', py: 2 }}>
              <CardContent>
                <Typography variant="h4" color="success.main" fontWeight="bold">
                  R$ {sales.reduce((sum, sale) => sum + sale.total, 0).toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Faturamento Total
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center', py: 2 }}>
              <CardContent>
                <Typography variant="h4" color="warning.main" fontWeight="bold">
                  {sales.filter(s => s.status === 'pendente').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Vendas Pendentes
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center', py: 2 }}>
              <CardContent>
                <Typography variant="h4" color="info.main" fontWeight="bold">
                  R$ {(sales.reduce((sum, sale) => sum + sale.total, 0) / sales.length || 0).toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ticket Médio
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tabela de Vendas */}
        <Paper sx={{ height: 500, borderRadius: 3 }}>
          <DataGrid
            rows={filteredSales}
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

        {/* Relatório de Rendimento Diário */}
        <DailyRevenueReport onRefresh={loadSales} />

        {/* Dialog para nova venda */}
        <Dialog 
          open={open} 
          onClose={() => setOpen(false)} 
          maxWidth="lg" 
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CartIcon />
              Nova Venda
            </Box>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              {/* Dados da Venda */}
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Dados da Venda
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Nome do Cliente"
                        value={saleData.cliente}
                        onChange={(e) => setSaleData({ ...saleData, cliente: e.target.value })}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <DatePicker
                        label="Data da Venda"
                        value={saleData.data}
                        onChange={(date) => setSaleData({ ...saleData, data: date })}
                        slotProps={{ textField: { fullWidth: true } }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Observações"
                        value={saleData.observacoes}
                        onChange={(e) => setSaleData({ ...saleData, observacoes: e.target.value })}
                        multiline
                        rows={3}
                      />
                    </Grid>
                  </Grid>
                </Card>
              </Grid>

              {/* Adicionar Produtos */}
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Adicionar Produto
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Autocomplete
                        options={products}
                        getOptionLabel={(option) => `${option.nome} - R$ ${option.preco.toFixed(2)}`}
                        value={selectedProduct}
                        onChange={(_, newValue) => setSelectedProduct(newValue)}
                        renderInput={(params) => (
                          <TextField {...params} label="Produto" fullWidth />
                        )}
                      />
                    </Grid>
                    <Grid item xs={8}>
                      <TextField
                        fullWidth
                        label="Quantidade"
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                        inputProps={{ min: 1 }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={handleAddItem}
                        disabled={!selectedProduct}
                        sx={{ height: '56px' }}
                      >
                        Adicionar
                      </Button>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>

              {/* Lista de Itens */}
              <Grid item xs={12}>
                <Card sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Itens da Venda
                  </Typography>
                  {saleItems.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                      Nenhum item adicionado
                    </Typography>
                  ) : (
                    <>
                      <List>
                        {saleItems.map((item, index) => (
                          <ListItem key={index} divider>
                            <ListItemText
                              primary={item.produto}
                              secondary={`${item.quantidade}x R$ ${item.preco.toFixed(2)}`}
                            />
                            <ListItemSecondaryAction>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body2" fontWeight="bold">
                                  R$ {item.total.toFixed(2)}
                                </Typography>
                                <IconButton 
                                  size="small" 
                                  color="error"
                                  onClick={() => handleRemoveItem(index)}
                                >
                                  <RemoveIcon />
                                </IconButton>
                              </Box>
                            </ListItemSecondaryAction>
                          </ListItem>
                        ))}
                      </List>
                      <Divider sx={{ my: 2 }} />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6">
                          Total:
                        </Typography>
                        <Typography variant="h5" color="success.main" fontWeight="bold">
                          R$ {calculateTotal().toFixed(2)}
                        </Typography>
                      </Box>
                    </>
                  )}
                </Card>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSaveSale} 
              variant="contained"
              disabled={!saleData.cliente || saleItems.length === 0}
            >
              Finalizar Venda
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
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

export default Sales;
