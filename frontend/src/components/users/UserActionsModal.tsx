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
  Edit as EditIcon,
  ToggleOn as ToggleOnIcon,
  ToggleOff as ToggleOffIcon
} from '@mui/icons-material';
import { User } from '../../types';

interface UserActionsModalProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
  onEdit: (user: User) => void;
  onToggleStatus?: (id: string | number) => void;
}

const UserActionsModal: React.FC<UserActionsModalProps> = ({
  open,
  onClose,
  user,
  onEdit,
  onToggleStatus
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (!user) return null;

  const handleAction = (action: () => void) => {
    action();
    onClose();
  };

  const isActive = user.ativo !== false;
  const userId = user.id || user._id;
  const userName = user.nome || user.name;

  if (!userId) return null;

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
          Ações - {userName}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ p: 0 }}>
        <List sx={{ py: 0 }}>
          <ListItem button onClick={() => handleAction(() => onEdit(user))} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <EditIcon color="warning" />
            </ListItemIcon>
            <ListItemText primary="Editar Usuário" secondary="Modificar dados do usuário" />
          </ListItem>
          <Divider variant="inset" component="li" />
          {onToggleStatus && (
            <ListItem button onClick={() => handleAction(() => onToggleStatus(userId))} sx={{ py: 1.5 }}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                {isActive ? <ToggleOffIcon color="warning" /> : <ToggleOnIcon color="success" />}
              </ListItemIcon>
              <ListItemText primary={isActive ? "Desativar" : "Ativar"} secondary={isActive ? "Desativar usuário" : "Ativar usuário"} />
            </ListItem>
          )}
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default UserActionsModal;
