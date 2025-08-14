import React from 'react';
import { Box, Grid, Typography, useTheme, useMediaQuery } from '@mui/material';
import { 
  TrendingUp, 
  ShoppingBag, 
  Inventory2, 
  Groups,
  MonetizationOn,
  LocalShipping,
  Assessment,
  AccountCircle,
  AttachMoney,
  Store,
  Category,
  PeopleAlt
} from '@mui/icons-material';
import Layout from '../components/common/Layout';
import {
  StatCard,
  SalesChart,
  ProductsChart,
  LowStockAlert,
  RecentSales
} from '../components/dashboard';
import { useDashboard } from '../hooks/useDashboard';

export const Dashboard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
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
      <Box sx={{ flexGrow: 1, p: isMobile ? 1 : 3 }}>
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          component="h1" 
          gutterBottom
          sx={{ mb: isMobile ? 2 : 3 }}
        >
          Dashboard
        </Typography>

        {/* Estatísticas Principais */}
        <Grid container spacing={isMobile ? 2 : 3} sx={{ mb: isMobile ? 3 : 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Receita Total"
              value={`R$ ${stats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
              icon={<AttachMoney />}
              color="#22C55E"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total de Vendas"
              value={stats.totalSales.toString()}
              icon={<Store />}
              color="#3B82F6"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total de Produtos"
              value={stats.totalProducts.toString()}
              icon={<Category />}
              color="#F59E0B"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total de Usuários"
              value={stats.totalUsers.toString()}
              icon={<PeopleAlt />}
              color="#8B5CF6"
            />
          </Grid>
        </Grid>

        {/* Gráficos */}
        <Grid container spacing={isMobile ? 2 : 3} sx={{ mb: isMobile ? 3 : 4 }}>
          <Grid item xs={12} md={8}>
            <SalesChart data={salesData} />
          </Grid>
          <Grid item xs={12} md={4}>
            <ProductsChart data={pieData} />
          </Grid>
        </Grid>

        {/* Alertas e Vendas Recentes */}
        <Grid container spacing={isMobile ? 2 : 3}>
          <Grid item xs={12} md={6}>
            <LowStockAlert products={stats.lowStockProducts} />
          </Grid>
          <Grid item xs={12} md={6}>
            <RecentSales sales={stats.recentSales} />
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
};

export default Dashboard;
