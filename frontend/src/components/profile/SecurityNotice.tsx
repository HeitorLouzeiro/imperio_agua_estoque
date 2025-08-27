import React from 'react';
import { Paper, Typography, Box, Chip } from '@mui/material';
import { Security, CheckCircle, Visibility } from '@mui/icons-material';

const SecurityNotice: React.FC = () => {
  return (
    <Paper sx={{ p: 3, mb: 3, bgcolor: 'info.light', borderRadius: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Security sx={{ color: 'info.dark', mr: 1 }} />
        <Typography variant="h6" color="info.dark" fontWeight="bold">
          💡 Dicas de Segurança
        </Typography>
      </Box>
      
      <Typography variant="body2" color="info.dark" paragraph>
        <strong>Criação de senha segura:</strong> Use uma senha forte com pelo menos 6 caracteres, 
        incluindo letras maiúsculas, minúsculas, números e símbolos.
      </Typography>
      
      <Typography variant="body2" color="info.dark" paragraph>
        <strong>Como usar a validação automática:</strong>
      </Typography>
      
      <Box component="ol" sx={{ color: 'info.dark', fontSize: '0.875rem', pl: 2, mt: 1 }}>
        <Box component="li" sx={{ mb: 0.5 }}>
          Ative o switch "Alterar Senha"
        </Box>
        <Box component="li" sx={{ mb: 0.5 }}>
          Digite sua senha atual no campo correspondente
        </Box>
        <Box component="li" sx={{ mb: 0.5 }}>
          Clique fora do campo ou pressione Tab para validar
        </Box>
        <Box component="li" sx={{ mb: 0.5 }}>
          Veja o ícone ✅ (correta) ou ❌ (incorreta) aparecer
        </Box>
      </Box>
      
      <Typography variant="body2" color="info.dark" paragraph>
        <strong>Validação em tempo real:</strong> Ao alterar sua senha, o sistema verifica 
        automaticamente se sua senha atual está correta quando você clica fora do campo.
      </Typography>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
        <Chip 
          icon={<CheckCircle />} 
          label="Validação automática" 
          size="small" 
          color="success" 
          variant="outlined"
        />
        <Chip 
          icon={<Visibility />} 
          label="Senhas ocultáveis" 
          size="small" 
          color="info" 
          variant="outlined"
        />
        <Chip 
          icon={<Security />} 
          label="Verificação segura" 
          size="small" 
          color="primary" 
          variant="outlined"
        />
      </Box>
      
      <Typography variant="body2" color="info.dark" sx={{ mt: 2, fontStyle: 'italic' }}>
        ⚠️ Mantenha sua senha segura e não a compartilhe com outras pessoas.
      </Typography>
    </Paper>
  );
};

export default SecurityNotice;
