import React from 'react';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';

const ProfileHeader: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: isMobile ? 'column' : 'row',
      justifyContent: 'space-between', 
      alignItems: isMobile ? 'stretch' : 'center',
      mb: 3,
      gap: 2
    }}>
      <Box>
        <Typography variant="h4" fontWeight="bold" color="primary">
          Gerenciamento de Perfil
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gerencie suas informações pessoais e configurações de segurança
        </Typography>
      </Box>
    </Box>
  );
};

export default ProfileHeader;
