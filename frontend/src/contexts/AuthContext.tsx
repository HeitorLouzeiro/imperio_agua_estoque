import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import { authService } from '../services';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, senha: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isAdmin: () => boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

interface LoginResponse {
  token: string;
  user?: User;
}

interface AuthError {
  response?: {
    data?: {
      erro?: string;
    };
  };
}

// Cria contexto com tipo opcional
const AuthContext = createContext<AuthContextType | null>(null);

// Hook personalizado para usar o AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

// Provider para envolver a aplicação
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  const logout = useCallback((): void => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  }, []);

  const verifyToken = useCallback(async (): Promise<void> => {
    try {
      const userData = await authService.getProfile();
      setUser(userData);
    } catch (error) {
      console.error('Token inválido ou expirado:', error);
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    if (token) {
      authService.setToken(token);
      verifyToken();
    } else {
      authService.setToken(null);
      setLoading(false);
    }
  }, [token, verifyToken]);

  const login = async (email: string, senha: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response: LoginResponse = await authService.login(email, senha);
      const { token: newToken } = response;

      localStorage.setItem('token', newToken);
      setToken(newToken);

      return { success: true };
    } catch (error) {
      console.error('Erro no login:', error);
      const authError = error as AuthError;
      return {
        success: false,
        message: authError.response?.data?.erro || 'Erro ao fazer login'
      };
    }
  };

  const isAuthenticated = !!user && !!token;

  const isAdmin = (): boolean => {
    console.log('isAdmin function called');
    console.log('Current user:', user);
    console.log('User role:', user?.role);
    console.log('User papel:', user?.papel);
    
    // TEMPORÁRIO: sempre retorna true para debug
    const adminCheck = true; // user?.role === 'administrador' || user?.papel === 'administrador';
    console.log('Admin check result (TEMP=true):', adminCheck);
    
    return adminCheck;
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    logout,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export { }; // Export default for easier imports in other files

