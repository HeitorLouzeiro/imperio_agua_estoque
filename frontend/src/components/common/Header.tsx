import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Button,
  Divider,
  ListItemIcon,
  ListItemText,
  Badge,
  Popover,
  List,
  ListItem,
  ListItemAvatar,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Logout,
  Notifications,
  ShoppingCart,
  Warning,
  Clear,
  Refresh,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useNotifications, AppNotification } from '../../hooks/useNotifications';

interface HeaderProps {
  onDrawerToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onDrawerToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const { notifications, getNotificationCount, clearAll, markAsRead, refresh, loading } = useNotifications();
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = React.useState<HTMLElement | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (): void => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>): void => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = (): void => {
    setNotificationAnchorEl(null);
  };

  const handleProfileClick = (): void => {
    handleMenuClose();
    navigate('/profile');
  };

  const handleLogout = (): void => {
    handleMenuClose();
    logout();
  };

  const handleClearNotifications = (): void => {
    clearAll();
  };

  const handleRefreshNotifications = (): void => {
    refresh();
  };

  const handleNotificationItemClick = (notification: AppNotification): void => {
    markAsRead(notification.id);
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, borderRadius: 0 }}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="abrir menu"
          edge="start"
          onClick={onDrawerToggle}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Império Água
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton color="inherit" onClick={handleNotificationClick}>
            <Badge badgeContent={getNotificationCount()} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          <Popover
            open={Boolean(notificationAnchorEl)}
            anchorEl={notificationAnchorEl}
            onClose={handleNotificationClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: isMobile ? 'center' : 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: isMobile ? 'center' : 'right',
            }}
            PaperProps={{
              sx: {
                mt: 1,
                width: isMobile ? '95vw' : isTablet ? '350px' : '380px',
                maxWidth: isMobile ? '95vw' : '380px',
                maxHeight: isMobile ? '80vh' : '500px',
                borderRadius: 2,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                ...(isMobile && {
                  position: 'fixed',
                  top: '64px !important',
                  left: '2.5vw !important',
                  transform: 'none !important',
                }),
              },
            }}
          >
            <Box sx={{ p: isMobile ? 1.5 : 2 }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: 2,
                flexWrap: isMobile ? 'wrap' : 'nowrap',
                gap: isMobile ? 1 : 0
              }}>
                <Typography 
                  variant={isMobile ? "subtitle1" : "h6"}
                  sx={{ 
                    fontSize: isMobile ? '1rem' : '1.25rem',
                    width: isMobile ? '100%' : 'auto',
                    textAlign: isMobile ? 'center' : 'left'
                  }}
                >
                  Notificações ({getNotificationCount()})
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  gap: 1,
                  width: isMobile ? '100%' : 'auto',
                  justifyContent: isMobile ? 'center' : 'flex-end'
                }}>
                  <IconButton 
                    size="small" 
                    onClick={handleRefreshNotifications}
                    disabled={loading}
                    title="Atualizar notificações"
                  >
                    <Refresh fontSize="small" />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={handleClearNotifications}
                    disabled={notifications.length === 0}
                    title="Limpar todas as notificações"
                  >
                    <Clear fontSize="small" />
                  </IconButton>
                </Box>
              </Box>

              {loading ? (
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ textAlign: 'center', py: 2 }}
                >
                  Carregando notificações...
                </Typography>
              ) : notifications.length === 0 ? (
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ textAlign: 'center', py: 2 }}
                >
                  Nenhuma notificação no momento 🎉
                </Typography>
              ) : (
                <List sx={{ 
                  p: 0, 
                  maxHeight: isMobile ? '60vh' : '300px', 
                  overflow: 'auto',
                  '&::-webkit-scrollbar': {
                    width: '6px',
                  },
                  '&::-webkit-scrollbar-track': {
                    backgroundColor: 'transparent',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    borderRadius: '3px',
                  },
                }}>
                  {notifications.map((notification: AppNotification) => (
                    <ListItem 
                      key={notification.id} 
                      sx={{ 
                        px: 0, 
                        py: isMobile ? 1.5 : 1,
                        cursor: 'pointer',
                        borderRadius: 1,
                        '&:hover': {
                          backgroundColor: 'action.hover'
                        },
                        '&:not(:last-child)': {
                          borderBottom: '1px solid',
                          borderColor: 'divider'
                        }
                      }}
                      onClick={() => handleNotificationItemClick(notification)}
                    >
                      <ListItemAvatar sx={{ minWidth: isMobile ? '40px' : '56px' }}>
                        {notification.type === 'low_stock' ? (
                          <Warning color="warning" fontSize={isMobile ? 'small' : 'medium'} />
                        ) : (
                          <ShoppingCart color="success" fontSize={isMobile ? 'small' : 'medium'} />
                        )}
                      </ListItemAvatar>
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography 
                          variant="subtitle2" 
                          sx={{ 
                            fontWeight: 600,
                            fontSize: isMobile ? '0.875rem' : '0.9375rem',
                            lineHeight: 1.3,
                            wordBreak: 'break-word'
                          }}
                        >
                          {notification.title}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          sx={{ 
                            fontSize: isMobile ? '0.75rem' : '0.875rem',
                            lineHeight: 1.4,
                            wordBreak: 'break-word',
                            mt: 0.5
                          }}
                        >
                          {notification.message}
                        </Typography>
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center', 
                          mt: 1,
                          flexWrap: isMobile ? 'wrap' : 'nowrap',
                          gap: isMobile ? 0.5 : 0
                        }}>
                          <Chip
                            label={notification.type === 'low_stock' ? 'Estoque' : 'Venda'}
                            size="small"
                            color={notification.type === 'low_stock' ? 'warning' : 'success'}
                            variant="outlined"
                            sx={{ 
                              fontSize: isMobile ? '0.65rem' : '0.75rem',
                              height: isMobile ? '20px' : '24px'
                            }}
                          />
                          <Typography 
                            variant="caption" 
                            color="text.secondary"
                            sx={{ 
                              fontSize: isMobile ? '0.65rem' : '0.75rem',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {new Date(notification.timestamp).toLocaleTimeString('pt-BR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </Typography>
                        </Box>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              )}

              {notifications.length > 0 && (
                <Box sx={{ mt: 2, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="small"
                    onClick={handleClearNotifications}
                    startIcon={<Clear />}
                  >
                    Limpar Todas
                  </Button>
                </Box>
              )}
            </Box>
          </Popover>

          <Button
            onClick={handleMenuOpen}
            color="inherit"
            startIcon={
              <Avatar sx={{ width: 32, height: 32 }}>
                {(user as any)?.nome?.charAt(0) || 'U'}
              </Avatar>
            }
            sx={{
              textTransform: 'none',
              color: 'inherit',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
              ...(isMobile && {
                minWidth: 'auto',
                px: 1,
                '& .MuiButton-startIcon': {
                  mr: 0
                }
              })
            }}
          >
            {!isMobile && ((user as any)?.nome || 'Usuário')}
          </Button>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 200,
                borderRadius: 2,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
              },
            }}
          >
            <MenuItem onClick={handleProfileClick}>
              <ListItemIcon>
                <AccountCircle />
              </ListItemIcon>
              <ListItemText>Meu Perfil</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout />
              </ListItemIcon>
              <ListItemText>Sair</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
