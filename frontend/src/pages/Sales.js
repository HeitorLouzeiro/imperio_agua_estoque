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
  Autocomplete,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Tooltip,
} from '@mui/material';
import { DataGrid, GridSearchIcon } from '@mui/x-data-grid';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Print as PrintIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { salesService, productService } from '../services';
import Layout from '../components/common/Layout';

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Dados para nova venda
  const [saleData, setSaleData] = useState({
    cliente: '',
    data: new Date(),
    observacoes: '',
    formaPagamento: 'dinheiro',
    desconto: 0,
  });
  const [saleItems, setSaleItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadSales();
    loadProducts();
  }, []);

  // Carregar vendas da API
  const loadSales = async () => {
    try {
      setLoading(true);
      const response = await salesService.getAll();
      const salesWithId = response.map(sale => ({
        ...sale,
        id: sale._id || sale.id,
      }));
      setSales(salesWithId);
    } catch (error) {
      showSnackbar('Erro ao carregar vendas', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Carregar produtos da API
  const loadProducts = async () => {
    try {
      const response = await productService.getAll();
      const productsWithId = response.map(prod => ({
        ...prod,
        id: prod._id || prod.id,
      }));
      setProducts(productsWithId);
    } catch (error) {
      showSnackbar('Erro ao carregar produtos', 'error');
    }
  };

  // Mostrar Snackbar
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Abrir modal nova venda
  const handleNewSale = () => {
    setSaleData({
      cliente: '',
      data: new Date(),
      observacoes: '',
      formaPagamento: 'dinheiro',
      desconto: 0,
    });
    setSaleItems([]);
    setSelectedProduct(null);
    setQuantity(1);
    setOpen(true);
  };

  // Adicionar item na venda
  const handleAddItem = () => {
    if (!selectedProduct || quantity <= 0) {
      showSnackbar('Selecione um produto e defina quantidade válida', 'error');
      return;
    }

    const existingIndex = saleItems.findIndex(item => item.produto === selectedProduct.id);

    if (existingIndex >= 0) {
      const updated = [...saleItems];
      updated[existingIndex].quantidade += quantity;
      updated[existingIndex].subtotal = updated[existingIndex].quantidade * updated[existingIndex].precoUnitario;
      setSaleItems(updated);
    } else {
      setSaleItems([
        ...saleItems,
        {
          produto: selectedProduct.id,
          nome: selectedProduct.nome,
          quantidade: quantity,
          precoUnitario: selectedProduct.preco,
          subtotal: selectedProduct.preco * quantity,
        },
      ]);
    }

    setSelectedProduct(null);
    setQuantity(1);
  };

  // Remover item da venda
  const handleRemoveItem = (index) => {
    setSaleItems(saleItems.filter((_, i) => i !== index));
  };

  // Calcular total da venda
  const calculateSubtotal = () => {
    return saleItems.reduce((acc, item) => acc + item.subtotal, 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() - (saleData.desconto || 0);
  };

  // Salvar venda na API
  const handleSaveSale = async () => {
    if (!saleData.cliente) {
      showSnackbar('Informe o nome do cliente', 'error');
      return;
    }
    if (saleItems.length === 0) {
      showSnackbar('Adicione pelo menos um produto', 'error');
      return;
    }
    try {
      const payload = {
        cliente: saleData.cliente,
        formaPagamento: saleData.formaPagamento,
        desconto: saleData.desconto,
        observacoes: saleData.observacoes,
        itens: saleItems.map(item => ({
          produto: item.produto,            // ID do produto
          quantidade: item.quantidade,
          precoUnitario: item.precoUnitario,
          subtotal: item.subtotal           // quantidade * precoUnitario
        }))
      };


      await salesService.create(payload);
      showSnackbar('Venda registrada com sucesso!', 'success');
      setOpen(false);
      loadSales();
    } catch (error) {
      console.error('Erro ao criar venda:', error.response?.data || error.message);
      showSnackbar('Erro ao criar venda', 'error');
    }
  };

  // Colunas para DataGrid
  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'cliente', headerName: 'Cliente', width: 200 },
    {
      field: 'dataVenda',
      headerName: 'Data',
      width: 130,
      valueGetter: (params) => params.row.dataVenda || params.row.data,
      renderCell: (params) => {
        const date = params.value ? new Date(params.value) : null;
        return date ? date.toLocaleDateString('pt-BR') : '';
      },
    },
    {
      field: 'total',
      headerName: 'Total',
      width: 130,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="bold" color="success.main">
          R$ {params.value?.toFixed(2)}
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.value || 'paga'}
          color={params.value === 'paga' ? 'success' : 'warning'}
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 140,
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
          {/* Implemente exclusão se quiser */}
        </Box>
      ),
    },
  ];

  return (
    <Layout>
      <Box>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Vendas
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Gerencie as vendas e faturamento da empresa
            </Typography>
          </Box>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleNewSale} sx={{ borderRadius: 2 }}>
            Nova Venda
          </Button>
        </Box>

        {/* Tabela de vendas */}
        <Paper sx={{ height: 440, width: '100%', mb: 3 }}>
          <DataGrid
            rows={sales}
            columns={columns}
            loading={loading}
            pageSize={8}
            rowsPerPageOptions={[8, 16]}
            disableSelectionOnClick
            getRowId={(row) => row.id}
          />
        </Paper>

        {/* Modal de nova venda */}
        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Nova Venda</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Cliente"
                  fullWidth
                  value={saleData.cliente}
                  onChange={(e) => setSaleData({ ...saleData, cliente: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Data da Venda"
                  value={saleData.data}
                  onChange={(newValue) => setSaleData({ ...saleData, data: newValue })}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  options={products}
                  getOptionLabel={(option) => option.nome}
                  value={selectedProduct}
                  onChange={(event, newValue) => setSelectedProduct(newValue)}
                  renderInput={(params) => <TextField {...params} label="Produto" fullWidth />}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                />
              </Grid>
              <Grid item xs={6} md={2}>
                <TextField
                  label="Quantidade"
                  type="number"
                  fullWidth
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  inputProps={{ min: 1 }}
                />
              </Grid>
              <Grid item xs={6} md={2} display="flex" alignItems="center">
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleAddItem}
                  disabled={!selectedProduct || quantity < 1}
                >
                  Adicionar
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                {saleItems.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" align="center">
                    Nenhum produto adicionado
                  </Typography>
                ) : (
                  <List>
                    {saleItems.map((item, index) => (
                      <ListItem key={index} divider>
                        <ListItemText
                          primary={`${item.nome} - Quantidade: ${item.quantidade}`}
                          secondary={`Preço Unitário: R$ ${item.precoUnitario.toFixed(2)} | Subtotal: R$ ${item.subtotal.toFixed(2)}`}
                        />
                        <ListItemSecondaryAction>
                          <IconButton edge="end" color="error" onClick={() => handleRemoveItem(index)}>
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                )}
                {saleItems.length > 0 && (
                  <Box sx={{ mt: 1, textAlign: 'right' }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Subtotal: R$ {calculateSubtotal().toFixed(2)}
                    </Typography>
                    <TextField
                      label="Desconto"
                      type="number"
                      size="small"
                      sx={{ mt: 1, width: 150 }}
                      value={saleData.desconto}
                      onChange={(e) => setSaleData({ ...saleData, desconto: Number(e.target.value) || 0 })}
                      inputProps={{ min: 0 }}
                    />
                    <Typography variant="h6" fontWeight="bold" sx={{ mt: 1 }}>
                      Total: R$ {calculateTotal().toFixed(2)}
                    </Typography>
                  </Box>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Forma de Pagamento"
                  select
                  fullWidth
                  value={saleData.formaPagamento}
                  onChange={(e) => setSaleData({ ...saleData, formaPagamento: e.target.value })}
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="dinheiro">Dinheiro</option>
                  <option value="cartao_debito">Cartão Débito</option>
                  <option value="cartao_credito">Cartão Crédito</option>
                  <option value="pix">Pix</option>
                  <option value="transferencia">Transferência</option>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Observações"
                  fullWidth
                  multiline
                  minRows={2}
                  value={saleData.observacoes}
                  onChange={(e) => setSaleData({ ...saleData, observacoes: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancelar</Button>
            <Button variant="contained" onClick={handleSaveSale}>
              Salvar
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
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
