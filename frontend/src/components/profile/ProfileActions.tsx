import React from 'react';
import { Box, Button, CircularProgress } from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';

interface ProfileActionsProps {
  loading: boolean;
  isFormValid: () => boolean;
  handleSave: () => void;
}

const ProfileActions: React.FC<ProfileActionsProps> = ({
  loading,
  isFormValid,
  handleSave
}) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 4 }}>
      <Button
        variant="contained"
        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
        onClick={handleSave}
        disabled={loading || !isFormValid()}
        size="large"
        sx={{ borderRadius: 2, minWidth: 150 }}
      >
        {loading ? 'Salvando...' : 'Salvar Alterações'}
      </Button>
    </Box>
  );
};

export default ProfileActions;
