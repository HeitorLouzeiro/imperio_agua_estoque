import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  Grid,
  Divider,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Water as WaterIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.nome.trim()) {
      setError('Nome é obrigatório');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email é obrigatório');
      return false;
    }
    if (formData.senha.length < 6) {
      setError('Senha deve ter pelo menos 6 caracteres');
      return false;
    }
    if (formData.senha !== formData.confirmarSenha) {
      setError('Senhas não coincidem');
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const result = await register({
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha
      });
      
      if (result.success) {
        alert('Conta criada com sucesso! Você será redirecionado para o login.');
        navigate('/login');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
            maxWidth: 450,
            borderRadius: 2,
          }}
        >
          {/* Logo e Título */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <WaterIcon sx={{ fontSize: 40, color: 'primary.main', mr: 1 }} />
            <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
              Império Água
            </Typography>
          </Box>

          <Typography variant="h6" component="h2" color="text.secondary" sx={{ mb: 3 }}>
            Criar Nova Conta
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
              id="nome"
              label="Nome Completo"
              name="nome"
              autoComplete="name"
              autoFocus
              value={formData.nome}
              onChange={handleChange('nome')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
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

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="senha"
                  label="Senha"
                  type={showPassword ? 'text' : 'password'}
                  id="senha"
                  autoComplete="new-password"
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
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="confirmarSenha"
                  label="Confirmar Senha"
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmarSenha"
                  autoComplete="new-password"
                  value={formData.confirmarSenha}
                  onChange={handleChange('confirmarSenha')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle confirm password visibility"
                          onClick={handleToggleConfirmPassword}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ 
                mt: 3, 
                mb: 2, 
                py: 1.5,
                fontSize: '1.1rem',
                textTransform: 'none',
              }}
            >
              {loading ? 'Criando conta...' : 'Criar Conta'}
            </Button>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Já tem uma conta?{' '}
                <Link 
                  to="/login" 
                  style={{ 
                    color: '#1976d2', 
                    textDecoration: 'none',
                    fontWeight: 500
                  }}
                >
                  Entre aqui
                </Link>
              </Typography>
            </Box>
          </Box>

          {/* Informações sobre senha */}
          <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1, width: '100%' }}>
            <Typography variant="caption" color="text.secondary" display="block" align="center">
              <strong>Requisitos da senha:</strong>
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" align="center">
              • Mínimo de 6 caracteres
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" align="center">
              • Senhas devem coincidir
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
