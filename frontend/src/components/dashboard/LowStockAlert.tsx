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
} from '@mui/material';
import {
  Warning,
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
    <Typography variant="h6" gutterBottom fontWeight="bold">
      Produtos com Estoque Baixo
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
              <Warning color="warning" />
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
