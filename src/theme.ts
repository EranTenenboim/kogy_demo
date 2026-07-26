import { createTheme } from '@mui/material/styles';

/** Google Material Design — standard blue primary, Roboto */
export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1a73e8',
      dark: '#174ea6',
      light: '#8ab4f8',
    },
    secondary: {
      main: '#5f6368',
    },
    success: {
      main: '#188038',
    },
    warning: {
      main: '#f9ab00',
    },
    error: {
      main: '#d93025',
    },
    background: {
      default: '#f1f3f4',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(255,255,255,0.12)',
        },
      },
    },
  },
});
