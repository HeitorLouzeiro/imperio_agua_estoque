import React from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Box,
  Chip,
  Avatar,
} from '@mui/material';
import {
  InventoryOutlined,
  ErrorOutline,
} from '@mui/icons-material';

interface ProductLowStock {
  id: number;
  nome: string;
  estoque: number;
}

interface LowStockAlertProps {
  products: ProductLowStock[];
  loading?: boolean;
}

const LowStockAlert: React.FC<LowStockAlertProps> = ({ products, loading = false }) => (
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
          bgcolor: 'warning.light',
          color: 'warning.contrastText',
          mr: 2,
          width: 32,
          height: 32,
        }}
      >
        <InventoryOutlined sx={{ fontSize: 18 }} />
      </Avatar>
      <Typography variant="h6" fontWeight="bold">
        Produtos com Estoque Baixo
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
    ) : products.length === 0 ? (
      <Box 
        display="flex" 
        flexDirection="column"
        justifyContent="center" 
        alignItems="center" 
        height={200}
      >
        <Typography color="text.secondary" align="center">
          Todos os produtos têm estoque adequado! 🎉
        </Typography>
      </Box>
    ) : (
      <List sx={{ py: 0 }}>
        {products.map((product) => (
          <ListItem
            key={product.id}
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
              <ErrorOutline 
                sx={{ 
                  color: 'warning.main',
                  fontSize: 28
                }} 
              />
            </ListItemIcon>
            <ListItemText
              primary={product.nome}
              secondary={`Apenas ${product.estoque} em estoque`}
            />
            <Chip
              label={product.estoque}
              size="small"
              color={product.estoque <= 3 ? 'error' : 'warning'}
              variant="outlined"
            />
          </ListItem>
        ))}
      </List>
    )}
  </Paper>
);

export default LowStockAlert;
