
import React, { useEffect, useState, ChangeEvent, useCallback } from 'react';
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
  IconButton,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Paper,
  Grid,
  Chip,
  InputAdornment,
  Tooltip,
  SelectChangeEvent
} from '@mui/material';
import { DataGrid, GridSearchIcon, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Edit, Delete, Add as AddIcon, Person as PersonIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/index';
import Layout from '../components/common/Layout';
import { User, SnackbarState, UserFormData } from '../types';

const Users = () => {
  const { isAdmin, user } = useAuth();
  const hasAccess = isAdmin();

  // Debug logs
  console.log('User data:', user);
  console.log('User role:', user?.role);
  console.log('User papel:', user?.papel);
  console.log('isAdmin result:', hasAccess);

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [snackbar, setSnackbar] = useState<SnackbarState>({ open: false, message: '', severity: 'success' });

  const [formData, setFormData] = useState<UserFormData>({
    nome: '',
    email: '',
    senha: '',
    papel: 'funcionario'
  });

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await authService.getUsers();
      const usersWithId = data.map(user => ({
        ...user,
        id: user._id || user.id,
      }));
      setUsers(usersWithId);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      showSnackbar('Erro ao carregar usuários', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (hasAccess) {
      loadUsers();
    }
  }, [hasAccess, loadUsers]);

  const handleDialogOpen = (user: User | null = null) => {
    setEditingUser(user);
    setFormData({
      nome: user?.nome || '',
      email: user?.email || '',
      senha: '',
      papel: user?.papel || 'funcionario'
    });
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setEditingUser(null);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: SelectChangeEvent<'administrador' | 'funcionario'>) => {
    setFormData({ ...formData, [e.target.name as string]: e.target.value });
  };

  const handleSave = async () => {
    try {
      if (editingUser) {
        const payload: any = { ...formData };
        if (!payload.senha) {
          delete payload.senha; // Não atualizar a senha se campo estiver vazio
        }
        const userId = typeof editingUser.id === 'string' ? parseInt(editingUser.id) : editingUser.id;
        await authService.updateProfile(userId, payload);
        showSnackbar('Usuário atualizado com sucesso!', 'success');
      } else {
        // Converter formData para o formato esperado pelo backend
        const createUserData = {
          name: formData.nome,
          nome: formData.nome,
          email: formData.email,
          password: formData.senha,
          senha: formData.senha,
          role: formData.papel,
          papel: formData.papel
        };
        await authService.register(createUserData);
        showSnackbar('Usuário criado com sucesso!', 'success');
      }
      loadUsers();
      handleDialogClose();
    } catch (error) {
      console.error(error);
      showSnackbar('Erro ao salvar usuário.', 'error');
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) return;
    try {
      const userId = typeof id === 'string' ? parseInt(id) : id;
      await authService.deleteUser(userId);
      showSnackbar('Usuário excluído com sucesso!', 'success');
      loadUsers();
    } catch (error) {
      showSnackbar('Erro ao excluir usuário.', 'error');
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Filtrar usuários baseado nos critérios de pesquisa
  const filteredUsers = users.filter((user) => {
    const matchesName = searchTerm === '' || 
      user.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === '' || user.papel === roleFilter;
    return matchesName && matchesRole;
  });

  // Colunas para DataGrid
  const columns: GridColDef[] = [
    { 
      field: 'nome', 
      headerName: 'Nome', 
      width: 200,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      )
    },
    { 
      field: 'email', 
      headerName: 'Email', 
      width: 250 
    },
    {
      field: 'papel',
      headerName: 'Papel',
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value === 'administrador' ? 'Admin' : 'Funcionário'}
          color={params.value === 'administrador' ? 'primary' : 'default'}
          size="small"
          variant={params.value === 'administrador' ? 'filled' : 'outlined'}
        />
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Criado em',
      width: 130,
      renderCell: (params: GridRenderCellParams) => {
        const date = params.value ? new Date(params.value) : null;
        return date ? date.toLocaleDateString('pt-BR') : '';
      },
    },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 120,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <Tooltip title="Editar Usuário">
            <IconButton size="small" onClick={() => handleDialogOpen(params.row)}>
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Excluir Usuário">
            <IconButton size="small" color="error" onClick={() => handleDelete(params.row.id)}>
              <Delete />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  if (!hasAccess) {
    return (
      <Layout>
        <Box sx={{ p: 3 }}>
          <Alert severity="error">
            <Typography variant="h6">Acesso Negado</Typography>
            <Typography>
              Apenas administradores podem gerenciar usuários do sistema.
            </Typography>
          </Alert>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Usuários
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Gerencie os usuários e permissões do sistema
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={() => handleDialogOpen()} 
            sx={{ borderRadius: 2 }}
          >
            Novo Usuário
          </Button>
        </Box>

        {/* Filtros de Pesquisa */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Filtros de Pesquisa
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                label="Pesquisar"
                placeholder="Nome ou email do usuário..."
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <GridSearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ borderRadius: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Filtrar por papel</InputLabel>
                <Select
                  value={roleFilter}
                  label="Filtrar por papel"
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="administrador">Administrador</MenuItem>
                  <MenuItem value="funcionario">Funcionário</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => {
                  setSearchTerm('');
                  setRoleFilter('');
                }}
                sx={{ height: '56px', borderRadius: 2 }}
              >
                Limpar
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Tabela de usuários */}
        <Paper sx={{ height: 440, width: '100%', mb: 3 }}>
          <DataGrid
            rows={filteredUsers}
            columns={columns}
            loading={loading}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 8, page: 0 },
              },
            }}
            pageSizeOptions={[8, 16]}
            disableRowSelectionOnClick
            getRowId={(row) => row.id}
            localeText={{
              noRowsLabel: 'Nenhum usuário encontrado',
              footerRowSelected: (count) => `${count} linha(s) selecionada(s)`,
            }}
          />
        </Paper>

        <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                    onChange={handleSelectChange} 
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
            <Button onClick={handleDialogClose} variant="outlined">
              Cancelar
            </Button>
            <Button onClick={handleSave} variant="contained">
              {editingUser ? 'Atualizar' : 'Criar'}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleSnackbarClose} 
            severity={snackbar.severity} 
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Layout>
  );
};

export default Users;
