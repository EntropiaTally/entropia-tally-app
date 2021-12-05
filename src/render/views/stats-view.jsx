import React from 'react';
import PropTypes from 'prop-types';
import StatBox from '../components/statbox';

const StatsView = ({
  damageInflicted,
  damageInflictedCrit,
  damageTaken,
  damageTakenCrit,
  enemyMiss,
  enemyDodge,
  enemyEvade,
  playerDodge,
  playerEvade,
  playerDeflect,
}) => {
  const playerAttackCount = damageInflicted.count + enemyDodge.count + enemyEvade.count; // Player attacks attempted
  const playerEvadeCount = playerEvade.count + playerDodge.count; // Enemy attacks avoided
  const enemyAttackCount = damageTaken.count + playerDeflect.count + enemyMiss.count + playerEvadeCount; // Enemy attacks attempted
  const enemyHitCount = damageTaken.count + playerDeflect.count; // Enemy attacks that hit incl. player deflections
  const enemyMissCount = enemyAttackCount - enemyHitCount; // Enemy attacks that missed

  const playerAttackHitRate = ((damageInflicted.count / playerAttackCount) || 0) * 100;
  const playerAttackCritRate = ((damageInflictedCrit.count / damageInflicted.count) || 0) * 100;
  const enemyAttackHitCritRate = ((damageTakenCrit.count / enemyHitCount) || 0) * 100;
  const enemyAttackMissRate = (((playerEvadeCount + enemyMiss.count) / enemyAttackCount) || 0) * 100;

  /// console.log("playerAttackCount", playerAttackCount)
  /// console.log("playerHitCount", damageInflicted.count)
  /// console.log("playerHitBeingCrits", damageInflictedCrit.count)

  /// console.log("enemyAttackCount", enemyAttackCount)
  /// console.log("enemyHitCount", enemyHitCount)
  /// console.log("enemyHitBeingCrits", damageTakenCrit.count)
  /// console.log("enemyHitMiss", enemyMissCount)

  return (
    <>
      <div className="content box info-box">
        <h3 className="title is-5">Offense</h3>
        <div className="statboxes-wrapper">
          <div className="tile tile-toplevel">
            <StatBox
              title="Damage inflicted"
              value={damageInflicted.total.toLocaleString()}
              suffix="HP"
            />
            <StatBox
              title="Hit rate"
              value={playerAttackHitRate.toFixed(2)}
              suffix="%"
            />
            <StatBox
              title="Crit rate"
              value={playerAttackCritRate.toFixed(2)}
              suffix="%"
            />
          </div>
          <div className="tile tile-toplevel">
            <StatBox
              title="Total attacks"
              value={playerAttackCount.toLocaleString()}
            />
            <StatBox
              title="Total attacks hit"
              value={damageInflicted.count.toLocaleString()}
            />
            <StatBox
              title="Total crits"
              value={damageInflictedCrit.count.toLocaleString()}
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
              value={damageTaken.total.toLocaleString()}
              suffix="HP"
            />
            <StatBox
              title="Evade rate"
              value={enemyAttackMissRate.toFixed(2)}
              suffix="%"
            />
            <StatBox
              title="Total evades"
              value={enemyMissCount.toLocaleString()}
            />
          </div>
          <div className="tile tile-toplevel">
            <StatBox
              title="Enemy hits"
              value={(enemyHitCount).toLocaleString()}
            />
            <StatBox
              title="Enemy crit rate"
              value={enemyAttackHitCritRate.toFixed(2)}
              suffix="%"
            />
            <StatBox
              title="Enemy crits"
              value={damageTakenCrit.count.toLocaleString()}
            />
          </div>
        </div>
      </div>
    </>
  );
};

StatsView.defaultProps = {
  damageInflicted: { count: 0, total: 0 },
  damageInflictedCrit: { count: 0, total: 0 },
  damageTaken: { count: 0, total: 0 },
  damageTakenCrit: { count: 0, total: 0 },
  enemyMiss: { count: 0, total: 0 },
  enemyDodge: { count: 0, total: 0 },
  enemyEvade: { count: 0, total: 0 },
  playerDodge: { count: 0, total: 0 },
  playerEvade: { count: 0, total: 0 },
  playerDeflect: { count: 0, total: 0 },
};

StatsView.propTypes = {
  damageInflicted: PropTypes.object,
  damageInflictedCrit: PropTypes.object,
  damageTaken: PropTypes.object,
  damageTakenCrit: PropTypes.object,
  enemyMiss: PropTypes.object,
  enemyDodge: PropTypes.object,
  enemyEvade: PropTypes.object,
  playerDodge: PropTypes.object,
  playerEvade: PropTypes.object,
  playerDeflect: PropTypes.object,
};

export default StatsView;
