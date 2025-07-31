import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  Autocomplete,
  MenuItem,
  Card,
  CardContent,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingCart as CartIcon
} from '@mui/icons-material';
import { salesService } from '../../services';
import { Product, SaleItem, CreateSalePayload } from '../../types';

interface QuickSaleDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (sale: any) => void;
  products: Product[];
  recentClients?: string[];
}

const QuickSaleDialog: React.FC<QuickSaleDialogProps> = ({
  open,
  onClose,
  onSuccess,
  products,
  recentClients = []
}) => {
  const [cliente, setCliente] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number | ''>('');
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [formaPagamento, setFormaPagamento] = useState('dinheiro');
  const [desconto, setDesconto] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  
  const clienteRef = useRef<HTMLInputElement>(null);
  const productRef = useRef<HTMLInputElement>(null);

  // Auto-focus no cliente quando abrir
  useEffect(() => {
    if (open && clienteRef.current) {
      setTimeout(() => clienteRef.current?.focus(), 100);
    }
  }, [open]);

  const handleReset = () => {
    setCliente('');
    setSelectedProduct(null);
    setQuantity('');
    setSaleItems([]);
    setFormaPagamento('dinheiro');
    setDesconto('');
  };

  const handleAddItem = () => {
    const qty = typeof quantity === 'number' ? quantity : parseInt(quantity.toString()) || 0;
    
    if (!selectedProduct || qty <= 0) return;

    const existingIndex = saleItems.findIndex(item => 
      item.produto === selectedProduct.id
    );

    if (existingIndex >= 0) {
      // Atualizar quantidade
      setSaleItems(prev => prev.map((item, index) =>
        index === existingIndex
          ? { 
            ...item, 
            quantidade: item.quantidade + qty,
            subtotal: (item.quantidade + qty) * item.precoUnitario
          }
          : item
      ));
    } else {
      // Adicionar novo item
      const newItem: SaleItem = {
        produto: selectedProduct.id || '',
        nome: selectedProduct.nome || '',
        quantidade: qty,
        precoUnitario: selectedProduct.preco || 0,
        subtotal: (selectedProduct.preco || 0) * qty,
        product: {
          nome: selectedProduct.nome || '',
          name: selectedProduct.nome || '',
          codigo: selectedProduct.codigo || '',
          id: selectedProduct.id
        }
      };
      setSaleItems(prev => [...prev, newItem]);
    }

    // Reset para próximo produto
    setSelectedProduct(null);
    setQuantity('');
    setTimeout(() => productRef.current?.focus(), 100);
  };

  const handleRemoveItem = (index: number) => {
    setSaleItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleQuantityChange = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(index);
      return;
    }
    
    setSaleItems(prev => prev.map((item, i) =>
      i === index
        ? { 
          ...item, 
          quantidade: newQty,
          subtotal: newQty * item.precoUnitario
        }
        : item
    ));
  };

  const calculateTotal = () => {
    const subtotal = saleItems.reduce((total, item) => total + item.subtotal, 0);
    const descontoValue = typeof desconto === 'number' && desconto > 0 ? desconto : 0;
    return subtotal - descontoValue;
  };

  const handleSubmit = async () => {
    if (!cliente.trim() || saleItems.length === 0) return;

    setLoading(true);
    try {
      const payload: CreateSalePayload = {
        cliente: cliente.trim(),
        formaPagamento,
        desconto: typeof desconto === 'number' && desconto > 0 ? desconto : 0,
        observacoes: '',
        itens: saleItems.map(item => ({
          produto: (typeof item.produto === 'object' && 'id' in item.produto ? 
                   (item.produto.id || item.produto._id) : 
                   item.produto) as string | number,
          quantidade: item.quantidade
        }))
      };

      const newSale = await salesService.create(payload);
      
      // Salvar cliente na lista de recentes
      const recentClients = JSON.parse(localStorage.getItem('recentClients') || '[]');
      const updatedClients = [cliente.trim(), ...recentClients.filter((c: string) => c !== cliente.trim())].slice(0, 10);
      localStorage.setItem('recentClients', JSON.stringify(updatedClients));
      
      if (onSuccess) {
        onSuccess(newSale);
      }
      
      handleReset();
      onClose();
    } catch (error) {
      console.error('Erro ao criar venda:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const qty = typeof quantity === 'number' ? quantity : parseInt(quantity.toString()) || 0;
      if (selectedProduct && qty > 0) {
        handleAddItem();
      } else if (cliente && saleItems.length > 0) {
        handleSubmit();
      }
    }
  };

  // Combinar clientes recentes com alguns padrões
  const clientOptions = [
    ...recentClients,
    'Cliente Balcão',
    'Venda à Vista'
  ].filter((client, index, arr) => arr.indexOf(client) === index);

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: { minHeight: '70vh' }
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={2}>
            <CartIcon color="primary" />
            <Typography variant="h6" fontWeight="bold">
              Venda Rápida
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={2}>
          {/* Cliente */}
          <Grid item xs={12}>
            <Autocomplete
              freeSolo
              value={cliente}
              onChange={(_, newValue) => setCliente(newValue || '')}
              onInputChange={(_, newInputValue) => setCliente(newInputValue)}
              options={clientOptions}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  fullWidth
                  label="Cliente *"
                  placeholder="Digite o nome do cliente..."
                  ref={clienteRef}
                  onKeyPress={handleKeyPress}
                />
              )}
            />
          </Grid>

          {/* Forma de Pagamento */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Forma de Pagamento"
              value={formaPagamento}
              onChange={(e) => setFormaPagamento(e.target.value)}
            >
              <MenuItem value="dinheiro">💵 Dinheiro</MenuItem>
              <MenuItem value="cartao_debito">💳 Cartão Débito</MenuItem>
              <MenuItem value="cartao_credito">💳 Cartão Crédito</MenuItem>
              <MenuItem value="pix">📱 PIX</MenuItem>
              <MenuItem value="transferencia">🏧 Transferência</MenuItem>
            </TextField>
          </Grid>

          {/* Desconto */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Desconto (R$)"
              value={desconto}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                setDesconto(!isNaN(value) && value > 0 ? value : '');
              }}
              inputProps={{ min: 0.01, step: 0.01 }}
              placeholder="0.00"
            />
          </Grid>

          {/* Adicionar Produto */}
          <Grid item xs={7}>
            <Autocomplete
              value={selectedProduct}
              onChange={(_, newValue) => setSelectedProduct(newValue)}
              options={products}
              getOptionLabel={(option) => 
                `${option.nome} - R$ ${option.preco?.toFixed(2) || '0.00'}`
              }
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  label="Produto" 
                  fullWidth 
                  ref={productRef}
                  onKeyPress={handleKeyPress}
                />
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Box>
                    <Typography variant="body1" fontWeight="bold">
                      {option.nome}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {option.codigo && `Código: ${option.codigo} | `}R$ {option.preco?.toFixed(2) || '0.00'}
                    </Typography>
                  </Box>
                </Box>
              )}
              isOptionEqualToValue={(option, value) => 
                (option.id || option._id) === (value.id || value._id)
              }
            />
          </Grid>

          <Grid item xs={3}>
            <TextField
              fullWidth
              type="number"
              label="Quantidade"
              value={quantity}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                setQuantity(!isNaN(value) && value > 0 ? value : '');
              }}
              onKeyPress={handleKeyPress}
              inputProps={{ min: 1, step: 1 }}
              placeholder="1"
            />
          </Grid>

          <Grid item xs={2}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleAddItem}
              disabled={!selectedProduct || (typeof quantity === 'string' || quantity <= 0)}
              sx={{ height: '56px' }}
            >
              <AddIcon />
            </Button>
          </Grid>

          {/* Lista de Produtos */}
          {saleItems.length > 0 && (
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent sx={{ p: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Produtos ({saleItems.length})
                  </Typography>
                  <List dense>
                    {saleItems.map((item, index) => (
                      <ListItem key={index} divider={index < saleItems.length - 1}>
                        <ListItemText
                          primary={
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                              <Typography variant="body2" fontWeight="bold">
                                {item.nome}
                              </Typography>
                              <Typography variant="body2" color="success.main" fontWeight="bold">
                                R$ {item.subtotal.toFixed(2)}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Box display="flex" alignItems="center" gap={1}>
                              <IconButton
                                size="small"
                                onClick={() => handleQuantityChange(index, item.quantidade - 1)}
                              >
                                <RemoveIcon fontSize="small" />
                              </IconButton>
                              <Typography variant="body2">
                                {item.quantidade}
                              </Typography>
                              <IconButton
                                size="small"
                                onClick={() => handleQuantityChange(index, item.quantidade + 1)}
                              >
                                <AddIcon fontSize="small" />
                              </IconButton>
                              <Typography variant="body2" color="text.secondary">
                                × R$ {item.precoUnitario.toFixed(2)}
                              </Typography>
                            </Box>
                          }
                        />
                        <ListItemSecondaryAction>
                          <IconButton 
                            edge="end" 
                            onClick={() => handleRemoveItem(index)}
                            size="small"
                            color="error"
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Total */}
          {saleItems.length > 0 && (
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body1">Subtotal:</Typography>
                    <Typography variant="body1">
                      R$ {saleItems.reduce((total, item) => total + item.subtotal, 0).toFixed(2)}
                    </Typography>
                  </Box>
                  {typeof desconto === 'number' && desconto > 0 && (
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body1">Desconto:</Typography>
                      <Typography variant="body1" color="error">
                        - R$ {desconto.toFixed(2)}
                      </Typography>
                    </Box>
                  )}
                  <Box 
                    display="flex" 
                    justifyContent="space-between" 
                    alignItems="center" 
                    pt={1}
                    sx={{ borderTop: 1, borderColor: 'divider' }}
                  >
                    <Typography variant="h6" fontWeight="bold">
                      TOTAL:
                    </Typography>
                    <Typography variant="h5" fontWeight="bold" color="success.main">
                      R$ {calculateTotal().toFixed(2)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!cliente.trim() || saleItems.length === 0 || loading}
          size="large"
          sx={{ minWidth: 120 }}
        >
          {loading ? 'Finalizando...' : `Finalizar - R$ ${calculateTotal().toFixed(2)}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuickSaleDialog;
