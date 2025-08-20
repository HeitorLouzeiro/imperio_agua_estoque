import React from 'react';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Box, Chip, IconButton, Tooltip, useTheme, useMediaQuery } from '@mui/material';
import { 
  Visibility as ViewIcon, 
  EditNote as EditNoteIcon,
  Assignment as StatusIcon,
  Print as PrintIcon 
} from '@mui/icons-material';
import { Sale } from '../../types';

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
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const columns: GridColDef[] = [
    {
      field: 'numero',
      headerName: 'Número',
      width: isMobile ? 80 : 120,
      minWidth: 80,
      renderCell: (params: GridRenderCellParams) => (
        <strong>#{params.value}</strong>
      ),
    },
    {
      field: 'cliente',
      headerName: 'Cliente',
      width: 200,
      flex: 1,
    },
    {
      field: 'dataVenda',
      headerName: 'Data',
      width: 120,
      renderCell: (params: GridRenderCellParams) => {
        const date = new Date(params.value || params.row.createdAt);
        return date.toLocaleDateString('pt-BR');
      },
    },
    {
      field: 'vendedor',
      headerName: 'Vendedor',
      width: 150,
      renderCell: (params: GridRenderCellParams) => 
        params.value?.nome || 'N/A',
    },
    {
      field: 'total',
      headerName: 'Total',
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <strong>R$ {(params.value || 0).toFixed(2)}</strong>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
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
              label={status.charAt(0).toUpperCase() + status.slice(1)}
              color={getStatusColor(status) as any}
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onEditStatus(params.row);
              }}
              sx={{
                cursor: 'pointer',
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
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <Tooltip title="Visualizar">
            <IconButton 
              size="small" 
              onClick={() => onViewSale(params.row)}
              color="primary"
            >
              <ViewIcon />
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
          <Tooltip title="Imprimir">
            <IconButton 
              size="small" 
              onClick={() => onPrintSale(params.row)}
              color="info"
            >
              <PrintIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ 
      height: isMobile ? 500 : 400, 
      width: '100%',
      '& .MuiDataGrid-root': {
        border: 'none',
      },
      '& .MuiDataGrid-columnHeaders': {
        fontSize: isMobile ? '0.75rem' : '0.875rem',
      },
      '& .MuiDataGrid-cell': {
        fontSize: isMobile ? '0.75rem' : '0.875rem',
        padding: isMobile ? '4px' : '8px',
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
        getRowId={(row) => row.id || row._id}
        localeText={{
          noRowsLabel: 'Nenhuma venda encontrada',
          footerRowSelected: (count) => `${count} linha(s) selecionada(s)`,
          MuiTablePagination: {
            labelRowsPerPage: 'Linhas por página:',
            labelDisplayedRows: ({ from, to, count }) => `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`,
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
            padding: isMobile ? '8px' : '16px',
          },
        }}
        density={isMobile ? 'compact' : 'standard'}
      />
    </Box>
  );
};

export default SalesTable;
