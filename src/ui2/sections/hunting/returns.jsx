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
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';

import { useReturns } from '@hooks/loot';

const Returns = () => {
  const returns = useReturns();
  console.log("returns", returns)
  return (
    <Box sx={{ m: 2 }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell component="th" scope="row">
                  Total weapon costs
                </TableCell>
                <TableCell style={{ width: 160 }} align="right">
                  123 PED
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell component="th" scope="row">
                  Additional costs
                </TableCell>
                <TableCell style={{ width: 160 }} align="right">
                  <TextField
                    id="name"
                    type="number"
                    fullWidth
                    size="small"
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">PED</InputAdornment>,
                    }}
                  />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell component="th" scope="row">
                </TableCell>
                <TableCell component="th" scope="row">
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell component="th" scope="row">
                  Total costs
                </TableCell>
                <TableCell style={{ width: 160 }} align="right">
                  123 PED
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell component="th" scope="row">
                  Total loot
                </TableCell>
                <TableCell style={{ width: 160 }} align="right">
                  123 PED
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell component="th" scope="row">
                  Returns
                </TableCell>
                <TableCell style={{ width: 160 }} align="right">
                  123 PED
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell component="th" scope="row">
                  > Incl. markup
                </TableCell>
                <TableCell style={{ width: 160 }} align="right">
                  125 PED
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Returns;
