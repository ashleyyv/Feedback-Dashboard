import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00ffff', // Cyan
    },
    secondary: {
      main: '#f50057', // A contrasting pink/magenta
    },
    background: {
      default: '#0a192f', // Dark navy blue
      paper: '#102a43',   // Slightly lighter blue for surfaces
    },
    text: {
      primary: '#e0e0e0',
      secondary: '#b0bec5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 'bold',
    },
  },
});
