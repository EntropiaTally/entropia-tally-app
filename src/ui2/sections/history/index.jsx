import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Toolbar from '@mui/material/Toolbar';
import Modal from '@mui/material/Modal';

import { useSessionStore } from '@store';
import { arrayCompare } from '@uiUtils2/compare';
import { formatLocalTime } from '@uiUtils2/formatting';

const style = {
  position: 'absolute',
  top: '25px',
  left: '50%',
  transform: 'translate(-50%, 0)',
  width: '95%',
  maxWidth: '950px',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const History = () => {
  const sessions = useSessionStore(state => state.list, arrayCompare);
  const setSessions = useSessionStore(state => state.updateList);

  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [sessionData, setSessionData] = useState({});

  useEffect(async () => {
    const fetchedSessions = await window.api2.fetch('sessions');
    setSessions(fetchedSessions);
  }, [setSessions]);

  const openSession = async (id) => {
    const fetchedSession = await window.api2.fetch('session', { id });
    console.log("fetchedSession", fetchedSession);
    setSessionData(fetchedSession);
    setHistoryModalOpen(true);
  }

  return (
    <Box sx={{ m: 2 }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Toolbar
          sx={{ pl: { sm: 2 }, minHeight: { sm: '48px' } }}
        >
          <Typography variant="h6">
            History
          </Typography>
        </Toolbar>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell align="right">Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sessions.map(row => (
                <React.Fragment key={row.created_at}>
                  <TableRow
                      hover
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      onClick={() => openSession(row.id)}
                    >
                    <TableCell component="th" scope="row">{formatLocalTime(row.created_at)}</TableCell>
                    <TableCell align="right">{row.name ? row.name : '-'}</TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Modal
        open={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {sessionData.createdAt}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
        </Box>
      </Modal>
    </Box>
  );
};

export default History;
