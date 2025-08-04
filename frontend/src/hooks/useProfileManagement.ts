import { useState, useCallback, ChangeEvent } from 'react';
import { authService } from '../services';
import { SnackbarState } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface ProfileFormData {
  nome: string;
  email: string;
  senhaAtual: string;
  novaSenha: string;
  confirmarSenha: string;
}

interface UseProfileManagementReturn {
  // States
  loading: boolean;
  formData: ProfileFormData;
  snackbar: SnackbarState;
  showPasswordFields: boolean;
  
  // Actions
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleTogglePasswordFields: () => void;
  handleSave: () => Promise<void>;
  handleSnackbarClose: () => void;
  
  // Utils
  isFormValid: () => boolean;
  showSnackbar: (message: string, severity: 'success' | 'error' | 'warning' | 'info') => void;
}

export const useProfileManagement = (): UseProfileManagementReturn => {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [showPasswordFields, setShowPasswordFields] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'success'
  });
  const [formData, setFormData] = useState<ProfileFormData>({
    nome: user?.nome || user?.name || '',
    email: user?.email || '',
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: ''
  });

  // Função para exibir snackbar
  const showSnackbar = useCallback((message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  }, []);

  // Manipular mudanças nos campos
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  // Alternar exibição dos campos de senha
  const handleTogglePasswordFields = useCallback(() => {
    setShowPasswordFields(prev => !prev);
    if (showPasswordFields) {
      // Limpar campos de senha ao ocultar
      setFormData(prev => ({
        ...prev,
        senhaAtual: '',
        novaSenha: '',
        confirmarSenha: ''
      }));
    }
  }, [showPasswordFields]);

  // Validar formulário
  const isFormValid = useCallback((): boolean => {
    // Validações básicas
    if (!formData.nome.trim() || !formData.email.trim()) {
      return false;
    }

    // Se está alterando senha, validar campos de senha
    if (showPasswordFields) {
      if (!formData.senhaAtual || !formData.novaSenha || !formData.confirmarSenha) {
        return false;
      }
      
      if (formData.novaSenha !== formData.confirmarSenha) {
        return false;
      }
      
      if (formData.novaSenha.length < 6) {
        return false;
      }
    }

    return true;
  }, [formData, showPasswordFields]);

  // Salvar alterações
  const handleSave = useCallback(async () => {
    if (!isFormValid()) {
      showSnackbar('Por favor, preencha todos os campos obrigatórios', 'error');
      return;
    }

    if (showPasswordFields && formData.novaSenha !== formData.confirmarSenha) {
      showSnackbar('As senhas não coincidem', 'error');
      return;
    }

    try {
      setLoading(true);
      
      const userId = user?.id || user?._id;
      if (!userId) {
        throw new Error('Usuário não encontrado');
      }

      // Preparar dados para atualização
      const updateData: any = {
        nome: formData.nome,
        email: formData.email
      };

      // Se está alterando senha, incluir dados de senha
      if (showPasswordFields) {
        updateData.senhaAtual = formData.senhaAtual;
        updateData.novaSenha = formData.novaSenha;
      }

      // Chamar API de atualização
      await authService.updateProfile(
        userId as string,
        updateData
      );

      showSnackbar('Perfil atualizado com sucesso!', 'success');
      
      // Limpar campos de senha após sucesso
      if (showPasswordFields) {
        setFormData(prev => ({
          ...prev,
          senhaAtual: '',
          novaSenha: '',
          confirmarSenha: ''
        }));
        setShowPasswordFields(false);
      }

    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      const message = error.response?.data?.erro || error.response?.data?.message || 'Erro ao atualizar perfil';
      showSnackbar(message, 'error');
    } finally {
      setLoading(false);
    }
  }, [formData, showPasswordFields, user, isFormValid, showSnackbar]);

  // Fechar snackbar
  const handleSnackbarClose = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  return {
    // States
    loading,
    formData,
    snackbar,
    showPasswordFields,
    
    // Actions
    handleChange,
    handleTogglePasswordFields,
    handleSave,
    handleSnackbarClose,
    
    // Utils
    isFormValid,
    showSnackbar
  };
};
