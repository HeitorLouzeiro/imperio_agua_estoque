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

interface ValidationState {
  isCurrentPasswordCorrect: boolean | null; // null = não verificado, true = correta, false = incorreta
  currentPasswordError: string;
}

interface UseProfileManagementReturn {
  // States
  loading: boolean;
  formData: ProfileFormData;
  snackbar: SnackbarState;
  showPasswordFields: boolean;
  validationState: ValidationState;
  
  // Actions
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleTogglePasswordFields: () => void;
  handleSave: () => Promise<void>;
  handleSnackbarClose: () => void;
  validateCurrentPassword: () => Promise<void>;
  
  // Utils
  isFormValid: () => boolean;
  showSnackbar: (message: string, severity: 'success' | 'error' | 'warning' | 'info') => void;
  
  // Validações específicas
  isCurrentPasswordValid: () => boolean;
  isNewPasswordValid: () => boolean;
  isPasswordConfirmationValid: () => boolean;
  getPasswordValidationMessage: () => string;
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
  const [validationState, setValidationState] = useState<ValidationState>({
    isCurrentPasswordCorrect: null,
    currentPasswordError: ''
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
    
    // Reset password validation when current password changes
    if (name === 'senhaAtual') {
      setValidationState({
        isCurrentPasswordCorrect: null,
        currentPasswordError: ''
      });
      
      // Se o campo foi limpo, resetar validação
      if (!value.trim()) {
        setValidationState({
          isCurrentPasswordCorrect: null,
          currentPasswordError: ''
        });
      }
    }
  }, []);

  // Validar senha atual via API
  const validateCurrentPassword = useCallback(async () => {
    if (!formData.senhaAtual.trim()) {
      setValidationState({
        isCurrentPasswordCorrect: null,
        currentPasswordError: ''
      });
      return;
    }

    // Validação básica de formato da senha
    if (formData.senhaAtual.length < 3) {
      setValidationState({
        isCurrentPasswordCorrect: false,
        currentPasswordError: 'Senha muito curta'
      });
      return;
    }

    try {
      setLoading(true);
      const userId = user?.id || user?._id;
      if (!userId) {
        throw new Error('Usuário não encontrado');
      }

      // Fazer uma tentativa de atualização com apenas a senha atual
      // Se a senha estiver incorreta, o backend retornará erro
      await authService.updateProfile(userId as string, {
        nome: formData.nome,
        email: formData.email,
        senhaAtual: formData.senhaAtual
        // Não enviamos novaSenha para apenas validar a atual
      });

      // Se chegou até aqui, a senha atual está correta
      setValidationState({
        isCurrentPasswordCorrect: true,
        currentPasswordError: ''
      });

    } catch (error: any) {
      const message = error.response?.data?.erro || error.response?.data?.message || '';
      
      // Verificar especificamente erro de senha atual incorreta (401)
      if (error.response?.status === 401 && 
          (message.includes('Senha atual incorreta') || 
           message.includes('senha atual') || 
           message.includes('incorreta'))) {
        setValidationState({
          isCurrentPasswordCorrect: false,
          currentPasswordError: 'Senha atual incorreta'
        });
      } else if (error.response?.status === 401) {
        // Outros erros 401 (token inválido, etc)
        setValidationState({
          isCurrentPasswordCorrect: false,
          currentPasswordError: 'Sessão expirada. Faça login novamente.'
        });
      } else {
        setValidationState({
          isCurrentPasswordCorrect: false,
          currentPasswordError: 'Erro ao validar senha'
        });
      }
    } finally {
      setLoading(false);
    }
  }, [formData.senhaAtual, formData.nome, formData.email, user]);

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

  // Validações específicas para senhas
  const isCurrentPasswordValid = useCallback((): boolean => {
    if (!showPasswordFields) return true;
    return formData.senhaAtual.trim().length > 0;
  }, [formData.senhaAtual, showPasswordFields]);

  const isNewPasswordValid = useCallback((): boolean => {
    if (!showPasswordFields) return true;
    return formData.novaSenha.length >= 6;
  }, [formData.novaSenha, showPasswordFields]);

