import React, { createContext, useContext, useState, useEffect } from 'react';

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

  useEffect(() => {
    // Verificar se existe token salvo no localStorage
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Erro ao recuperar dados do usuário:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (email, senha) => {
    try {
      // TODO: Integrar com API real
      // const response = await authAPI.login(email, senha);
      
      // Simulação de login
      if (email === 'admin@imperio.com' && senha === '123456') {
        const userData = {
          id: 1,
          nome: 'Administrador',
          email: email,
          papel: 'administrador'
        };
        
        const token = 'mock-jwt-token';
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        
        return { success: true, user: userData };
      } else {
        throw new Error('Credenciais inválidas');
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      // TODO: Integrar com API real
      // const response = await authAPI.register(userData);
      
      // Simulação de registro
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return { success: true, message: 'Usuário criado com sucesso!' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const isAuthenticated = () => {
    return !!user && !!localStorage.getItem('token');
  };

  const isAdmin = () => {
    return user?.papel === 'administrador';
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated,
    isAdmin,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
