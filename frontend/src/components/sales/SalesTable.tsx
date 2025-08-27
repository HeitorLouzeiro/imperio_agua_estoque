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
  onPrintSale: (sale: Sale) => void;
}

const SalesTable: React.FC<SalesTableProps> = ({
  sales,
  loading,
  onViewSale,
  onEditSale,
  onEditStatus,
  onPrintSale
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

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
      width: isMobile ? 80 : 100,
      renderCell: (params: GridRenderCellParams) => (
        <strong>#{params.value}</strong>
      ),
    },
    {
      field: 'cliente',
      headerName: 'Cliente',
      width: isMobile ? 160 : isTablet ? 200 : 250,
      minWidth: 160,
      flex: !isMobile ? 1 : 0,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ 
          width: '100%', 
          textOverflow: 'ellipsis', 
          whiteSpace: 'nowrap', 
          overflow: 'hidden',
          textAlign: 'left'
        }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: 'dataVenda',
      headerName: 'Data',
      width: isMobile ? 100 : 120,
      renderCell: (params: GridRenderCellParams) => {
        const date = new Date(params.value || params.row.createdAt);
        return isMobile ? date.toLocaleDateString('pt-BR', { 
          day: '2-digit', 
          month: '2-digit' 
        }) : date.toLocaleDateString('pt-BR');
      },
    },
    {
      field: 'vendedor',
      headerName: 'Vendedor',
      width: isMobile ? 0 : isTablet ? 140 : 170,
      maxWidth: isMobile ? 0 : undefined,
      renderCell: (params: GridRenderCellParams) => 
        params.value?.nome || 'N/A',
    },
    {
      field: 'total',
      headerName: 'Total',
      width: isMobile ? 100 : 120,
      renderCell: (params: GridRenderCellParams) => (
        <strong style={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
          R$ {(params.value || 0).toFixed(2)}
        </strong>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: isMobile ? 90 : 120,
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
              label={isMobile ? status.charAt(0).toUpperCase() : status.charAt(0).toUpperCase() + status.slice(1)}
              color={getStatusColor(status) as any}
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onEditStatus(params.row);
              }}
              sx={{
                cursor: 'pointer',
                fontSize: isMobile ? '0.65rem' : '0.75rem',
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
      headerName: 'Ações',
      width: isMobile ? 70 : 160,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => (
        isMobile ? (
          <Tooltip title="Ações">
            <IconButton
              size="small"
              color="primary"
              onClick={() => handleOpenActionModal(params.row)}
              sx={{ p: 0.5 }}
            >
              <MoreVertIcon sx={{ fontSize: '1.2rem' }} />
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
      height: isMobile ? 450 : 550, 
      width: '100%',
      '& .MuiDataGrid-root': {
        border: 'none',
      },
      '& .MuiDataGrid-columnHeaders': {
        fontSize: isMobile ? '0.75rem' : '0.875rem',
        fontWeight: 'bold',
        minHeight: isMobile ? '35px' : '56px',
      },
      '& .MuiDataGrid-cell': {
        fontSize: isMobile ? '0.75rem' : '0.875rem',
        padding: isMobile ? '4px 6px' : '8px',
        minHeight: isMobile ? '40px' : '52px',
        whiteSpace: 'normal',
        lineHeight: '1.2',
        display: 'flex',
        alignItems: 'center',
      },
      '& .MuiDataGrid-row': {
        minHeight: isMobile ? '40px' : '52px',
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
            paginationModel: { page: 0, pageSize: isMobile ? 5 : 10 },
          },
        }}
        pageSizeOptions={isMobile ? [5, 10] : [5, 10, 25]}
        disableRowSelectionOnClick
        disableColumnMenu={isMobile}
        getRowId={(row) => row.id || row._id}
        localeText={{
          noRowsLabel: 'Nenhuma venda encontrada',
          footerRowSelected: (count) => `${count} linha(s) selecionada(s)`,
          MuiTablePagination: {
            labelRowsPerPage: isMobile ? 'Por página:' : 'Linhas por página:',
            labelDisplayedRows: ({ from, to, count }) => 
              isMobile 
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
            display: isMobile ? 'none' : 'block',
          },
          '& .MuiDataGrid-toolbarContainer': {
            padding: isMobile ? '4px' : '16px',
          },
          '& .MuiDataGrid-footerContainer': {
            minHeight: isMobile ? '45px' : '52px',
            '& .MuiTablePagination-root': {
              fontSize: isMobile ? '0.75rem' : '0.875rem',
            },
          },
        }}
        density={isMobile ? 'standard' : 'standard'}
        rowHeight={isMobile ? 45 : 56}
      />
      {/* Modal de ações para mobile */}
      <SaleActionsModal
        open={actionModalOpen}
        onClose={handleCloseActionModal}
        sale={selectedSale}
        onView={onViewSale}
        onEdit={onEditSale}
        onEditStatus={onEditStatus}
        onPrint={onPrintSale}
      />
    </Box>
  );
};

export default SalesTable;
