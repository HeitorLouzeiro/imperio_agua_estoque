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
  Tooltip,
  Fade,
  Zoom,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Logout,
  Notifications,
  NotificationsNone,
  ShoppingCart,
  Warning,
  Clear,
  Refresh,
  MarkAsUnread,
  CheckCircle,
  ErrorOutline,
  InfoOutlined,
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
  const isTabletMobile = useMediaQuery(theme.breakpoints.down('lg')); // Tablets usam interface mobile
  const { notifications, getNotificationCount, clearAll, markAsRead, refresh, loading } = useNotifications();
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = React.useState<HTMLElement | null>(null);
  const [notificationAnimation, setNotificationAnimation] = React.useState(false);

  // Trigger animation when notification count changes
  React.useEffect(() => {
    const notificationCount = getNotificationCount();
    if (notificationCount > 0) {
      setNotificationAnimation(true);
      const timer = setTimeout(() => setNotificationAnimation(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [getNotificationCount]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'low_stock':
        return <Warning color="warning" fontSize={isMobile ? 'small' : 'medium'} />;
      case 'recent_sale':
        return <ShoppingCart color="success" fontSize={isMobile ? 'small' : 'medium'} />;
      case 'error':
        return <ErrorOutline color="error" fontSize={isMobile ? 'small' : 'medium'} />;
      case 'info':
        return <InfoOutlined color="info" fontSize={isMobile ? 'small' : 'medium'} />;
      default:
        return <CheckCircle color="primary" fontSize={isMobile ? 'small' : 'medium'} />;
    }
  };

  const getNotificationChipColor = (type: string): "warning" | "success" | "error" | "info" | "primary" => {
    switch (type) {
      case 'low_stock':
        return 'warning';
      case 'recent_sale':
        return 'success';
      case 'error':
        return 'error';
      case 'info':
        return 'info';
      default:
        return 'primary';
    }
  };

  const getNotificationChipLabel = (type: string): string => {
    switch (type) {
      case 'low_stock':
        return 'Baixo Estoque';
      case 'recent_sale':
        return 'Venda Recente';
      case 'error':
        return 'Erro';
      case 'info':
        return 'Informação';
      default:
        return 'Notificação';
    }
  };  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>): void => {
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
    
    // Navegar para a página correspondente ao tipo de notificação
    switch (notification.type) {
      case 'low_stock':
        // Para notificações de baixo estoque, ir para página de produtos
        navigate('/products');
        break;
      case 'recent_sale':
        // Para notificações de vendas, ir para página de vendas
        navigate('/sales');
        break;
      default:
        // Para outros tipos, pode ir para dashboard
        navigate('/dashboard');
        break;
    }
    
    // Fechar o painel de notificações após navegação
    handleNotificationClose();
  };

  const handleMarkAllAsRead = (): void => {
    notifications.forEach(n => markAsRead(n.id));
    // Não fecha o painel para que o usuário veja que foram marcadas como lidas
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, borderRadius: 0 }}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="abrir menu"
          edge="start"
          onClick={onDrawerToggle}
          sx={{ mr: 2, display: { lg: 'none' } }} // Mostra até tablet (lg)
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Império Água
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip 
            title={getNotificationCount() > 0 ? `${getNotificationCount()} novas notificações` : 'Nenhuma notificação'}
            placement="bottom"
          >
            <IconButton 
              color="inherit" 
              onClick={handleNotificationClick}
              sx={{
                position: 'relative',
                animation: notificationAnimation ? 'pulse 1s ease-in-out' : 'none',
                '@keyframes pulse': {
                  '0%': {
                    transform: 'scale(1)',
                  },
                  '50%': {
                    transform: 'scale(1.1)',
                  },
                  '100%': {
                    transform: 'scale(1)',
                  },
                },
              }}
            >
              <Badge 
                badgeContent={getNotificationCount()} 
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    animation: getNotificationCount() > 0 ? 'bounce 2s infinite' : 'none',
                    '@keyframes bounce': {
                      '0%, 20%, 50%, 80%, 100%': {
                        transform: 'translateY(0)',
                      },
                      '40%': {
                        transform: 'translateY(-3px)',
                      },
                      '60%': {
                        transform: 'translateY(-1px)',
                      },
                    },
                  }
                }}
              >
                {getNotificationCount() > 0 ? <Notifications /> : <NotificationsNone />}
              </Badge>
            </IconButton>
          </Tooltip>

          <Popover
            open={Boolean(notificationAnchorEl)}
            anchorEl={notificationAnchorEl}
            onClose={handleNotificationClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: isTabletMobile ? 'center' : 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: isMobile ? 'center' : 'right',
            }}
            TransitionComponent={Fade}
            transitionDuration={300}
            disableScrollLock={true}
            PaperProps={{
              sx: {
                mt: 1,
                width: isMobile ? '95vw' : isTablet ? '350px' : '420px',
                maxWidth: isMobile ? '95vw' : '420px',
                maxHeight: isMobile ? '80vh' : '600px',
                borderRadius: 3,
                boxShadow: '0 12px 48px rgba(0, 0, 0, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.95) 100%)',
                zIndex: 1300,
                ...(isMobile && {
                  position: 'fixed',
                  top: '64px !important',
                  left: '2.5vw !important',
                  transform: 'none !important',
                }),
              },
            }}
          >
            <Box sx={{ p: isMobile ? 2 : 2.5 }}>
              {/* Header do painel de notificações */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: 2,
                pb: 1.5,
                borderBottom: '2px solid',
                borderColor: 'primary.main',
                background: 'linear-gradient(45deg, rgba(25, 118, 210, 0.1) 0%, rgba(25, 118, 210, 0.05) 100%)',
                borderRadius: 2,
                px: 2,
                py: 1,
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Notifications color="primary" fontSize="small" />
                  <Typography 
                    variant={isMobile ? "subtitle1" : "h6"}
                    sx={{ 
                      fontSize: isMobile ? '1.1rem' : '1.25rem',
                      fontWeight: 600,
                      color: 'primary.main'
                    }}
                  >
                    Notificações
                  </Typography>
                  <Chip 
                    label={getNotificationCount()}
                    size="small"
                    color="primary"
                    sx={{ 
                      minWidth: '24px',
                      height: '20px',
                      '& .MuiChip-label': {
                        fontSize: '0.75rem',
                        fontWeight: 600
                      }
                    }}
                  />
                </Box>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <Tooltip title="Atualizar notificações">
                    <IconButton 
                      size="small" 
                      onClick={handleRefreshNotifications}
                      disabled={loading}
                      sx={{
                        backgroundColor: 'rgba(25, 118, 210, 0.1)',
                        '&:hover': {
                          backgroundColor: 'rgba(25, 118, 210, 0.2)',
                        }
                      }}
                    >
                      {loading ? (
                        <CircularProgress size={16} />
                      ) : (
                        <Refresh fontSize="small" />
                      )}
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              {loading ? (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  py: 4,
                  gap: 2
                }}>
                  <CircularProgress size={40} />
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ textAlign: 'center' }}
                  >
                    Carregando notificações...
                  </Typography>
                </Box>
              ) : notifications.length === 0 ? (
                <Alert 
                  severity="info" 
                  sx={{ 
                    borderRadius: 2,
                    '& .MuiAlert-icon': {
                      fontSize: '1.5rem'
                    }
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Nenhuma notificação no momento 🎉
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Você está em dia com tudo!
                  </Typography>
                </Alert>
              ) : (
                <List sx={{ 
                  p: 0, 
                  maxHeight: isMobile ? '60vh' : '400px', 
                  overflow: 'auto',
                  '&::-webkit-scrollbar': {
                    width: '6px',
                  },
                  '&::-webkit-scrollbar-track': {
                    backgroundColor: 'rgba(0,0,0,0.05)',
                    borderRadius: '3px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'rgba(25, 118, 210, 0.3)',
                    borderRadius: '3px',
                    '&:hover': {
                      backgroundColor: 'rgba(25, 118, 210, 0.5)',
                    }
                  },
                }}>
                  {notifications.map((notification: AppNotification, index: number) => {
                    const isRead = localStorage.getItem('readNotifications')?.includes(notification.id) || false;
                    return (
                    <Zoom
                      key={notification.id}
                      in={true}
                      timeout={300 + (index * 100)}
                      style={{ transitionDelay: `${index * 50}ms` }}
                    >
                      <ListItem 
                        sx={{ 
                          px: 0, 
                          py: isMobile ? 2 : 1.5,
                          cursor: 'pointer',
                          borderRadius: 2,
                          mb: 1,
                          backgroundColor: isRead ? 'transparent' : 'rgba(25, 118, 210, 0.05)',
                          border: isRead ? 'none' : '1px solid rgba(25, 118, 210, 0.1)',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            backgroundColor: 'rgba(25, 118, 210, 0.1)',
                            transform: 'translateY(-1px)',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                          }
                        }}
                        onClick={() => handleNotificationItemClick(notification)}
                      >
                        <ListItemAvatar sx={{ minWidth: isMobile ? '48px' : '56px' }}>
                          <Box sx={{
                            backgroundColor: 'rgba(25, 118, 210, 0.1)',
                            borderRadius: '50%',
                            p: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {getNotificationIcon(notification.type)}
                          </Box>
                        </ListItemAvatar>
                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                            <Typography 
                              variant="subtitle2" 
                              sx={{ 
                                fontWeight: isRead ? 500 : 700,
                                fontSize: isMobile ? '0.9rem' : '1rem',
                                lineHeight: 1.3,
                                wordBreak: 'break-word',
                                color: isRead ? 'text.secondary' : 'text.primary'
                              }}
                            >
                              {notification.title}
                            </Typography>
                            {!isRead && (
                              <Box sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                backgroundColor: 'primary.main',
                                ml: 1,
                                flexShrink: 0
                              }} />
                            )}
                          </Box>
                          <Typography 
                            variant="body2" 
                            color="text.secondary" 
                            sx={{ 
                              fontSize: isMobile ? '0.8rem' : '0.875rem',
                              lineHeight: 1.4,
                              wordBreak: 'break-word',
                              mb: 1
                            }}
                          >
                            {notification.message}
                          </Typography>
                          <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            flexWrap: isMobile ? 'wrap' : 'nowrap',
                            gap: 1
                          }}>
                            <Chip
                              label={getNotificationChipLabel(notification.type)}
                              size="small"
                              color={getNotificationChipColor(notification.type)}
                              variant="outlined"
                              sx={{ 
                                fontSize: isMobile ? '0.7rem' : '0.75rem',
                                height: isMobile ? '22px' : '24px',
                                fontWeight: 500
                              }}
                            />
                            <Typography 
                              variant="caption" 
                              color="text.secondary"
                              sx={{ 
                                fontSize: isMobile ? '0.7rem' : '0.75rem',
                                whiteSpace: 'nowrap',
                                fontWeight: 500
                              }}
                            >
                              {new Date(notification.timestamp).toLocaleString('pt-BR', { 
                                day: '2-digit',
                                month: '2-digit',
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </Typography>
                          </Box>
                        </Box>
                      </ListItem>
                    </Zoom>
                  )})}
                </List>
              )}

              {notifications.length > 0 && (
                <Box sx={{ 
                  mt: 2, 
                  pt: 2, 
                  borderTop: '2px solid', 
                  borderColor: 'divider',
                  background: 'linear-gradient(45deg, rgba(0, 0, 0, 0.02) 0%, rgba(0, 0, 0, 0.01) 100%)',
                  borderRadius: 2,
                  px: 1
                }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="small"
                      onClick={handleClearNotifications}
                      startIcon={<Clear />}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        '&:hover': {
                          backgroundColor: 'rgba(244, 67, 54, 0.1)',
                          borderColor: 'error.main',
                          color: 'error.main'
                        }
                      }}
                    >
                      Limpar Todas
                    </Button>
                    <Button
                      fullWidth
                      variant="contained"
                      size="small"
                      onClick={handleMarkAllAsRead}
                      startIcon={<MarkAsUnread />}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                        }
                      }}
                    >
                      Marcar como Lidas
                    </Button>
                  </Box>
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
            disableScrollLock={true}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 200,
                borderRadius: 2,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                zIndex: 1300,
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
