import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Drawer,
  Typography,
  Divider,
} from '@mui/material';

import { ColorModeContext } from './contexts.js';

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

const Sidebar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const colorMode = useContext(ColorModeContext);

  const openSettings = () => navigate('/settings');

  return (
    <CustomDrawer variant="permanent" open={open} PaperProps={{ sx: { backgroundColor: 'background.sidebar' }}}>
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
        <ListItem>
          <ListItemButton variant="outlined" onClick={openSettings}>
            <ListItemText primary="Settings" sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>
        </ListItem>
      </List>
    </CustomDrawer>
  );
};

export default Sidebar;
