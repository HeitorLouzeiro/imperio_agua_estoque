import {
  Edit,
  Person as PersonIcon,
  ToggleOff,
  ToggleOn
} from '@mui/icons-material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  Box,
  Chip,
  IconButton,
  Paper,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import React from 'react';
import { User } from '../../types';
import UserActionsModal from './UserActionsModal';

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
  const isTabletMobile = useMediaQuery(theme.breakpoints.down('lg')); // Tablets usam interface mobile

  // Estado para modal de ações no mobile
  const [actionModalOpen, setActionModalOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);

  const handleOpenActionModal = (user: User) => {
    setSelectedUser(user);
    setActionModalOpen(true);
  };
  const handleCloseActionModal = () => {
    setActionModalOpen(false);
    setSelectedUser(null);
  };

  const columns: GridColDef[] = [
    { 
      field: 'nome', 
      headerName: 'Nome', 
      width: isTabletMobile ? 250 : 200,
      minWidth: 120,
      flex: isTabletMobile ? 0 : 1,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <PersonIcon sx={{ 
            mr: isTabletMobile ? 0.5 : 1, 
            color: 'text.secondary', 
            fontSize: isTabletMobile ? '1rem' : '1.25rem',
            display: isTabletMobile ? 'none' : 'block'
          }} />
          <Typography variant="body2" fontSize={isTabletMobile ? '0.75rem' : '0.875rem'}>
            {params.value}
          </Typography>
        </Box>
      )
    },
    { 
      field: 'email', 
      headerName: 'Email', 
      width: isTabletMobile ? 200 : 250,
      minWidth: 140,
      ...(isTabletMobile && { width: 0, minWidth: 0, flex: 0, maxWidth: 0 }),
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" fontSize={isTabletMobile ? '0.75rem' : '0.875rem'} noWrap>
          {params.value}
        </Typography>
      )
    },
    {
      field: 'papel',
      headerName: 'Papel',
      width: isTabletMobile ? 120 : 150,
      minWidth: 80,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value === 'administrador' ? 'Admin' : 'Funcionário'}
          color={params.value === 'administrador' ? 'primary' : 'default'}
          size="small"
          variant={params.value === 'administrador' ? 'filled' : 'outlined'}
          sx={{ 
            fontSize: isTabletMobile ? '0.7rem' : '0.75rem',
            height: isTabletMobile ? '22px' : '24px',
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
      width: isTabletMobile ? 100 : 120,
      minWidth: 70,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value !== false ? 'Ativo' : 'Inativo'}
          color={params.value !== false ? 'success' : 'error'}
          size="small"
          variant={params.value !== false ? 'filled' : 'outlined'}
          sx={{ 
            fontSize: isTabletMobile ? '0.7rem' : '0.75rem',
            height: isTabletMobile ? '22px' : '24px',
            '& .MuiChip-label': {
              px: isTabletMobile ? 0.5 : 1
            }
          }}
        />
      ),
    },
    {
      field: 'createdAt',
      headerName: isTabletMobile ? 'Criado' : 'Criado em',
      width: isTabletMobile ? 90 : 130,
      minWidth: 80,
      ...(isTabletMobile && { width: 0, minWidth: 0, flex: 0, maxWidth: 0 }),
      renderCell: (params: GridRenderCellParams) => {
        const date = params.value ? new Date(params.value) : null;
        return (
          <Typography variant="body2" fontSize={isTabletMobile ? '0.75rem' : '0.875rem'}>
            {date ? date.toLocaleDateString('pt-BR') : ''}
          </Typography>
        );
      },
    },
    {
      field: 'actions',
      headerName: isTabletMobile ? '' : 'Ações',
      width: isTabletMobile ? 80 : 130,
      minWidth: 80,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        isTabletMobile ? (
          <Tooltip title="Mais opções" arrow>
            <IconButton
              size={isTabletMobile ? "medium" : "small"}
              color="primary"
              onClick={() => handleOpenActionModal(params.row as User)}
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
            <Tooltip title="Editar">
              <IconButton size="small" onClick={() => onEdit(params.row as User)}>
                <Edit sx={{ fontSize: '1.2rem' }} />
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
        )
      ),
    },
  ];

  return (
    <>
      <Paper elevation={3} sx={{ p: { xs: 1, sm: 2, lg: 3 } }}>
        <DataGrid
          rows={users}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { pageSize: isTabletMobile ? 8 : 5 } },
            sorting: {
              sortModel: [{ field: 'nome', sort: 'asc' }],
            },
          }}
          pageSizeOptions={isTabletMobile ? [8, 16, 24] : [5, 10, 25, 50]}
          disableRowSelectionOnClick
          getRowId={(row) => row.id || 0}
          sx={{
            height: isTabletMobile ? 450 : 400,
            '& .MuiDataGrid-main': {
              backgroundColor: 'background.paper',
            },
            '& .MuiDataGrid-cell': {
              fontSize: isTabletMobile ? '0.8rem' : '0.875rem',
              paddingX: isTabletMobile ? 1 : 1.5,
            },
            '& .MuiDataGrid-columnHeader': {
              fontSize: isTabletMobile ? '0.8rem' : '0.875rem',
              fontWeight: 600,
              paddingX: isTabletMobile ? 1 : 1.5,
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        />
      </Paper>
      
      {/* Modal de ações para mobile */}
      <UserActionsModal
        open={actionModalOpen}
        onClose={handleCloseActionModal}
        user={selectedUser}
        onEdit={onEdit}
        onToggleStatus={onToggleStatus}
      />
    </>
  );
};

export default UserTable;
