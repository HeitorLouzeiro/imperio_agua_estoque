import React from 'react';
import {
  Box,
  Alert,
  Typography
} from '@mui/material';
import Layout from '../common/Layout';

const AccessDenied: React.FC = () => {
  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          <Typography variant="h6">Acesso Negado</Typography>
          <Typography>
            Apenas administradores podem gerenciar usuários do sistema.
          </Typography>
        </Alert>
      </Box>
    </Layout>
  );
};

export default AccessDenied;
