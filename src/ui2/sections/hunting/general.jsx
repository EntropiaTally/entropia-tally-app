import React from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import InfoBox from '@components2/InfoBox';
import { useGeneralLoot } from '@hooks/loot';
import { useStats } from '@hooks/stats';
import { useHeal } from '@hooks/heal';

const General = () => {
  const lootData = useGeneralLoot();
  const huntingStats = useStats();
  const heal = useHeal();

  return (
    <Box sx={{ m: 2 }}>
      <Box sx={{ my: 2 }}>
        <Typography variant="h6">
          General
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <InfoBox title="Total loot" subtitle={`${lootData.allLoot.toFixed(2)} PED`} />
          </Grid>

          <Grid item xs={6} md={3}>
            <InfoBox title="Globals" subtitle={lootData.globals} />
          </Grid>

          <Grid item xs={6} md={3}>
            <InfoBox title="HoFs" subtitle={lootData.hofs} />
          </Grid>

          <Grid item xs={6} md={3}>
            <InfoBox title="Rare items" subtitle={lootData.rareLoot} />
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
            <InfoBox title="Total healed" subtitle={`${heal.healTotal.toFixed(2)} hp`} />
          </Grid>

          <Grid item xs={6} md={3}>
            <InfoBox title="Total healed yourself" subtitle={`${heal.healYourselfTotal.toFixed(2)} hp`} />
          </Grid>

          <Grid item xs={6} md={3}>
            <InfoBox title="Total healed others" subtitle={`${heal.healOthersTotal.toFixed(2)} hp`} />
          </Grid>
        </Grid>
      </Box>

    </Box>
  );
};

export default General;
