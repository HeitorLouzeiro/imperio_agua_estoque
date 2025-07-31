import React from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Link,
  Paper,
  Fade,
} from '@mui/material';
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';

interface FormData {
  email: string;
  senha: string;
}

interface LoginFormProps {
  formData: FormData;
  showPassword: boolean;
  loading: boolean;
  error: string;
  onFormDataChange: (data: FormData) => void;
  onShowPasswordToggle: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  onErrorClear: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  formData,
  showPassword,
  loading,
  error,
  onFormDataChange,
  onShowPasswordToggle,
  onSubmit,
  onErrorClear,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newFormData = {
      ...formData,
      [e.target.name]: e.target.value,
    };
    onFormDataChange(newFormData);
    if (error) onErrorClear();
  };

  return (
    <Fade in timeout={800}>
      <Paper
        elevation={24}
        sx={{
          borderRadius: 4,
          overflow: 'hidden',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <Card elevation={0} sx={{ backgroundColor: 'transparent' }}>
          <CardContent sx={{ p: 6 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
                Bem-vindo!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Faça login para acessar o sistema
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={onSubmit}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />

              <TextField
                fullWidth
                label="Senha"
                name="senha"
                type={showPassword ? 'text' : 'password'}
                value={formData.senha}
                onChange={handleChange}
                margin="normal"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="primary" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={onShowPasswordToggle}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 4 }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: 3,
                  mb: 3,
                  background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(25, 118, 210, 0.4)',
                  },
                }}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Link
                  href="#"
                  underline="hover"
                  color="primary"
                  sx={{
                    fontWeight: 500,
                    '&:hover': {
                      color: 'primary.dark',
                    },
                  }}
                >
                  Esqueceu sua senha?
                </Link>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Paper>
    </Fade>
  );
};

export default LoginForm;
