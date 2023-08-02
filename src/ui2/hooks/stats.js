import { useAggregatedStore } from '@store';
import { shallowCompare } from '@uiUtils2/compare';
import { toNumber, sum } from '@utils/helpers';

export const useStats = () => {
  const stats = useAggregatedStore(state => ({
    damageInflictedCount: toNumber(state.damageInflicted?.count),
    damageInflictedTotal: toNumber(state.damageInflicted?.total),
    damageInflictedCritCount: toNumber(state.damageInflictedCrit?.count),
    damageTakenCount: toNumber(state.damageTaken?.count),
    damageTakenTotal: toNumber(state.damageTaken?.total),
    damageTakenCritCount: toNumber(state.damageTakenCrit?.count),
    playerDeflectCount: toNumber(state.playerDeflect?.count),
    playerMissCount: toNumber(state.playerMiss?.count),
    playerEvadeCount: toNumber(state.playerEvade?.count),
    playerDodgeCount: toNumber(state.playerDodge?.count),
    enemyMissCountValue: toNumber(state.enemyMiss?.count),
    enemyDodgeCount: toNumber(state.enemyDodge?.count),
    enemyEvadeCount: toNumber(state.enemyEvade?.count),
    enemyJamCount: toNumber(state.enemyJam?.count),
    lootEventCount: toNumber(state.lootEvent?.count),
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
  const playerAttackHitRate = (damageInflictedCount / playerAttackCount) * 100 || 0;
  const playerAttackCritRate = (damageInflictedCritCount / damageInflictedCount) * 100 || 0;
  const enemyAttackHitCritRate = (damageTakenCritCount / enemyHitCount) * 100 || 0;
  const enemyAttackMissRate = ((playerEvadeCount + stats.enemyMissCountValue) / enemyAttackCount) * 100 || 0;

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
  };
};
