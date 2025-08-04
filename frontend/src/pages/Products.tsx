import React from 'react';
import {
  Box, 
  Typography, 
  Button, 
  Alert, 
  Snackbar
} from '@mui/material';
import {
  Add as AddIcon
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

  return (
    <Layout>
      <Box sx={{ mb: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h4">Produtos</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
            Novo Produto
          </Button>
        </Box>

        {/* Filters */}
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

        {/* Table */}
        <ProductTable
          products={filteredProducts}
          loading={loading}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
        />

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

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={closeSnackbar}
        >
          <Alert
            severity={snackbar.severity}
            onClose={closeSnackbar}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Layout>
  );
};

export default Products;
