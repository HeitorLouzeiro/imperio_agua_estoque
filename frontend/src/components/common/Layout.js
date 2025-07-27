import React from 'react';
import { Box, Toolbar } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerWidth = -100;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Header onDrawerToggle={handleDrawerToggle} />

      <Sidebar mobileOpen={mobileOpen} onDrawerToggle={handleDrawerToggle} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          minHeight: '100vh',
          backgroundColor: '#f5f7fa',
          position: 'relative',
          mt: '64px', // Altura da AppBar
        }}
      >


        {children}
      </Box>
    </Box>
  );
};

export default Layout;
