import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography
} from '@mui/material';
import { Product } from '../../types';

interface ProductViewDialogProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
}

const ProductViewDialog: React.FC<ProductViewDialogProps> = ({
  open,
  onClose,
  product
}) => {
  if (!product) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Detalhes do Produto</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle2">Código:</Typography>
            <Typography>{product.codigo}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2">Nome:</Typography>
            <Typography>{product.nome}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2">Marca:</Typography>
            <Typography>{product.marca}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Preço:</Typography>
            <Typography>R$ {(product.preco || 0).toFixed(2)}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Quantidade:</Typography>
            <Typography>{product.quantidade || 0}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="caption" color="text.secondary">
              Criado em: {new Date(product.createdAt || '').toLocaleString()}<br />
              Atualizado em: {new Date(product.updatedAt || '').toLocaleString()}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Fechar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductViewDialog;
