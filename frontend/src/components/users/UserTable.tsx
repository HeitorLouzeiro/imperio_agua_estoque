import React from 'react';
import {
  Paper,
  Box,
  Typography,
  IconButton,
  Chip,
  Tooltip
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { 
  Edit, 
  Block, 
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
  const columns: GridColDef[] = [
    { 
      field: 'nome', 
      headerName: 'Nome', 
      width: 200,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      )
    },
    { 
      field: 'email', 
      headerName: 'Email', 
      width: 250 
    },
    {
      field: 'papel',
      headerName: 'Papel',
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value === 'administrador' ? 'Admin' : 'Funcionário'}
          color={params.value === 'administrador' ? 'primary' : 'default'}
          size="small"
          variant={params.value === 'administrador' ? 'filled' : 'outlined'}
        />
      ),
    },
    {
      field: 'ativo',
      headerName: 'Status',
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value !== false ? 'Ativo' : 'Inativo'}
          color={params.value !== false ? 'success' : 'error'}
          size="small"
          variant={params.value !== false ? 'filled' : 'outlined'}
        />
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Criado em',
      width: 130,
      renderCell: (params: GridRenderCellParams) => {
        const date = params.value ? new Date(params.value) : null;
        return date ? date.toLocaleDateString('pt-BR') : '';
      },
    },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 160,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <Tooltip title="Editar Usuário">
            <IconButton size="small" onClick={() => onEdit(params.row)}>
              <Edit />
            </IconButton>
          </Tooltip>
          {onToggleStatus && (
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
    <Paper sx={{ height: 440, width: '100%', mb: 3 }}>
      <DataGrid
        rows={users}
        columns={columns}
        loading={loading}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 8, page: 0 },
          },
        }}
        pageSizeOptions={[8, 16]}
        disableRowSelectionOnClick
        getRowId={(row) => row.id}
        localeText={{
          noRowsLabel: 'Nenhum usuário encontrado',
          footerRowSelected: (count) => `${count} linha(s) selecionada(s)`,
        }}
      />
    </Paper>
  );
};

export default UserTable;
