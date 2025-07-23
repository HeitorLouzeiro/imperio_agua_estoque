import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Divider
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
  ShoppingCart as ShoppingCartIcon,
  Receipt as ReceiptIcon,
  Assessment as AssessmentIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { salesService } from '../../services';

const DailyRevenueReport = ({ onRefresh }) => {
  const [stats, setStats] = useState({
    hoje: { totalVendas: 0, faturamentoTotal: 0 },
    produtosMaisVendidos: [],
    vendasPorFormaPagamento: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDailyStats();
  }, []);

  const loadDailyStats = async () => {
    try {
      setLoading(true);
      const response = await salesService.getStatistics();
      setStats(response);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadDailyStats();
    if (onRefresh) onRefresh();
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getPaymentMethodLabel = (method) => {
    const labels = {
      dinheiro: 'Dinheiro',
      cartao_debito: 'Cartão Débito',
      cartao_credito: 'Cartão Crédito',
      pix: 'PIX',
      transferencia: 'Transferência'
    };
    return labels[method] || method;
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 2 }}>
        <LinearProgress />
        <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
          Carregando relatório do dia...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AssessmentIcon color="primary" />
          Rendimento do Dia
        </Typography>
        <Tooltip title="Atualizar dados">
          <IconButton onClick={handleRefresh} color="primary">
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Grid container spacing={3}>
        {/* Cards de Resumo */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ 
                  backgroundColor: 'primary.main', 
                  color: 'white', 
                  borderRadius: '50%', 
                  p: 1,
                  display: 'flex'
                }}>
                  <ShoppingCartIcon />
                </Box>
                <Box>
                  <Typography variant="h4" color="primary" fontWeight="bold">
                    {stats.hoje.totalVendas}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Vendas Realizadas
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ 
                  backgroundColor: 'success.main', 
                  color: 'white', 
                  borderRadius: '50%', 
                  p: 1,
                  display: 'flex'
                }}>
                  <MoneyIcon />
                </Box>
                <Box>
                  <Typography variant="h5" color="success.main" fontWeight="bold">
                    {formatCurrency(stats.hoje.faturamentoTotal)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Faturamento Total
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Produtos Mais Vendidos */}
        {stats.produtosMaisVendidos.length > 0 && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingUpIcon color="primary" />
                  Produtos Mais Vendidos
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Produto</TableCell>
                        <TableCell align="right">Qtd</TableCell>
                        <TableCell align="right">Valor</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {stats.produtosMaisVendidos.slice(0, 5).map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.produto.nome}</TableCell>
                          <TableCell align="right">
                            <Chip 
                              label={item.quantidadeVendida}
                              size="small"
                              color="primary"
                            />
                          </TableCell>
                          <TableCell align="right">
                            {formatCurrency(item.faturamento)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Vendas por Forma de Pagamento */}
        {stats.vendasPorFormaPagamento.length > 0 && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ReceiptIcon color="primary" />
                  Formas de Pagamento
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {stats.vendasPorFormaPagamento.map((item, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">
                          {getPaymentMethodLabel(item._id)}
                        </Typography>
                        <Typography variant="body2" color="primary" fontWeight="bold">
                          {formatCurrency(item.valor)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={(item.valor / stats.hoje.faturamentoTotal) * 100}
                          sx={{ flexGrow: 1, height: 8, borderRadius: 1 }}
                        />
                        <Chip 
                          label={`${item.quantidade} vendas`}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                      {index < stats.vendasPorFormaPagamento.length - 1 && (
                        <Divider sx={{ mt: 2 }} />
                      )}
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Mensagem quando não há vendas */}
        {stats.hoje.totalVendas === 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <ShoppingCartIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Nenhuma venda registrada hoje
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  As vendas realizadas hoje aparecerão neste relatório
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default DailyRevenueReport;
