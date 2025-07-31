import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Fade,
} from '@mui/material';
import {
  Store,
  Water,
  Security,
  Speed,
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
  );
};

export default LoginBrandSection;
