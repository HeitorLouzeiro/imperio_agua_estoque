import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  trend?: 'up' | 'down';
  trendValue?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, trend, trendValue }) => (
  <Card
    sx={{
      height: '100%',
      borderRadius: 3,
      background: `linear-gradient(135deg, ${color}10 0%, ${color}05 100%)`,
      border: `1px solid ${color}20`,
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: `0 8px 25px ${color}25`,
      },
      transition: 'all 0.3s ease',
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" component="div" fontWeight="bold" color={color}>
            {typeof value === 'number' && title.includes('Receita')
              ? `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
              : typeof value === 'number'
              ? value.toLocaleString('pt-BR')
              : value
            }
          </Typography>
          {trend && trendValue && (
            <Box display="flex" alignItems="center" mt={1}>
              {trend === 'up' ? (
                <TrendingUp sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
              ) : (
                <TrendingDown sx={{ fontSize: 16, color: 'error.main', mr: 0.5 }} />
              )}
              <Typography
                variant="caption"
                color={trend === 'up' ? 'success.main' : 'error.main'}
                fontWeight="medium"
              >
                {trendValue}% vs mês anterior
              </Typography>
            </Box>
          )}
        </Box>
        <Avatar
          sx={{
            bgcolor: `${color}15`,
            color: color,
            width: 56,
            height: 56,
          }}
        >
          {icon}
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

export default StatCard;
