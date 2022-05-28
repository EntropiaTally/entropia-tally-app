import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
  List,
  ListItemButton,
  ListItemText,
  Drawer,
  Typography,
  Divider,
} from '@mui/material';
import ListItemIcon from '@mui/material/ListItemIcon';
import SettingsIcon from '@mui/icons-material/Settings';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';

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

const SidebarItem = ({ text, isOpen, icon, onClick }) => (
  <ListItemButton
    sx={{
      minHeight: 48,
      justifyContent: isOpen ? 'initial' : 'center',
      px: 2.5,
    }}
    onClick={onClick}
  >
    <ListItemIcon
      sx={{
        minWidth: 0,
        mr: isOpen ? 3 : 'auto',
        justifyContent: 'center',
      }}
    >
      {icon}
    </ListItemIcon>
    <ListItemText primary={text} sx={{ opacity: isOpen ? 1 : 0 }} />
  </ListItemButton>
);

SidebarItem.defaultProps = {
  isOpen: true,
  icon: null,
  onClick: null,
};

SidebarItem.propTypes = {
  text: PropTypes.string.isRequired,
  isOpen: PropTypes.bool,
  icon: PropTypes.any,
  onClick: PropTypes.func,
};

const Sidebar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const colorMode = useContext(ColorModeContext);

  const openSettings = () => navigate('/settings');

  return (
    <CustomDrawer variant="permanent" open={open} PaperProps={{ sx: { backgroundColor: 'background.sidebar' }}}>
      <Typography
        variant="h6"
        sx={{ mx: 2, my: 1, color: 'sidebar.text' }}
      >
        Entropia Tally
      </Typography>

      <Divider sx={{ backgroundColor: 'sidebar.divider' }} />

      <List sx={{ color: 'sidebar.text' }}>
        {['Current run', 'New Run', 'New Session', 'History'].map((text, _index) => (
          <SidebarItem
            key={text}
            text={text}
            isOpen={open}
            icon={<PlayArrowIcon color="sidebar" />}
          />
        ))}
      </List>

      <Divider sx={{ backgroundColor: 'sidebar.divider' }} />

      <List sx={{ color: 'sidebar.text' }} style={{ marginTop: 'auto' }} >
        <SidebarItem
          text="Toggle darkmode"
          isOpen={open}
          icon={<ToggleOffIcon color="sidebar" />}
          onClick={() => colorMode.toggleColorMode()}
        />

        <SidebarItem
          text="Toggle size"
          isOpen={open}
          icon={<CompareArrowsIcon color="sidebar" />}
          onClick={() => setOpen(!open)}
        />

        <SidebarItem
          text="Settings"
          isOpen={open}
          icon={<SettingsIcon color="sidebar" />}
          onClick={openSettings}
        />
      </List>
    </CustomDrawer>
  );
};

export default Sidebar;