  const isPasswordConfirmationValid = useCallback((): boolean => {
    if (!showPasswordFields) return true;
    return formData.confirmarSenha.length > 0 && formData.novaSenha === formData.confirmarSenha;
  }, [formData.novaSenha, formData.confirmarSenha, showPasswordFields]);

  const getPasswordValidationMessage = useCallback((): string => {
    if (!showPasswordFields) return '';
    
    if (!isCurrentPasswordValid()) {
      return 'Digite sua senha atual para confirmar a alteração';
    }
    
    if (!isNewPasswordValid()) {
      return 'A nova senha deve ter pelo menos 6 caracteres';
    }
    
    if (!isPasswordConfirmationValid()) {
      if (formData.confirmarSenha.length === 0) {
        return 'Confirme sua nova senha';
      }
      return 'As senhas não coincidem';
    }
    
    return '';
  }, [isCurrentPasswordValid, isNewPasswordValid, isPasswordConfirmationValid, formData.confirmarSenha, showPasswordFields]);

  // Validar formulário
  const isFormValid = useCallback((): boolean => {
    // Validações básicas
    if (!formData.nome.trim() || !formData.email.trim()) {
      return false;
    }

        // Se está alterando senhas, validar campos de senha
    if (showPasswordFields) {
      if (!formData.senhaAtual || !formData.novaSenha || !formData.confirmarSenha) {
        return false;
      }
      
      if (formData.novaSenha !== formData.confirmarSenha) {
        return false;
      }
      
      // Apenas validar se tem pelo menos 6 caracteres
      if (formData.novaSenha.length < 6) {
        return false;
      }
    }

    return true;
  }, [formData, showPasswordFields]);

  // Salvar alterações
  const handleSave = useCallback(async () => {
    // Validações específicas com mensagens detalhadas
    if (showPasswordFields) {
      if (!isCurrentPasswordValid()) {
        showSnackbar('Digite sua senha atual para confirmar a alteração', 'error');
        return;
      }
      
      if (!isNewPasswordValid()) {
        showSnackbar('A nova senha deve ter pelo menos 6 caracteres', 'error');
        return;
      }
      
      if (!isPasswordConfirmationValid()) {
        if (formData.confirmarSenha.length === 0) {
          showSnackbar('Confirme sua nova senha', 'error');
        } else {
          showSnackbar('As senhas não coincidem', 'error');
        }
        return;
      }
    }

    // Validações básicas do formulário
    if (!isFormValid()) {
      showSnackbar('Por favor, preencha todos os campos obrigatórios', 'error');
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

      if (showPasswordFields) {
        showSnackbar('Perfil e senha atualizados com sucesso!', 'success');
      } else {
        showSnackbar('Perfil atualizado com sucesso!', 'success');
      }
      
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
      
      // Tratar erro específico de senha incorreta sem redirecionar
      if (error.response?.status === 401 && 
          (message.includes('Senha atual incorreta') || 
           message.includes('senha atual') || 
           message.includes('incorreta'))) {
        showSnackbar('Senha atual incorreta. Verifique e tente novamente.', 'error');
      } else if (error.response?.status === 401) {
        // Outros erros 401 (token inválido, etc)
        showSnackbar('Sessão expirada. Faça login novamente.', 'error');
      } else {
        showSnackbar(message, 'error');
      }
    } finally {
      setLoading(false);
    }
  }, [formData, showPasswordFields, user, isFormValid, showSnackbar, isCurrentPasswordValid, isNewPasswordValid, isPasswordConfirmationValid]);

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
    validationState,
    
    // Actions
    handleChange,
    handleTogglePasswordFields,
    handleSave,
    handleSnackbarClose,
    validateCurrentPassword,
    
    // Utils
    isFormValid,
    showSnackbar,
    
    // Validações específicas
    isCurrentPasswordValid,
    isNewPasswordValid,
    isPasswordConfirmationValid,
    getPasswordValidationMessage
  };
};
