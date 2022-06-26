import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import EditIcon from '@mui/icons-material/Edit';
import PauseIcon from '@mui/icons-material/Pause';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Fab from '@mui/material/Fab';


import { deepCompare, shallowCompare } from '@uiUtils2/compare';
import { formatTime } from '@uiUtils2/formatting';
import { useActiveSessionStore } from '@store';

const Header = () => {
  const [loggingActive, sessionName, sessionTime] = useActiveSessionStore(state => [state.active, state.sessionName, state.sessionTime], shallowCompare);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [newSessionNameText, setNewSessionNameText] = useState("");

  const toggleLogging = () => {
    window.api2.request('logger:status:toggle');
  };

  const updateSessionName = () => {
    window.api2.request('session:name:update', newSessionNameText);
    setIsEditOpen(false);
  };

  return (
    <>
      <Box sx={{ flexGrow: 1, mx: 2, mt: 1 }}>
        <Grid container>
          <Grid item xs>
            <Typography variant="h5" onClick={() => setIsEditOpen(true)}>
              {sessionName ? sessionName : 'Session name'}
            </Typography>
          </Grid>
          <Grid item>
            {formatTime(sessionTime)}
            {/*<Button variant="contained" size="small" color={loggingActive ? "error" : "success"} onClick={toggleLogging}>
              {loggingActive ? <PauseIcon /> : <PlayArrowIcon />}
            </Button>*/}
          </Grid>
        </Grid>
      </Box>

      <Fab sx={{ right: 24, bottom: 24, position: "fixed" }} color={loggingActive ? "error" : "success"} onClick={toggleLogging}>
        {loggingActive ? <PauseIcon /> : <PlayArrowIcon />}
      </Fab>

      <Dialog open={isEditOpen} onClose={() => setIsEditOpen(false)}>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Session name"
            type="text"
            fullWidth
            variant="standard"
            value={newSessionNameText}
            onChange={event => setNewSessionNameText(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditOpen(false)}>Cancel</Button>
          <Button onClick={updateSessionName}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Header;
