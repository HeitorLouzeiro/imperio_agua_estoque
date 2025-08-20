import React, { useState } from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  useTheme, 
  useMediaQuery,
  Card,
  CardContent,
  Avatar,
  Paper,
  Button,
  TextField
} from '@mui/material';
import { 
  ShoppingBag, 
  Inventory2, 
  AttachMoney,
  Store,
  Category,
  PeopleAlt,
  FilterAlt as FilterIcon,
  Refresh as RefreshIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import Layout from '../components/common/Layout';
import {
  SalesChart,
  ProductsChart,
  LowStockAlert,
  RecentSales
} from '../components/dashboard';
import { useDashboard } from '../hooks/useDashboard';

export const Dashboard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Estados para filtros
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  
  const {
    stats,
    salesData,
    pieData,
    loading,
    error,
    loadDashboardData
  } = useDashboard();

  React.useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Função para aplicar filtros
  const handleApplyFilter = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Incluir o dia inteiro
      loadDashboardData(start, end);
    }
  };

  // Função para limpar filtros
  const handleClearFilter = () => {
    setStartDate('');
    setEndDate('');
    loadDashboardData(); // Carregar dados sem filtro
  };

  // Função para filtros rápidos
  const handleQuickFilter = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);
    
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
    
    loadDashboardData(start, end);
  };

  // Função para gerar título dinâmico do gráfico
  const getChartTitle = () => {
    if (startDate && endDate) {
      const start = new Date(startDate).toLocaleDateString('pt-BR');
      const end = new Date(endDate).toLocaleDateString('pt-BR');
      return `Evolução de Vendas - ${start} até ${end}`;
    }
    return 'Evolução de Vendas - Últimos 6 Meses';
  };

  if (loading) {
    return (
      <Layout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Typography>Carregando dashboard...</Typography>
        </Box>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Typography color="error">Erro ao carregar dados: {error}</Typography>
        </Box>
      </Layout>
    );
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
            <Typography variant="h4" fontWeight="bold" color="primary">
              Dashboard Gerencial
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Visão geral completa do seu negócio
            </Typography>
          </Box>
        </Box>

        {/* Filtros de Período */}
        <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <FilterIcon sx={{ mr: 1 }} />
            Filtros de Período
          </Typography>
          
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <TextField
                label="Data Inicial"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                size="small"
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={3}>
              <TextField
                label="Data Final"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                size="small"
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  onClick={handleApplyFilter}
                  disabled={!startDate || !endDate}
                  size="small"
                  startIcon={<CalendarIcon />}
                  sx={{ borderRadius: 2, textTransform: 'none' }}
                >
                  Aplicar
                </Button>
                
                <Button
                  variant="outlined"
                  onClick={handleClearFilter}
                  size="small"
                  startIcon={<RefreshIcon />}
                  sx={{ borderRadius: 2, textTransform: 'none' }}
                >
                  Limpar
                </Button>
                
                <Button
                  variant="text"
                  onClick={() => handleQuickFilter(7)}
                  size="small"
                  sx={{ borderRadius: 2, textTransform: 'none' }}
                >
                  7 dias
                </Button>
                
                <Button
                  variant="text"
                  onClick={() => handleQuickFilter(30)}
                  size="small"
                  sx={{ borderRadius: 2, textTransform: 'none' }}
                >
                  30 dias
                </Button>
                
                <Button
                  variant="text"
                  onClick={() => handleQuickFilter(90)}
                  size="small"
                  sx={{ borderRadius: 2, textTransform: 'none' }}
                >
                  90 dias
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Estatísticas Principais */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold" color="success.main">
                      R$ {stats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Receita Total
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'success.main', width: 56, height: 56 }}>
                    <AttachMoney />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold" color="primary.main">
                      {stats.totalSales}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total de Vendas
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                    <Store />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold" color="warning.main">
                      {stats.totalProducts}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total de Produtos
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'warning.main', width: 56, height: 56 }}>
                    <Category />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold" color="info.main">
                      {stats.totalUsers}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total de Usuários
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'info.main', width: 56, height: 56 }}>
                    <PeopleAlt />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Gráficos */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <SalesChart data={salesData} title={getChartTitle()} />
          </Grid>
          <Grid item xs={12} md={6}>
            <ProductsChart data={pieData} title="Produtos Mais Vendidos" />
          </Grid>
        </Grid>

        {/* Alertas e Vendas Recentes */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
              <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                  <Inventory2 sx={{ mr: 1 }} />
                  Produtos com Estoque Baixo
                </Typography>
              </Box>
              <Box sx={{ p: 2 }}>
                <LowStockAlert products={stats.lowStockProducts} />
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
              <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                  <ShoppingBag sx={{ mr: 1 }} />
                  Últimas Vendas Realizadas
                </Typography>
              </Box>
              <Box sx={{ p: 2 }}>
                <RecentSales sales={stats.recentSales} />
              </Box>
            </Paper>
          </Grid>
        </Grid>

      </Box>
    </Layout>
  );
};

export default Dashboard;
