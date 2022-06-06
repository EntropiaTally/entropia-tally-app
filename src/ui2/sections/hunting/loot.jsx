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

import { useLootItems, useGlobals, useHofs, useRareLoot } from '@hooks/loot';

const Loot = () => {
  const loot = useLootItems();
  const globals = useGlobals();
  const hofs = useHofs();
  const rareLoot = useRareLoot();

  const mappedLoot = Object.keys(loot).map(key => ({ key, ...loot[key] }));
  const sortedLoot = Object.values(mappedLoot).sort((a, b) => b.percent - a.percent);

  const mappedRareLoot = Object.keys(rareLoot).map(key => ({ key, ...rareLoot[key] }));
  const sortedRareLoot = Object.values(mappedRareLoot).sort((a, b) => b.percent - a.percent);

  return (
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
                <TableCell align="right">Value Distribution</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedLoot.map(row => (
                <TableRow
                  key={row.key}
                  hover
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">{row.key}</TableCell>
                  <TableCell align="right">{row.count.toLocaleString()}</TableCell>
                  <TableCell align="right">{row.total.toFixed(2)}</TableCell>
                  <TableCell align="right">{row.percent ? `${row.percent.toFixed(2)} %` : '--' }</TableCell>
                </TableRow>
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
            Rare items
          </Typography>
        </Toolbar>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell align="right">Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedRareLoot.map(row => (
                <TableRow
                  key={row.key}
                  hover
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">{row.key}</TableCell>
                  <TableCell align="right">{row.count.toLocaleString()}</TableCell>
                  <TableCell align="right">{`${row.total.toFixed(0)} PED`}</TableCell>
                </TableRow>
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
              {globals.map(row => (
                <TableRow
                  key={row.date}
                  hover
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">{row.enemy}</TableCell>
                  <TableCell align="right">{row.location}</TableCell>
                  <TableCell align="right">{`${row.value.toFixed(0)} PED`}</TableCell>
                </TableRow>
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
              {hofs.map((row, i) => (
                <TableRow
                  key={i}
                  hover
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">{row.enemy}</TableCell>
                  <TableCell align="right">{row.location}</TableCell>
                  <TableCell align="right">{`${row.value.toFixed(0)} PED`}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Loot;
