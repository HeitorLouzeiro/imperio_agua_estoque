import React from 'react';
import { Box, TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem, Chip, useMediaQuery, useTheme, Grid } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

interface SalesFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  dateFilter: Date | null;
  setDateFilter: (value: Date | null) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  onNewSale?: () => void;
}

const SalesFilters: React.FC<SalesFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  dateFilter,
  setDateFilter,
  statusFilter,
  setStatusFilter,
  onNewSale
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paga': return 'success';
      case 'pendente': return 'warning';
      case 'cancelada': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paga': return 'Paga';
      case 'pendente': return 'Pendente';
      case 'cancelada': return 'Cancelada';
      default: return 'Todos';
    }
  };

  if (isMobile) {
    return (
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Buscar vendas"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              fullWidth
            />
          </Grid>
          
          <Grid item xs={6}>
            <DatePicker
              label="Data"
              value={dateFilter}
              onChange={(newValue) => setDateFilter(newValue)}
              slotProps={{
                textField: {
                  size: 'small',
                  fullWidth: true
                }
              }}
            />
          </Grid>

          <Grid item xs={6}>
            <FormControl size="small" fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
                renderValue={(selected) => (
                  selected ? getStatusLabel(selected) : 'Todos'
                )}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="paga">
                  <Chip label="Paga" color="success" size="small" />
                </MenuItem>
                <MenuItem value="pendente">
                  <Chip label="Pendente" color="warning" size="small" />
                </MenuItem>
                <MenuItem value="cancelada">
                  <Chip label="Cancelada" color="error" size="small" />
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <Box display="flex" gap={2} mb={3} alignItems="center" flexWrap="wrap">
      <TextField
        label="Buscar vendas"
        variant="outlined"
        size="small"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ minWidth: isTablet ? 200 : 250 }}
      />
      
      <DatePicker
        label="Filtrar por data"
        value={dateFilter}
        onChange={(newValue) => setDateFilter(newValue)}
        slotProps={{
          textField: {
            size: 'small',
            sx: { minWidth: isTablet ? 150 : 200 }
          }
        }}
      />

      <FormControl size="small" sx={{ minWidth: isTablet ? 120 : 150 }}>
        <InputLabel>Status</InputLabel>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          label="Status"
          renderValue={(selected) => (
            selected ? (
              <Chip 
                label={getStatusLabel(selected)} 
                color={getStatusColor(selected) as any}
                size="small"
              />
            ) : 'Todos'
          )}
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="paga">
            <Chip label="Paga" color="success" size="small" />
          </MenuItem>
          <MenuItem value="pendente">
            <Chip label="Pendente" color="warning" size="small" />
          </MenuItem>
          <MenuItem value="cancelada">
            <Chip label="Cancelada" color="error" size="small" />
          </MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default SalesFilters;
