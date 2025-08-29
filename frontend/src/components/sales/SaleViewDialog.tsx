import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton
} from '@mui/material';
import { Close as CloseIcon, Print as PrintIcon, Share as ShareIcon } from '@mui/icons-material';
import { Sale } from '../../types';
import { printReceipt, shareReceipt } from '../../utils/receiptUtils';

interface SaleViewDialogProps {
  open: boolean;
  onClose: () => void;
  sale: Sale | null;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
  onUpdateStatus?: (id: string, status: string) => void;
}

const SaleViewDialog: React.FC<SaleViewDialogProps> = ({
  open,
  onClose,
  sale,
  onSuccess,
  onError,
  onUpdateStatus
}) => {
  if (!sale) return null;

  const handlePrint = () => {
    printReceipt(sale);
    onSuccess?.('Recibo enviado para impressão!');
  };

  const handleShare = async () => {
    await shareReceipt(sale, onSuccess, onError);
  };

  const handleStatusClick = () => {
    if (!onUpdateStatus || !sale) return;
    
    const statusOrder = ['pendente', 'paga', 'cancelada'];
    const currentIndex = statusOrder.indexOf(sale.status || 'paga');
    const nextIndex = (currentIndex + 1) % statusOrder.length;
    const nextStatus = statusOrder[nextIndex];
    
    onUpdateStatus(String(sale._id || sale.id), nextStatus);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paga':
        return 'success';
      case 'pendente':
        return 'warning';
      case 'cancelada':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            Detalhes da Venda #{sale.numero}
          </Typography>
          <Box>
            <IconButton onClick={handlePrint} size="small" title="Imprimir Recibo">
              <PrintIcon />
            </IconButton>
            <IconButton onClick={handleShare} size="small" title="Compartilhar Recibo">
              <ShareIcon />
            </IconButton>
            <IconButton onClick={onClose} size="small" title="Fechar">
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Informações Gerais */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Informações Gerais
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Cliente
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {sale.cliente}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Data da Venda
            </Typography>
            <Typography variant="body1">
              {formatDate(sale.dataVenda || sale.createdAt)}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Vendedor
            </Typography>
            <Typography variant="body1">
              {sale.vendedor?.nome || 'N/A'}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Status
            </Typography>
            <Box mt={0.5} display="flex" alignItems="center" gap={0.5}>
              <Chip
                label={(sale.status || 'paga').charAt(0).toUpperCase() + (sale.status || 'paga').slice(1)}
                color={getStatusColor(sale.status || 'paga') as any}
                size="small"
                onClick={onUpdateStatus ? handleStatusClick : undefined}
                clickable={!!onUpdateStatus}
                sx={{
                  cursor: onUpdateStatus ? 'pointer' : 'default',
                  '&:hover': onUpdateStatus ? {
                    opacity: 0.8,
                    transform: 'scale(1.05)'
                  } : {}
                }}
              />
              {onUpdateStatus && (
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                  (clique para alterar)
                </Typography>
              )}
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Forma de Pagamento
            </Typography>
            <Typography variant="body1">
              {sale.formaPagamento || 'N/A'}
            </Typography>
          </Grid>
          
          {sale.desconto !== undefined && sale.desconto !== null && sale.desconto > 0 && (
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Desconto
              </Typography>
              <Typography variant="body1">
                R$ {sale.desconto.toFixed(2)}
              </Typography>
            </Grid>
          )}

          {/* Produtos */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Produtos
            </Typography>
            <List>
              {sale.itens?.map((item, index) => {
                const produto = typeof item.produto === 'object' ? item.produto : null;
                const isInactive = produto && 'ativo' in produto && !produto.ativo;
                
                return (
                  <ListItem key={index} divider>
                    <ListItemText
                      primary={
                        <Box>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="body1" fontWeight="bold">
                              {produto?.nome || item.product?.name || item.nome || 'Produto'} - Quantidade: {item.quantidade}
                            </Typography>
                            {isInactive && (
                              <Chip 
                                label="Produto Inativo" 
                                size="small" 
                                color="warning" 
                                variant="outlined"
                              />
                            )}
                          </Box>
                          {produto?.codigo && (
                            <Typography variant="body2" color="text.secondary">
                              Código: {produto.codigo}
                            </Typography>
                          )}
                          {isInactive && (
                            <Typography variant="caption" color="warning.main" sx={{ fontStyle: 'italic' }}>
                              Este produto foi desativado após a venda
                            </Typography>
                          )}
                        </Box>
                      }
                      secondary={`Preço Unitário: R$ ${item.precoUnitario?.toFixed(2) || '0.00'} | Subtotal: R$ ${item.subtotal?.toFixed(2) || '0.00'}`}
                    />
                  </ListItem>
                );
              })}
            </List>
          </Grid>

          {/* Totais */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Box display="flex" flexDirection="column" alignItems="flex-end" gap={1}>
              <Typography variant="body1">
                Subtotal: R$ {(sale.subtotal || 0).toFixed(2)}
              </Typography>
              {sale.desconto !== undefined && sale.desconto !== null && sale.desconto > 0 && (
                <Typography variant="body1" color="error">
                  Desconto: -R$ {sale.desconto.toFixed(2)}
                </Typography>
              )}
              <Typography variant="h5" fontWeight="bold">
                Total: R$ {(sale.total || 0).toFixed(2)}
              </Typography>
            </Box>
          </Grid>

          {/* Observações */}
          {sale.observacoes && (
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Observações
              </Typography>
              <Typography variant="body1">
                {sale.observacoes}
              </Typography>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Fechar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SaleViewDialog;
