import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import StatBox from '../components/statbox';
import Table from '../components/table';

function makeNumber(value) {
  return value || 0;
}

const StatsView = ({ avatarName }) => {
  const [stats, setStats] = useState({});

  useEffect(() => {
    const updateAggregatedData = newData => {
      const aggregated = newData?.aggregated ?? newData;

      const damageInflictedCount = makeNumber(aggregated?.damageInflicted?.count);
      const damageInflictedCritCount = makeNumber(aggregated?.damageInflictedCrit?.count);
      const damageTakenCount = makeNumber(aggregated?.damageTaken?.count);
      const damageTakenCritCount = makeNumber(aggregated?.damageTakenCrit?.count);
      const playerDeflectCount = makeNumber(aggregated?.playerDeflect?.count);
      const enemyMissCountValue = makeNumber(aggregated?.enemyMiss?.count);

      const playerAttackCount = damageInflictedCount + makeNumber(aggregated?.playerMiss?.count) + makeNumber(aggregated?.enemyDodge?.count) + makeNumber(aggregated?.enemyEvade?.count) + makeNumber(aggregated?.enemyJam?.count); // Player attacks attempted
      const playerEvadeCount = makeNumber(aggregated?.playerEvade?.count) + makeNumber(aggregated?.playerDodge?.count); // Enemy attacks avoided
      const enemyAttackCount = damageTakenCount + playerDeflectCount + enemyMissCountValue + playerEvadeCount; // Enemy attacks attempted
      const enemyHitCount = damageTakenCount + playerDeflectCount; // Enemy attacks that hit incl. player deflections
      const enemyMissCount = enemyAttackCount - enemyHitCount; // Enemy attacks that missed

      const playerAttackHitRate = makeNumber(damageInflictedCount / playerAttackCount) * 100;
      const playerAttackCritRate = makeNumber(makeNumber(aggregated?.damageInflictedCrit?.count) / damageInflictedCount) * 100;
      const enemyAttackHitCritRate = makeNumber(damageTakenCritCount / enemyHitCount) * 100;
      const enemyAttackMissRate = makeNumber((playerEvadeCount + enemyMissCountValue) / enemyAttackCount) * 100;

      const targetUser = avatarName ? avatarName : 'yourself';
      const healYourselfTotal = aggregated?.heal?.[targetUser]?.total || 0;
      const healTotal = Object.values(aggregated?.heal || {}).reduce((previous, current) =>
        previous + current.total,
      0);
      const healOthersTotal = healTotal - healYourselfTotal;

      const mappedHeal = Object.keys(aggregated?.heal ?? {}).map(key => ({ key, ...aggregated?.heal[key] }));
      const sortedHeal = Object.values(mappedHeal).sort((a, b) => b.percent - a.percent);

      setStats({
        damageInflictedTotal: makeNumber(aggregated?.damageInflicted?.total),
        damageTakenTotal: makeNumber(aggregated?.damageTaken?.total),
        healAll: sortedHeal,
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
        healTotal,
        healYourselfTotal,
        healOthersTotal,
      });
    };

    const removeAggregatedListener = window.api.on('session-data-updated-aggregated', updateAggregatedData);

    if (avatarName !== 'none') {
      window.api.get('active-session').then(updateAggregatedData);
    }

    return () => removeAggregatedListener();
  }, [avatarName]);

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
      <div className="content box info-box">
        <h3 className="title is-5">Heal</h3>
        <div className="statboxes-wrapper">
          <div className="tile tile-toplevel">
            <StatBox
              title="Healed total"
              value={stats?.healTotal?.toFixed(2) ?? 0}
              suffix="HP"
            />
            <StatBox
              title="Healed yourself"
              value={stats?.healYourselfTotal?.toFixed(2) ?? 0}
              suffix="HP"
            />
            <StatBox
              title="Healed others"
              value={stats?.healOthersTotal?.toFixed(2) ?? 0}
              suffix="HP"
            />
          </div>
        </div>
        {Object.keys(stats?.healAll || {}).length > 1 && (
          <div className="stats-heal-table">
            <Table header={['Player', 'Amount', 'Distribution']}>
              {stats.healAll.map(row => (
                <tr key={row.key}>
                  <td>{row.key}</td>
                  <td className="small-locked-size"><span className="sum">{row.total.toFixed(2)}</span> HP</td>
                  <td className="small-locked-size">{row.percent.toFixed(2)} %</td>
                </tr>
              ))}
            </Table>
          </div>
        )}
      </div>
    </>
  );
};

StatsView.propTypes = {
  avatarName: PropTypes.string,
};

export default StatsView;
