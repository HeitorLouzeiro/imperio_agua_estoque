import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  InputAdornment,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
  Water as WaterIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = location.state?.from?.pathname || '/';

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(formData.email, formData.senha);
      
      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          py: 3,
        }}
      >
        <Paper
          elevation={8}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: 400,
            borderRadius: 2,
          }}
        >
          {/* Logo e Título */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <WaterIcon sx={{ fontSize: 40, color: 'primary.main', mr: 1 }} />
            <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
              Império Água
            </Typography>
          </Box>

          <Typography variant="h6" component="h2" color="text.secondary" sx={{ mb: 3 }}>
            Sistema de Controle de Estoque
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange('email')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="senha"
              label="Senha"
              type={showPassword ? 'text' : 'password'}
              id="senha"
              autoComplete="current-password"
              value={formData.senha}
              onChange={handleChange('senha')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ 
                mt: 2, 
                mb: 2, 
                py: 1.5,
                fontSize: '1.1rem',
                textTransform: 'none',
              }}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Não tem uma conta?{' '}
                <Link 
                  to="/register" 
                  style={{ 
                    color: '#1976d2', 
                    textDecoration: 'none',
                    fontWeight: 500
                  }}
                >
                  Cadastre-se aqui
                </Link>
              </Typography>
            </Box>
          </Box>

          {/* Credenciais de exemplo */}
          <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1, width: '100%' }}>
            <Typography variant="caption" color="text.secondary" display="block" align="center">
              <strong>Credenciais de exemplo:</strong>
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" align="center">
              Email: admin@imperio.com
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" align="center">
              Senha: 123456
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
