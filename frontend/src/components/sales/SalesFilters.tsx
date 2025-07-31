import React from 'react';
import { Box, TextField, InputAdornment } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

interface SalesFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  dateFilter: Date | null;
  setDateFilter: (value: Date | null) => void;
  onNewSale?: () => void;
}

const SalesFilters: React.FC<SalesFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  dateFilter,
  setDateFilter,
  onNewSale
}) => {
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
        sx={{ minWidth: 250 }}
      />
      
      <DatePicker
        label="Filtrar por data"
        value={dateFilter}
        onChange={(newValue) => setDateFilter(newValue)}
        slotProps={{
          textField: {
            size: 'small',
            sx: { minWidth: 200 }
          }
        }}
      />
    </Box>
  );
};

export default SalesFilters;
