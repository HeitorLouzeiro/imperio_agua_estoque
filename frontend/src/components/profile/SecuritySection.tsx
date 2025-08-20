import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Divider,
  Switch,
  FormControlLabel,
  Alert,
  LinearProgress,
  Chip,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Security as SecurityIcon,
  Lock as LockIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Visibility,
  VisibilityOff,
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
  
  // Novas funções de validação
  isCurrentPasswordValid: () => boolean;
  isNewPasswordValid: () => boolean;
  isPasswordConfirmationValid: () => boolean;
  getPasswordValidationMessage: () => string;
  
  // Estado de validação da senha atual
  validationState: {
    isCurrentPasswordCorrect: boolean | null;
    currentPasswordError: string;
  };
  validateCurrentPassword: () => Promise<void>;
}

const SecuritySection: React.FC<SecuritySectionProps> = ({
  formData,
  showPasswordFields,
  handleChange,
  handleTogglePasswordFields,
  isCurrentPasswordValid,
  isNewPasswordValid,
  isPasswordConfirmationValid,
  getPasswordValidationMessage,
  validationState,
  validateCurrentPassword
}) => {
  // Estados para controlar visibilidade das senhas
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Funções para alternar visibilidade das senhas
  const handleToggleCurrentPassword = () => setShowCurrentPassword(!showCurrentPassword);
  const handleToggleNewPassword = () => setShowNewPassword(!showNewPassword);
  const handleToggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);
  // Função para avaliar força da senha - simplificada
  const getPasswordStrength = (password: string) => {
    if (!password) return { score: 0, label: '', color: 'grey' };
    
    if (password.length < 6) {
      return { score: 20, label: 'Muito Curta', color: 'error' };
    } else if (password.length < 10) {
      return { score: 60, label: 'Boa', color: 'warning' };
    } else {
      return { score: 100, label: 'Excelente', color: 'success' };
    }
  };

  const passwordStrength = getPasswordStrength(formData.novaSenha);
  return (
    <Paper sx={{ p: 4, mb: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Box
          sx={{
            background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
            borderRadius: '50%',
            p: 1.5,
            mr: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <SecurityIcon sx={{ color: 'white', fontSize: 28 }} />
        </Box>
        <Box>
          <Typography variant="h6" fontWeight="bold">
            Configurações de Segurança
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Mantenha sua conta protegida
          </Typography>
        </Box>
      </Box>

      <Alert 
        severity="info" 
        sx={{ mb: 3, borderRadius: 2 }}
        icon={<SecurityIcon />}
      >
        <Typography variant="body2">
          <strong>💡 Validação Inteligente:</strong> Digite sua senha atual e clique fora do campo 
          para verificação automática. O sistema mostrará se a senha está correta com 
          ícones visuais em tempo real.
        </Typography>
      </Alert>

      <FormControlLabel
        control={
          <Switch
            checked={showPasswordFields}
            onChange={handleTogglePasswordFields}
            color="primary"
            size="medium"
          />
        }
        label={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LockIcon sx={{ mr: 1, fontSize: '1.2rem', color: 'primary.main' }} />
            <Box>
              <Typography variant="body1" fontWeight={500}>
                Alterar Senha
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {showPasswordFields ? 'Preencha os campos abaixo' : 'Clique para alterar sua senha'}
              </Typography>
            </Box>
          </Box>
        }
        sx={{ mb: 3, alignItems: 'flex-start' }}
      />

      {showPasswordFields && (
        <>
          <Divider sx={{ my: 3 }} />
          
          <Alert 
            severity="warning" 
            sx={{ mb: 3, borderRadius: 2 }}
            icon={<LockIcon />}
          >
            <Typography variant="body2">
              <strong>✨ Nova Funcionalidade:</strong> Digite sua senha atual e clique fora do campo 
              para verificação automática. Você verá um ✅ se estiver correta ou ❌ se estiver incorreta.
            </Typography>
          </Alert>

          {/* Alerta de validação em tempo real */}
          {getPasswordValidationMessage() && (
            <Alert 
              severity="error" 
              sx={{ mb: 3, borderRadius: 2 }}
              icon={<ErrorIcon />}
            >
              <Typography variant="body2">
                {getPasswordValidationMessage()}
              </Typography>
            </Alert>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Senha Atual"
                name="senhaAtual"
                type={showCurrentPassword ? "text" : "password"}
                value={formData.senhaAtual}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleChange(e);
                  // Resetar validação quando o usuário começa a digitar
                  if (validationState.isCurrentPasswordCorrect !== null) {
                    // Aqui poderíamos resetar a validação, mas vamos deixar
                    // para ser resetada apenas no hook
                  }
                }}
                onBlur={() => {
                  // Validar apenas se há conteúdo no campo
                  if (formData.senhaAtual.trim()) {
                    validateCurrentPassword();
                  }
                }}
                fullWidth
                required
                variant="outlined"
                error={
                  (formData.senhaAtual.length > 0 && validationState.isCurrentPasswordCorrect === false) ||
                  !!validationState.currentPasswordError
                }
                helperText={
                  validationState.currentPasswordError ||
                  (validationState.isCurrentPasswordCorrect === true 
                    ? "✓ Senha atual confirmada" 
                    : formData.senhaAtual.length > 0 
                      ? "Clique fora do campo para validar" 
                      : "Digite sua senha atual para confirmar a alteração")
                }
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {validationState.isCurrentPasswordCorrect === true && (
                        <CheckIcon sx={{ color: 'success.main', mr: 1 }} />
                      )}
                      {validationState.isCurrentPasswordCorrect === false && (
                        <ErrorIcon sx={{ color: 'error.main', mr: 1 }} />
                      )}
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleToggleCurrentPassword}
                        edge="end"
                      >
                        {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Nova Senha"
                name="novaSenha"
                type={showNewPassword ? "text" : "password"}
                value={formData.novaSenha}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
                error={formData.novaSenha.length > 0 && !isNewPasswordValid()}
                helperText={
                  formData.novaSenha.length > 0 && !isNewPasswordValid()
                    ? "A nova senha deve ter pelo menos 6 caracteres"
                    : "Mínimo de 6 caracteres"
                }
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {formData.novaSenha.length > 0 && isNewPasswordValid() && (
                        <CheckIcon sx={{ color: 'success.main', mr: 1 }} />
                      )}
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleToggleNewPassword}
                        edge="end"
                      >
                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              
              {formData.novaSenha && (
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Força da senha:
                    </Typography>
                    <Chip 
                      label={passwordStrength.label}
                      size="small"
                      color={passwordStrength.color as any}
                      variant="outlined"
                    />
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={passwordStrength.score}
                    color={passwordStrength.color as any}
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>
              )}
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Confirmar Nova Senha"
                name="confirmarSenha"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmarSenha}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
                error={formData.confirmarSenha.length > 0 && !isPasswordConfirmationValid()}
                helperText={
                  formData.confirmarSenha.length > 0 && !isPasswordConfirmationValid()
                    ? 'As senhas não coincidem'
                    : 'Digite a nova senha novamente'
                }
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {isPasswordConfirmationValid() && formData.confirmarSenha ? (
                        <CheckIcon sx={{ color: 'success.main', mr: 1 }} />
                      ) : formData.confirmarSenha && !isPasswordConfirmationValid() ? (
                        <ErrorIcon sx={{ color: 'error.main', mr: 1 }} />
                      ) : null}
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleToggleConfirmPassword}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>

          {formData.novaSenha && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Requisitos da senha:
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {isNewPasswordValid() ? (
                      <CheckIcon sx={{ color: 'success.main', fontSize: 16 }} />
                    ) : (
                      <ErrorIcon sx={{ color: 'error.main', fontSize: 16 }} />
                    )}
                    <Typography variant="body2" color={isNewPasswordValid() ? 'success.main' : 'text.secondary'}>
                      Pelo menos 6 caracteres
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {isPasswordConfirmationValid() ? (
                      <CheckIcon sx={{ color: 'success.main', fontSize: 16 }} />
                    ) : (
                      <ErrorIcon sx={{ color: 'error.main', fontSize: 16 }} />
                    )}
                    <Typography variant="body2" color={isPasswordConfirmationValid() ? 'success.main' : 'text.secondary'}>
                      Senhas coincidem
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </>
      )}
    </Paper>
  );
};

export default SecuritySection;
