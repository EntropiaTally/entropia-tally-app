import React, { useEffect, useState } from 'react';
import StatBox from '../components/statbox';

const StatsView = () => {
  const [stats, setStats] = useState({});

  useEffect(() => {
    const updateAggregatedData = newData => {
      const aggregated = newData?.aggregated ?? newData;

      const damageInflictedCount = aggregated?.damageInflicted?.count || 0;
      const damageInflictedCritCount = aggregated?.damageInflictedCrit?.count || 0;
      const damageTakenCount = aggregated?.damageTaken?.count || 0;
      const damageTakenCritCount = aggregated?.damageTakenCrit?.count || 0;
      const playerDeflectCount = aggregated?.playerDeflect?.count || 0;
      const enemyMissCountValue = aggregated?.enemyMiss?.count || 0;

      const playerAttackCount = damageInflictedCount + (aggregated?.enemyDodge?.count || 0) + (aggregated?.enemyEvade?.count || 0); // Player attacks attempted
      const playerEvadeCount = (aggregated?.playerEvade?.count || 0) + (aggregated?.playerDodge?.count || 0); // Enemy attacks avoided
      const enemyAttackCount = damageTakenCount + playerDeflectCount + enemyMissCountValue + playerEvadeCount; // Enemy attacks attempted
      const enemyHitCount = damageTakenCount + playerDeflectCount; // Enemy attacks that hit incl. player deflections
      const enemyMissCount = enemyAttackCount - enemyHitCount; // Enemy attacks that missed

      const playerAttackHitRate = ((damageInflictedCount / playerAttackCount) || 0) * 100;
      const playerAttackCritRate = (((aggregated?.damageInflictedCrit?.count || 0) / damageInflictedCount) || 0) * 100;
      const enemyAttackHitCritRate = ((damageTakenCritCount / enemyHitCount) || 0) * 100;
      const enemyAttackMissRate = (((playerEvadeCount + enemyMissCountValue) / enemyAttackCount) || 0) * 100;

      setStats({
        damageInflictedTotal: aggregated?.damageInflicted?.total || 0,
        damageTakenTotal: aggregated?.damageTaken?.total || 0,
        damageInflictedCount,
        damageInflictedCritCount,
        damageTakenCritCount,
        playerAttackCount,
        enemyHitCount,
        enemyMissCount,
        playerAttackHitRate,
        playerAttackCritRate,
        enemyAttackHitCritRate,
        enemyAttackMissRate,
      });
    };

    const removeAggregatedListener = window.api.on('session-data-updated-aggregated', updateAggregatedData);

    window.api.get('active-session').then(updateAggregatedData);

    return () => removeAggregatedListener();
  }, []);

  return (
    <>
      <div className="content box info-box">
        <h3 className="title is-5">Offense</h3>
        <div className="statboxes-wrapper">
          <div className="tile tile-toplevel">
            <StatBox
              title="Damage inflicted"
              value={stats?.damageInflictedTotal?.toLocaleString() ?? 0}
              suffix="HP"
            />
            <StatBox
              title="Hit rate"
              value={stats?.playerAttackHitRate?.toFixed(2) ?? 0}
              suffix="%"
            />
            <StatBox
              title="Crit rate"
              value={stats?.playerAttackCritRate?.toFixed(2) ?? 0}
              suffix="%"
            />
          </div>
          <div className="tile tile-toplevel">
            <StatBox
              title="Total attacks"
              value={stats?.playerAttackCount?.toLocaleString() ?? 0}
            />
            <StatBox
              title="Total attacks hit"
              value={stats?.damageInflictedCount?.toLocaleString() ?? 0}
            />
            <StatBox
              title="Total crits"
              value={stats?.damageInflictedCritCount?.toLocaleString() ?? 0}
            />
          </div>
        </div>
      </div>
      <div className="content box info-box">
        <h3 className="title is-5">Defense</h3>
        <div className="statboxes-wrapper">
          <div className="tile tile-toplevel">
            <StatBox
              title="Damage received"
              value={stats?.damageTakenTotal?.toLocaleString() ?? 0}
              suffix="HP"
            />
            <StatBox
              title="Evade rate"
              value={stats?.enemyAttackMissRate?.toFixed(2) ?? 0}
              suffix="%"
            />
            <StatBox
              title="Total evades"
              value={stats?.enemyMissCount?.toLocaleString() ?? 0}
            />
          </div>
          <div className="tile tile-toplevel">
            <StatBox
              title="Enemy hits"
              value={stats?.enemyHitCount?.toLocaleString() ?? 0}
            />
            <StatBox
              title="Enemy crit rate"
              value={stats?.enemyAttackHitCritRate?.toFixed(2) ?? 0}
              suffix="%"
            />
            <StatBox
              title="Enemy crits"
              value={stats?.damageTakenCritCount?.toLocaleString() ?? 0}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default StatsView;
