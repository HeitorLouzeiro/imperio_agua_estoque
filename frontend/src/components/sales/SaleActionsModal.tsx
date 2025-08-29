import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Close as CloseIcon,
  Visibility as ViewIcon,
  EditNote as EditNoteIcon,
  Assignment as StatusIcon
} from '@mui/icons-material';
import { Sale } from '../../types';

interface SaleActionsModalProps {
  open: boolean;
  onClose: () => void;
  sale: Sale | null;
  onView: (sale: Sale) => void;
  onEdit: (sale: Sale) => void;
  onEditStatus: (sale: Sale) => void;
}

const SaleActionsModal: React.FC<SaleActionsModalProps> = ({
  open,
  onClose,
  sale,
  onView,
  onEdit,
  onEditStatus
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (!sale) return null;

  const handleAction = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2, m: isMobile ? 1 : 2 } }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography variant="h6" component="div">
          Ações - Venda #{sale.numero || sale.id}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ p: 0 }}>
        <List sx={{ py: 0 }}>
          <ListItem button onClick={() => handleAction(() => onView(sale))} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <ViewIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Visualizar" secondary="Ver detalhes da venda" />
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem button onClick={() => handleAction(() => onEdit(sale))} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <EditNoteIcon color="warning" />
            </ListItemIcon>
            <ListItemText primary="Editar Venda" secondary="Modificar dados da venda" />
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem button onClick={() => handleAction(() => onEditStatus(sale))} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <StatusIcon color="secondary" />
            </ListItemIcon>
            <ListItemText primary="Editar Status" secondary="Alterar status da venda" />
          </ListItem>
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default SaleActionsModal;
