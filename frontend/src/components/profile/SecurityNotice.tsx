import React from 'react';
import { Paper, Typography } from '@mui/material';

const SecurityNotice: React.FC = () => {
  return (
    <Paper sx={{ p: 3, mb: 3, bgcolor: 'info.light' }}>
      <Typography variant="body2" color="info.dark">
        <strong>💡 Dica de Segurança:</strong> Use uma senha forte com pelo menos 8 caracteres, 
        incluindo letras maiúsculas, minúsculas, números e símbolos. Mantenha sua senha segura 
        e não a compartilhe com outras pessoas.
      </Typography>
    </Paper>
  );
};

export default SecurityNotice;
