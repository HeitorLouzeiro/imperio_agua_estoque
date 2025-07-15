import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Chip,
  IconButton,
  Avatar,
  Alert,
  Snackbar,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';

const Users = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      nome: 'João Silva',
      email: 'joao@imperio.com',
      papel: 'administrador',
      status: 'ativo',
      dataCriacao: '2024-01-15',
      ultimoLogin: '2025-07-15'
    },
    {
      id: 2,
      nome: 'Maria Santos',
      email: 'maria@imperio.com',
      papel: 'operador',
      status: 'ativo',
      dataCriacao: '2024-02-20',
      ultimoLogin: '2025-07-14'
    },
    {
      id: 3,
      nome: 'Pedro Oliveira',
      email: 'pedro@imperio.com',
      papel: 'operador',
      status: 'inativo',
      dataCriacao: '2024-03-10',
      ultimoLogin: '2025-06-30'
    },
  ]);

  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    papel: 'operador',
    status: 'ativo'
  });

  const columns = [
    {
      field: 'avatar',
      headerName: '',
      width: 70,
      sortable: false,
      renderCell: (params) => (
        <Avatar sx={{ bgcolor: params.row.papel === 'administrador' ? 'primary.main' : 'secondary.main' }}>
          {params.row.papel === 'administrador' ? <AdminIcon /> : <PersonIcon />}
        </Avatar>
      ),
    },
    { field: 'nome', headerName: 'Nome', width: 180 },
    { field: 'email', headerName: 'Email', width: 200 },
    {
      field: 'papel',
      headerName: 'Papel',
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.value === 'administrador' ? 'Admin' : 'Operador'}
          color={params.value === 'administrador' ? 'primary' : 'default'}
          size="small"
          icon={params.value === 'administrador' ? <AdminIcon /> : <PersonIcon />}
        />
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === 'ativo' ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    { field: 'dataCriacao', headerName: 'Criado em', width: 120 },
    { field: 'ultimoLogin', headerName: 'Último Login', width: 130 },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton size="small" onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton 
            size="small" 
            onClick={() => handleDelete(params.row.id)}
            disabled={params.row.papel === 'administrador'}
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingUser(null);
    setFormData({
      nome: '',
      email: '',
      senha: '',
      papel: 'operador',
      status: 'ativo'
    });
    setOpen(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      nome: user.nome,
      email: user.email,
      senha: '',
      papel: user.papel,
      status: user.status
    });
    setOpen(true);
  };

  const handleDelete = (id) => {
    const userToDelete = users.find(u => u.id === id);
    if (userToDelete?.papel === 'administrador') {
      setSnackbar({
        open: true,
        message: 'Não é possível excluir administradores!',
        severity: 'error'
      });
      return;
    }

    setUsers(users.filter(u => u.id !== id));
    setSnackbar({
      open: true,
      message: 'Usuário excluído com sucesso!',
      severity: 'success'
    });
  };

  const handleSave = () => {
    if (editingUser) {
      // Editando usuário existente
      setUsers(users.map(u => 
        u.id === editingUser.id 
          ? { ...u, ...formData }
          : u
      ));
      setSnackbar({
        open: true,
        message: 'Usuário atualizado com sucesso!',
        severity: 'success'
      });
    } else {
      // Adicionando novo usuário
      const newUser = {
        ...formData,
        id: Math.max(...users.map(u => u.id)) + 1,
        dataCriacao: new Date().toISOString().split('T')[0],
        ultimoLogin: '-'
      };
      setUsers([...users, newUser]);
      setSnackbar({
        open: true,
        message: 'Usuário criado com sucesso!',
        severity: 'success'
      });
    }
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Gestão de Usuários
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          size="large"
        >
          Novo Usuário
        </Button>
      </Box>

      <Paper sx={{ height: 600, width: '100%', mb: 2 }}>
        <DataGrid
          rows={users}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
          disableSelectionOnClick
          sx={{
            '& .MuiDataGrid-cell:hover': {
              color: 'primary.main',
            },
          }}
        />
      </Paper>

      {/* Dialog para adicionar/editar usuário */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nome Completo"
                value={formData.nome}
                onChange={handleChange('nome')}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={editingUser ? "Nova Senha (deixe em branco para manter)" : "Senha"}
                type="password"
                value={formData.senha}
                onChange={handleChange('senha')}
                required={!editingUser}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Papel"
                select
                value={formData.papel}
                onChange={handleChange('papel')}
                SelectProps={{ native: true }}
              >
                <option value="operador">Operador</option>
                <option value="administrador">Administrador</option>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Status"
                select
                value={formData.status}
                onChange={handleChange('status')}
                SelectProps={{ native: true }}
              >
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained">
            {editingUser ? 'Atualizar' : 'Criar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para feedbacks */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Users;
