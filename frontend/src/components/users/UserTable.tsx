import React from 'react';
import {
  Paper,
  Box,
  Typography,
  IconButton,
  Chip,
  Tooltip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { 
  Edit, 
  Person as PersonIcon,
  ToggleOn,
  ToggleOff
} from '@mui/icons-material';
import { User } from '../../types';

interface UserTableProps {
  users: User[];
  loading: boolean;
  onEdit: (user: User) => void;
  onDelete: (id: string | number) => void;
  onToggleStatus?: (id: string | number) => void;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  loading,
  onEdit,
  onDelete,
  onToggleStatus
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const columns: GridColDef[] = [
    { 
      field: 'nome', 
      headerName: 'Nome', 
      width: isMobile ? 120 : isTablet ? 160 : 200,
      minWidth: 120,
      flex: isMobile ? 1 : isTablet ? 0.8 : 1,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <PersonIcon sx={{ 
            mr: isMobile ? 0.5 : 1, 
            color: 'text.secondary', 
            fontSize: isMobile ? '1rem' : isTablet ? '1.1rem' : '1.25rem',
            display: isMobile ? 'none' : 'block'
          }} />
          <Typography variant="body2" fontSize={isMobile ? '0.7rem' : isTablet ? '0.75rem' : '0.875rem'}>
            {params.value}
          </Typography>
        </Box>
      )
    },
    { 
      field: 'email', 
      headerName: 'Email', 
      width: isMobile ? 140 : isTablet ? 180 : 250,
      minWidth: 140,
      ...(isMobile && { width: 0, minWidth: 0, flex: 0, maxWidth: 0 }),
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" fontSize={isTablet ? '0.75rem' : '0.875rem'} noWrap>
          {params.value}
        </Typography>
      )
    },
    {
      field: 'papel',
      headerName: 'Papel',
      width: isMobile ? 80 : isTablet ? 100 : 150,
      minWidth: 80,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value === 'administrador' ? (isMobile ? 'Admin' : 'Admin') : (isMobile ? 'Func' : 'Funcionário')}
          color={params.value === 'administrador' ? 'primary' : 'default'}
          size="small"
          variant={params.value === 'administrador' ? 'filled' : 'outlined'}
          sx={{ 
            fontSize: isMobile ? '0.65rem' : isTablet ? '0.7rem' : '0.75rem',
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
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value !== false ? (isMobile ? 'Ativo' : 'Ativo') : (isMobile ? 'Inativo' : 'Inativo')}
          color={params.value !== false ? 'success' : 'error'}
          size="small"
          variant={params.value !== false ? 'filled' : 'outlined'}
          sx={{ 
            fontSize: isMobile ? '0.65rem' : isTablet ? '0.7rem' : '0.75rem',
            height: isMobile ? '20px' : '24px',
            '& .MuiChip-label': {
              px: isMobile ? 0.5 : 1
            }
          }}
        />
      ),
    },
    {
      field: 'createdAt',
      headerName: isMobile ? 'Criado' : 'Criado em',
      width: isMobile ? 80 : isTablet ? 100 : 130,
      minWidth: 80,
      ...(isMobile && { width: 0, minWidth: 0, flex: 0, maxWidth: 0 }),
      renderCell: (params: GridRenderCellParams) => {
        const date = params.value ? new Date(params.value) : null;
        return (
          <Typography variant="body2" fontSize={isTablet ? '0.75rem' : '0.875rem'}>
            {date ? date.toLocaleDateString('pt-BR') : ''}
          </Typography>
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Ações',
      width: isMobile ? 70 : isTablet ? 100 : 160,
      minWidth: 70,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', gap: isMobile ? 0.25 : 0.5 }}>
          <Tooltip title="Editar Usuário">
            <IconButton size={isMobile ? "small" : "small"} onClick={() => onEdit(params.row)}>
              <Edit sx={{ fontSize: isMobile ? '1rem' : '1.2rem' }} />
            </IconButton>
          </Tooltip>
          {onToggleStatus && !isMobile && (
            <Tooltip title={params.row.ativo !== false ? 'Desativar' : 'Reativar'}>
              <IconButton 
                size="small" 
                color={params.row.ativo !== false ? 'success' : 'error'}
                onClick={() => {
                  const action = params.row.ativo !== false ? 'desativar' : 'reativar';
                  const message = `Tem certeza que deseja ${action} o usuário "${params.row.nome}"?`;
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
        rows={users}
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
        getRowId={(row) => row.id}
        density={isMobile ? 'compact' : 'standard'}
        localeText={{
          noRowsLabel: 'Nenhum usuário encontrado',
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

export default UserTable;
