import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { aggregateHuntingSetData } from '@utils/helpers';

import StatBox from '@components/statbox';
import Table from '@components/table';

function makeNumber(value) {
  return value || 0;
}

const StatsView = ({ avatarName, isKillCountEnabled }) => {
  const [stats, setStats] = useState({
    damageInflictedTotal: 0,
    playerAttackHitRate: 0,
    playerAttackCritRate: 0,
    playerAttackCount: 0,
    damageInflictedCount: 0,
    damageInflictedCritCount: 0,
    killCount: 0,
    damageTakenTotal: 0,
    enemyAttackMissRate: 0,
    enemyMissCount: 0,
    enemyHitCount: 0,
    enemyAttackHitCritRate: 0,
    damageTakenCritCount: 0,
    healTotal: 0,
    healYourselfTotal: 0,
    healOthersTotal: 0,
    healAll: [],
  });

  useEffect(() => {
    const updateAggregatedData = newData => {
      const aggregated = newData?.aggregated;
      const usedHuntingSets = newData?.usedHuntingSets;

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

      let avgDpp = 0;
      if (usedHuntingSets) {
        const fixedSets = aggregateHuntingSetData(usedHuntingSets, aggregated);
        const activeSets = Object.values(fixedSets).filter(set => set.hits || set.misses);

        const combinedDpp = activeSets.reduce((previous, current) => previous + current.dpp, 0);
        avgDpp = combinedDpp
          ? combinedDpp / activeSets.length
          : 0;
      }

      setStats({
        damageInflictedTotal: makeNumber(aggregated?.damageInflicted?.total),
        damageTakenTotal: makeNumber(aggregated?.damageTaken?.total),
        healAll: sortedHeal,
        killCount: makeNumber(aggregated?.lootEvent?.count),
        dpp: avgDpp,
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

    const removeAggregatedListener = window.api.on('session-data-updated', updateAggregatedData);

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
              value={stats.damageInflictedTotal?.toLocaleString()}
              suffix="HP"
            />
            <StatBox
              title="Hit rate"
              value={stats.playerAttackHitRate?.toFixed(2)}
              suffix="%"
            />
            <StatBox
              title="Crit rate"
              value={stats.playerAttackCritRate?.toFixed(2)}
              suffix="%"
            />
          </div>
          <div className="tile tile-toplevel">
            <StatBox
              title="Total attacks"
              value={stats.playerAttackCount?.toLocaleString()}
            />
            <StatBox
              title="Total attacks hit"
              value={stats.damageInflictedCount?.toLocaleString()}
            />
            <StatBox
              title="Total crits"
              value={stats.damageInflictedCritCount?.toLocaleString()}
            />
          </div>
          <div className="tile tile-toplevel">
            {isKillCountEnabled && (
              <StatBox
                title="Estimated kills"
                value={stats.killCount}
              />
            )}
            <StatBox
              title="Avg. dpp"
              value={stats.dpp?.toFixed(6)}
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
              value={stats.damageTakenTotal?.toLocaleString()}
              suffix="HP"
            />
            <StatBox
              title="Evade rate"
              value={stats.enemyAttackMissRate?.toFixed(2)}
              suffix="%"
            />
            <StatBox
              title="Total evades"
              value={stats.enemyMissCount?.toLocaleString()}
            />
          </div>
          <div className="tile tile-toplevel">
            <StatBox
              title="Enemy hits"
              value={stats.enemyHitCount?.toLocaleString()}
            />
            <StatBox
              title="Enemy crit rate"
              value={stats.enemyAttackHitCritRate?.toFixed(2)}
              suffix="%"
            />
            <StatBox
              title="Enemy crits"
              value={stats.damageTakenCritCount?.toLocaleString()}
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
              value={stats.healTotal?.toFixed(2)}
              suffix="HP"
            />
            <StatBox
              title="Healed yourself"
              value={stats.healYourselfTotal?.toFixed(2)}
              suffix="HP"
            />
            <StatBox
              title="Healed others"
              value={stats.healOthersTotal?.toFixed(2)}
              suffix="HP"
            />
          </div>
        </div>
        {Object.keys(stats.healAll || {}).length > 1 && (
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
  isKillCountEnabled: PropTypes.bool,
};

export default StatsView;
