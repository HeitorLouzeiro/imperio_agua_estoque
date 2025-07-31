import React, { useState } from 'react';
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
  Container,
  Paper,
  Grid,
  Fade,
} from '@mui/material';
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Store,
  Water,
  Security,
  Speed,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

interface FormData {
  email: string;
  senha: string;
}

interface Feature {
  icon: React.ReactElement;
  title: string;
  description: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    senha: '',
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(formData.email, formData.senha);
      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setError(result.message || 'Erro ao fazer login');
      }
    } catch (err) {
      setError('Erro interno do servidor. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const features: Feature[] = [
    {
      icon: <Store sx={{ fontSize: 40 }} />,
      title: 'Gestão Completa',
      description: 'Controle total do seu estoque de água mineral',
    },
    {
      icon: <Speed sx={{ fontSize: 40 }} />,
      title: 'Relatórios em Tempo Real',
      description: 'Acompanhe vendas e estoque instantaneamente',
    },
    {
      icon: <Security sx={{ fontSize: 40 }} />,
      title: 'Segurança Avançada',
      description: 'Seus dados protegidos com criptografia',
    },
  ];

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
            <Fade in timeout={1000}>
              <Box sx={{ color: 'white', pr: { md: 4 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                  <Water sx={{ fontSize: 48, mr: 2 }} />
                  <Typography variant="h3" fontWeight="bold">
                    Império Água
                  </Typography>
                </Box>

                <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                  Sistema Inteligente de Gestão de Estoque
                </Typography>

                <Typography variant="body1" sx={{ mb: 6, opacity: 0.8, lineHeight: 1.8 }}>
                  Gerencie seu negócio de água mineral com eficiência e praticidade. 
                  Controle vendas, estoque, usuários e relatórios em uma única plataforma.
                </Typography>

                <Grid container spacing={3}>
                  {features.map((feature, index) => (
                    <Grid item xs={12} key={index}>
                      <Fade in timeout={1200 + index * 200}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                          <Box
                            sx={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              borderRadius: 2,
                              p: 1,
                              backdropFilter: 'blur(10px)',
                            }}
                          >
                            {feature.icon}
                          </Box>
                          <Box>
                            <Typography variant="h6" sx={{ mb: 0.5 }}>
                              {feature.title}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                              {feature.description}
                            </Typography>
                          </Box>
                        </Box>
                      </Fade>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Fade>
          </Grid>

          {/* Lado direito - Formulário de Login */}
          <Grid item xs={12} md={6}>
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

                    <Box component="form" onSubmit={handleSubmit}>
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
                                onClick={() => setShowPassword(!showPassword)}
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
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Login;
