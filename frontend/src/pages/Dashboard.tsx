import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { AttachMoney, ShoppingCart, Inventory, People } from '@mui/icons-material';
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
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>

        {/* Estatísticas Principais */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Receita Total"
              value={`R$ ${stats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
              icon={<AttachMoney />}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total de Vendas"
              value={stats.totalSales.toString()}
              icon={<ShoppingCart />}
              color="success"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total de Produtos"
              value={stats.totalProducts.toString()}
              icon={<Inventory />}
              color="info"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total de Usuários"
              value={stats.totalUsers.toString()}
              icon={<People />}
              color="warning"
            />
          </Grid>
        </Grid>

        {/* Gráficos */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={8}>
            <SalesChart data={salesData} />
          </Grid>
          <Grid item xs={12} md={4}>
            <ProductsChart data={pieData} />
          </Grid>
        </Grid>

        {/* Alertas e Vendas Recentes */}
        <Grid container spacing={3}>
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
