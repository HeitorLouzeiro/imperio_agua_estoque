import { useState, useCallback, ChangeEvent } from 'react';
import { SelectChangeEvent } from '@mui/material';
import { authService } from '../services';
import { User, SnackbarState, UserFormData } from '../types';

interface UseUserManagementReturn {
  // States
  users: User[];
  loading: boolean;
  openDialog: boolean;
  editingUser: User | null;
  searchTerm: string;
  roleFilter: string;
  snackbar: SnackbarState;
  formData: UserFormData;
  
  // Computed
  filteredUsers: User[];
  
  // Actions
  setSearchTerm: (value: string) => void;
  setRoleFilter: (value: string) => void;
  loadUsers: () => Promise<void>;
  handleDialogOpen: (user?: User | null) => void;
  handleDialogClose: () => void;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (e: SelectChangeEvent<'administrador' | 'funcionario'>) => void;
  handleSave: () => Promise<void>;
  handleDelete: (id: string | number) => Promise<void>;
  handleSnackbarClose: () => void;
  handleClearFilters: () => void;
  showSnackbar: (message: string, severity: 'success' | 'error' | 'warning' | 'info') => void;
}

export const useUserManagement = (): UseUserManagementReturn => {
  // Estados
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [snackbar, setSnackbar] = useState<SnackbarState>({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });
  const [formData, setFormData] = useState<UserFormData>({
    nome: '',
    email: '',
    senha: '',
    papel: 'funcionario'
  });

  // Helper para mostrar snackbar
  const showSnackbar = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  // Carregar usuários
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

  // Abrir dialog
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

  // Fechar dialog
  const handleDialogClose = () => {
    setOpenDialog(false);
    setEditingUser(null);
  };

  // Handle form changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle select changes
  const handleSelectChange = (e: SelectChangeEvent<'administrador' | 'funcionario'>) => {
    setFormData({ ...formData, [e.target.name as string]: e.target.value });
  };

  // Salvar usuário
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

  // Excluir usuário
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

  // Fechar snackbar
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Limpar filtros
  const handleClearFilters = () => {
    setSearchTerm('');
    setRoleFilter('');
  };

  // Filtrar usuários
  const filteredUsers = users.filter((user) => {
    const matchesName = searchTerm === '' || 
      user.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === '' || user.papel === roleFilter;
    return matchesName && matchesRole;
  });

  return {
    // States
    users,
    loading,
    openDialog,
    editingUser,
    searchTerm,
    roleFilter,
    snackbar,
    formData,
    
    // Computed
    filteredUsers,
    
    // Actions
    setSearchTerm,
    setRoleFilter,
    loadUsers,
    handleDialogOpen,
    handleDialogClose,
    handleChange,
    handleSelectChange,
    handleSave,
    handleDelete,
    handleSnackbarClose,
    handleClearFilters,
    showSnackbar,
  };
};
