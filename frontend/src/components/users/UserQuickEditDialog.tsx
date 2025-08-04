import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Box,
  Chip
} from '@mui/material';
import { User } from '../../types';

interface UserQuickEditDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  editingUser: User | null;
  currentRole: 'administrador' | 'funcionario';
  currentStatus: boolean;
  onRoleChange: (e: SelectChangeEvent<'administrador' | 'funcionario'>) => void;
  onStatusChange: (e: SelectChangeEvent<string>) => void;
}

const UserQuickEditDialog: React.FC<UserQuickEditDialogProps> = ({
  open,
  onClose,
  onSave,
  editingUser,
  currentRole,
  currentStatus,
  onRoleChange,
  onStatusChange
}) => {
  if (!editingUser) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" fontWeight="bold">
          Editar Permissões do Usuário
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {/* Informações do usuário (somente leitura) */}
          <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Informações do Usuário
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {editingUser.nome}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {editingUser.email}
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {/* Papel/Tipo */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Papel</InputLabel>
                <Select 
                  value={currentRole} 
                  onChange={onRoleChange} 
                  label="Papel"
                >
                  <MenuItem value="administrador">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      Administrador
                      <Chip 
                        label="Acesso Total" 
                        size="small" 
                        color="error"
                        variant="outlined"
                      />
                    </Box>
                  </MenuItem>
                  <MenuItem value="funcionario">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      Funcionário
                      <Chip 
                        label="Acesso Limitado" 
                        size="small" 
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Status */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select 
                  value={currentStatus ? 'ativo' : 'inativo'} 
                  onChange={onStatusChange} 
                  label="Status"
                >
                  <MenuItem value="ativo">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip 
                        label="Ativo" 
                        size="small" 
                        color="success"
                        variant="filled"
                      />
                      Usuário pode acessar o sistema
                    </Box>
                  </MenuItem>
                  <MenuItem value="inativo">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip 
                        label="Inativo" 
                        size="small" 
                        color="error"
                        variant="filled"
                      />
                      Usuário não pode acessar o sistema
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Aviso */}
          <Box sx={{ mt: 3, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
            <Typography variant="caption" color="info.dark">
              💡 Para alterar dados pessoais (nome, email, senha), use a página de configurações do perfil.
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} variant="outlined">
          Cancelar
        </Button>
        <Button onClick={onSave} variant="contained">
          Salvar Alterações
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserQuickEditDialog;
