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
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ProductActionsModal from './ProductActionsModal';
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
  const isTabletMobile = useMediaQuery(theme.breakpoints.down('lg')); // Tablets usam interface mobile

  // Estado para modal de ações no mobile
  const [actionModalOpen, setActionModalOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);

  const handleOpenActionModal = (product: Product) => {
    setSelectedProduct(product);
    setActionModalOpen(true);
  };
  const handleCloseActionModal = () => {
    setActionModalOpen(false);
    setSelectedProduct(null);
  };

  const columns = [
    { 
      field: 'codigo', 
      headerName: 'Código', 
      width: isTabletMobile ? 100 : 130,
      minWidth: 80,
      flex: isTabletMobile ? 0 : undefined
    },
    { 
      field: 'nome', 
      headerName: 'Nome', 
      width: isTabletMobile ? 280 : 200,
      minWidth: 120,
      flex: isTabletMobile ? 0 : 1
    },
    { 
      field: 'marca', 
      headerName: 'Marca', 
      width: isTabletMobile ? 120 : 150,
      minWidth: 90,
      hide: isTabletMobile
    },
    {
      field: 'preco',
      headerName: 'Preço',
      width: isTabletMobile ? 110 : 100,
      minWidth: 80,
      renderCell: (params: any) => (
        <Box sx={{ 
          fontSize: isTabletMobile ? '0.75rem' : '0.875rem',
          color: isTabletMobile ? '#2e7d32' : 'inherit',
          fontWeight: isTabletMobile ? 'bold' : 'normal'
        }}>
          R$ {(params.value || 0).toFixed(2)}
        </Box>
      ),
    },
    {
      field: 'quantidade',
      headerName: isTabletMobile ? 'Estoque' : 'Estoque',
      width: isTabletMobile ? 100 : 120,
      minWidth: 70,
      renderCell: (params: any) => (
        <Chip
          label={params.value || 0}
          color={params.value === 0 ? 'error' : params.value < 20 ? 'warning' : 'success'}
          icon={params.value !== undefined && params.value < 20 && !isTabletMobile ? <WarningIcon /> : undefined}
          size={isTabletMobile ? "small" : "small"}
          sx={{ 
            fontSize: isTabletMobile ? '0.65rem' : '0.75rem',
            height: isTabletMobile ? '20px' : '24px',
            '& .MuiChip-label': {
              px: isTabletMobile ? 0.5 : 1
            }
          }}
        />
      ),
    },
    {
      field: 'ativo',
      headerName: 'Status',
      width: isTabletMobile ? 90 : 120,
      minWidth: 70,
      hide: isTabletMobile,
      renderCell: (params: any) => (
        <Chip
          label={params.value !== false ? 'Ativo' : 'Inativo'}
          color={params.value !== false ? 'success' : 'error'}
          size="small"
          variant={params.value !== false ? 'filled' : 'outlined'}
          sx={{ 
            fontSize: isTabletMobile ? '0.65rem' : '0.75rem',
            height: isTabletMobile ? '22px' : '24px'
          }}
        />
      ),
    },
    {
      field: 'actions',
      headerName: isTabletMobile ? '' : 'Ações',
      width: isTabletMobile ? 80 : 180,
      minWidth: 80,
      sortable: false,
      renderCell: (params: any) => (
        isTabletMobile ? (
          <Tooltip title="Mais opções" arrow>
            <IconButton
              size={isTabletMobile ? "medium" : "small"}
              color="primary"
              onClick={() => handleOpenActionModal(params.row as Product)}
              sx={{ 
                p: isTabletMobile ? 1.2 : 0.5,
                minWidth: isTabletMobile ? '44px' : '32px',
                minHeight: isTabletMobile ? '44px' : '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(25, 118, 210, 0.04)',
                border: '1px solid rgba(25, 118, 210, 0.12)',
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  transform: 'scale(1.05)',
                  boxShadow: '0 2px 8px rgba(25, 118, 210, 0.15)'
                },
                '&:active': {
                  transform: 'scale(0.98)',
                },
                transition: 'all 0.2s ease-in-out'
              }}
            >
              <MoreVertIcon sx={{ 
                fontSize: isTabletMobile ? '1.4rem' : '1.2rem',
                color: 'primary.main'
              }} />
            </IconButton>
          </Tooltip>
        ) : (
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="Visualizar">
              <IconButton size="small" onClick={() => onView(params.row.id)}>
                <ViewIcon sx={{ fontSize: '1.2rem' }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Editar">
              <IconButton size="small" onClick={() => onEdit(params.row as Product)}>
                <EditIcon sx={{ fontSize: '1.2rem' }} />
              </IconButton>
            </Tooltip>
            {onToggleStatus && (
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
        )
      ),
    },
  ];

  return (
    <>
      <Paper sx={{ height: isTabletMobile ? 450 : 500, width: '100%' }}>
        <DataGrid
          sx={{
            borderRadius: 0,
            '& .MuiDataGrid-columnHeader': {
              fontSize: isTabletMobile ? '0.7rem' : '0.875rem',
              fontWeight: 'bold'
            },
            '& .MuiDataGrid-cell': {
              fontSize: isTabletMobile ? '0.7rem' : '0.875rem',
              padding: isTabletMobile ? '4px 8px' : '8px 12px'
            },
            '& .MuiDataGrid-row': {
              minHeight: isTabletMobile ? '45px !important' : '52px !important'
            },
            '& .MuiDataGrid-columnSeparator': {
              display: isTabletMobile ? 'none' : 'block'
            },
            '& .MuiDataGrid-toolbarContainer': {
              padding: isTabletMobile ? '8px' : '16px'
            }
          }}
          rows={products}
          columns={columns}
          loading={loading}
          pageSizeOptions={isTabletMobile ? [5, 8, 15] : [10, 25, 50]}
          initialState={{ 
            pagination: { 
              paginationModel: { 
                pageSize: isTabletMobile ? 8 : 10 
              } 
            } 
          }}
          disableRowSelectionOnClick
          density={isTabletMobile ? 'compact' : 'standard'}
          localeText={{
            noRowsLabel: 'Nenhum produto encontrado',
            footerRowSelected: (count) => `${count} linha(s) selecionada(s)`,
            MuiTablePagination: {
              labelRowsPerPage: isTabletMobile ? 'Por página:' : 'Linhas por página:',
              labelDisplayedRows: ({ from, to, count }) => 
                isTabletMobile 
                  ? `${from}-${to} de ${count !== -1 ? count : `+${to}`}`
                  : `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`,
            },
          }}
        />
      </Paper>
      {/* Modal de ações para mobile */}
      <ProductActionsModal
        open={actionModalOpen}
        onClose={handleCloseActionModal}
        product={selectedProduct}
        onView={onView}
        onEdit={onEdit}
        onToggleStatus={onToggleStatus}
      />
    </>
  );
};

export default ProductTable;
