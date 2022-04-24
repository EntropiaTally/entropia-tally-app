import React, { useState, useMemo, useContext, createContext } from 'react';
import { MemoryRouter as Router } from 'react-router-dom';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import {
  Box,
  CssBaseline,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Drawer,
  Typography,
  Divider,
} from '@mui/material';

const themeDark = createTheme({
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
      text: '#ffffff',
      divider: 'rgba(255, 255, 255, 0.12)',
    },
  },
});

const themeLight = createTheme({
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
      paper: '#424242',
    },
    sidebar: {
      text: '#ffffff',
      divider: 'rgba(255, 255, 255, 0.12)',
    },
  },
});

const ColorModeContext = createContext({
  toggleColorMode() {},
  setColorMode() {},
});

const drawerWidth = 240;

const openedMixin = theme => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = theme => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const CustomDrawer = styled(Drawer, { shouldForwardProp: prop => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const Nav = () => {
  const [open, setOpen] = useState(true);
  const colorMode = useContext(ColorModeContext);

  return (
    <CustomDrawer variant="permanent" open={open}>
      <Typography variant="h5" sx={{ mx: 2, my: 1, color: 'sidebar.text' }}>Entropia Tally</Typography>
      <Divider sx={{ backgroundColor: 'sidebar.divider' }} />
      <List sx={{ color: 'sidebar.text' }}>
        {['Current run', 'New Run', 'New Session', 'History'].map((text, _index) => (
          <ListItem key={text} button>
            {text}
          </ListItem>
        ))}
      </List>
      <Divider sx={{ backgroundColor: 'sidebar.divider' }} />
      <List style={{ marginTop: 'auto' }} >
        <ListItem>
          <ListItemButton variant="outlined" onClick={() => colorMode.toggleColorMode()}>
            <ListItemText primary="Toggle darkmode" />
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton variant="outlined" onClick={() => setOpen(!open)}>
            <ListItemText primary="Toggle size" sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>
        </ListItem>
      </List>
    </CustomDrawer>
  );
};

const App = () => {
  const [mode, setMode] = useState('light');
  const colorMode = React.useMemo(() => ({
    toggleColorMode: () => setMode(previousMode => (previousMode === 'light' ? 'dark' : 'light')),
    setColorMode: newMode => setMode(newMode),
  }), []);
  const theme = useMemo(() => mode === 'dark' ? themeDark : themeLight, [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Box sx={{ display: 'flex' }}>
            <Nav />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
              Main content
            </Box>
          </Box>
        </Router>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;
