import React, { useState } from 'react';
import { MemoryRouter as Router } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
  Box,
  Button,
  CssBaseline,
  List,
  ListItem,
  Drawer,
} from '@mui/material';

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

  return (
    <CustomDrawer variant="permanent" open={open}>
      <h1>Entropia Tally</h1>
      <List>
        {['Current run', 'New Run', 'New Session', 'History'].map((text, _index) => (
          <ListItem key={text} button>
            {text}
          </ListItem>
        ))}
      </List>
      <Button onClick={() => setOpen(!open)}>
        Toggle
      </Button>
    </CustomDrawer>
  );
};

const App = () => (
  <Router>
    <CssBaseline />
    <Box sx={{ display: 'flex' }}>
      <Nav />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        Main content
      </Box>
    </Box>
  </Router>
);

export default App;
