import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/index';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Sempre que o token mudar, atualiza os headers do authService
  useEffect(() => {
    if (token) {
      authService.setToken(token);
      verifyToken();
    } else {
      authService.setToken(null);
      setLoading(false);
    }
  }, [token]);

  const verifyToken = async () => {
    try {
      const userData = await authService.getProfile();
      setUser(userData);
    } catch (error) {
      console.error('Token inválido ou expirado:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, senha) => {
    try {
      const response = await authService.login(email, senha);
      const { token: newToken } = response;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);

      return { success: true };
    } catch (error) {
      console.error('Erro no login:', error);
      return {
        success: false,
        message: error.response?.data?.erro || 'Erro ao fazer login'
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      return { success: true, user: response };
    } catch (error) {
      console.error('Erro no cadastro:', error);
      return {
        success: false,
        message: error.response?.data?.erro || 'Erro ao cadastrar usuário'
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const isAdmin = () => user?.tipo === 'administrador';

  const isAuthenticated = () => !!user && !!token;

  const value = {
    user,
    login,
    register,
    logout,
    isAdmin,
    isAuthenticated,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
