import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
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
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
    background: {
      default: '#F9FAFB',
      paper: '#FFFFFF',
    },
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
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          padding: '12px 24px',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.15)',
          },
        },
        contained: {
          '&.MuiButton-containedPrimary': {
            color: '#FFFFFF',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          padding: '16px',
        },
      },
    },
  },
});