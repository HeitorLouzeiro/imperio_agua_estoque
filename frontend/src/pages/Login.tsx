import React from 'react';
import {
  Box,
  Container,
  Grid,
  CircularProgress,
} from '@mui/material';
import { Navigate } from 'react-router-dom';
import { LoginBrandSection, LoginForm } from '../components/login';
import { useLoginManagement } from '../hooks';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const {
    formData,
    showPassword,
    loading,
    error,
    handleFormDataChange,
    handleShowPasswordToggle,
    handleErrorClear,
    handleSubmit,
  } = useLoginManagement();

  // Se ainda está carregando a autenticação, mostrar loading
  if (authLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <CircularProgress size={60} sx={{ color: 'white' }} />
      </Box>
    );
  }

  // Se já está autenticado, redirecionar
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          {/* Lado esquerdo - Informações */}
          <Grid item xs={12} md={6}>
            <LoginBrandSection />
          </Grid>

          {/* Lado direito - Formulário de Login */}
          <Grid item xs={12} md={6}>
            <LoginForm
              formData={formData}
              showPassword={showPassword}
              loading={loading}
              error={error}
              onFormDataChange={handleFormDataChange}
              onShowPasswordToggle={handleShowPasswordToggle}
              onSubmit={handleSubmit}
              onErrorClear={handleErrorClear}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Login;
