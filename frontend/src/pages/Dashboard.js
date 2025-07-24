import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Button,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Divider,
  Alert,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Inventory,
  ShoppingCart,
  People,
  AttachMoney,
  Warning,
  CheckCircle,
  MoreVert,
  Refresh,
  Visibility,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { productService, salesService } from '../services';
import Layout from '../components/common/Layout';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    totalUsers: 0,
    totalRevenue: 0,
    lowStockProducts: [],
    recentSales: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Dados fictícios para demonstração
  const salesData = [
    { name: 'Jan', vendas: 4000, produtos: 2400 },
    { name: 'Fev', vendas: 3000, produtos: 1398 },
    { name: 'Mar', vendas: 2000, produtos: 9800 },
    { name: 'Abr', vendas: 2780, produtos: 3908 },
    { name: 'Mai', vendas: 1890, produtos: 4800 },
    { name: 'Jun', vendas: 2390, produtos: 3800 },
  ];

  const pieData = [
    { name: 'Água 500ml', value: 400, color: '#0088FE' },
    { name: 'Água 1L', value: 300, color: '#00C49F' },
    { name: 'Água 2L', value: 200, color: '#FFBB28' },
    { name: 'Galão 20L', value: 100, color: '#FF8042' },
  ];

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Simular carregamento de dados
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        totalProducts: 156,
        totalSales: 1247,
        totalUsers: 8,
        totalRevenue: 45678.90,
        lowStockProducts: [
          { id: 1, nome: 'Água Crystal 500ml', estoque: 5 },
          { id: 2, nome: 'Água Pura 1L', estoque: 8 },
          { id: 3, nome: 'Galão 20L Premium', estoque: 3 },
        ],
        recentSales: [
          { id: 1, cliente: 'João Silva', valor: 125.50, data: '2024-01-15' },
          { id: 2, cliente: 'Maria Santos', valor: 89.90, data: '2024-01-15' },
          { id: 3, cliente: 'Pedro Costa', valor: 234.70, data: '2024-01-14' },
        ],
      });
    } catch (err) {
      setError('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, trend, trendValue }) => (
    <Card
      sx={{
        height: '100%',
        borderRadius: 3,
        background: `linear-gradient(135deg, ${color}10 0%, ${color}05 100%)`,
        border: `1px solid ${color}20`,
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 12px 40px ${color}20`,
        },
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>
            {icon}
          </Avatar>
          <IconButton size="small">
            <MoreVert />
          </IconButton>
        </Box>
        
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {typeof value === 'number' && title.includes('Receita') 
            ? `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
            : value?.toLocaleString?.('pt-BR') || value
          }
        </Typography>
        
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        
        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {trend === 'up' ? (
              <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />
            ) : (
              <TrendingDown sx={{ fontSize: 16, color: 'error.main' }} />
            )}
            <Typography 
              variant="caption" 
              color={trend === 'up' ? 'success.main' : 'error.main'}
              fontWeight="medium"
            >
              {trendValue}% vs mês anterior
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Layout>
        <Box sx={{ width: '100%', mb: 4 }}>
          <LinearProgress />
        </Box>
        <Typography>Carregando dashboard...</Typography>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box>
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Visão geral do seu negócio em tempo real
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={loadDashboardData}
            sx={{ borderRadius: 2 }}
          >
            Atualizar
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total de Produtos"
              value={stats.totalProducts}
              icon={<Inventory />}
              color="#1976d2"
              trend="up"
              trendValue={12}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Vendas do Mês"
              value={stats.totalSales}
              icon={<ShoppingCart />}
              color="#2e7d32"
              trend="up"
              trendValue={8}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Usuários Ativos"
              value={stats.totalUsers}
              icon={<People />}
              color="#ed6c02"
              trend="down"
              trendValue={3}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Receita do Mês"
              value={stats.totalRevenue}
              icon={<AttachMoney />}
              color="#9c27b0"
              trend="up"
              trendValue={15}
            />
          </Grid>
        </Grid>

        {/* Charts */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} lg={8}>
            <Paper sx={{ p: 3, borderRadius: 3, height: 400 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Vendas e Produtos - Últimos 6 Meses
              </Typography>
              <ResponsiveContainer width="100%" height="90%">
                <AreaChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="vendas"
                    stackId="1"
                    stroke="#1976d2"
                    fill="url(#colorVendas)"
                  />
                  <Area
                    type="monotone"
                    dataKey="produtos"
                    stackId="1"
                    stroke="#2e7d32"
                    fill="url(#colorProdutos)"
                  />
                  <defs>
                    <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1976d2" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#1976d2" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="colorProdutos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2e7d32" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#2e7d32" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Paper sx={{ p: 3, borderRadius: 3, height: 400 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Produtos Mais Vendidos
              </Typography>
              <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>

        {/* Recent Activity & Alerts */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Vendas Recentes
              </Typography>
              <List>
                {stats.recentSales.map((sale, index) => (
                  <React.Fragment key={sale.id}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: 'success.main', width: 32, height: 32 }}>
                          <ShoppingCart sx={{ fontSize: 16 }} />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={sale.cliente}
                        secondary={`R$ ${sale.valor.toFixed(2)} - ${sale.data}`}
                      />
                      <ListItemSecondaryAction>
                        <IconButton size="small">
                          <Visibility />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < stats.recentSales.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Warning sx={{ color: 'warning.main' }} />
                <Typography variant="h6" fontWeight="bold">
                  Produtos com Estoque Baixo
                </Typography>
              </Box>
              <List>
                {stats.lowStockProducts.map((product, index) => (
                  <React.Fragment key={product.id}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: 'warning.main', width: 32, height: 32 }}>
                          <Inventory sx={{ fontSize: 16 }} />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={product.nome}
                        secondary={`Apenas ${product.estoque} unidades`}
                      />
                      <ListItemSecondaryAction>
                        <Chip
                          label={`${product.estoque} un.`}
                          color="warning"
                          size="small"
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < stats.lowStockProducts.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
              {stats.lowStockProducts.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                  <CheckCircle sx={{ fontSize: 48, mb: 1 }} />
                  <Typography>Todos os produtos com estoque adequado!</Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
};

export default Dashboard;
