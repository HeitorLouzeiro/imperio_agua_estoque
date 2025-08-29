import { useState, useEffect, useRef, useCallback } from 'react';

interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
  animationClass: string;
  isAutoHiding: boolean;
}

export const useAnimatedSnackbar = () => {
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'info',
    animationClass: '',
    isAutoHiding: false,
  });

  const autoHideTimer = useRef<NodeJS.Timeout | null>(null);
  const hideTimer = useRef<NodeJS.Timeout | null>(null);

  const clearTimers = useCallback(() => {
    if (autoHideTimer.current) {
      clearTimeout(autoHideTimer.current);
      autoHideTimer.current = null;
    }
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  }, []);

  const showSnackbar = useCallback((message: string, severity: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    clearTimers();
    
    setSnackbar({
      open: true,
      message,
      severity,
      animationClass: 'snackbar-enter',
      isAutoHiding: false,
    });

    // Iniciar animação de auto-hide após 4 segundos
    autoHideTimer.current = setTimeout(() => {
      setSnackbar(prev => ({
        ...prev,
        animationClass: 'snackbar-auto-hide',
        isAutoHiding: true,
      }));

      // Fechar completamente após a animação de fade
      hideTimer.current = setTimeout(() => {
        setSnackbar(prev => ({
          ...prev,
          open: false,
          animationClass: '',
          isAutoHiding: false,
        }));
      }, 1500); // Duração da animação fadeOutGradual
    }, 4000);
  }, [clearTimers]);

  const hideSnackbar = useCallback(() => {
    clearTimers();
    
    setSnackbar(prev => ({
      ...prev,
      animationClass: 'snackbar-exit',
      isAutoHiding: false,
    }));

    setTimeout(() => {
      setSnackbar(prev => ({
        ...prev,
        open: false,
        animationClass: '',
      }));
    }, 300); // Duração da animação slideOutRight
  }, [clearTimers]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  return {
    snackbar,
    showSnackbar,
    hideSnackbar,
  };
};
