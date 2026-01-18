import { createTheme as muiCreateTheme } from '@mui/material/styles';

export const createAppTheme = (mode: 'light' | 'dark') => muiCreateTheme({
  palette: {
    mode,
    primary: {
      main: '#6FCF97',
      light: '#8ED7AC',
      dark: '#4DAF7C',
    },
    secondary: {
      main: '#56CCF2',
      light: '#7AD7F5',
      dark: '#3DACD2',
    },
    error: {
      main: '#F44336',
    },
    ...(mode === 'light'
      ? {
          text: {
            primary: '#333333',
            secondary: '#666666',
          },
          background: {
            default: '#F9FAFB',
            paper: '#FFFFFF',
          },
        }
      : {
          text: {
            primary: '#FFFFFF',
            secondary: '#BBBBBB',
          },
          background: {
            default: '#121212',
            paper: '#1E1E1E',
          },
        }),
  },
  typography: {
    fontFamily: "'Poppins', 'Lato', 'Nunito Sans', sans-serif",
    h1: {
      fontSize: '24px',
      fontWeight: 600,
    },
    h2: {
      fontSize: '20px',
      fontWeight: 600,
    },
    h3: {
      fontSize: '18px',
      fontWeight: 600,
    },
    body1: {
      fontSize: '16px',
      fontWeight: 400,
    },
    body2: {
      fontSize: '14px',
      fontWeight: 400,
    },
    button: {
      fontSize: '16px',
      fontWeight: 500,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 500,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
        },
        contained: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
});

export const theme = createAppTheme('light');