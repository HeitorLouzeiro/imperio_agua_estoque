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

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, trend, trendValue }) => {
  // Função para criar gradiente personalizado baseado na cor
  const getGradient = (baseColor: string) => {
    const colorMap: { [key: string]: string } = {
      '#22C55E': 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)', // Verde para receita
      '#3B82F6': 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)', // Azul para vendas
      '#F59E0B': 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', // Laranja para produtos
      '#8B5CF6': 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)', // Roxo para usuários
    };
    return colorMap[baseColor] || `linear-gradient(135deg, ${baseColor} 0%, ${baseColor}CC 100%)`;
  };

  return (
    <Card
    sx={{
      height: '100%',
      borderRadius: 4,
      background: `linear-gradient(135deg, ${color}08 0%, ${color}03 100%)`,
      border: `1px solid ${color}15`,
      boxShadow: `0 4px 20px ${color}10`,
      '&:hover': {
        transform: 'translateY(-6px)',
        boxShadow: `0 12px 35px ${color}20`,
        border: `1px solid ${color}25`,
      },
      transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: `linear-gradient(90deg, ${color} 0%, ${color}80 100%)`,
      },
    }}
  >
    <CardContent sx={{ p: 3, position: 'relative' }}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box sx={{ flex: 1 }}>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            gutterBottom
            sx={{ 
              fontWeight: 600,
              fontSize: '0.875rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              mb: 1
            }}
          >
            {title}
          </Typography>
          <Typography 
            variant="h4" 
            component="div" 
            sx={{
              fontWeight: 800,
              fontSize: { xs: '1.75rem', sm: '2rem' },
              color: 'text.primary',
              mb: 0.5
            }}
          >
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
            width: 64,
            height: 64,
            background: getGradient(color),
            border: `2px solid ${color}40`,
            boxShadow: `0 4px 16px ${color}30`,
            '& svg': {
              fontSize: 32,
              color: 'white',
              filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))',
            },
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: `0 6px 20px ${color}40`,
            },
            transition: 'all 0.3s ease',
          }}
        >
          {icon}
        </Avatar>
      </Box>
    </CardContent>
  </Card>
  );
};

export default StatCard;
