import React from 'react';
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

const Loot = () => (
  <Box sx={{ m: 2 }}>
    <Typography variant="h6">
      Loot
    </Typography>
    <Paper sx={{ width: '100%', mb: 2 }}>
      <Toolbar
        sx={{ pl: { sm: 2 }, minHeight: { sm: '48px' } }}
      >
        <Typography variant="h6">
          Loot
        </Typography>
      </Toolbar>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Value</TableCell>
              <TableCell align="right">Distribution</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow
              key={0}
              hover
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">Shrapnel</TableCell>
              <TableCell align="right">12000</TableCell>
              <TableCell align="right">12</TableCell>
              <TableCell align="right">100%</TableCell>
            </TableRow>

            <TableRow
              key={1}
              hover
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">Shrapnel</TableCell>
              <TableCell align="right">12000</TableCell>
              <TableCell align="right">12</TableCell>
              <TableCell align="right">100%</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>

    <Paper sx={{ width: '100%', mb: 2 }}>
      <Toolbar
        sx={{ pl: { sm: 2 }, minHeight: { sm: '48px' } }}
      >
        <Typography variant="h6">
          Globals
        </Typography>
      </Toolbar>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Source</TableCell>
              <TableCell>Location</TableCell>
              <TableCell align="right">Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow
              key={0}
              hover
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">Atrox Old</TableCell>
              <TableCell align="right">-</TableCell>
              <TableCell align="right">128 PED</TableCell>
            </TableRow>

            <TableRow
              key={1}
              hover
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">Wombana Stalker</TableCell>
              <TableCell align="right">Arkadia Underground</TableCell>
              <TableCell align="right">68 PED</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>

    <Paper sx={{ width: '100%', mb: 2 }}>
      <Toolbar
        sx={{ pl: { sm: 2 }, minHeight: { sm: '48px' } }}
      >
        <Typography variant="h6">
          HoFs
        </Typography>
      </Toolbar>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Source</TableCell>
              <TableCell>Location</TableCell>
              <TableCell align="right">Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow
              key={0}
              hover
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">Araneatrox Young</TableCell>
              <TableCell align="right">-</TableCell>
              <TableCell align="right">847 PED</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>

    <Paper sx={{ width: '100%', mb: 2 }}>
      <Toolbar
        sx={{ pl: { sm: 2 }, minHeight: { sm: '48px' } }}
      >
        <Typography variant="h6">
          Rare items
        </Typography>
      </Toolbar>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow
              key={0}
              hover
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">Rare Mayhem Token</TableCell>
              <TableCell align="right">0.00</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  </Box>
);

export default Loot;
