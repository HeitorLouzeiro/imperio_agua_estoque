import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Snackbar, 
  Alert,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Add as AddIcon,
  Receipt as ReceiptIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
  Today as TodayIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import Layout from '../components/common/Layout';
import { 
  SalesFilters, 
  SalesTable,
  SaleViewDialog,
  SaleStatusDialog,
  QuickSaleDialog,
  SaleEditDialog
} from '../components/sales';
import { useSales, useSnackbar } from '../hooks';
import { productService, salesService } from '../services';
import { Sale, Product } from '../types';

const Sales: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // State para filtros e dialogs
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<Date | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [viewDialogOpen, setViewDialogOpen] = useState<boolean>(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState<boolean>(false);
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
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

    const matchesStatus = statusFilter === '' || sale.status === statusFilter;

    return matchesSearch && matchesDate && matchesStatus;
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

  const handleEditSale = (sale: Sale) => {
    setSelectedSale(sale);
    setEditDialogOpen(true);
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

  const handleSaveEditedSale = async (saleData: any) => {
    try {
      const { id, ...saleUpdateData } = saleData; // Separar ID dos dados da venda
      await salesService.update(id, saleUpdateData);
      
      // Recarregar vendas
      await loadSales(products);
      
      setEditDialogOpen(false);
    } catch (error) {
      throw error;
    }
  };

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
              Gerenciamento de Vendas
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Controle completo de vendas e faturamento
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleQuickSale}
            size={isMobile ? "medium" : "large"}
            sx={{ 
              borderRadius: 3,
              textTransform: 'none',
              fontWeight: 'bold',
              px: 3
            }}
          >
            Nova Venda
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
                      {statistics.totalVendas}
                    </Typography>
                    <Typography variant={isMobile ? "caption" : "body2"} color="text.secondary">
                      Total de Vendas
                    </Typography>
                  </Box>
                  <Avatar sx={{ 
                    bgcolor: 'primary.main', 
                    width: isMobile ? 32 : 48, 
                    height: isMobile ? 32 : 48 
                  }}>
                    <ReceiptIcon sx={{ fontSize: isMobile ? '1.2rem' : '1.5rem' }} />
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
                      {statistics.vendasHoje}
                    </Typography>
                    <Typography variant={isMobile ? "caption" : "body2"} color="text.secondary">
                      Vendas Hoje
                    </Typography>
                  </Box>
                  <Avatar sx={{ 
                    bgcolor: 'info.main', 
                    width: isMobile ? 32 : 48, 
                    height: isMobile ? 32 : 48 
                  }}>
                    <TodayIcon sx={{ fontSize: isMobile ? '1.2rem' : '1.5rem' }} />
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
                    <Typography variant={isMobile ? "body1" : "h4"} fontWeight="bold" color="success.main">
                      R$ {statistics.receitaTotal.toFixed(2)}
                    </Typography>
                    <Typography variant={isMobile ? "caption" : "body2"} color="text.secondary">
                      Receita Total
                    </Typography>
                  </Box>
                  <Avatar sx={{ 
                    bgcolor: 'success.main', 
                    width: isMobile ? 32 : 48, 
                    height: isMobile ? 32 : 48 
                  }}>
                    <MoneyIcon sx={{ fontSize: isMobile ? '1.2rem' : '1.5rem' }} />
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
                    <Typography variant={isMobile ? "body1" : "h4"} fontWeight="bold" color="warning.main">
                      R$ {statistics.receitaHoje.toFixed(2)}
                    </Typography>
                    <Typography variant={isMobile ? "caption" : "body2"} color="text.secondary">
                      Receita Hoje
                    </Typography>
                  </Box>
                  <Avatar sx={{ 
                    bgcolor: 'warning.main', 
                    width: isMobile ? 32 : 48, 
                    height: isMobile ? 32 : 48 
                  }}>
                    <TrendingUpIcon sx={{ fontSize: isMobile ? '1.2rem' : '1.5rem' }} />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filtros */}
        <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <SearchIcon sx={{ mr: 1 }} />
            Filtros de Busca
          </Typography>
          <SalesFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
        </Paper>

        {/* Tabela */}
        <Paper sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                <ReceiptIcon sx={{ mr: 1 }} />
                Lista de Vendas ({filteredSales.length})
              </Typography>
              {(searchTerm || dateFilter || statusFilter) && (
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {searchTerm && (
                    <Typography variant="caption" sx={{ 
                      px: 1, 
                      py: 0.5, 
                      bgcolor: 'primary.light', 
                      color: 'primary.contrastText', 
                      borderRadius: 1 
                    }}>
                      Busca: "{searchTerm}"
                    </Typography>
                  )}
                  {dateFilter && (
                    <Typography variant="caption" sx={{ 
                      px: 1, 
                      py: 0.5, 
                      bgcolor: 'info.light', 
                      color: 'info.contrastText', 
                      borderRadius: 1 
                    }}>
                      Data: {dateFilter.toLocaleDateString('pt-BR')}
                    </Typography>
                  )}
                  {statusFilter && (
                    <Typography variant="caption" sx={{ 
                      px: 1, 
                      py: 0.5, 
                      bgcolor: statusFilter === 'paga' ? 'success.light' : 
                              statusFilter === 'pendente' ? 'warning.light' : 'error.light',
                      color: statusFilter === 'paga' ? 'success.contrastText' : 
                             statusFilter === 'pendente' ? 'warning.contrastText' : 'error.contrastText',
                      borderRadius: 1 
                    }}>
                      Status: {statusFilter === 'paga' ? 'Paga' : 
                               statusFilter === 'pendente' ? 'Pendente' : 'Cancelada'}
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          </Box>
          <SalesTable
            sales={filteredSales}
            loading={salesLoading}
            onViewSale={handleViewSale}
            onEditSale={handleEditSale}
            onEditStatus={handleEditStatus}
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

      {/* Dialog de Edição */}
      <SaleEditDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        sale={selectedSale}
        products={products}
        onSuccess={showSnackbar}
        onSave={handleSaveEditedSale}
      />

      {/* Dialog de Venda Rápida */}
      <QuickSaleDialog
        open={quickSaleOpen}
        onClose={() => setQuickSaleOpen(false)}
        onSuccess={handleQuickSaleSubmit}
        onError={(message) => showSnackbar(message, 'error')}
        products={products}
        recentClients={recentClients}
      />

      {/* Snackbar Animado */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={hideSnackbar}
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
          onClose={hideSnackbar} 
          severity={snackbar.severity} 
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

    </Layout>
  );
};

export default Sales;
