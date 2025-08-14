import { useTheme, useMediaQuery } from '@mui/material';

// Hook customizado para responsividade
export const useResponsive = () => {
  const theme = useTheme();
  
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));  // < 600px
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));  // < 900px
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));   // >= 1200px
  
  return {
    isMobile,
    isTablet,
    isDesktop,
    // Configurações responsivas para componentes comuns
    spacing: {
      section: isMobile ? 2 : 3,
      card: isMobile ? 1.5 : 2,
      grid: isMobile ? 2 : 3,
    },
    typography: {
      h4: isMobile ? 'h5' : 'h4',
      h5: isMobile ? 'h6' : 'h5',
      h6: isMobile ? 'subtitle1' : 'h6',
    },
    sizing: {
      buttonSize: isMobile ? 'medium' : 'large',
      inputSize: isMobile ? 'small' : 'medium',
      avatarSize: isMobile ? 32 : 40,
      iconSize: isMobile ? 'small' : 'medium',
    },
    layout: {
      dialogMaxWidth: isMobile ? false : 'sm',
      dialogFullScreen: isMobile,
      containerPadding: isMobile ? 1 : 3,
      cardPadding: isMobile ? 1.5 : 2,
    },
  };
};

// Configurações específicas para notificações
export const getNotificationConfig = (isMobile: boolean, isTablet: boolean) => ({
  popover: {
    width: isMobile ? '95vw' : isTablet ? '350px' : '380px',
    maxWidth: isMobile ? '95vw' : '380px',
    maxHeight: isMobile ? '80vh' : '500px',
    ...(isMobile && {
      position: 'fixed' as const,
      top: '64px !important',
      left: '2.5vw !important',
      transform: 'none !important',
    }),
  },
  content: {
    padding: isMobile ? 1.5 : 2,
    titleVariant: isMobile ? 'subtitle1' : 'h6',
    titleFontSize: isMobile ? '1rem' : '1.25rem',
    bodyFontSize: isMobile ? '0.75rem' : '0.875rem',
    captionFontSize: isMobile ? '0.65rem' : '0.75rem',
  },
  list: {
    maxHeight: isMobile ? '60vh' : '300px',
    itemPadding: isMobile ? 1.5 : 1,
    avatarMinWidth: isMobile ? '40px' : '56px',
    chipHeight: isMobile ? '20px' : '24px',
  },
});

// Configurações para tabelas responsivas
export const getTableConfig = (isMobile: boolean) => ({
  height: isMobile ? 500 : 400,
  pageSize: isMobile ? 5 : 10,
  pageSizeOptions: isMobile ? [5, 10] : [5, 10, 25],
  density: isMobile ? 'compact' : 'standard',
  columnDefaults: {
    headerFontSize: isMobile ? '0.75rem' : '0.875rem',
    cellFontSize: isMobile ? '0.75rem' : '0.875rem',
    cellPadding: isMobile ? '4px' : '8px',
    minWidth: isMobile ? 80 : 100,
  },
});

// Configurações para formulários responsivos
export const getFormConfig = (isMobile: boolean) => ({
  dialog: {
    fullScreen: isMobile,
    maxWidth: isMobile ? false : 'sm' as const,
    titlePadding: isMobile ? 1 : 2,
    contentPadding: isMobile ? 2 : 3,
  },
  fields: {
    size: isMobile ? 'small' : 'medium' as const,
    spacing: isMobile ? 1.5 : 2,
  },
  buttons: {
    size: isMobile ? 'large' : 'medium' as const,
    fullWidth: isMobile,
    spacing: isMobile ? 1 : 0,
    flexDirection: isMobile ? 'column' : 'row' as const,
  },
});
