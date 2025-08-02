import React from 'react';
import { Box, Typography } from '@mui/material';

const ProfileHeader: React.FC = () => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Configurações do Perfil
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Gerencie suas informações pessoais e configurações de segurança
      </Typography>
    </Box>
  );
};

export default ProfileHeader;
