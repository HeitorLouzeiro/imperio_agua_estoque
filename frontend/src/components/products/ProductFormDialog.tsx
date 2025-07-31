import React, { ChangeEvent } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  InputAdornment,
  Slide
} from '@mui/material';
import { Product } from '../../types';

interface ProductFormData {
  codigo: string;
  nome: string;
  marca: string;
  preco: number | string;
  quantidade: number | string;
}

interface ProductFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  editingProduct: Product | null;
  formData: ProductFormData;
  onFormChange: (field: keyof ProductFormData) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  getFieldError: (field: keyof ProductFormData) => string;
}

const ProductFormDialog: React.FC<ProductFormDialogProps> = ({
  open,
  onClose,
  onSave,
  editingProduct,
  formData,
  onFormChange,
  getFieldError
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      TransitionComponent={Slide}
      // @ts-ignore: MUI Slide transitionProps workaround
      TransitionProps={{ direction: 'up' }}
    >
      <DialogTitle>
        {editingProduct ? 'Editar Produto' : 'Novo Produto'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Código"
              value={formData.codigo}
              onChange={onFormChange('codigo')}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nome"
              value={formData.nome}
              onChange={onFormChange('nome')}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Marca"
              value={formData.marca}
              onChange={onFormChange('marca')}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Preço (R$)"
              type="number"
              value={formData.preco}
              onChange={onFormChange('preco')}
              placeholder="0.00"
              inputProps={{ 
                min: 0, 
                step: 0.01,
                'data-testid': 'preco-input'
              }}
              InputProps={{
                startAdornment: <InputAdornment position="start">R$</InputAdornment>,
              }}
              helperText={getFieldError('preco') || "Digite o preço (ex: 12.50)"}
              error={!!getFieldError('preco')}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Quantidade"
              type="number"
              value={formData.quantidade}
              onChange={onFormChange('quantidade')}
              placeholder="0"
              inputProps={{ 
                min: 0,
                step: 1,
                'data-testid': 'quantidade-input'
              }}
              helperText={getFieldError('quantidade') || "Digite a quantidade em estoque"}
              error={!!getFieldError('quantidade')}
              required
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={onSave} variant="contained">
          {editingProduct ? 'Atualizar' : 'Criar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductFormDialog;
