import { useState, useCallback, ChangeEvent } from 'react';
import { SelectChangeEvent } from '@mui/material';
import { authService } from '../services';
import { User, SnackbarState, UserFormData } from '../types';

interface UseUserManagementReturn {
  // States
  users: User[];
  loading: boolean;
  openDialog: boolean;
  openQuickEditDialog: boolean;
  editingUser: User | null;
  searchTerm: string;
  roleFilter: string;
  statusFilter: string;
  snackbar: SnackbarState;
  formData: UserFormData;
  quickEditData: {
    role: 'administrador' | 'funcionario';
    status: boolean;
  };
  
  // Computed
  filteredUsers: User[];
  
  // Actions
  setSearchTerm: (value: string) => void;
  setRoleFilter: (value: string) => void;
  setStatusFilter: (value: string) => void;
  loadUsers: () => Promise<void>;
  handleDialogOpen: (user?: User | null) => void;
  handleDialogClose: () => void;
  handleQuickEditOpen: (user: User) => void;
  handleQuickEditClose: () => void;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (e: SelectChangeEvent<'administrador' | 'funcionario'>) => void;
  handleQuickEditRoleChange: (e: SelectChangeEvent<'administrador' | 'funcionario'>) => void;
  handleQuickEditStatusChange: (e: SelectChangeEvent<string>) => void;
  handleSave: () => Promise<void>;
  handleQuickEditSave: () => Promise<void>;
  handleDelete: (id: string | number) => Promise<void>;
  handleToggleStatus: (id: string | number) => Promise<void>;
  handleSnackbarClose: () => void;
  handleClearFilters: () => void;
  showSnackbar: (message: string, severity: 'success' | 'error' | 'warning' | 'info') => void;
}

export const useUserManagement = (): UseUserManagementReturn => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openQuickEditDialog, setOpenQuickEditDialog] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
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
  const [quickEditData, setQuickEditData] = useState<{
    role: 'administrador' | 'funcionario';
    status: boolean;
  }>({
    role: 'funcionario',
    status: true
  });

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      let data: User[] = [];
      
      if (statusFilter === 'inativo') {
        data = await authService.getInactiveUsers();
      } else if (statusFilter === 'ativo') {
        data = await authService.getUsers();
      } else {
        const [activeUsers, inactiveUsers] = await Promise.all([
          authService.getUsers(),
          authService.getInactiveUsers()
        ]);
        data = [...activeUsers, ...inactiveUsers];
      }

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
  }, [statusFilter]);

  const handleDialogOpen = (user: User | null = null) => {
    if (user) {
      // Se é edição, abrir o quick edit ao invés do form completo
      handleQuickEditOpen(user);
      return;
    }
    
    // Para novo usuário, usar o form completo
    setEditingUser(user);
    setFormData({
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

  const handleQuickEditOpen = (user: User) => {
    setEditingUser(user);
    setQuickEditData({
      role: user.papel || 'funcionario',
      status: user.ativo !== false // Se não tem ativo ou é true, considera ativo
    });
    setOpenQuickEditDialog(true);
  };

  const handleQuickEditClose = () => {
    setOpenQuickEditDialog(false);
    setEditingUser(null);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: SelectChangeEvent<'administrador' | 'funcionario'>) => {
    setFormData({ ...formData, [e.target.name as string]: e.target.value });
  };

  const handleQuickEditRoleChange = (e: SelectChangeEvent<'administrador' | 'funcionario'>) => {
    setQuickEditData({ ...quickEditData, role: e.target.value as 'administrador' | 'funcionario' });
  };

  const handleQuickEditStatusChange = (e: SelectChangeEvent<string>) => {
    setQuickEditData({ ...quickEditData, status: e.target.value === 'ativo' });
  };

  const handleSave = async () => {
    try {
      if (editingUser) {
        const payload: any = { ...formData };
        if (!payload.senha) {
          delete payload.senha;
        }
        const userId = editingUser.id || editingUser._id;
        await authService.updateProfile(userId as string, payload);
        showSnackbar('Usuário atualizado com sucesso!', 'success');
      } else {
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

  const handleQuickEditSave = async () => {
    try {
      if (!editingUser) return;
      
      const userId = editingUser.id || editingUser._id;
      
      // Atualizar papel
      await authService.updateProfile(userId as string, { papel: quickEditData.role });
      
      // Atualizar status se necessário
      const currentStatus = editingUser.ativo !== false;
      if (currentStatus !== quickEditData.status) {
        if (quickEditData.status) {
          await authService.reactivateUser(userId as string);
        } else {
          await authService.deleteUser(userId as string);
        }
      }
      
      showSnackbar('Usuário atualizado com sucesso!', 'success');
      loadUsers();
      handleQuickEditClose();
    } catch (error) {
      console.error(error);
      showSnackbar('Erro ao atualizar usuário.', 'error');
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!window.confirm('Tem certeza que deseja desativar este usuário?\n\nO usuário ficará inativo mas seu histórico será preservado.')) return;
    try {
      const userId = id as string;
      await authService.deleteUser(userId);
      showSnackbar('Usuário desativado com sucesso!', 'success');
      loadUsers();
    } catch (error) {
      showSnackbar('Erro ao desativar usuário.', 'error');
    }
  };

  const handleToggleStatus = async (id: string | number) => {
    try {
      const userId = id as string;
      const user = users.find(u => (u.id || u._id) === userId);
      if (!user) return;
      
      const currentStatus = user.ativo !== false;
      if (currentStatus) {
        await authService.deleteUser(userId);
        showSnackbar('Usuário desativado com sucesso!', 'success');
      } else {
        await authService.reactivateUser(userId);
        showSnackbar('Usuário reativado com sucesso!', 'success');
      }
      
      loadUsers();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      showSnackbar('Erro ao alterar status do usuário', 'error');
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setRoleFilter('');
    setStatusFilter('todos');
  };

  const filteredUsers = users.filter((user) => {
    const matchesName = searchTerm === '' || 
      user.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === '' || user.papel === roleFilter;
    return matchesName && matchesRole;
  });

  return {
    users,
    loading,
    openDialog,
    openQuickEditDialog,
    editingUser,
    searchTerm,
    roleFilter,
    statusFilter,
    snackbar,
    formData,
    quickEditData,
    filteredUsers,
    setSearchTerm,
    setRoleFilter,
    setStatusFilter,
    loadUsers,
    handleDialogOpen,
    handleDialogClose,
    handleQuickEditOpen,
    handleQuickEditClose,
    handleChange,
    handleSelectChange,
    handleQuickEditRoleChange,
    handleQuickEditStatusChange,
    handleSave,
    handleQuickEditSave,
    handleDelete,
    handleToggleStatus,
    handleSnackbarClose,
    handleClearFilters,
    showSnackbar,
  };
};

