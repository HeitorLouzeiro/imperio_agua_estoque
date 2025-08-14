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
  ListItemSecondaryAction,
  InputAdornment,
  useTheme,
  useMediaQuery
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
  onError?: (message: string) => void;
  products: Product[];
  recentClients?: string[];
}

const QuickSaleDialog: React.FC<QuickSaleDialogProps> = ({
  open,
  onClose,
  onSuccess,
  onError,
  products,
  recentClients = []
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [cliente, setCliente] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number | ''>('');
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [formaPagamento, setFormaPagamento] = useState('dinheiro');
  const [desconto, setDesconto] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [barcode, setBarcode] = useState('');
  
  const clienteRef = useRef<HTMLInputElement>(null);
  const productRef = useRef<HTMLInputElement>(null);
  const barcodeRef = useRef<HTMLInputElement>(null);

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
    setBarcode('');
  };

  const handleBarcodeSearch = () => {
    if (!barcode.trim()) return;
    
    const product = products.find(p => p.codigo === barcode.trim());
    if (product) {
      setSelectedProduct(product);
      setQuantity(1);
      setBarcode('');
      // Focar no campo de quantidade após encontrar o produto
      setTimeout(() => {
        const qtyInput = document.querySelector('input[name="quantity"]') as HTMLInputElement;
        qtyInput?.focus();
        qtyInput?.select();
      }, 100);
    } else {
      if (onError) {
        onError(`❌ Produto não encontrado com código: ${barcode}`);
      }
      setBarcode('');
    }
  };

  const handleBarcodeKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleBarcodeSearch();
    }
  };

  const handleAddItem = () => {
    const qty = typeof quantity === 'number' ? quantity : parseInt(quantity.toString()) || 0;
    
    if (!selectedProduct || qty <= 0) return;

    // Verificar estoque disponível
    const estoqueDisponivel = selectedProduct.quantidade || 0;
    const estoqueJaUsado = saleItems
      .filter(item => item.produto === selectedProduct.id)
      .reduce((total, item) => total + item.quantidade, 0);
    const estoqueRestante = estoqueDisponivel - estoqueJaUsado;

    if (qty > estoqueRestante) {
      if (onError) {
        if (estoqueRestante === 0) {
          onError(`❌ ${selectedProduct.nome} - Sem estoque disponível`);
        } else {
          onError(`❌ ${selectedProduct.nome} - Estoque insuficiente. Disponível: ${estoqueRestante}, solicitado: ${qty}`);
        }
      }
      return;
    }

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
    setTimeout(() => barcodeRef.current?.focus(), 100); // Focar no código de barras para agilizar
  };

  const handleRemoveItem = (index: number) => {
    setSaleItems(prev => {
      const newItems = prev.filter((_, i) => i !== index);
      // Se não há mais produtos, limpar o desconto
      if (newItems.length === 0) {
        setDesconto('');
      }
      return newItems;
    });
  };

  const handleQuantityChange = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(index);
      return;
    }

    const item = saleItems[index];
    // Encontrar o produto correspondente para verificar estoque
    const product = products.find(p => p.id === item.produto || p._id === item.produto);
    
    if (product) {
      // Calcular estoque total já usado por outros itens do mesmo produto
      const outrosItens = saleItems.filter((saleItem, i) => 
        i !== index && (saleItem.produto === product.id || saleItem.produto === product._id)
      );
      const estoqueUsadoOutros = outrosItens.reduce((total, saleItem) => total + saleItem.quantidade, 0);
      const estoqueDisponivel = (product.quantidade || 0) - estoqueUsadoOutros;

      // Verificar se a nova quantidade não excede o estoque disponível
      if (newQty > estoqueDisponivel) {
        if (onError) {
          if (estoqueDisponivel === 0) {
            onError(`❌ ${product.nome} - Sem estoque disponível`);
          } else {
            onError(`❌ ${product.nome} - Estoque insuficiente. Disponível: ${estoqueDisponivel}, solicitado: ${newQty}`);
          }
        }
        return;
      }
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
    
    // Verificar se o desconto ainda é válido após a mudança de quantidade
    if (typeof desconto === 'number' && desconto > 0) {
      const newSubtotal = saleItems.reduce((total, item, i) => {
        if (i === index) {
          return total + (newQty * item.precoUnitario);
        }
        return total + item.subtotal;
      }, 0);
      
      // Se o desconto for maior que o novo subtotal, ajustar
      if (desconto > newSubtotal) {
        setDesconto(newSubtotal);
      }
    }
  };

  const calculateTotal = () => {
    const subtotal = saleItems.reduce((total, item) => total + item.subtotal, 0);
    const descontoValue = typeof desconto === 'number' && desconto > 0 ? desconto : 0;
    const total = subtotal - descontoValue;
    
    // Garantir que o total nunca seja negativo
    return Math.max(0, total);
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
    } catch (error: any) {
      console.error('Erro ao criar venda:', error);
      
      // Tratamento específico para erro de estoque
      if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.erro || error.response?.data?.message;
        
        if (errorMessage?.includes('Estoque insuficiente')) {
          // Extrair informações do erro para mostrar ao usuário
          if (onError) {
            onError(`⚠️ ${errorMessage}`);
          }
        } else if (errorMessage?.includes('não encontrado')) {
          if (onError) {
            onError('❌ Produto não encontrado ou inativo');
          }
        } else {
          if (onError) {
            onError(`❌ ${errorMessage || 'Erro ao processar venda'}`);
          }
        }
      } else {
        if (onError) {
          onError('❌ Erro interno do servidor. Tente novamente.');
        }
      }
      
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
      maxWidth={isMobile ? false : "sm"}
      fullWidth={!isMobile}
      fullScreen={isMobile}
      PaperProps={{
        sx: { 
          ...(isMobile ? {
            margin: 0,
            width: '100%',
            height: '100%',
            maxHeight: '100%',
            borderRadius: 0
          } : {
            minHeight: '70vh',
            maxHeight: '90vh'
          })
        }
      }}
    >
      <DialogTitle sx={{ pb: isMobile ? 1 : 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={isMobile ? 1 : 2}>
            <CartIcon color="primary" fontSize={isMobile ? "medium" : "large"} />
            <Typography variant={isMobile ? "h6" : "h5"} fontWeight="bold">
              Venda Rápida
            </Typography>
          </Box>
          <IconButton onClick={onClose} size={isMobile ? "medium" : "large"}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: isMobile ? 2 : 3 }}>
        <Grid container spacing={isMobile ? 1.5 : 2}>
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
              size={isMobile ? "small" : "medium"}
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
              disabled={saleItems.length === 0}
              size={isMobile ? "small" : "medium"}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                const subtotal = saleItems.reduce((total, item) => total + item.subtotal, 0);
                
                if (!isNaN(value) && value > 0) {
                  // Validar se o desconto não é maior que o subtotal
                  if (value > subtotal) {
                    setDesconto(subtotal);
                  } else {
                    setDesconto(value);
                  }
                } else {
                  setDesconto('');
                }
              }}
              inputProps={{ 
                min: 0.01, 
                step: 0.01,
                max: saleItems.reduce((total, item) => total + item.subtotal, 0)
              }}
              placeholder="0.00"
              helperText={
                saleItems.length === 0 
                  ? 'Adicione produtos para aplicar desconto' 
                  : `Máximo: R$ ${saleItems.reduce((total, item) => total + item.subtotal, 0).toFixed(2)}`
              }
            />
          </Grid>

          {/* Código de Barras */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="🔍 Código de Barras"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              onKeyPress={handleBarcodeKeyPress}
              placeholder="Escaneie ou digite o código de barras..."
              ref={barcodeRef}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton 
                      onClick={handleBarcodeSearch}
                      disabled={!barcode.trim()}
                      size="small"
                    >
                      🔍
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{ mb: 1 }}
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
                  label="Produto (ou use código de barras acima)" 
                  fullWidth 
                  ref={productRef}
                  onKeyPress={handleKeyPress}
                />
              )}
              renderOption={(props, option) => {
                const estoqueUsado = saleItems
                  .filter(item => item.produto === option.id)
                  .reduce((total, item) => total + item.quantidade, 0);
                const estoqueDisponivel = (option.quantidade || 0) - estoqueUsado;
                const temEstoque = estoqueDisponivel > 0;

                return (
                  <Box component="li" {...props} sx={{ 
                    opacity: temEstoque ? 1 : 0.5,
                    background: !temEstoque ? '#ffebee' : 'inherit'
                  }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1" fontWeight="bold">
                        {option.nome} {!temEstoque && '(SEM ESTOQUE)'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {option.codigo && `Código: ${option.codigo} | `}
                        R$ {option.preco?.toFixed(2) || '0.00'} | 
                        Estoque: {estoqueDisponivel}/{option.quantidade || 0}
                      </Typography>
                    </Box>
                  </Box>
                );
              }}
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
                    {saleItems.map((item, index) => {
                      // Calcular estoque disponível para este produto
                      const product = products.find(p => p.id === item.produto || p._id === item.produto);
                      const outrosItens = saleItems.filter((saleItem, i) => 
                        i !== index && (saleItem.produto === product?.id || saleItem.produto === product?._id)
                      );
                      const estoqueUsadoOutros = outrosItens.reduce((total, saleItem) => total + saleItem.quantidade, 0);
                      const estoqueDisponivel = (product?.quantidade || 0) - estoqueUsadoOutros;
                      const podeAumentar = item.quantidade < estoqueDisponivel;

                      return (
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
                                  disabled={!podeAumentar}
                                  title={!podeAumentar ? 'Estoque insuficiente' : 'Aumentar quantidade'}
                                >
                                  <AddIcon fontSize="small" />
                                </IconButton>
                                <Typography variant="body2" color="text.secondary">
                                  × R$ {item.precoUnitario.toFixed(2)}
                                </Typography>
                                {!podeAumentar && (
                                  <Typography variant="caption" color="warning.main" sx={{ ml: 1 }}>
                                    (Estoque máx.)
                                  </Typography>
                                )}
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
                      );
                    })}
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

      <DialogActions sx={{ 
        p: isMobile ? 1 : 2,
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? 1 : 0
      }}>
        <Button 
          onClick={onClose} 
          disabled={loading}
          fullWidth={isMobile}
          size={isMobile ? "large" : "medium"}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!cliente.trim() || saleItems.length === 0 || loading}
          size="large"
          fullWidth={isMobile}
          sx={{ 
            minWidth: isMobile ? 'auto' : 120,
            fontSize: isMobile ? '1rem' : '0.875rem'
          }}
        >
          {loading ? 'Finalizando...' : `Finalizar - R$ ${calculateTotal().toFixed(2)}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuickSaleDialog;
