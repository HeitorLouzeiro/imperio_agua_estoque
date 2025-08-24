import React from 'react';
import {
  Paper,
  Box,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  Edit as EditIcon,
  Visibility as ViewIcon,
  Warning as WarningIcon,
  ToggleOn,
  ToggleOff
} from '@mui/icons-material';
import { Product } from '../../types';

interface ProductTableProps {
  products: Product[];
  loading: boolean;
  onView: (id: string | number) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string | number) => void;
  onToggleStatus?: (id: string | number) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  loading,
  onView,
  onEdit,
  onDelete,
  onToggleStatus
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const columns = [
    { 
      field: 'codigo', 
      headerName: 'Código', 
      width: isMobile ? 90 : isTablet ? 110 : 130,
      minWidth: 80,
      flex: isMobile ? 0 : undefined
    },
    { 
      field: 'nome', 
      headerName: 'Nome', 
      width: isMobile ? 120 : isTablet ? 160 : 200,
      minWidth: 120,
      flex: isMobile ? 1 : isTablet ? 0.8 : 1
    },
    { 
      field: 'marca', 
      headerName: 'Marca', 
      width: isMobile ? 100 : isTablet ? 120 : 150,
      minWidth: 90,
      hide: isMobile
    },
    {
      field: 'preco',
      headerName: 'Preço',
      width: isMobile ? 80 : isTablet ? 90 : 100,
      minWidth: 80,
      renderCell: (params: any) => (
        <Box sx={{ fontSize: isMobile ? '0.7rem' : '0.875rem' }}>
          R$ {(params.value || 0).toFixed(2)}
        </Box>
      ),
    },
    {
      field: 'quantidade',
      headerName: isMobile ? 'Estq.' : 'Estoque',
      width: isMobile ? 70 : isTablet ? 90 : 120,
      minWidth: 70,
      renderCell: (params: any) => (
        <Chip
          label={params.value || 0}
          color={params.value === 0 ? 'error' : params.value < 20 ? 'warning' : 'success'}
          icon={params.value !== undefined && params.value < 20 && !isMobile ? <WarningIcon /> : undefined}
          size={isMobile ? "small" : "small"}
          sx={{ 
            fontSize: isMobile ? '0.65rem' : '0.75rem',
            height: isMobile ? '20px' : '24px',
            '& .MuiChip-label': {
              px: isMobile ? 0.5 : 1
            }
          }}
        />
      ),
    },
    {
      field: 'ativo',
      headerName: 'Status',
      width: isMobile ? 70 : isTablet ? 90 : 120,
      minWidth: 70,
      hide: isMobile,
      renderCell: (params: any) => (
        <Chip
          label={params.value !== false ? 'Ativo' : 'Inativo'}
          color={params.value !== false ? 'success' : 'error'}
          size="small"
          variant={params.value !== false ? 'filled' : 'outlined'}
          sx={{ 
            fontSize: isTablet ? '0.7rem' : '0.75rem',
            height: '24px'
          }}
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Ações',
      width: isMobile ? 80 : isTablet ? 120 : 180,
      minWidth: 80,
      sortable: false,
      renderCell: (params: any) => (
        <Box sx={{ display: 'flex', gap: isMobile ? 0.25 : 0.5 }}>
          <Tooltip title="Visualizar">
            <IconButton size={isMobile ? "small" : "small"} onClick={() => onView(params.row.id)}>
              <ViewIcon sx={{ fontSize: isMobile ? '1rem' : '1.2rem' }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Editar">
            <IconButton size={isMobile ? "small" : "small"} onClick={() => onEdit(params.row as Product)}>
              <EditIcon sx={{ fontSize: isMobile ? '1rem' : '1.2rem' }} />
            </IconButton>
          </Tooltip>
          {onToggleStatus && !isMobile && (
            <Tooltip title={params.row.ativo !== false ? 'Desativar' : 'Reativar'}>
              <IconButton 
                size="small" 
                color={params.row.ativo !== false ? 'success' : 'error'}
                onClick={() => {
                  const action = params.row.ativo !== false ? 'desativar' : 'reativar';
                  const message = `Tem certeza que deseja ${action} o produto "${params.row.nome}"?`;
                  if (window.confirm(message)) {
                    onToggleStatus(params.row.id);
                  }
                }}
              >
                {params.row.ativo !== false ? <ToggleOn /> : <ToggleOff />}
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ];

  return (
    <Paper sx={{ height: isMobile ? 350 : isTablet ? 450 : 500, width: '100%' }}>
      <DataGrid
        sx={{
          borderRadius: 0,
          '& .MuiDataGrid-columnHeader': {
            fontSize: isMobile ? '0.7rem' : isTablet ? '0.75rem' : '0.875rem',
            fontWeight: 'bold'
          },
          '& .MuiDataGrid-cell': {
            fontSize: isMobile ? '0.7rem' : isTablet ? '0.75rem' : '0.875rem',
            padding: isMobile ? '4px 8px' : '8px 12px'
          },
          '& .MuiDataGrid-row': {
            minHeight: isMobile ? '40px !important' : '52px !important'
          },
          '& .MuiDataGrid-columnSeparator': {
            display: isMobile ? 'none' : 'block'
          },
          '& .MuiDataGrid-toolbarContainer': {
            padding: isMobile ? '8px' : '16px'
          }
        }}
        rows={products}
        columns={columns}
        loading={loading}
        pageSizeOptions={isMobile ? [5, 10] : isTablet ? [10, 25] : [10, 25, 50]}
        initialState={{ 
          pagination: { 
            paginationModel: { 
              pageSize: isMobile ? 5 : isTablet ? 10 : 10 
            } 
          } 
        }}
        disableRowSelectionOnClick
        density={isMobile ? 'compact' : 'standard'}
        localeText={{
          noRowsLabel: 'Nenhum produto encontrado',
          footerRowSelected: (count) => `${count} linha(s) selecionada(s)`,
          MuiTablePagination: {
            labelRowsPerPage: isMobile ? 'Por página:' : 'Linhas por página:',
            labelDisplayedRows: ({ from, to, count }) => 
              isMobile 
                ? `${from}-${to} de ${count !== -1 ? count : `+${to}`}`
                : `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`,
          },
        }}
      />
    </Paper>
  );
};

export default ProductTable;
