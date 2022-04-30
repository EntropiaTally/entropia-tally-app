import { createTheme } from '@mui/material/styles';

export const darkTheme = createTheme({
  palette: {
    type: 'dark',
    background: {
      default: '#505050',
      paper: '#424242',
      background: '#424242',
    },
    text: {
      primary: '#fff',
      secondary: 'rgba(255, 255, 255, 0.7)',
      disabled: 'rgba(255, 255, 255, 0.5)',
      hint: 'rgba(255, 255, 255, 0.5)',
    },
    primary: {
      main: '#3f51b5',
      light: '#7986cb',
      dark: '#303f9f',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f50057',
    },
    sidebar: {
      text: '#ffffff',
      divider: 'rgba(255, 255, 255, 0.12)',
    },
  },
});

export const lightTheme = createTheme({
  palette: {
    type: 'light',
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
      sidebar: '#424242',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.54)',
      disabled: 'rgba(0, 0, 0, 0.38)',
      hint: 'rgba(0, 0, 0, 0.38)',
    },
    primary: {
      main: '#3f51b5',
      light: '#7986cb',
      dark: '#303f9f',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f50057',
    },
    sidebar: {
      text: '#ffffff',
      divider: 'rgba(255, 255, 255, 0.12)',
    },
  },
});
