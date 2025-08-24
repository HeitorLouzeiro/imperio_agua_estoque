/// <reference types="react" />
import React, { useEffect } from 'react';
import {
  Box,
  Button,
  Snackbar,
  Alert,
  Typography,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Paper,
  Avatar
} from '@mui/material';
import { 
  Add as AddIcon,
  People as PeopleIcon,
  AdminPanelSettings as AdminIcon,
  Work as WorkIcon,
  CheckCircle as ActiveIcon,
  Search as SearchIcon
} from '@mui/icons-material';
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

const Users: React.FC = () => {
  const { isAdmin } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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

  // Calcular estatísticas
  const totalUsers = filteredUsers.length;
  const activeUsers = filteredUsers.filter((user: any) => user.ativo).length;
  const inactiveUsers = totalUsers - activeUsers;
  const adminUsers = filteredUsers.filter((user: any) => user.papel === 'administrador' && user.ativo).length;
  const employeeUsers = filteredUsers.filter((user: any) => user.papel === 'funcionario' && user.ativo).length;

  if (!hasAccess) {
    return <AccessDenied />;
  }

  return (
    <Layout>
      <Box sx={{ mb: 4 }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between', 
          alignItems: isMobile ? 'stretch' : 'center',
          mb: 3,
          gap: 2
        }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" color="primary.main">
              Gerenciamento de Usuários
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Controle completo de usuários e permissões do sistema
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={() => handleDialogOpen()} 
            size={isMobile ? "medium" : "large"}
            sx={{ 
              borderRadius: 3,
              textTransform: 'none',
              fontWeight: 'bold',
              px: 3
            }}
          >
            Novo Usuário
          </Button>
        </Box>

        {/* Cards de Estatísticas */}
        <Grid container spacing={isMobile ? 1.5 : 3} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={6} md={3}>
            <Card sx={{ 
              borderRadius: 3, 
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              height: '100%',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
              }
            }}>
              <CardContent sx={{ p: isMobile ? 1.5 : 2 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  flexDirection: isMobile ? 'column' : 'row',
                  gap: isMobile ? 1 : 0
                }}>
                  <Box sx={{ textAlign: isMobile ? 'center' : 'left' }}>
                    <Typography variant={isMobile ? "h6" : "h4"} fontWeight="bold" color="primary">
                      {totalUsers}
                    </Typography>
                    <Typography variant={isMobile ? "caption" : "body2"} color="text.secondary">
                      Total de Usuários
                    </Typography>
                  </Box>
                  <Avatar sx={{ 
                    bgcolor: 'primary.main', 
                    width: isMobile ? 32 : 48, 
                    height: isMobile ? 32 : 48 
                  }}>
                    <PeopleIcon sx={{ fontSize: isMobile ? '1.2rem' : '1.5rem' }} />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6} sm={6} md={3}>
            <Card sx={{ 
              borderRadius: 3, 
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              height: '100%',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
              }
            }}>
              <CardContent sx={{ p: isMobile ? 1.5 : 2 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  flexDirection: isMobile ? 'column' : 'row',
                  gap: isMobile ? 1 : 0
                }}>
                  <Box sx={{ textAlign: isMobile ? 'center' : 'left' }}>
                    <Typography variant={isMobile ? "h6" : "h4"} fontWeight="bold" color="success.main">
                      {activeUsers}
                    </Typography>
                    <Typography variant={isMobile ? "caption" : "body2"} color="text.secondary">
                      Usuários Ativos
                    </Typography>
                  </Box>
                  <Avatar sx={{ 
                    bgcolor: 'success.main', 
                    width: isMobile ? 32 : 48, 
                    height: isMobile ? 32 : 48 
                  }}>
                    <ActiveIcon sx={{ fontSize: isMobile ? '1.2rem' : '1.5rem' }} />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6} sm={6} md={3}>
            <Card sx={{ 
              borderRadius: 3, 
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              height: '100%',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
              }
            }}>
              <CardContent sx={{ p: isMobile ? 1.5 : 2 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  flexDirection: isMobile ? 'column' : 'row',
                  gap: isMobile ? 1 : 0
                }}>
                  <Box sx={{ textAlign: isMobile ? 'center' : 'left' }}>
                    <Typography variant={isMobile ? "h6" : "h4"} fontWeight="bold" color="warning.main">
                      {adminUsers}
                    </Typography>
                    <Typography variant={isMobile ? "caption" : "body2"} color="text.secondary">
                      Administradores
                    </Typography>
                  </Box>
                  <Avatar sx={{ 
                    bgcolor: 'warning.main', 
                    width: isMobile ? 32 : 48, 
                    height: isMobile ? 32 : 48 
                  }}>
                    <AdminIcon sx={{ fontSize: isMobile ? '1.2rem' : '1.5rem' }} />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6} sm={6} md={3}>
            <Card sx={{ 
              borderRadius: 3, 
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              height: '100%',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
              }
            }}>
              <CardContent sx={{ p: isMobile ? 1.5 : 2 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  flexDirection: isMobile ? 'column' : 'row',
                  gap: isMobile ? 1 : 0
                }}>
                  <Box sx={{ textAlign: isMobile ? 'center' : 'left' }}>
                    <Typography variant={isMobile ? "h6" : "h4"} fontWeight="bold" color="info.main">
                      {employeeUsers}
                    </Typography>
                    <Typography variant={isMobile ? "caption" : "body2"} color="text.secondary">
                      Funcionários
                    </Typography>
                  </Box>
                  <Avatar sx={{ 
                    bgcolor: 'info.main', 
                    width: isMobile ? 32 : 48, 
                    height: isMobile ? 32 : 48 
                  }}>
                    <WorkIcon sx={{ fontSize: isMobile ? '1.2rem' : '1.5rem' }} />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Alerta de usuários inativos (se houver) */}
        {inactiveUsers > 0 && (
          <Alert 
            severity="warning" 
            sx={{ mb: 3, borderRadius: 2 }}
          >
            <Typography variant="body2">
              <strong>Atenção:</strong> Há {inactiveUsers} usuário{inactiveUsers > 1 ? 's' : ''} inativo{inactiveUsers > 1 ? 's' : ''} no sistema.
            </Typography>
          </Alert>
        )}

        {/* Filtros */}
        <Paper sx={{ p: isMobile ? 2 : 3, mb: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <SearchIcon sx={{ mr: 1 }} />
            Filtros de Busca
          </Typography>
          <UserFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            onClearFilters={handleClearFilters}
            onRefresh={loadUsers}
          />
        </Paper>

        {/* Tabela */}
        <Paper sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
              <PeopleIcon sx={{ mr: 1 }} />
              Lista de Usuários ({filteredUsers.length})
            </Typography>
          </Box>
          <UserTable
            users={filteredUsers}
            loading={loading}
            onEdit={handleQuickEditOpen}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
          />
        </Paper>

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
