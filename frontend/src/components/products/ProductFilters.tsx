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
  Tooltip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Clear as ClearIcon,
  Category as CategoryIcon,
  ToggleOn as ActiveIcon
} from '@mui/icons-material';

interface ProductFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterCategory: string;
  setFilterCategory: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  categories: string[];
  onRefresh: () => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  filterCategory,
  setFilterCategory,
  statusFilter,
  setStatusFilter,
  categories,
  onRefresh
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const clearFilters = () => {
    setSearchTerm('');
    setFilterCategory('');
    setStatusFilter('todos');
  };

  const hasActiveFilters = searchTerm || filterCategory || statusFilter !== 'todos';

  return (
    <Box>
      <Grid container spacing={isMobile ? 1.5 : 2} alignItems="flex-end">
        <Grid item xs={12} sm={12} md={4}>
          <TextField
            fullWidth
            placeholder="Buscar por código, nome ou marca"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            variant="outlined"
            size={isMobile ? "small" : "medium"}
            sx={{ 
              '& .MuiOutlinedInput-root': { 
                borderRadius: 2,
                backgroundColor: 'background.paper',
                fontSize: isMobile ? '0.875rem' : '1rem'
              },
              '& .MuiInputBase-input': {
                fontSize: isMobile ? '0.875rem' : '1rem'
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" sx={{ fontSize: isMobile ? '1.2rem' : '1.5rem' }} />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchTerm('')}>
                    <ClearIcon sx={{ fontSize: isMobile ? '1rem' : '1.2rem' }} />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            select
            label="Marca"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            variant="outlined"
            size={isMobile ? "small" : "medium"}
            sx={{ 
              '& .MuiOutlinedInput-root': { 
                borderRadius: 2,
                backgroundColor: 'background.paper'
              },
              '& .MuiInputLabel-root': {
                fontSize: isMobile ? '0.875rem' : '1rem'
              },
              '& .MuiInputBase-input': {
                fontSize: isMobile ? '0.875rem' : '1rem'
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CategoryIcon color="action" sx={{ fontSize: isMobile ? '1.2rem' : '1.5rem' }} />
                </InputAdornment>
              )
            }}
          >
            <MenuItem value="">Todas as marcas</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            select
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            variant="outlined"
            size={isMobile ? "small" : "medium"}
            sx={{ 
              '& .MuiOutlinedInput-root': { 
                borderRadius: 2,
                backgroundColor: 'background.paper'
              },
              '& .MuiInputLabel-root': {
                fontSize: isMobile ? '0.875rem' : '1rem'
              },
              '& .MuiInputBase-input': {
                fontSize: isMobile ? '0.875rem' : '1rem'
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <ActiveIcon color="action" sx={{ fontSize: isMobile ? '1.2rem' : '1.5rem' }} />
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
          <Box sx={{ 
            display: 'flex', 
            gap: 1, 
            flexDirection: isMobile ? 'row' : 'column',
            justifyContent: isMobile ? 'space-between' : 'flex-start'
          }}>
            <Tooltip title="Atualizar lista">
              <Button
                fullWidth={!isMobile}
                variant="outlined"
                onClick={onRefresh}
                startIcon={!isMobile ? <RefreshIcon /> : undefined}
                size={isMobile ? "small" : "medium"}
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 'medium',
                  fontSize: isMobile ? '0.75rem' : '0.875rem',
                  minWidth: isMobile ? '80px' : 'auto',
                  flex: isMobile ? 1 : 'none'
                }}
              >
                {isMobile ? 'Atualizar' : 'Atualizar'}
              </Button>
            </Tooltip>
            
            {hasActiveFilters && (
              <Tooltip title="Limpar filtros">
                <Button
                  fullWidth={!isMobile}
                  variant="text"
                  onClick={clearFilters}
                  startIcon={!isMobile ? <ClearIcon /> : undefined}
                  size="small"
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: isMobile ? '0.75rem' : '0.875rem',
                    minWidth: isMobile ? '70px' : 'auto',
                    flex: isMobile ? 1 : 'none'
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
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
            Filtros ativos:
          </Typography>
          {searchTerm && (
            <Chip
              label={`Busca: "${searchTerm}"`}
              onDelete={() => setSearchTerm('')}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ fontSize: isMobile ? '0.7rem' : '0.75rem' }}
            />
          )}
          {filterCategory && (
            <Chip
              label={`Marca: ${filterCategory}`}
              onDelete={() => setFilterCategory('')}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ fontSize: isMobile ? '0.7rem' : '0.75rem' }}
            />
          )}
          {statusFilter !== 'todos' && (
            <Chip
              label={`Status: ${statusFilter}`}
              onDelete={() => setStatusFilter('todos')}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ fontSize: isMobile ? '0.7rem' : '0.75rem' }}
            />
          )}
        </Box>
      )}
    </Box>
  );
};

export default ProductFilters;
