import { createTheme, alpha } from '@mui/material/styles';
import { COLORS } from './constants/colors';

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  spacing: (factor) => `${8 * factor}px`,
  palette: {
    mode: 'dark',
    primary: {
      main: COLORS.primary,
      light: alpha(COLORS.primary, 0.8),
      dark: COLORS.primary,
    },
    secondary: {
      main: COLORS.secondary,
      light: alpha(COLORS.secondary, 0.8),
      dark: COLORS.secondary,
    },
    background: {
      default: COLORS.background.primary,
      paper: COLORS.background.secondary,
      elevated: COLORS.background.elevated,
    },
    text: {
      primary: COLORS.text.primary,
      secondary: COLORS.text.secondary,
    },
    success: {
      main: COLORS.success,
    },
    info: {
      main: COLORS.accent,
    },
  },
  typography: {
    fontFamily: 'monospace',
    h1: {
      fontFamily: 'monospace',
      fontSize: {
        xs: '1.75rem',
        sm: '2rem',
        md: '2.5rem'
      },
      fontWeight: 500,
      lineHeight: 1.2,
    },
    h2: {
      fontFamily: 'monospace',
      fontSize: {
        xs: '1.5rem',
        sm: '1.75rem',
        md: '2rem'
      },
      fontWeight: 500,
      lineHeight: 1.3,
    },
    subtitle1: {
      fontFamily: 'monospace',
      fontSize: {
        xs: '0.875rem',
        sm: '1rem'
      },
      fontWeight: 500,
      lineHeight: 1.5,
    },
    subtitle2: {
      fontFamily: 'monospace',
      fontWeight: 600,
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem'
      },
      lineHeight: 1.5,
    },
    body1: {
      fontFamily: 'monospace',
      fontSize: {
        xs: '0.875rem',
        sm: '1rem'
      },
      letterSpacing: '0.15px',
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: COLORS.background.elevated,
          backgroundImage: 'none',
          borderRadius: 8,
          border: `1px solid ${COLORS.background.elevated}`,
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          color: COLORS.primary,
          height: 8,
        },
        track: {
          height: 4,
          borderRadius: 2,
        },
        rail: {
          height: 4,
          borderRadius: 2,
          opacity: 0.3,
        },
        thumb: {
          width: 16,
          height: 16,
          backgroundColor: COLORS.text.primary,
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: `1px solid ${COLORS.background.elevated}`,
          '&.Mui-selected': {
            backgroundColor: COLORS.primary,
            color: COLORS.text.primary,
            '&:hover': {
              backgroundColor: COLORS.primary,
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 16px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        sizeLarge: {
          padding: '12px 24px',
        },
        sizeSmall: {
          padding: '4px 8px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: COLORS.background.elevated,
        },
        elevation1: {
          boxShadow: 'none',
        },
        rounded: {
          borderRadius: 8,
        },
      },
    },
    MuiGrid: {
      styleOverrides: {
        root: {
          '& > .MuiGrid-item': {
            paddingTop: 8,
            paddingBottom: 8,
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

export default theme;
