
import React, { useEffect } from 'react';
import {
  Box,
  Button,
  Snackbar,
  Alert,
  Typography
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/common/Layout';
import {
  UserFilters,
  UserTable,
  UserFormDialog,
  AccessDenied
} from '../components/users';
import { useUserManagement } from '../hooks';

const Users = () => {
  const { isAdmin } = useAuth();
  const hasAccess = isAdmin();

  const {
    // States
    loading,
    openDialog,
    editingUser,
    searchTerm,
    roleFilter,
    snackbar,
    formData,
    
    // Computed
    filteredUsers,
    
    // Actions
    setSearchTerm,
    setRoleFilter,
    loadUsers,
    handleDialogOpen,
    handleDialogClose,
    handleChange,
    handleSelectChange,
    handleSave,
    handleDelete,
    handleSnackbarClose,
    handleClearFilters,
  } = useUserManagement();

  useEffect(() => {
    if (hasAccess) {
      loadUsers();
    }
  }, [hasAccess, loadUsers]);

  if (!hasAccess) {
    return <AccessDenied />;
  }

  return (
    <Layout>
      <Box>
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Usuários
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Gerencie os usuários e permissões do sistema
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={() => handleDialogOpen()} 
            sx={{ borderRadius: 2 }}
          >
            Novo Usuário
          </Button>
        </Box>

        {/* Filters */}
        <UserFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          onClearFilters={handleClearFilters}
        />

        {/* Table */}
        <UserTable
          users={filteredUsers}
          loading={loading}
          onEdit={handleDialogOpen}
          onDelete={handleDelete}
        />

        {/* Form Dialog */}
        <UserFormDialog
          open={openDialog}
          onClose={handleDialogClose}
          onSave={handleSave}
          editingUser={editingUser}
          formData={formData}
          onFormChange={handleChange}
          onSelectChange={handleSelectChange}
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

export default Users;
