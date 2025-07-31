import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

interface FormData {
  email: string;
  senha: string;
}

export const useLoginManagement = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    senha: '',
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleFormDataChange = (data: FormData): void => {
    setFormData(data);
  };

  const handleShowPasswordToggle = (): void => {
    setShowPassword(!showPassword);
  };

  const handleErrorClear = (): void => {
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(formData.email, formData.senha);
      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setError(result.message || 'Erro ao fazer login');
      }
    } catch (err) {
      setError('Erro interno do servidor. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    showPassword,
    loading,
    error,
    handleFormDataChange,
    handleShowPasswordToggle,
    handleErrorClear,
    handleSubmit,
  };
};
