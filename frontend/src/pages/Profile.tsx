import React from 'react';
import {
  Box,
  Snackbar,
  Alert
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useProfileManagement } from '../hooks';
import Layout from '../components/common/Layout';
import {
  ProfileHeader,
  ProfileCard,
  PersonalInfoSection,
  SecuritySection,
  SecurityNotice,
  ProfileActions
} from '../components/profile';

const Profile = () => {
  const { user } = useAuth();
  const {
    loading,
    formData,
    snackbar,
    showPasswordFields,
    handleChange,
    handleTogglePasswordFields,
    handleSave,
    handleSnackbarClose,
    isFormValid
  } = useProfileManagement();

  if (!user) {
    return (
      <Layout>
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <div>Usuário não encontrado</div>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        <ProfileHeader />
        
        <ProfileCard user={user} />
        
        <PersonalInfoSection 
          formData={formData}
          handleChange={handleChange}
        />
        
        <SecuritySection
          formData={formData}
          showPasswordFields={showPasswordFields}
          handleChange={handleChange}
          handleTogglePasswordFields={handleTogglePasswordFields}
        />
        
        <SecurityNotice />
        
        <ProfileActions
          loading={loading}
          isFormValid={isFormValid}
          handleSave={handleSave}
        />

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleSnackbarClose} 
            severity={snackbar.severity} 
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Layout>
  );
};

export default Profile;
