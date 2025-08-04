import React from 'react';
import { Box, Paper, Typography, Chip, Avatar } from '@mui/material';

interface ProfileCardProps {
  user: {
    nome?: string;
    name?: string;
    email?: string;
    role?: string;
    papel?: string;
  };
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user }) => {
  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .slice(0, 2)
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const getRoleColor = (role: string) => {
    return role === 'administrador' ? 'error' : 'primary';
  };

  const getRoleLabel = (role: string) => {
    return role === 'administrador' ? 'Administrador' : 'Funcionário';
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Avatar
          sx={{ 
            width: 80, 
            height: 80, 
            mr: 3,
            bgcolor: getRoleColor(user.role || user.papel || 'funcionario') + '.main',
            fontSize: '1.5rem',
            fontWeight: 'bold'
          }}
        >
          {getUserInitials(user.nome || user.name || '')}
        </Avatar>
        <Box>
          <Typography variant="h5" fontWeight="bold">
            {user.nome || user.name}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
            {user.email}
          </Typography>
          <Chip
            label={getRoleLabel(user.role || user.papel || 'funcionario')}
            color={getRoleColor(user.role || user.papel || 'funcionario')}
            size="small"
            variant="outlined"
          />
        </Box>
      </Box>
    </Paper>
  );
};

export default ProfileCard;
