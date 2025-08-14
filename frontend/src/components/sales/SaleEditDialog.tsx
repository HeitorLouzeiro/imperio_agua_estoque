import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Autocomplete,
  Typography,
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { Sale, Product } from '../../types';

interface SaleEditDialogProps {
  open: boolean;
  onClose: () => void;
  sale: Sale | null;
  products: Product[];
  onSuccess: (message: string, severity: 'success' | 'error' | 'warning' | 'info') => void;
  onSave: (saleData: any) => Promise<void>;
}

interface SaleItem {
  id: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

const SaleEditDialog: React.FC<SaleEditDialogProps> = ({
  open,
  onClose,
  sale,
  products,
  onSuccess,
  onSave,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Estados do formulário
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [status, setStatus] = useState<'pendente' | 'paga' | 'cancelada'>('pendente');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<SaleItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  // Preencher formulário quando sale mudar
  useEffect(() => {
    if (sale && open) {
      setCustomerName(sale.cliente || '');
      setCustomerPhone(sale.customerPhone || '');
      setCustomerAddress(sale.customerAddress || '');
      setPaymentMethod(sale.formaPagamento || '');
      setStatus(sale.status || 'pendente');
      setNotes(sale.notes || '');
      
      // Converter itens da venda para o formato do formulário
      if (sale.itens && Array.isArray(sale.itens)) {
        const convertedItems: SaleItem[] = sale.itens.map((item: any, index: number) => {
          const product = products.find(p => p.id === item.productId || p._id === item.productId) || {
            id: item.productId || `unknown-${index}`,
            name: item.productName || 'Produto não encontrado',
            nome: item.productName || 'Produto não encontrado',
            price: item.unitPrice || 0,
            preco: item.unitPrice || 0,
            quantity: 0,
            quantidade: 0,
            createdAt: '',
            updatedAt: '',
          };
          
          return {
            id: `${item.productId}-${index}`,
            product,
            quantity: item.quantity || 1,
            unitPrice: item.unitPrice || 0,
            totalPrice: (item.quantity || 1) * (item.unitPrice || 0),
          };
        });
        setItems(convertedItems);
      } else {
        setItems([]);
      }
    }
  }, [sale, open, products]);

  // Limpar formulário ao fechar
  useEffect(() => {
    if (!open) {
      setCustomerName('');
      setCustomerPhone('');
      setCustomerAddress('');
      setPaymentMethod('');
      setStatus('pendente');
      setNotes('');
      setItems([]);
      setSelectedProduct(null);
      setQuantity(1);
    }
  }, [open]);

  // Adicionar item
  const handleAddItem = () => {
    if (!selectedProduct) {
      onSuccess('Selecione um produto', 'warning');
      return;
    }

    if (quantity <= 0) {
      onSuccess('Quantidade deve ser maior que zero', 'warning');
      return;
    }

    const productPrice = selectedProduct.preco || selectedProduct.price || 0;
    const newItem: SaleItem = {
      id: `${selectedProduct.id}-${Date.now()}`,
      product: selectedProduct,
      quantity,
      unitPrice: productPrice,
      totalPrice: quantity * productPrice,
    };

    setItems([...items, newItem]);
    setSelectedProduct(null);
    setQuantity(1);
  };

  // Remover item
  const handleRemoveItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  // Atualizar quantidade do item
  const handleUpdateItemQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) return;

    setItems(items.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          quantity: newQuantity,
          totalPrice: newQuantity * item.unitPrice,
        };
      }
      return item;
    }));
  };

  // Calcular total
  const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);

  // Salvar venda
  const handleSave = async () => {
    if (!customerName.trim()) {
      onSuccess('Nome do cliente é obrigatório', 'warning');
      return;
    }

    if (items.length === 0) {
      onSuccess('Adicione pelo menos um item à venda', 'warning');
      return;
    }

    try {
      setLoading(true);

      const saleData = {
        id: sale?.id || sale?._id,
        cliente: customerName,
        customerPhone,
        customerAddress,
        formaPagamento: paymentMethod,
        status,
        notes,
        itens: items.map(item => ({
          productId: item.product.id || item.product._id,
          productName: item.product.nome || item.product.name,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
        })),
        valorTotal: totalAmount,
      };

      await onSave(saleData);
      onSuccess('Venda atualizada com sucesso!', 'success');
      onClose();
    } catch (error) {
      onSuccess('Erro ao atualizar venda', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      fullScreen={isMobile}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            <EditIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Editar Venda #{sale?.numero || sale?.id}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Informações do Cliente */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Informações do Cliente
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nome do Cliente"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Telefone"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Endereço"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              multiline
              rows={2}
            />
          </Grid>

          {/* Informações da Venda */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Informações da Venda
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Forma de Pagamento"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <MenuItem value="dinheiro">Dinheiro</MenuItem>
              <MenuItem value="cartao_debito">Cartão de Débito</MenuItem>
              <MenuItem value="cartao_credito">Cartão de Crédito</MenuItem>
              <MenuItem value="pix">PIX</MenuItem>
              <MenuItem value="transferencia">Transferência</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
            >
              <MenuItem value="pendente">Pendente</MenuItem>
              <MenuItem value="paga">Paga</MenuItem>
              <MenuItem value="cancelada">Cancelada</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Observações"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              multiline
              rows={3}
            />
          </Grid>

          {/* Adicionar Produtos */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Adicionar Produtos
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Autocomplete
              value={selectedProduct}
              onChange={(_, value) => setSelectedProduct(value)}
              options={products}
              getOptionLabel={(option) => `${option.nome || option.name} - R$ ${(option.preco || option.price || 0).toFixed(2)}`}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Selecionar Produto"
                  fullWidth
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Quantidade"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              inputProps={{ min: 1 }}
            />
          </Grid>

          <Grid item xs={12} sm={2}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleAddItem}
              startIcon={<AddIcon />}
              sx={{ height: '56px' }}
            >
              Adicionar
            </Button>
          </Grid>

          {/* Lista de Itens */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Itens da Venda
            </Typography>
            
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Produto</TableCell>
                    <TableCell align="center">Quantidade</TableCell>
                    <TableCell align="right">Preço Unit.</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell align="center">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.product.nome || item.product.name}</TableCell>
                      <TableCell align="center">
                        <TextField
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleUpdateItemQuantity(item.id, Number(e.target.value))}
                          inputProps={{ min: 1 }}
                          size="small"
                          sx={{ width: 80 }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        R$ {item.unitPrice.toFixed(2)}
                      </TableCell>
                      <TableCell align="right">
                        R$ {item.totalPrice.toFixed(2)}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="error"
                          onClick={() => handleRemoveItem(item.id)}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {items.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        Nenhum item adicionado
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Typography variant="h6">
                Total: R$ {totalAmount.toFixed(2)}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={loading}
        >
          {loading ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SaleEditDialog;
