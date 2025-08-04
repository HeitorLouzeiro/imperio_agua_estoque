import React from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Box,
  Chip,
} from '@mui/material';

interface SaleDisplay {
  id: number;
  cliente: string;
  valor: number;
  data: string;
}

interface RecentSalesProps {
  sales: SaleDisplay[];
  loading?: boolean;
}

const RecentSales: React.FC<RecentSalesProps> = ({ sales, loading = false }) => (
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
      Vendas Recentes
    </Typography>
    
    {loading ? (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        height={200}
      >
        <Typography color="text.secondary">Carregando dados...</Typography>
      </Box>
    ) : sales.length === 0 ? (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        height={200}
      >
        <Typography color="text.secondary">Nenhuma venda encontrada</Typography>
      </Box>
    ) : (
      <List sx={{ py: 0 }}>
        {sales.map((sale) => (
          <ListItem
            key={sale.id}
            sx={{
              px: 0,
              borderBottom: '1px solid',
              borderColor: 'divider',
              '&:last-child': {
                borderBottom: 'none',
              },
            }}
          >
            <ListItemText
              primary={sale.cliente}
              secondary={sale.data}
            />
            <ListItemSecondaryAction>
              <Chip
                label={`R$ ${sale.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                size="small"
                color="success"
                variant="outlined"
              />
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    )}
  </Paper>
);

export default RecentSales;
