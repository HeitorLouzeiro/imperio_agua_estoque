import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Snackbar, 
  Alert,
  Button
} from '@mui/material';
import { 
  Add as AddIcon
} from '@mui/icons-material';
import Layout from '../components/common/Layout';
import { 
  SalesStats,
  SalesFilters, 
  SalesTable,
  SaleViewDialog,
  SaleStatusDialog,
  QuickSaleDialog
} from '../components/sales';
import { useSales, useSnackbar } from '../hooks';
import { productService } from '../services';
import { Sale, Product } from '../types';

const Sales = () => {
  // State para filtros e dialogs
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<Date | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState<boolean>(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState<boolean>(false);
  const [quickSaleOpen, setQuickSaleOpen] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);

  // Hooks customizados
  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();
  const { 
    sales, 
    loading: salesLoading, 
    statistics, 
    loadSales, 
    updateSaleStatus 
  } = useSales();

  // Carregar dados iniciais
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const response = await productService.getAll();
        const loadedProducts = response.map(prod => ({
          ...prod,
          id: prod._id || prod.id,
        }));
        setProducts(loadedProducts);
        await loadSales(loadedProducts);
      } catch (error) {
        showSnackbar('Erro ao carregar dados', 'error');
      }
    };

    loadInitialData();
  }, [loadSales, showSnackbar]);

  // Filtrar vendas baseado nos critérios de pesquisa
  const filteredSales = sales.filter(sale => {
    const matchesSearch = searchTerm === '' || 
      sale.cliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.numero?.toString().includes(searchTerm) ||
      sale.vendedor?.nome?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDate = !dateFilter || 
      new Date(sale.dataVenda || sale.createdAt).toDateString() === dateFilter.toDateString();

    return matchesSearch && matchesDate;
  });

  // Lista de clientes recentes
  const recentClients = JSON.parse(localStorage.getItem('recentClients') || '[]');

  // Handlers
  const handleQuickSale = () => {
    setQuickSaleOpen(true);
  };

  const handleQuickSaleSubmit = async (sale: any) => {
    try {
      showSnackbar('Venda criada com sucesso!', 'success');
      // Recarregar vendas
      await loadSales(products);
    } catch (error) {
      showSnackbar(
        error instanceof Error ? error.message : 'Erro ao criar venda', 
        'error'
      );
    }
  };

  const handleViewSale = (sale: Sale) => {
    setSelectedSale(sale);
    setViewDialogOpen(true);
  };

  const handleEditStatus = (sale: Sale) => {
    setSelectedSale(sale);
    setStatusDialogOpen(true);
  };

  const handlePrintSale = (sale: Sale) => {
    // Implementação movida para o componente SaleViewDialog
    showSnackbar('Use o botão de impressão no diálogo de visualização', 'info');
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await updateSaleStatus(id, status);
      showSnackbar('Status atualizado com sucesso!', 'success');
      
      // Atualizar os dados da venda selecionada
      if (selectedSale && selectedSale._id === id) {
        setSelectedSale({ ...selectedSale, status: status as 'paga' | 'pendente' | 'cancelada' });
      }
      
      // Recarregar vendas
      await loadSales(products);
      
      setStatusDialogOpen(false);
    } catch (error) {
      showSnackbar('Erro ao atualizar status', 'error');
    }
  };

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Paper sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" gutterBottom>
              Vendas
            </Typography>
            
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={handleQuickSale}
              sx={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': { background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)' },
                fontSize: '1.1rem',
                px: 3
              }}
            >
              Nova Venda
            </Button>
          </Box>

          {/* Estatísticas */}
          <SalesStats statistics={statistics} />

          {/* Filtros */}
          <SalesFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
          />

          {/* Tabela de Vendas */}
          <SalesTable
            sales={filteredSales}
            loading={salesLoading}
            onViewSale={handleViewSale}
            onEditStatus={handleEditStatus}
            onPrintSale={handlePrintSale}
          />
        </Paper>
      </Box>

      {/* Dialog de Visualização */}
      <SaleViewDialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        sale={selectedSale}
        onSuccess={showSnackbar}
        onError={showSnackbar}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Dialog de Status */}
      <SaleStatusDialog
        open={statusDialogOpen}
        onClose={() => setStatusDialogOpen(false)}
        sale={selectedSale}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Dialog de Venda Rápida */}
      <QuickSaleDialog
        open={quickSaleOpen}
        onClose={() => setQuickSaleOpen(false)}
        onSuccess={handleQuickSaleSubmit}
        products={products}
        recentClients={recentClients}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={hideSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={hideSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

    </Layout>
  );
};

export default Sales;
