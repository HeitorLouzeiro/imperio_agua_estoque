
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
  UserQuickEditDialog,
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
    openQuickEditDialog,
    editingUser,
    searchTerm,
    roleFilter,
    statusFilter,
    snackbar,
    formData,
    quickEditData,
    
    // Computed
    filteredUsers,
    
    // Actions
    setSearchTerm,
    setRoleFilter,
    setStatusFilter,
    loadUsers,
    handleDialogOpen,
    handleDialogClose,
    handleQuickEditOpen,
    handleQuickEditClose,
    handleChange,
    handleSelectChange,
    handleQuickEditRoleChange,
    handleQuickEditStatusChange,
    handleSave,
    handleQuickEditSave,
    handleDelete,
    handleToggleStatus,
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
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          onClearFilters={handleClearFilters}
        />

        {/* Table */}
        <UserTable
          users={filteredUsers}
          loading={loading}
          onEdit={handleQuickEditOpen}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
        />

        {/* Form Dialog - Apenas para criação */}
        <UserFormDialog
          open={openDialog}
          onClose={handleDialogClose}
          onSave={handleSave}
          editingUser={null} // Sempre null para criação
          formData={formData}
          onFormChange={handleChange}
          onSelectChange={handleSelectChange}
        />

        {/* Quick Edit Dialog - Para edição de status e papel */}
        <UserQuickEditDialog
          open={openQuickEditDialog}
          onClose={handleQuickEditClose}
          onSave={handleQuickEditSave}
          editingUser={editingUser}
          currentRole={quickEditData.role}
          currentStatus={quickEditData.status}
          onRoleChange={handleQuickEditRoleChange}
          onStatusChange={handleQuickEditStatusChange}
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
