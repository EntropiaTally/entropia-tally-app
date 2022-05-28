import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

const InfoBox = ({ title, subtitle }) => (
  <Card>
    <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="subtitle1">
        {subtitle}
      </Typography>
    </CardContent>
  </Card>
);

InfoBox.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
};

const General = () => (
  <Box sx={{ m: 2 }}>
    <Box sx={{ my: 2 }}>
      <Typography variant="h6">
        General
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={6} md={3}>
          <InfoBox title="Total loot" subtitle="1052.00 PED" />
        </Grid>

        <Grid item xs={6} md={3}>
          <InfoBox title="Globals" subtitle="5" />
        </Grid>

        <Grid item xs={6} md={3}>
          <InfoBox title="HoFs" subtitle="2" />
        </Grid>

        <Grid item xs={6} md={3}>
          <InfoBox title="Rare items" subtitle="1" />
        </Grid>
      </Grid>
    </Box>

    <Box sx={{ my: 2 }}>
      <Typography variant="h6">
        Offensive
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={6} md={3}>
          <InfoBox title="Damage inflicted" subtitle="80,157 hp" />
        </Grid>

        <Grid item xs={6} md={3}>
          <InfoBox title="Hit rate" subtitle="89.98%" />
        </Grid>

        <Grid item xs={6} md={3}>
          <InfoBox title="Crit rate" subtitle="5.38%" />
        </Grid>

        <Grid item xs={6} md={3}>
          <InfoBox title="Total attacks" subtitle="2,602" />
        </Grid>

        <Grid item xs={6} md={3}>
          <InfoBox title="Total hits" subtitle="2,341" />
        </Grid>

        <Grid item xs={6} md={3}>
          <InfoBox title="Total crits" subtitle="126" />
        </Grid>

        <Grid item xs={6} md={3}>
          <InfoBox title="Kills" subtitle="67" />
        </Grid>
      </Grid>
    </Box>

    <Box sx={{ my: 2 }}>
      <Typography variant="h6">
        Defensive
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={6} md={3}>
          <InfoBox title="Damage received" subtitle="5,157 hp" />
        </Grid>

        <Grid item xs={6} md={3}>
          <InfoBox title="Evade rate" subtitle="78.14%" />
        </Grid>

        <Grid item xs={6} md={3}>
          <InfoBox title="Total evades" subtitle="325" />
        </Grid>

        <Grid item xs={6} md={3}>
          <InfoBox title="Received hits" subtitle="157" />
        </Grid>

        <Grid item xs={6} md={3}>
          <InfoBox title="Received crit rate" subtitle="0.25%" />
        </Grid>

        <Grid item xs={6} md={3}>
          <InfoBox title="Received crits" subtitle="5" />
        </Grid>
      </Grid>
    </Box>

    <Box sx={{ my: 2 }}>
      <Typography variant="h6">
        Healing
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={6} md={3}>
          <InfoBox title="Total healed" subtitle="500 hp" />
        </Grid>

        <Grid item xs={6} md={3}>
          <InfoBox title="Total healed yourself" subtitle="500 hp" />
        </Grid>

        <Grid item xs={6} md={3}>
          <InfoBox title="Total healed others" subtitle="0 hp" />
        </Grid>
      </Grid>
    </Box>

  </Box>
);

export default General;
