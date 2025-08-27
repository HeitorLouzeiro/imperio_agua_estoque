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
  Edit as EditIcon,
  ToggleOn as ToggleOnIcon,
  ToggleOff as ToggleOffIcon
} from '@mui/icons-material';
import { Product } from '../../types';

interface ProductActionsModalProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  onView: (id: string | number) => void;
  onEdit: (product: Product) => void;
  onToggleStatus?: (id: string | number) => void;
}

const ProductActionsModal: React.FC<ProductActionsModalProps> = ({
  open,
  onClose,
  product,
  onView,
  onEdit,
  onToggleStatus
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (!product) return null;

  const handleAction = (action: () => void) => {
    action();
    onClose();
  };

  const isActive = product.ativo !== false;
  const productId = product.id || product._id;
  const productName = product.nome || product.name;

  if (!productId) return null;

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
          Ações - {productName}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ p: 0 }}>
        <List sx={{ py: 0 }}>
          <ListItem button onClick={() => handleAction(() => onView(productId))} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <ViewIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Visualizar" secondary="Ver detalhes do produto" />
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem button onClick={() => handleAction(() => onEdit(product))} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <EditIcon color="warning" />
            </ListItemIcon>
            <ListItemText primary="Editar Produto" secondary="Modificar dados do produto" />
          </ListItem>
          <Divider variant="inset" component="li" />
          {onToggleStatus && (
            <ListItem button onClick={() => handleAction(() => onToggleStatus(productId))} sx={{ py: 1.5 }}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                {isActive ? <ToggleOffIcon color="warning" /> : <ToggleOnIcon color="success" />}
              </ListItemIcon>
              <ListItemText primary={isActive ? "Desativar" : "Ativar"} secondary={isActive ? "Desativar produto" : "Ativar produto"} />
            </ListItem>
          )}
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default ProductActionsModal;
