import React from 'react';
import { Grid, Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { TrendingUp, Receipt, AttachMoney, Today } from '@mui/icons-material';
import { SaleStatistics } from '../../types';

interface SalesStatsProps {
  statistics: SaleStatistics;
}

const SalesStats: React.FC<SalesStatsProps> = ({ statistics }) => {
  const stats = [
    {
      title: 'Total de Vendas',
      value: statistics.totalVendas,
      icon: Receipt,
      color: 'primary.main',
      format: (value: number) => value.toString()
    },
    {
      title: 'Vendas Hoje',
      value: statistics.vendasHoje,
      icon: Today,
      color: 'secondary.main',
      format: (value: number) => value.toString()
    },
    {
      title: 'Receita Total',
      value: statistics.receitaTotal,
      icon: AttachMoney,
      color: 'success.main',
      format: (value: number) => `R$ ${value.toFixed(2)}`
    },
    {
      title: 'Receita Hoje',
      value: statistics.receitaHoje,
      icon: TrendingUp,
      color: 'warning.main',
      format: (value: number) => `R$ ${value.toFixed(2)}`
    }
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                      {stat.title}
                    </Typography>
                    <Typography variant="h5" component="div">
                      {stat.format(stat.value)}
                    </Typography>
                  </Box>
                  <IconComponent sx={{ color: stat.color, fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
      
      {/* Produto mais vendido */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom variant="body2">
              Produto Mais Vendido
            </Typography>
            {statistics.produtoMaisVendido ? (
              <Box>
                <Typography variant="h6" component="div">
                  {statistics.produtoMaisVendido.nome}
                </Typography>
                <Box display="flex" gap={1} mt={1}>
                  <Chip 
                    label={`${statistics.produtoMaisVendido.quantidade} vendidos`} 
                    color="primary" 
                    size="small" 
                  />
                  {statistics.produtoMaisVendido.codigo && (
                    <Chip 
                      label={`Código: ${statistics.produtoMaisVendido.codigo}`} 
                      variant="outlined" 
                      size="small" 
                    />
                  )}
                </Box>
              </Box>
            ) : (
              <Typography variant="body1" color="textSecondary">
                Nenhum produto vendido
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Vendas por status */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom variant="body2">
              Vendas por Status
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body2">Pagas:</Typography>
                <Chip 
                  label={statistics.vendasPorStatus.paga} 
                  color="success" 
                  size="small" 
                />
              </Box>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body2">Pendentes:</Typography>
                <Chip 
                  label={statistics.vendasPorStatus.pendente} 
                  color="warning" 
                  size="small" 
                />
              </Box>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body2">Canceladas:</Typography>
                <Chip 
                  label={statistics.vendasPorStatus.cancelada} 
                  color="error" 
                  size="small" 
                />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default SalesStats;
