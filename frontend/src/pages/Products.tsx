import React from 'react';
import {
  Box, 
  Typography, 
  Button, 
  Alert, 
  Snackbar,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Add as AddIcon,
  Inventory2 as InventoryIcon,
  TrendingDown as LowStockIcon,
  Assessment as StatsIcon,
  Warehouse as WarehouseIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import Layout from '../components/common/Layout';
import {
  ProductFilters,
  ProductTable,
  ProductFormDialog,
  ProductViewDialog
} from '../components/products';
import { useProductManagement } from '../hooks';

const Products: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const {
    // States
    loading,
    categories,
    searchTerm,
    filterCategory,
    statusFilter,
    open,
    editingProduct,
    viewProduct,
    formData,
    snackbar,
    
    // Computed
    filteredProducts,
    
    // Actions
    setSearchTerm,
    setFilterCategory,
    setStatusFilter,
    loadProducts,
    handleAdd,
    handleEdit,
    handleView,
    handleDelete,
    handleToggleStatus,
    handleSave,
    handleChange,
    getFieldError,
    closeDialog,
    closeViewDialog,
    closeSnackbar,
  } = useProductManagement();

  // Calcular estatísticas
  const totalProducts = filteredProducts.length;
  const activeProducts = filteredProducts.filter(p => p.ativo !== false).length;
  const lowStockProducts = filteredProducts.filter(p => (p.quantidade || 0) < 20).length;
  const totalValue = filteredProducts.reduce((sum, p) => sum + ((p.preco || 0) * (p.quantidade || 0)), 0);

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
            <Typography variant="h4" fontWeight="bold" color="primary">
              Gerenciamento de Produtos
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Controle completo do seu estoque e inventário
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={handleAdd}
            size={isMobile ? "medium" : "large"}
            sx={{ 
              borderRadius: 3,
              textTransform: 'none',
              fontWeight: 'bold',
              px: 3
            }}
          >
            Novo Produto
          </Button>
        </Box>

        {/* Estatísticas */}
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
                      {totalProducts}
                    </Typography>
                    <Typography variant={isMobile ? "caption" : "body2"} color="text.secondary">
                      Total de Produtos
                    </Typography>
                  </Box>
                  <Avatar sx={{ 
                    bgcolor: 'primary.main', 
                    width: isMobile ? 32 : 48, 
                    height: isMobile ? 32 : 48 
                  }}>
                    <InventoryIcon sx={{ fontSize: isMobile ? '1.2rem' : '1.5rem' }} />
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
                      {activeProducts}
                    </Typography>
                    <Typography variant={isMobile ? "caption" : "body2"} color="text.secondary">
                      Produtos Ativos
                    </Typography>
                  </Box>
                  <Avatar sx={{ 
                    bgcolor: 'success.main', 
                    width: isMobile ? 32 : 48, 
                    height: isMobile ? 32 : 48 
                  }}>
                    <WarehouseIcon sx={{ fontSize: isMobile ? '1.2rem' : '1.5rem' }} />
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
                      {lowStockProducts}
                    </Typography>
                    <Typography variant={isMobile ? "caption" : "body2"} color="text.secondary">
                      Estoque Baixo
                    </Typography>
                  </Box>
                  <Avatar sx={{ 
                    bgcolor: 'warning.main', 
                    width: isMobile ? 32 : 48, 
                    height: isMobile ? 32 : 48 
                  }}>
                    <LowStockIcon sx={{ fontSize: isMobile ? '1.2rem' : '1.5rem' }} />
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
                    <Typography variant={isMobile ? "body1" : "h4"} fontWeight="bold" color="info.main">
                      R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </Typography>
                    <Typography variant={isMobile ? "caption" : "body2"} color="text.secondary">
                      Valor Total
                    </Typography>
                  </Box>
                  <Avatar sx={{ 
                    bgcolor: 'info.main', 
                    width: isMobile ? 32 : 48, 
                    height: isMobile ? 32 : 48 
                  }}>
                    <StatsIcon sx={{ fontSize: isMobile ? '1.2rem' : '1.5rem' }} />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Alertas importantes */}
        {lowStockProducts > 0 && (
          <Alert 
            severity="warning" 
            sx={{ mb: 3, borderRadius: 2 }}
            icon={<LowStockIcon />}
          >
            <Typography variant="body2">
              <strong>Atenção!</strong> {lowStockProducts} produto(s) com estoque baixo (menos de 20 unidades).
              Considere fazer reposição.
            </Typography>
          </Alert>
        )}

        {/* Filtros */}
        <Paper sx={{ p: isMobile ? 2 : 3, mb: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <SearchIcon sx={{ mr: 1 }} />
            Filtros de Busca
          </Typography>
          <ProductFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            categories={categories}
            onRefresh={loadProducts}
          />
        </Paper>

        {/* Tabela */}
        <Paper sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
              <InventoryIcon sx={{ mr: 1 }} />
              Lista de Produtos ({filteredProducts.length})
            </Typography>
          </Box>
          <ProductTable
            products={filteredProducts}
            loading={loading}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
          />
        </Paper>

        {/* Form Dialog */}
        <ProductFormDialog
          open={open}
          onClose={closeDialog}
          onSave={handleSave}
          editingProduct={editingProduct}
          formData={formData}
          onFormChange={handleChange}
          getFieldError={getFieldError}
        />

        {/* View Dialog */}
        <ProductViewDialog
          open={!!viewProduct}
          onClose={closeViewDialog}
          product={viewProduct}
        />

        {/* Snackbar Animado */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={5000}
          onClose={closeSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{
            mt: 8,
            '& .MuiAlert-root': {
              minWidth: '300px',
              maxWidth: '400px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              animation: snackbar.open ? 'slideInRight 0.4s ease-out' : 'none',
            }
          }}
        >
          <Alert
            severity={snackbar.severity}
            onClose={closeSnackbar}
            sx={{ 
              width: '100%',
              fontSize: '0.875rem',
              fontWeight: 500,
              '& .MuiAlert-message': {
                paddingTop: '4px',
                paddingBottom: '4px'
              },
              '& .MuiAlert-icon': {
                fontSize: '1.2rem'
              }
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Layout>
  );
};

export default Products;
