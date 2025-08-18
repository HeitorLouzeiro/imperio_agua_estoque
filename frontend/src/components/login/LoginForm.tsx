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
  Divider,
  Chip,
} from '@mui/material';
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  LoginRounded,
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
          borderRadius: 6,
          overflow: 'hidden',
          background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.95) 100%)',
          backdropFilter: 'blur(30px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        }}
      >
        <Card elevation={0} sx={{ backgroundColor: 'transparent' }}>
          <CardContent sx={{ p: 6 }}>
            <Box sx={{ textAlign: 'center', mb: 5 }}>
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                  borderRadius: '50%',
                  width: 80,
                  height: 80,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 2rem',
                  boxShadow: '0 12px 40px rgba(25, 118, 210, 0.3)',
                }}
              >
                <LoginRounded sx={{ fontSize: 40, color: 'white' }} />
              </Box>
              <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
                Bem-vindo de volta!
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Acesse sua conta para continuar
              </Typography>
              <Chip 
                label="Sistema Seguro" 
                size="small" 
                color="primary" 
                variant="outlined"
                sx={{ fontWeight: 500 }}
              />
            </Box>

            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3, 
                  borderRadius: 3,
                  border: '1px solid rgba(244, 67, 54, 0.2)',
                  backgroundColor: 'rgba(244, 67, 54, 0.05)',
                }}
              >
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
                sx={{ 
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    backgroundColor: 'rgba(25, 118, 210, 0.02)',
                    '&:hover': {
                      backgroundColor: 'rgba(25, 118, 210, 0.04)',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'rgba(25, 118, 210, 0.05)',
                    }
                  }
                }}
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
                        sx={{ 
                          color: 'primary.main',
                          '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.04)' }
                        }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  mb: 4,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    backgroundColor: 'rgba(25, 118, 210, 0.02)',
                    '&:hover': {
                      backgroundColor: 'rgba(25, 118, 210, 0.04)',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'rgba(25, 118, 210, 0.05)',
                    }
                  }
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: 4,
                  mb: 4,
                  background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 50%, #1976d2 100%)',
                  backgroundSize: '200% 200%',
                  boxShadow: '0 8px 30px rgba(25, 118, 210, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundPosition: 'right center',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 12px 40px rgba(25, 118, 210, 0.4)',
                  },
                  '&:active': {
                    transform: 'translateY(-1px)',
                  }
                }}
              >
                {loading ? 'Entrando...' : 'Entrar no Sistema'}
              </Button>

              <Divider sx={{ mb: 3, opacity: 0.5 }}>
                <Typography variant="body2" color="text.secondary">
                  ou
                </Typography>
              </Divider>

              <Box sx={{ textAlign: 'center' }}>
                <Link
                  href="#"
                  underline="hover"
                  color="primary"
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      color: 'primary.dark',
                      textDecoration: 'underline',
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
