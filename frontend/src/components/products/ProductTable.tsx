import React from 'react';
import {
  Paper,
  Box,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { Product } from '../../types';

interface ProductTableProps {
  products: Product[];
  loading: boolean;
  onView: (id: string | number) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string | number) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  loading,
  onView,
  onEdit,
  onDelete
}) => {
  const columns = [
    { field: 'codigo', headerName: 'Código', width: 130 },
    { field: 'nome', headerName: 'Nome', width: 200 },
    { field: 'marca', headerName: 'Marca', width: 150 },
    {
      field: 'preco',
      headerName: 'Preço',
      width: 100,
      renderCell: (params: any) => `R$ ${(params.value || 0).toFixed(2)}`,
    },
    {
      field: 'quantidade',
      headerName: 'Estoque',
      width: 120,
      renderCell: (params: any) => (
        <Chip
          label={params.value || 0}
          color={params.value === 0 ? 'error' : params.value < 20 ? 'warning' : 'success'}
          icon={params.value !== undefined && params.value < 20 ? <WarningIcon /> : undefined}
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 150,
      sortable: false,
      renderCell: (params: any) => (
        <Box>
          <Tooltip title="Visualizar">
            <IconButton size="small" onClick={() => onView(params.row.id)}>
              <ViewIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Editar">
            <IconButton size="small" onClick={() => onEdit(params.row as Product)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Excluir">
            <IconButton size="small" color="error" onClick={() => onDelete(params.row.id)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Paper sx={{ height: 500 }}>
      <DataGrid
        rows={products}
        columns={columns}
        loading={loading}
        pageSizeOptions={[10, 25, 50]}
        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        disableRowSelectionOnClick
      />
    </Paper>
  );
};

export default ProductTable;
