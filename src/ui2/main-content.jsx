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
import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar';

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

        <Box sx={{ my: 2 }}>

          <Typography variant="h6">
            General
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={3}>
              <Card>
                <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                  <Typography variant="body2" color="text.secondary">
                    Total loot
                  </Typography>
                  <Typography variant="subtitle1">
                    1052.00 PED
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={3}>
              <Card>
                <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                  <Typography variant="body2" color="text.secondary">
                    Globals
                  </Typography>
                  <Typography variant="subtitle1">
                    5
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={3}>
              <Card>
                <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                  <Typography variant="body2" color="text.secondary">
                    Hall of fame
                  </Typography>
                  <Typography variant="subtitle1">
                    2
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={3}>
              <Card>
                <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                  <Typography variant="body2" color="text.secondary">
                    Rare loot
                  </Typography>
                  <Typography variant="subtitle1">
                    1
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ my: 2 }}>

          <Typography variant="h6">
            Offensive
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={3}>
              <Card>
                <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                  <Typography variant="body2" color="text.secondary">
                    Damage inflicted
                  </Typography>
                  <Typography variant="subtitle1">
                    80,157 hp
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={3}>
              <Card>
                <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                  <Typography variant="body2" color="text.secondary">
                    Shots fired
                  </Typography>
                  <Typography variant="subtitle1">
                    110
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={3}>
              <Card>
                <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                  <Typography variant="body2" color="text.secondary">
                    Kill count
                  </Typography>
                  <Typography variant="subtitle1">
                    945
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={3}>
              <Card>
                <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                  <Typography variant="body2" color="text.secondary">
                    Hit rate
                  </Typography>
                  <Typography variant="subtitle1">
                    91.28 %
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ my: 2 }}>
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
        </Box>

        <Card>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Random card
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Some text
            </Typography>
          </CardContent>
        </Card>

        <Box sx={{ my: 2 }}>
          <Card>
            <CardContent>
              <TextField
                multiline
                label="Notes"
                rows={10}
                defaultValue=""
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
