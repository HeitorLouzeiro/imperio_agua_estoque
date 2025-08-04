import React, { useState } from 'react';
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
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Autocomplete,
  MenuItem,
  Card,
  CardContent,
  Chip,
  InputAdornment
} from '@mui/material';
import { 
  Delete as DeleteIcon, 
  Close as CloseIcon, 
  Add as AddIcon,
  Person as PersonIcon,
  ShoppingCart as ShoppingCartIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Product, SaleFormData, SaleItem } from '../../types';

interface SaleFormDialogProps {
  open: boolean;
  onClose: () => void;
  saleData: SaleFormData;
  setSaleData: (data: SaleFormData) => void;
  saleItems: SaleItem[];
  products: Product[];
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  quantity: number | string;
  setQuantity: (quantity: number | string) => void;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  onSubmit: () => void;
  calculateTotal: () => number;
  loading?: boolean;
  recentClients?: string[];
}

const SaleFormDialog: React.FC<SaleFormDialogProps> = ({
  open,
  onClose,
  saleData,
  setSaleData,
  saleItems,
  products,
  selectedProduct,
  setSelectedProduct,
  quantity,
  setQuantity,
  onAddItem,
  onRemoveItem,
  onSubmit,
  calculateTotal,
  loading = false,
  recentClients = []
}) => {
  const [clientesSugeridos] = useState<string[]>([
    'João Silva',
    'Maria Santos',
    'Pedro Oliveira',
    'Ana Costa',
    'Carlos Ferreira'
  ]);
  const [currentStep, setCurrentStep] = useState<'dados' | 'produtos' | 'resumo'>('dados');
  const [produtoFiltrado, setProdutoFiltrado] = useState<string>('');

  // Combinar clientes recentes com sugeridos
  const allClients = [...recentClients, ...clientesSugeridos].filter((client, index, arr) => 
    arr.indexOf(client) === index
  );

  const handleInputChange = (field: keyof SaleFormData, value: any) => {
    setSaleData({ ...saleData, [field]: value });
  };

  const nextStep = () => {
    if (currentStep === 'dados' && saleData.cliente.trim()) {
      setCurrentStep('produtos');
    } else if (currentStep === 'produtos' && saleItems.length > 0) {
      setCurrentStep('resumo');
    }
  };

  const prevStep = () => {
    if (currentStep === 'resumo') {
      setCurrentStep('produtos');
    } else if (currentStep === 'produtos') {
      setCurrentStep('dados');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const qty = typeof quantity === 'number' ? quantity : parseInt(quantity.toString()) || 0;
      if (selectedProduct && qty > 0) {
        onAddItem();
      }
    }
  };

  const produtosFiltrados = products.filter(product =>
    !produtoFiltrado || 
    product.nome?.toLowerCase().includes(produtoFiltrado.toLowerCase()) ||
    product.codigo?.toLowerCase().includes(produtoFiltrado.toLowerCase()) ||
    product.marca?.toLowerCase().includes(produtoFiltrado.toLowerCase())
  );

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { minHeight: '80vh' }
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h5" fontWeight="bold">
              Nova Venda
            </Typography>
            <Box display="flex" gap={1} mt={1}>
              <Chip 
                label="1. Dados" 
                color={currentStep === 'dados' ? 'primary' : 'default'}
                size="small"
              />
              <Chip 
                label="2. Produtos" 
                color={currentStep === 'produtos' ? 'primary' : 'default'}
                size="small"
                disabled={!saleData.cliente.trim()}
              />
              <Chip 
                label="3. Resumo" 
                color={currentStep === 'resumo' ? 'primary' : 'default'}
                size="small"
                disabled={saleItems.length === 0}
              />
            </Box>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {/* Etapa 1: Dados da Venda */}
        {currentStep === 'dados' && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card sx={{ mb: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <PersonIcon />
                    <Typography variant="h6">
                      Informações do Cliente
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12}>
              <Autocomplete
                freeSolo
                value={saleData.cliente}
                onChange={(_, newValue) => handleInputChange('cliente', newValue || '')}
                onInputChange={(_, newInputValue) => handleInputChange('cliente', newInputValue)}
                options={allClients}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    fullWidth
                    label="Nome do Cliente *"
                    placeholder="Digite o nome do cliente..."
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon />
                        </InputAdornment>
                      )
                    }}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Data da Venda"
                value={saleData.data}
                onChange={(value) => handleInputChange('data', value)}
                slotProps={{
                  textField: {
                    fullWidth: true
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Forma de Pagamento"
                value={saleData.formaPagamento}
                onChange={(e) => handleInputChange('formaPagamento', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MoneyIcon />
                    </InputAdornment>
                  )
                }}
              >
                <MenuItem value="dinheiro">💵 Dinheiro</MenuItem>
                <MenuItem value="cartao_debito">💳 Cartão Débito</MenuItem>
                <MenuItem value="cartao_credito">💳 Cartão Crédito</MenuItem>
                <MenuItem value="pix">📱 PIX</MenuItem>
                <MenuItem value="transferencia">🏧 Transferência</MenuItem>
              </TextField>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Observações (opcional)"
                value={saleData.observacoes}
                onChange={(e) => handleInputChange('observacoes', e.target.value)}
                placeholder="Informações adicionais sobre a venda..."
              />
            </Grid>
          </Grid>
        )}

        {/* Etapa 2: Adicionar Produtos */}
        {currentStep === 'produtos' && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card sx={{ mb: 2, background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <ShoppingCartIcon />
                    <Typography variant="h6">
                      Adicionar Produtos à Venda
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Buscar Produto"
                value={produtoFiltrado}
                onChange={(e) => setProdutoFiltrado(e.target.value)}
                placeholder="Nome, código ou marca..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ShoppingCartIcon />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Autocomplete
                value={selectedProduct}
                onChange={(_, newValue) => setSelectedProduct(newValue)}
                options={produtosFiltrados}
                getOptionLabel={(option) => 
                  `${option.nome || option.name} - R$ ${option.preco?.toFixed(2) || '0.00'}`
                }
                renderInput={(params) => (
                  <TextField {...params} label="Selecionar Produto" fullWidth />
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <Box>
                      <Typography variant="body1" fontWeight="bold">
                        {option.nome || option.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Código: {option.codigo || 'S/C'} | R$ {option.preco?.toFixed(2) || '0.00'}
                      </Typography>
                    </Box>
                  </Box>
                )}
                isOptionEqualToValue={(option, value) => 
                  (option.id || option._id) === (value.id || value._id)
                }
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                label="Quantidade"
                value={quantity || ''}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  setQuantity(!isNaN(value) && value > 0 ? value : '');
                }}
                onKeyPress={handleKeyPress}
                inputProps={{ min: 1 }}
                placeholder="1"
              />
            </Grid>
            
            <Grid item xs={12} sm={2}>
              <Button
                fullWidth
                variant="contained"
                onClick={onAddItem}
                disabled={!selectedProduct || (typeof quantity === 'string' || quantity <= 0)}
                startIcon={<AddIcon />}
                sx={{ height: '56px' }}
              >
                Adicionar
              </Button>
            </Grid>

            {/* Produtos Adicionados */}
            {saleItems.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Produtos na Venda ({saleItems.length})
                </Typography>
                <List>
                  {saleItems.map((item, index) => (
                    <ListItem key={index} divider>
                      <ListItemText
                        primary={
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="body1" fontWeight="bold">
                              {item.nome} × {item.quantidade}
                            </Typography>
                            <Typography variant="h6" color="success.main">
                              R$ {item.subtotal?.toFixed(2)}
                            </Typography>
                          </Box>
                        }
                        secondary={`Preço unitário: R$ ${item.precoUnitario?.toFixed(2) || '0.00'}`}
                      />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" onClick={() => onRemoveItem(index)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
                
                <Box display="flex" justifyContent="flex-end" mt={2} p={2} bgcolor="grey.100" borderRadius={1}>
                  <Typography variant="h5" fontWeight="bold">
                    Subtotal: R$ {saleItems.reduce((acc, item) => acc + item.subtotal, 0).toFixed(2)}
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        )}

        {/* Etapa 3: Resumo */}
        {currentStep === 'resumo' && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card sx={{ mb: 2, background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <MoneyIcon />
                    <Typography variant="h6">
                      Resumo da Venda
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Dados do Cliente</Typography>
                  <Typography><strong>Nome:</strong> {saleData.cliente}</Typography>
                  <Typography><strong>Data:</strong> {saleData.data?.toLocaleDateString('pt-BR')}</Typography>
                  <Typography><strong>Pagamento:</strong> {saleData.formaPagamento}</Typography>
                  {saleData.observacoes && (
                    <Typography><strong>Obs:</strong> {saleData.observacoes}</Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Resumo Financeiro</Typography>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography>Subtotal:</Typography>
                    <Typography>R$ {saleItems.reduce((acc, item) => acc + item.subtotal, 0).toFixed(2)}</Typography>
                  </Box>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Desconto (R$)"
                      value={saleData.desconto || ''}
                      disabled={saleItems.length === 0}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        const subtotal = saleItems.reduce((acc, item) => acc + item.subtotal, 0);
                        
                        if (!isNaN(value) && value > 0) {
                          // Validar se o desconto não é maior que o subtotal
                          if (value > subtotal) {
                            handleInputChange('desconto', subtotal);
                          } else {
                            handleInputChange('desconto', value);
                          }
                        } else {
                          handleInputChange('desconto', undefined);
                        }
                      }}
                      inputProps={{ 
                        min: 0.01, 
                        step: 0.01,
                        max: saleItems.reduce((acc, item) => acc + item.subtotal, 0)
                      }}
                      placeholder="0.00"
                      helperText={
                        saleItems.length === 0 
                          ? 'Adicione produtos para aplicar desconto' 
                          : `Máximo: R$ ${saleItems.reduce((acc, item) => acc + item.subtotal, 0).toFixed(2)}`
                      }
                    />
                  </Grid>
                  <Divider sx={{ my: 1 }} />
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6" fontWeight="bold">Total:</Typography>
                    <Typography variant="h6" fontWeight="bold" color="success.main">
                      R$ {calculateTotal().toFixed(2)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Produtos ({saleItems.length})</Typography>
              <List>
                {saleItems.map((item, index) => (
                  <ListItem key={index} divider>
                    <ListItemText
                      primary={`${item.nome} × ${item.quantidade}`}
                      secondary={`R$ ${item.precoUnitario?.toFixed(2)} cada`}
                    />
                    <Typography variant="body1" fontWeight="bold">
                      R$ {item.subtotal?.toFixed(2)}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" width="100%">
          <Box>
            {currentStep !== 'dados' && (
              <Button onClick={prevStep} variant="outlined">
                Voltar
              </Button>
            )}
          </Box>
          
          <Box display="flex" gap={2}>
            <Button onClick={onClose}>
              Cancelar
            </Button>
            
            {currentStep !== 'resumo' ? (
              <Button
                variant="contained"
                onClick={nextStep}
                disabled={
                  (currentStep === 'dados' && !saleData.cliente.trim()) ||
                  (currentStep === 'produtos' && saleItems.length === 0)
                }
              >
                Próximo
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={onSubmit}
                disabled={loading}
                sx={{ minWidth: 120 }}
              >
                {loading ? 'Salvando...' : 'Finalizar Venda'}
              </Button>
            )}
          </Box>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default SaleFormDialog;
