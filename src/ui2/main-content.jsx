import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';

const MainContent = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  return (
    <>
      <AppBar position="static">
        <Tabs
          value={selectedTab}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          aria-label="full width tabs example"
          onChange={(_event, value) => setSelectedTab(value)}
        >
          <Tab label="General" />
          <Tab label="Loot" />
          <Tab label="Misc" />
          <Tab label="Returns" />
          <Tab label="Notes" />
        </Tabs>
      </AppBar>
      <Box sx={{ p: 2 }}>
        <Card>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Total loot
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Text goes here
            </Typography>
          </CardContent>
        </Card>

        <Box sx={{ my: 2 }}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">Shrapnel</TableCell>
                  <TableCell align="right">12000</TableCell>
                  <TableCell align="right">12</TableCell>
                  <TableCell align="right">100%</TableCell>
                </TableRow>
                <TableRow
                  key={1}
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
        </Box>

        <Box sx={{ my: 2 }}>
          <Card>
            <CardContent>
              <TextField
                multiline
                label="Custom CSS"
                rows={10}
                defaultValue="Default Value"
                variant="filled"
                style={{ width: '100%' }}
              />
            </CardContent>
          </Card>
        </Box>
      </Box>
    </>
  );
};

export default MainContent;
