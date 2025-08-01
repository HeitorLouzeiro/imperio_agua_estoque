import React from 'react';
import {
  Paper,
  Typography,
  Box,
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface PieChartData {
  name: string;
  value: number;
  color: string;
}

interface ProductsChartProps {
  data: PieChartData[];
  loading?: boolean;
}

const ProductsChart: React.FC<ProductsChartProps> = ({ data, loading = false }) => (
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
      Produtos Mais Vendidos
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
    ) : data.length === 0 ? (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        height={300}
      >
        <Typography color="text.secondary">Nenhum dado disponível</Typography>
      </Box>
    ) : (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={120}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
            formatter={(value: any, name: string) => [
              `${value} unidades`,
              name
            ]}
          />
        </PieChart>
      </ResponsiveContainer>
    )}
    
    {!loading && data.length > 0 && (
      <Box mt={2}>
        {data.map((entry, index) => (
          <Box
            key={index}
            display="flex"
            alignItems="center"
            mb={1}
          >
            <Box
              sx={{
                width: 12,
                height: 12,
                backgroundColor: entry.color,
                borderRadius: '50%',
                mr: 1,
              }}
            />
            <Typography variant="body2" color="text.secondary">
              {entry.name}: {entry.value} unidades
            </Typography>
          </Box>
        ))}
      </Box>
    )}
  </Paper>
);

export default ProductsChart;
