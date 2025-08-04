import React from 'react';
import {
  Paper,
  Typography,
  Box,
} from '@mui/material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface SalesChartData {
  name: string;
  vendas: number;
  produtos: number;
}

interface SalesChartProps {
  data: SalesChartData[];
  loading?: boolean;
}

const SalesChart: React.FC<SalesChartProps> = ({ data, loading = false }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      borderRadius: 3,
      border: '1px solid',
      borderColor: 'divider',
      height: '100%',
    }}
  >
    <Typography variant="h6" gutterBottom fontWeight="bold">
      Vendas dos Últimos 6 Meses
    </Typography>
    
    {loading ? (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        height={300}
      >
        <Typography color="text.secondary">Carregando dados...</Typography>
      </Box>
    ) : (
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="name" 
            stroke="#666"
            fontSize={12}
          />
          <YAxis 
            stroke="#666"
            fontSize={12}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
            formatter={(value: any, name: string) => [
              name === 'vendas' 
                ? `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                : `${value} unidades`,
              name === 'vendas' ? 'Receita' : 'Produtos Vendidos'
            ]}
          />
          <Area
            type="monotone"
            dataKey="vendas"
            stackId="1"
            stroke="#2196F3"
            fill="url(#colorVendas)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="produtos"
            stackId="2"
            stroke="#4CAF50"
            fill="url(#colorProdutos)"
            strokeWidth={2}
          />
          <defs>
            <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2196F3" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#2196F3" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="colorProdutos" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#4CAF50" stopOpacity={0.1} />
            </linearGradient>
          </defs>
        </AreaChart>
      </ResponsiveContainer>
    )}
  </Paper>
);

export default SalesChart;
