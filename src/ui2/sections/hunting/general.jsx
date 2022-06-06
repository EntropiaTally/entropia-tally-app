import React from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import InfoBox from '@components2/InfoBox';
import { useGeneralLoot } from '@hooks/loot';
import { useStats } from '@hooks/stats';
import { useHeal } from '@hooks/heal';
import { useDpp } from '@hooks/hunting';

const General = () => {
  const lootData = useGeneralLoot();
  const huntingStats = useStats();
  const heal = useHeal();
  const dpp = useDpp();

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
            <InfoBox title="Damage inflicted" subtitle={`${huntingStats.damageInflictedTotal.toLocaleString()} hp`} />
          </Grid>

          <Grid item xs={6} md={3}>
            <InfoBox title="Hit rate" subtitle={`${huntingStats.playerAttackHitRate.toFixed(2)}%`} />
          </Grid>

          <Grid item xs={6} md={3}>
            <InfoBox title="Crit rate" subtitle={`${huntingStats.playerAttackCritRate.toFixed(2)}%`} />
          </Grid>

          <Grid item xs={6} md={3}>
            <InfoBox title="Total attacks" subtitle={huntingStats.playerAttackCount.toLocaleString()} />
          </Grid>

          <Grid item xs={6} md={3}>
            <InfoBox title="Total hits" subtitle={huntingStats.damageInflictedCount.toLocaleString()} />
          </Grid>

          <Grid item xs={6} md={3}>
            <InfoBox title="Total crits" subtitle={huntingStats.damageInflictedCritCount.toLocaleString()} />
          </Grid>

          <Grid item xs={6} md={3}>
            <InfoBox title="Kills" subtitle={huntingStats.killCount} />
          </Grid>

          <Grid item xs={6} md={3}>
            <InfoBox title="Avg. dpp" subtitle={dpp.toFixed(6)} />
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ my: 2 }}>
        <Typography variant="h6">
          Defensive
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <InfoBox title="Damage received" subtitle={`${huntingStats.damageTakenTotal.toLocaleString()} hp`} />
          </Grid>

          <Grid item xs={6} md={3}>
            <InfoBox title="Evade rate" subtitle={`${huntingStats.enemyAttackMissRate.toFixed(2)}%`} />
          </Grid>

          <Grid item xs={6} md={3}>
            <InfoBox title="Total evades" subtitle={huntingStats.enemyMissCount.toLocaleString()} />
          </Grid>

          <Grid item xs={6} md={3}>
            <InfoBox title="Received hits" subtitle={huntingStats.enemyHitCount.toLocaleString()} />
          </Grid>

          <Grid item xs={6} md={3}>
            <InfoBox title="Received crit rate" subtitle={`${huntingStats.enemyAttackHitCritRate.toFixed(2)}%`} />
          </Grid>

          <Grid item xs={6} md={3}>
            <InfoBox title="Received crits" subtitle={huntingStats.damageTakenCritCount.toLocaleString()} />
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
