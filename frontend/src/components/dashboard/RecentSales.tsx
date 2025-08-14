import React from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  ListItemIcon,
  Box,
  Chip,
  Avatar,
} from '@mui/material';
import {
  ShoppingBag,
  TrendingUp,
} from '@mui/icons-material';

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
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <Avatar
        sx={{
          bgcolor: 'success.light',
          color: 'success.contrastText',
          mr: 2,
          width: 32,
          height: 32,
        }}
      >
        <TrendingUp sx={{ fontSize: 18 }} />
      </Avatar>
      <Typography variant="h6" fontWeight="bold">
        Vendas Recentes
      </Typography>
    </Box>
    
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
            <ListItemIcon>
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: 'success.light',
                  color: 'success.contrastText',
                }}
              >
                <ShoppingBag sx={{ fontSize: 20 }} />
              </Avatar>
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="body1" fontWeight={600}>
                  {sale.cliente}
                </Typography>
              }
              secondary={
                <Typography variant="caption" color="text.secondary">
                  {sale.data}
                </Typography>
              }
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
