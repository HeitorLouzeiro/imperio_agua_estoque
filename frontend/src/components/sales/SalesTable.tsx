import {
  EditNote as EditNoteIcon,
  Assignment as StatusIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Box, Chip, IconButton, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import React from 'react';
import { Sale } from '../../types';
import SaleActionsModal from './SaleActionsModal';

interface SalesTableProps {
  sales: Sale[];
  loading: boolean;
  onViewSale: (sale: Sale) => void;
  onEditSale: (sale: Sale) => void;
  onEditStatus: (sale: Sale) => void;
}

const SalesTable: React.FC<SalesTableProps> = ({
  sales,
  loading,
  onViewSale,
  onEditSale,
  onEditStatus
}) => {
  const theme = useTheme();
  const isTabletMobile = useMediaQuery(theme.breakpoints.down('lg')); // Tablets usam interface mobile

  // Estado para modal de ações no mobile
  const [actionModalOpen, setActionModalOpen] = React.useState(false);
  const [selectedSale, setSelectedSale] = React.useState<Sale | null>(null);

  const handleOpenActionModal = (sale: Sale) => {
    setSelectedSale(sale);
    setActionModalOpen(true);
  };
  const handleCloseActionModal = () => {
    setActionModalOpen(false);
    setSelectedSale(null);
  };

  const columns: GridColDef[] = [
    {
      field: 'numero',
      headerName: '#',
      width: isTabletMobile ? 90 : 100,
      renderCell: (params: GridRenderCellParams) => (
        <strong style={{ fontSize: isTabletMobile ? '0.7rem' : '0.875rem' }}>
          #{params.value}
        </strong>
      ),
    },
    {
      field: 'cliente',
      headerName: 'Cliente',
      width: isTabletMobile ? 280 : 250,
      minWidth: 160,
      flex: !isTabletMobile ? 1 : 0,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ 
          width: '100%', 
          textOverflow: 'ellipsis', 
          whiteSpace: 'nowrap', 
          overflow: 'hidden',
          textAlign: 'left',
          fontSize: isTabletMobile ? '0.75rem' : '0.875rem'
        }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: 'dataVenda',
      headerName: isTabletMobile ? 'Data' : 'Data',
      width: isTabletMobile ? 100 : 120,
      renderCell: (params: GridRenderCellParams) => {
        const date = new Date(params.value || params.row.createdAt);
        return (
          <Box sx={{ fontSize: isTabletMobile ? '0.7rem' : '0.875rem' }}>
            {isTabletMobile ? date.toLocaleDateString('pt-BR', { 
              day: '2-digit', 
              month: '2-digit' 
            }) : date.toLocaleDateString('pt-BR')}
          </Box>
        );
      },
    },
    {
      field: 'vendedor',
      headerName: 'Vendedor',
      width: isTabletMobile ? 110 : 170,
      maxWidth: isTabletMobile ? 110 : undefined,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ 
          fontSize: isTabletMobile ? '0.7rem' : '0.875rem',
          textOverflow: 'ellipsis', 
          whiteSpace: 'nowrap', 
          overflow: 'hidden'
        }}>
          {isTabletMobile ? 'Func.' : (params.value?.nome || 'N/A')}
        </Box>
      ),
    },
    {
      field: 'total',
      headerName: isTabletMobile ? 'Valor' : 'Total',
      width: isTabletMobile ? 110 : 120,
      renderCell: (params: GridRenderCellParams) => (
        <strong style={{ 
          fontSize: isTabletMobile ? '0.75rem' : '0.875rem',
          color: isTabletMobile ? '#2e7d32' : 'inherit'
        }}>
          R$ {(params.value || 0).toFixed(2)}
        </strong>
      ),
    },
    {
      field: 'status',
      headerName: isTabletMobile ? 'Status' : 'Status',
      width: isTabletMobile ? 90 : 120,
      renderCell: (params: GridRenderCellParams) => {
        const status = params.value || 'paga';
        const getStatusColor = (status: string) => {
          switch (status) {
            case 'paga':
              return 'success';
            case 'pendente':
              return 'warning';
            case 'cancelada':
              return 'error';
            default:
              return 'default';
          }
        };

        return (
          <Tooltip title="Clique para editar status">
            <Chip
              label={isTabletMobile ? 
                (status === 'paga' ? 'Paga' : status === 'pendente' ? 'Pend.' : 'Canc.') : 
                status.charAt(0).toUpperCase() + status.slice(1)
              }
              color={getStatusColor(status) as any}
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onEditStatus(params.row);
              }}
              sx={{
                cursor: 'pointer',
                fontSize: isTabletMobile ? '0.65rem' : '0.75rem',
                minWidth: isTabletMobile ? 'auto' : 'auto',
                height: isTabletMobile ? '22px' : '24px',
                '&:hover': {
                  opacity: 0.8,
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.2s ease-in-out'
              }}
            />
          </Tooltip>
        );
      },
    },
    {
      field: 'actions',
      headerName: '',
      width: isTabletMobile ? 80 : 160,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => (
        isTabletMobile ? (
          <Tooltip title="Mais opções" arrow>
            <IconButton
              size={isTabletMobile ? "medium" : "small"}
              color="primary"
              onClick={() => handleOpenActionModal(params.row)}
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
              <IconButton 
                size="small" 
                onClick={() => onViewSale(params.row)}
                color="primary"
                sx={{ p: 1 }}
              >
                <ViewIcon sx={{ fontSize: '1.25rem' }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Editar Venda">
              <IconButton 
                size="small" 
                onClick={() => onEditSale(params.row)}
                color="warning"
              >
                <EditNoteIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Editar Status">
              <IconButton 
                size="small" 
                onClick={() => onEditStatus(params.row)}
                color="secondary"
              >
                <StatusIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )
      ),
    },
  ];

  return (
    <Box sx={{ 
      height: isTabletMobile ? 450 : 550, 
      width: '100%',
      '& .MuiDataGrid-root': {
        border: 'none',
      },
      '& .MuiDataGrid-columnHeaders': {
        fontSize: isTabletMobile ? '0.7rem' : '0.875rem',
        fontWeight: 'bold',
        minHeight: isTabletMobile ? '40px' : '56px',
      },
      '& .MuiDataGrid-cell': {
        fontSize: isTabletMobile ? '0.7rem' : '0.875rem',
        padding: isTabletMobile ? '4px 6px' : '8px',
        minHeight: isTabletMobile ? '45px' : '52px',
        whiteSpace: 'normal',
        lineHeight: '1.2',
        display: 'flex',
        alignItems: 'center',
      },
      '& .MuiDataGrid-row': {
        minHeight: isTabletMobile ? '45px' : '52px',
      },
      '& .MuiDataGrid-virtualScroller': {
        overflow: 'auto',
      },
    }}>
      <DataGrid
        rows={sales}
        columns={columns}
        loading={loading}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: isTabletMobile ? 8 : 10 },
          },
        }}
        pageSizeOptions={isTabletMobile ? [5, 8, 15] : [5, 10, 25]}
        disableRowSelectionOnClick
        disableColumnMenu={isTabletMobile}
        getRowId={(row) => row.id || row._id}
        localeText={{
          noRowsLabel: 'Nenhuma venda encontrada',
          footerRowSelected: (count) => `${count} linha(s) selecionada(s)`,
          MuiTablePagination: {
            labelRowsPerPage: isTabletMobile ? 'Por página:' : 'Linhas por página:',
            labelDisplayedRows: ({ from, to, count }) => 
              isTabletMobile 
                ? `${from}-${to} de ${count !== -1 ? count : `+${to}`}`
                : `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`,
          },
        }}
        sx={{
          '& .MuiDataGrid-cell:focus': {
            outline: 'none',
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: 'action.hover',
          },
          '& .MuiDataGrid-columnSeparator': {
            display: isTabletMobile ? 'none' : 'block',
          },
          '& .MuiDataGrid-toolbarContainer': {
            padding: isTabletMobile ? '4px' : '16px',
          },
          '& .MuiDataGrid-footerContainer': {
            minHeight: isTabletMobile ? '45px' : '52px',
            '& .MuiTablePagination-root': {
              fontSize: isTabletMobile ? '0.75rem' : '0.875rem',
            },
          },
        }}
        density={isTabletMobile ? 'compact' : 'standard'}
        rowHeight={isTabletMobile ? 45 : 56}
      />
      {/* Modal de ações para mobile */}
      <SaleActionsModal
        open={actionModalOpen}
        onClose={handleCloseActionModal}
        sale={selectedSale}
        onView={onViewSale}
        onEdit={onEditSale}
        onEditStatus={onEditStatus}
      />
    </Box>
  );
};

export default SalesTable;
