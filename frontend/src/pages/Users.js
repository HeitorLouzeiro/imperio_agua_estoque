import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Snackbar,
  Alert,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  CircularProgress
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext'; // Adjust the import path as necessary

const Users = () => {
  const { user, isAdmin } = useAuth();

  // Hooks devem estar sempre no topo
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    papel: 'funcionario'
  });

  const hasAccess = isAdmin();

  useEffect(() => {
    if (hasAccess) {
      loadUsers();
    }
  }, [hasAccess]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/usuarios');
      setUsers(response.data);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDialogOpen = (user = null) => {
    setEditingUser(user);
    setFormData(user || {
      nome: '',
      email: '',
      senha: '',
      papel: 'funcionario'
    });
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setEditingUser(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      if (editingUser) {
        await axios.put(`http://localhost:5000/api/usuarios/${editingUser._id}`, formData);
        showSnackbar('Usuário atualizado com sucesso!', 'success');
      } else {
        await axios.post('http://localhost:5000/api/usuarios', formData);
        showSnackbar('Usuário criado com sucesso!', 'success');
      }
      loadUsers();
      handleDialogClose();
    } catch (error) {
      showSnackbar('Erro ao salvar usuário.', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/usuarios/${id}`);
      showSnackbar('Usuário excluído com sucesso!', 'success');
      loadUsers();
    } catch (error) {
      showSnackbar('Erro ao excluir usuário.', 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const filteredUsers = users.filter((u) => {
    const matchesName = u.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter ? u.papel === roleFilter : true;
    return matchesName && matchesRole;
  });

  // Verificação de acesso
  if (!hasAccess) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          <Typography variant="h6">Acesso Negado</Typography>
          <Typography>
            Apenas administradores podem gerenciar usuários do sistema.
          </Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Gerenciamento de Usuários</Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="Buscar por nome"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Filtrar por papel</InputLabel>
          <Select
            value={roleFilter}
            label="Filtrar por papel"
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="admin">Administrador</MenuItem>
            <MenuItem value="funcionario">Funcionário</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" onClick={() => handleDialogOpen()}>Novo Usuário</Button>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Papel</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((u) => (
                <TableRow key={u._id}>
                  <TableCell>{u.nome}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.papel}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleDialogOpen(u)}><Edit /></IconButton>
                    <IconButton onClick={() => handleDelete(u._id)}><Delete /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4}>Nenhum usuário encontrado.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>{editingUser ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="Nome" name="nome" value={formData.nome} onChange={handleChange} />
          <TextField label="Email" name="email" value={formData.email} onChange={handleChange} />
          <TextField label="Senha" name="senha" type="password" value={formData.senha} onChange={handleChange} />
          <FormControl>
            <InputLabel>Papel</InputLabel>
            <Select name="papel" value={formData.papel} onChange={handleChange} label="Papel">
              <MenuItem value="admin">Administrador</MenuItem>
              <MenuItem value="funcionario">Funcionário</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained">Salvar</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Users;
