import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import EditIcon from '@mui/icons-material/Edit';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import General from './general';
import Loot from './loot';
import Misc from './misc';
import Returns from './returns';
import Notes from './notes';

const tabList = ['General', 'Loot', 'Misc', 'Returns', 'Notes'].map(tab => (
  <Tab key={tab} label={tab} />
));

const TabView = ({ index, selected, children }) => (
  <div role="tabpanel">
    {selected === index && (children)}
  </div>
);

TabView.propTypes = {
  index: PropTypes.number.isRequired,
  selected: PropTypes.number.isRequired,
  children: PropTypes.node,
};

const HuntingPage = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const toggleLogging = () => {
    window.api2.request('logger:status:toggle');
  };

  return (
    <>
      <AppBar position="static">
        <div>
          <Box sx={{ flexGrow: 1, mx: 2 }}>
            <Grid container>
              <Grid item xs>
                <Typography>Session name here</Typography>
                <EditIcon onClick={() => setIsEditOpen(true)} />
              </Grid>
              <Grid item>
                00:25:24
                <Button variant="contained" size="small" color="success" onClick={toggleLogging}><PlayArrowIcon /></Button>
              </Grid>
            </Grid>
          </Box>
        </div>
        <Tabs
          value={selectedTab}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          onChange={(_event, value) => setSelectedTab(value)}
        >
          {tabList}
        </Tabs>
      </AppBar>

      <div>
        <TabView index={0} selected={selectedTab}>
          <General />
        </TabView>

        <TabView index={1} selected={selectedTab}>
          <Loot />
        </TabView>

        <TabView index={2} selected={selectedTab}>
          <Misc />
        </TabView>

        <TabView index={3} selected={selectedTab}>
          <Returns />
        </TabView>

        <TabView index={4} selected={selectedTab}>
          <Notes />
        </TabView>
      </div>

      <div>
        <Dialog open={isEditOpen} onClose={() => setIsEditOpen(false)}>
          <DialogTitle>Edit session name</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Session name"
              type="text"
              fullWidth
              variant="standard"
              defaultValue="Current value goes here"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsEditOpen(false)}>Subscribe</Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default HuntingPage;
