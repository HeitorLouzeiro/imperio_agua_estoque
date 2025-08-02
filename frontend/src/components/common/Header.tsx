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
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Logout,
  Notifications,
  ShoppingCart,
  Warning,
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
  const { notifications, getNotificationCount } = useNotifications();
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
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            PaperProps={{
              sx: {
                mt: 1,
                maxWidth: 350,
                maxHeight: 400,
                borderRadius: 2,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
              },
            }}
          >
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Notificações ({getNotificationCount()})
              </Typography>
              {notifications.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Nenhuma notificação no momento
                </Typography>
              ) : (
                <List sx={{ p: 0 }}>
                  {notifications.map((notification: AppNotification) => (
                    <ListItem key={notification.id} sx={{ px: 0, py: 1 }}>
                      <ListItemAvatar>
                        {notification.type === 'low_stock' ? (
                          <Warning color="warning" />
                        ) : (
                          <ShoppingCart color="success" />
                        )}
                      </ListItemAvatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {notification.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {notification.message}
                        </Typography>
                        <Chip
                          label={notification.type === 'low_stock' ? 'Estoque' : 'Venda'}
                          size="small"
                          color={notification.type === 'low_stock' ? 'warning' : 'success'}
                          sx={{ mt: 0.5 }}
                        />
                      </Box>
                    </ListItem>
                  ))}
                </List>
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
            }}
          >
            {(user as any)?.nome || 'Usuário'}
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
