import React from 'react';
import {
  Grid,
  TextField,
  Button,
  InputAdornment,
  MenuItem,
  Box,
  Chip,
  Typography,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Clear as ClearIcon,
  Group as GroupIcon,
  ToggleOn as StatusIcon
} from '@mui/icons-material';

interface UserFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  roleFilter: string;
  setRoleFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  onClearFilters: () => void;
  onRefresh?: () => void;
}

const UserFilters: React.FC<UserFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  roleFilter,
  setRoleFilter,
  statusFilter,
  setStatusFilter,
  onClearFilters,
  onRefresh
}) => {
  const clearFilters = () => {
    setSearchTerm('');
    setRoleFilter('');
    setStatusFilter('todos');
    onClearFilters();
  };

  const hasActiveFilters = searchTerm || roleFilter || statusFilter !== 'todos';

  return (
    <Box>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            placeholder="Buscar por nome ou email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            variant="outlined"
            size="medium"
            sx={{ 
              '& .MuiOutlinedInput-root': { 
                borderRadius: 2,
                backgroundColor: 'background.paper'
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchTerm('')}>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            select
            label="Papel"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            variant="outlined"
            size="medium"
            sx={{ 
              '& .MuiOutlinedInput-root': { 
                borderRadius: 2,
                backgroundColor: 'background.paper'
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <GroupIcon color="action" />
                </InputAdornment>
              )
            }}
          >
            <MenuItem value="">Todos os papéis</MenuItem>
            <MenuItem value="administrador">Administrador</MenuItem>
            <MenuItem value="funcionario">Funcionário</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            select
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            variant="outlined"
            size="medium"
            sx={{ 
              '& .MuiOutlinedInput-root': { 
                borderRadius: 2,
                backgroundColor: 'background.paper'
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <StatusIcon color="action" />
                </InputAdornment>
              )
            }}
          >
            <MenuItem value="todos">Todos</MenuItem>
            <MenuItem value="ativo">Ativos</MenuItem>
            <MenuItem value="inativo">Inativos</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} md={2}>
          <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
            <Tooltip title="Atualizar lista">
              <Button
                fullWidth
                variant="outlined"
                onClick={onRefresh || (() => window.location.reload())}
                startIcon={<RefreshIcon />}
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 'medium'
                }}
              >
                Atualizar
              </Button>
            </Tooltip>
            
            {hasActiveFilters && (
              <Tooltip title="Limpar filtros">
                <Button
                  fullWidth
                  variant="text"
                  onClick={clearFilters}
                  startIcon={<ClearIcon />}
                  size="small"
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '0.875rem'
                  }}
                >
                  Limpar
                </Button>
              </Tooltip>
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Filtros ativos */}
      {hasActiveFilters && (
        <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Filtros ativos:
          </Typography>
          {searchTerm && (
            <Chip
              label={`Busca: "${searchTerm}"`}
              onDelete={() => setSearchTerm('')}
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
          {roleFilter && (
            <Chip
              label={`Papel: ${roleFilter}`}
              onDelete={() => setRoleFilter('')}
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
          {statusFilter !== 'todos' && (
            <Chip
              label={`Status: ${statusFilter}`}
              onDelete={() => setStatusFilter('todos')}
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
        </Box>
      )}
    </Box>
  );
};

export default UserFilters;
