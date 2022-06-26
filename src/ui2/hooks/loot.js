import { useMemo } from 'react';
import { useAggregatedStore, useActiveSessionStore, useEventStore } from '@store';
import { deepCompare, shallowCompare, arrayCompare } from '@uiUtils2/compare';
import { toNumber } from '@utils/helpers';
import { useExistingHuntingSets } from '@hooks/hunting';

export const useGeneralLoot = () => {
  const lootData = useAggregatedStore(state => ({
    allLoot: toNumber(state.allLoot?.total),
    globals: toNumber(state.globals?.count),
    hofs: toNumber(state.hofs?.count),
  }), shallowCompare);

  const rareLoot = useAggregatedStore(state => state.rareLoot, deepCompare);

  const rareLootCount = Object.values(rareLoot).reduce((previous, current) => previous + current.count, 0);

  return { ...lootData, rareLoot: rareLootCount };
};

export const useLootItems = () => {
  const loot = useAggregatedStore(state => state.loot, deepCompare);
  return loot;
};

export const useGlobals = () => {
  const globals = useEventStore(state => state.globals, arrayCompare);
  return globals;
};

export const useHofs = () => {
  const hofs = useEventStore(state => state.hofs, arrayCompare);
  return hofs;
};

export const useRareLoot = () => {
  const rareLoot = useAggregatedStore(state => state.rareLoot, deepCompare);
  return rareLoot;
};

export const useReturns = () => {
  const existingHuntingSets = useExistingHuntingSets();
  const additionalCost = useActiveSessionStore(state => toNumber(state.additionalCost));
  
  const { totalLoot, lootEventCount } = useAggregatedStore(state => ({
    totalLoot: toNumber(state.allLoot.total),
    lootEventCount: toNumber(state.lootEvent.count),
  }), shallowCompare);

  const aggregatedHuntingSetData = Object.values(existingHuntingSets).filter(set => set.hits || set.misses);

  const { loot: trackedLoot, cost: totalWeaponCost } = aggregatedHuntingSetData.reduce((previous, current) => ({
    cost: previous.cost + ((current.hits + current.misses) * (current.decay / 100)),
    loot: previous.loot + current.loot,
  }), { cost: 0, loot: 0 });

  const totalCost = totalWeaponCost + additionalCost;
  const resultValue = totalLoot - totalCost;
  const resultRate = totalCost > 0
    ? (trackedLoot / totalCost) * 100 || 0
    : null;

  const avg = useMemo(() => {
    if (lootEventCount > 0) {
      return {
        loot: (totalLoot / lootEventCount) || 0,
        cost: totalCost > 0 ? (totalCost / lootEventCount) : 0,
      };
    }

    return { loot: 0, cost: 0};
  }, [totalCost, lootEventCount, totalLoot]);

  return {
    trackedLoot,
    totalCost,
    totalWeaponCost,
    resultValue,
    resultRate,
    avg,
  };
};
