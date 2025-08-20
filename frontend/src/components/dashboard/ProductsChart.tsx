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
  title?: string;
}

const ProductsChart: React.FC<ProductsChartProps> = ({ data, loading = false, title = 'Produtos Mais Vendidos' }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      borderRadius: 3,
      border: '1px solid',
      borderColor: 'divider',
      height: 600,
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    }}
  >
    <Typography variant="h6" gutterBottom fontWeight="bold">
      {title}
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
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={100}
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
      <Box mt={3}>
        {data.map((entry, index) => (
          <Box
            key={index}
            display="flex"
            alignItems="center"
            mb={1.5}
            sx={{ minHeight: '24px' }}
          >
            <Box
              sx={{
                width: 12,
                height: 12,
                backgroundColor: entry.color,
                borderRadius: '50%',
                mr: 1.5,
                flexShrink: 0,
              }}
            />
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                lineHeight: 1.2,
                wordBreak: 'break-word',
                flex: 1,
              }}
            >
              {entry.name}: {entry.value} unidades
            </Typography>
          </Box>
        ))}
      </Box>
    )}
  </Paper>
);

export default ProductsChart;
