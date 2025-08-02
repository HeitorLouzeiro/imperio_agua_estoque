import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Divider,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Security as SecurityIcon,
  Lock as LockIcon
} from '@mui/icons-material';

interface SecuritySectionProps {
  formData: {
    senhaAtual: string;
    novaSenha: string;
    confirmarSenha: string;
  };
  showPasswordFields: boolean;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleTogglePasswordFields: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SecuritySection: React.FC<SecuritySectionProps> = ({
  formData,
  showPasswordFields,
  handleChange,
  handleTogglePasswordFields
}) => {
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <SecurityIcon sx={{ mr: 2, color: 'warning.main' }} />
        <Typography variant="h6" fontWeight="bold">
          Configurações de Segurança
        </Typography>
      </Box>

      <FormControlLabel
        control={
          <Switch
            checked={showPasswordFields}
            onChange={handleTogglePasswordFields}
            color="primary"
          />
        }
        label={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LockIcon sx={{ mr: 1, fontSize: '1rem' }} />
            Alterar Senha
          </Box>
        }
        sx={{ mb: 2 }}
      />

      {showPasswordFields && (
        <>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Senha Atual"
                name="senhaAtual"
                type="password"
                value={formData.senhaAtual}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
                helperText="Digite sua senha atual para confirmar a alteração"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Nova Senha"
                name="novaSenha"
                type="password"
                value={formData.novaSenha}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
                helperText="Mínimo de 6 caracteres"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Confirmar Nova Senha"
                name="confirmarSenha"
                type="password"
                value={formData.confirmarSenha}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
                error={formData.confirmarSenha !== '' && formData.novaSenha !== formData.confirmarSenha}
                helperText={
                  formData.confirmarSenha !== '' && formData.novaSenha !== formData.confirmarSenha
                    ? 'As senhas não coincidem'
                    : 'Digite a nova senha novamente'
                }
              />
            </Grid>
          </Grid>
        </>
      )}
    </Paper>
  );
};

export default SecuritySection;
