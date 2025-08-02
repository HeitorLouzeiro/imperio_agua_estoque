import React from 'react';
import {
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  InputAdornment,
  MenuItem
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon
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
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              placeholder="Buscar por código, nome ou marca"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              select
              fullWidth
              label="Filtrar por marca"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <MenuItem value="">Todas</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              select
              fullWidth
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="todos">Todos</MenuItem>
              <MenuItem value="ativo">Apenas Ativos</MenuItem>
              <MenuItem value="inativo">Apenas Inativos</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={onRefresh}
            >
              Atualizar
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ProductFilters;
