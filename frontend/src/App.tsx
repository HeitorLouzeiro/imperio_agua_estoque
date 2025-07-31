import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';

import theme from './theme';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/common/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Páginas
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Sales from './pages/Sales';
import Users from './pages/Users';

// Componente para redirecionamento baseado na autenticação
const AuthRedirect: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Rota raiz - redireciona baseado na autenticação */}
              <Route path="/" element={<AuthRedirect />} />

              {/* Rota de login - não protegida */}
              <Route path="/login" element={<Login />} />

              {/* Rotas protegidas com layout */}
              <Route
                path="/*"
                element={
                  <ProtectedRoute requiredRole={undefined}>
                    <Layout>
                      <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/sales" element={<Sales />} />

                        {/* Rota exclusiva para administrador */}
                        <Route
                          path="/users"
                          element={
                            <ProtectedRoute requiredRole="administrador">
                              <Users />
                            </ProtectedRoute>
                          }
                        />

                        {/* Rota catch-all para páginas não encontradas */}
                        <Route path="*" element={<Navigate to="/dashboard" replace />} />
                      </Routes>
                    </Layout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;
