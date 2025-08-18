import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Fade,
  Chip,
} from '@mui/material';
import {
  Store,
  Water,
  Security,
  Speed,
  Analytics,
  CloudDone,
} from '@mui/icons-material';

interface Feature {
  icon: React.ReactElement;
  title: string;
  description: string;
}

const LoginBrandSection: React.FC = () => {
  const features: Feature[] = [
    {
      icon: <Store sx={{ fontSize: 40 }} />,
      title: 'Gestão Completa',
      description: 'Controle total do seu estoque de água mineral com interface moderna',
    },
    {
      icon: <Analytics sx={{ fontSize: 40 }} />,
      title: 'Dashboard Inteligente',
      description: 'Relatórios e métricas em tempo real para decisões rápidas',
    },
    {
      icon: <Speed sx={{ fontSize: 40 }} />,
      title: 'Performance Otimizada',
      description: 'Sistema rápido e responsivo para máxima produtividade',
    },
    {
      icon: <Security sx={{ fontSize: 40 }} />,
      title: 'Segurança Avançada',
      description: 'Proteção de dados com criptografia e backup automático',
    },
  ];

  return (
    <Fade in timeout={1000}>
      <Box sx={{ color: 'white', pr: { md: 4 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Box
            sx={{
              background: 'linear-gradient(135deg, #42a5f5 0%, #1976d2 100%)',
              borderRadius: '50%',
              p: 1.5,
              mr: 2,
              boxShadow: '0 8px 32px rgba(66, 165, 245, 0.3)',
            }}
          >
            <Water sx={{ fontSize: 48, color: 'white' }} />
          </Box>
          <Box>
            <Typography variant="h3" fontWeight="bold" sx={{ mb: 0.5 }}>
              Império Água
            </Typography>
            <Chip 
              label="v2.0" 
              size="small" 
              sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                color: 'white',
                fontWeight: 'bold'
              }} 
            />
          </Box>
        </Box>

        <Typography variant="h5" sx={{ mb: 4, opacity: 0.95, fontWeight: 500 }}>
          Sistema Inteligente de Gestão de Estoque
        </Typography>

        <Typography variant="body1" sx={{ mb: 6, opacity: 0.85, lineHeight: 1.8, fontSize: '1.1rem' }}>
          Transforme sua gestão com tecnologia de ponta. Controle vendas, estoque, 
          usuários e relatórios em uma plataforma moderna e intuitiva.
        </Typography>

        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} key={index}>
              <Fade in timeout={1200 + index * 200}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box
                    sx={{
                      color: 'white',
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)',
                      borderRadius: 3,
                      p: 1.5,
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                      }
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ mb: 0.5, fontWeight: 600 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.85, lineHeight: 1.6 }}>
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
  );
};

export default LoginBrandSection;
