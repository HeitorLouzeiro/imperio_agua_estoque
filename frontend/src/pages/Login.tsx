import React from 'react';
import {
  Box,
  Container,
  Grid,
} from '@mui/material';
import { LoginBrandSection, LoginForm } from '../components/login';
import { useLoginManagement } from '../hooks';

const Login: React.FC = () => {
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
