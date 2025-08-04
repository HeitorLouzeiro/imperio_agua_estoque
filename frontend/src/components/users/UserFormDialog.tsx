import React, { ChangeEvent } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import { User, UserFormData } from '../../types';

interface UserFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  editingUser: User | null;
  formData: UserFormData;
  onFormChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (e: SelectChangeEvent<'administrador' | 'funcionario'>) => void;
}

const UserFormDialog: React.FC<UserFormDialogProps> = ({
  open,
  onClose,
  onSave,
  editingUser,
  formData,
  onFormChange,
  onSelectChange
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" fontWeight="bold">
          {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField 
              label="Nome" 
              name="nome" 
              value={formData.nome} 
              onChange={onFormChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField 
              label="Email" 
              name="email" 
              type="email"
              value={formData.email} 
              onChange={onFormChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Senha"
              name="senha"
              type="password"
              value={formData.senha}
              onChange={onFormChange}
              placeholder={editingUser ? 'Deixe em branco para manter a senha atual' : 'Digite uma senha segura'}
              fullWidth
              required={!editingUser}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Papel</InputLabel>
              <Select 
                name="papel" 
                value={formData.papel} 
                onChange={onSelectChange} 
                label="Papel"
              >
                <MenuItem value="administrador">Administrador</MenuItem>
                <MenuItem value="funcionario">Funcionário</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} variant="outlined">
          Cancelar
        </Button>
        <Button onClick={onSave} variant="contained">
          {editingUser ? 'Atualizar' : 'Criar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserFormDialog;
