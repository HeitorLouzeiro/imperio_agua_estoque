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
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #667eea 50%, #764ba2 75%, #667eea 100%)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 15s ease infinite',
        display: 'flex',
        alignItems: 'center',
        py: 4,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
          zIndex: 1,
        },
        '@keyframes gradientShift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        }
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <Grid container spacing={6} alignItems="center">
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
