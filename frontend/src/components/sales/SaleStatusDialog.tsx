import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Typography,
  Box,
  IconButton
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { Sale } from '../../types';

interface SaleStatusDialogProps {
  open: boolean;
  onClose: () => void;
  sale: Sale | null;
  onUpdateStatus: (id: string, status: string) => Promise<void>;
  loading?: boolean;
}

const SaleStatusDialog: React.FC<SaleStatusDialogProps> = ({
  open,
  onClose,
  sale,
  onUpdateStatus,
  loading = false
}) => {
  const [newStatus, setNewStatus] = useState<string>('');

  useEffect(() => {
    if (sale) {
      setNewStatus(sale.status || 'paga');
    }
  }, [sale]);

  const handleSubmit = async () => {
    if (!sale || !newStatus) return;
    
    try {
      await onUpdateStatus(sale.id.toString(), newStatus);
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  if (!sale) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            Editar Status da Venda #{sale.numero}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box mt={2}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Cliente: {sale.cliente}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Total: R$ {(sale.total || 0).toFixed(2)}
          </Typography>
          
          <TextField
            fullWidth
            select
            label="Status"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            margin="normal"
          >
            <MenuItem value="pendente">Pendente</MenuItem>
            <MenuItem value="paga">Paga</MenuItem>
            <MenuItem value="cancelada">Cancelada</MenuItem>
          </TextField>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || newStatus === sale.status}
        >
          {loading ? 'Atualizando...' : 'Atualizar Status'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SaleStatusDialog;
