import { createTheme } from '@mui/material/styles';

export const darkTheme = createTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#43a047',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#505050',
      paper: '#424242',
    },
    sidebar: {
      background: '#424242',
      text: '#ffffff',
      divider: 'rgba(255, 255, 255, 0.12)',
    },
  },
});

export const lightTheme = createTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#ff0000',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
      sidebar: '#424242',
    },
    sidebar: {
      text: '#ffffff',
      divider: 'rgba(255, 255, 255, 0.12)',
    },
  },
});
