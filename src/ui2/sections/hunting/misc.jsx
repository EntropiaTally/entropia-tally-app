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

import { useTierUp, useEnhancerBreaks } from '@hooks/hunting';

const Misc = () => {
  const tierUps = useTierUp();
  const enhancerBreaks = useEnhancerBreaks();

  return (
    <Box sx={{ m: 2 }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Toolbar
          sx={{ pl: { sm: 2 }, minHeight: { sm: '48px' } }}
        >
          <Typography variant="h6">
            Enhancer breaks
          </Typography>
        </Toolbar>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Total value</TableCell>
                <TableCell align="right">Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(enhancerBreaks).map(item => (
                <React.Fragment key={item}>
                  <TableRow
                      hover
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                    <TableCell component="th" scope="row">{item}</TableCell>
                    <TableCell align="right"></TableCell>
                    <TableCell align="right"></TableCell>
                  </TableRow>
                  {enhancerBreaks[item].map(row => (
                    <TableRow
                      key={row.name}
                      hover
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">{row.name}</TableCell>
                      <TableCell align="right">{row.value.toFixed(2)} PED</TableCell>
                      <TableCell align="right">{row.count}</TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Toolbar
          sx={{ pl: { sm: 2 }, minHeight: { sm: '48px' } }}
        >
          <Typography variant="h6">
            Tier Up
          </Typography>
        </Toolbar>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Increase</TableCell>
                <TableCell align="right">Tier</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tierUps.map(row => (
                <TableRow
                  key={row.key}
                  hover
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">{row.key}</TableCell>
                  <TableCell align="right">{row.count.toLocaleString()}</TableCell>
                  <TableCell align="right">{row.tier}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Misc;
