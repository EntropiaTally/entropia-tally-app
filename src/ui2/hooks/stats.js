import { useAggregatedStore } from '@store';
import { shallowCompare } from '@uiUtils2/compare';
import { toNum, sum } from '@utils/helpers';

export const useStats = () => {
  const stats = useAggregatedStore(state => ({
    damageInflictedCount: toNum(state.damageInflicted?.count),
    damageInflictedTotal: toNum(state.damageInflicted?.total),
    damageInflictedCritCount: toNum(state.damageInflictedCrit?.count),
    damageTakenCount: toNum(state.damageTaken?.count),
    damageTakenTotal: toNum(state.damageTaken?.total),
    damageTakenCritCount: toNum(state.damageTakenCrit?.count),
    playerDeflectCount: toNum(state.playerDeflect?.count),
    playerMissCount: toNum(state.playerMiss?.count),
    playerEvadeCount: toNum(state.playerEvade?.count),
    playerDodgeCount: toNum(state.playerDodge?.count),
    enemyMissCountValue: toNum(state.enemyMiss?.count),
    enemyDodgeCount: toNum(state.enemyDodge?.count),
    enemyEvadeCount: toNum(state.enemyEvade?.count),
    enemyJamCount: toNum(state.enemyJam?.count),
    lootEventCount: toNum(state.lootEvent?.count),
  }), shallowCompare);

  const { damageInflictedCount, damageInflictedCritCount, damageTakenCritCount } = stats;

  // Player attacks attempted
  const playerAttackCount = sum(
    damageInflictedCount,
    stats.playerMissCount,
    stats.enemyDodgeCount,
    stats.enemyEvadeCount,
    stats.enemyJamCount,
  );

  // Enemy attacks avoided
  const playerEvadeCount = sum(
    stats.playerEvadeCount,
    stats.playerDodgeCount,
  );

  // Enemy attacks attempted
  const enemyAttackCount = sum(
    stats.damageTakenCount,
    stats.enemyMissCountValue,
    stats.playerDeflectCount,
    stats.playerEvadeCount,
  );

  // Enemy attacks that hit incl. player deflections
  const enemyHitCount = sum(
    stats.damageTakenCount,
    stats.playerDeflectCount,
  );

  // Enemy attacks that missed
  const enemyMissCount = enemyAttackCount - enemyHitCount;

  const playerAttackHitRate = (damageInflictedCount / playerAttackCount) * 100;
  const playerAttackCritRate = (damageInflictedCritCount / damageInflictedCount) * 100;
  const enemyAttackHitCritRate = (damageTakenCritCount / enemyHitCount) * 100;
  const enemyAttackMissRate = ((playerEvadeCount + stats.enemyMissCountValue) / enemyAttackCount) * 100;

  return {
    damageInflictedTotal: stats.damageInflictedTotal,
    damageTakenTotal: stats.damageTakenTotal,
    killCount: stats.lootEventCount,
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

    // Dpp: avgDpp,
  };
};
