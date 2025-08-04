import React from 'react';
import { Box, Paper, Typography, Grid, TextField } from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';

interface PersonalInfoSectionProps {
  formData: {
    nome: string;
    email: string;
  };
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({ 
  formData, 
  handleChange 
}) => {
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <PersonIcon sx={{ mr: 2, color: 'primary.main' }} />
        <Typography variant="h6" fontWeight="bold">
          Informações Pessoais
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Nome Completo"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            fullWidth
            required
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            required
            variant="outlined"
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default PersonalInfoSection;
