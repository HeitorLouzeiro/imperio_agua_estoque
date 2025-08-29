import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Typography,
  Divider,
  Avatar,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  LocalGroceryStore,
  AccountCircle,
  Analytics,
  Category,
  PointOfSale,
  SupervisorAccount,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const drawerWidth = 280;

interface MenuItem {
  text: string;
  icon: React.ReactElement;
  path: string;
  roles: string[];
}

interface SidebarProps {
  mobileOpen: boolean;
  onDrawerToggle: () => void;
}

const menuItems: MenuItem[] = [
  {
    text: 'Dashboard',
    icon: <Analytics />,
    path: '/dashboard',
    roles: ['administrador', 'funcionario'],
  },
  {
    text: 'Produtos',
    icon: <Category />,
    path: '/products',
    roles: ['administrador', 'funcionario'],
  },
  {
    text: 'Vendas',
    icon: <PointOfSale />,
    path: '/sales',
    roles: ['administrador', 'funcionario'],
  },
  {
    text: 'Usuários',
    icon: <SupervisorAccount />,
    path: '/users',
    roles: ['administrador'],
  },
  {
    text: 'Perfil',
    icon: <AccountCircle />,
    path: '/profile',
    roles: ['administrador', 'funcionario'],
  },
];

const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onDrawerToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTabletMobile = useMediaQuery(theme.breakpoints.down('lg')); // Tablets usam interface mobile

  const filteredMenuItems = menuItems.filter(item =>
    item.roles.includes((user as any)?.role || (user as any)?.papel || 'funcionario')
  );

  const drawer = (
    <Box sx={{ height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Toolbar sx={{ px: isTabletMobile ? 1 : 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: isTabletMobile ? 1 : 2, width: '100%' }}>
          <Avatar sx={{ 
            bgcolor: 'rgba(255, 255, 255, 0.15)', 
            color: 'white',
            width: isTabletMobile ? 36 : 44,
            height: isTabletMobile ? 36 : 44,
            border: '2px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            '& svg': {
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
            }
          }}>
            <LocalGroceryStore fontSize={isTabletMobile ? 'medium' : 'large'} />
          </Avatar>
          <Box>
                        <Typography 
              variant={isTabletMobile ? "subtitle1" : "h6"} 
              component="h1" 
              sx={{ 
                color: 'white', 
                fontWeight: 700,
                fontSize: isTabletMobile ? '1rem' : '1.25rem',
                lineHeight: 1.2,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                letterSpacing: '0.5px'
              }}
            >
              Império Água
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: isTabletMobile ? '0.65rem' : '0.75rem',
                fontWeight: 500,
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
              }}
            >
              Sistema de Gestão
            </Typography>
          </Box>
        </Box>
      </Toolbar>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />

      <List sx={{ px: isTabletMobile ? 1 : 2, py: 1 }}>
        {filteredMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => {
                navigate(item.path);
                if (isMobile) {
                  onDrawerToggle(); // Fechar drawer no mobile após navegar
                }
              }}
              selected={location.pathname === item.path}
              sx={{
                borderRadius: 3,
                color: 'rgba(255, 255, 255, 0.8)',
                minHeight: isMobile ? 44 : 48,
                px: isMobile ? 1.5 : 2,
                mb: 0.5,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '3px',
                  bgcolor: 'white',
                  transform: location.pathname === item.path ? 'scaleY(1)' : 'scaleY(0)',
                  transition: 'transform 0.3s ease',
                },
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  color: 'white',
                  transform: 'translateX(6px)',
                  '& svg': {
                    transform: 'scale(1.1)',
                  },
                },
                '&.Mui-selected': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  },
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              <ListItemIcon
                sx={{
                  color: 'inherit',
                  minWidth: 44,
                  display: 'flex',
                  justifyContent: 'center',
                  '& svg': {
                    fontSize: 24,
                    filter: location.pathname === item.path 
                      ? 'drop-shadow(0 0 8px rgba(255,255,255,0.5))' 
                      : 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                    transition: 'all 0.3s ease',
                  },
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontWeight: location.pathname === item.path ? 600 : 500,
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)', mx: 2, mb: 2 }} />

      {/* Removido item de Configurações - não implementado */}
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { lg: drawerWidth }, flexShrink: { lg: 0 } }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{
          keepMounted: true, // Melhor desempenho no mobile
        }}
        sx={{
          display: { xs: 'block', lg: 'none' }, // Mostra até tablet (lg)
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            border: 'none',
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', lg: 'block' }, // Só mostra em desktop (lg+)
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            border: 'none',
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
