import { useAggregatedStore, useHuntingSetStore } from '@store';
import { deepCompare } from '@uiUtils2/compare';
import { toNumber } from '@utils/helpers';

export const useDpp = () => {
  let avgDpp = 0;
  const existingHuntingSets = {};

  const usedHuntingSets = useHuntingSetStore();
  const { huntingSetDmg, huntingSetMissed, huntingSetLoot } = useAggregatedStore(state => ({
    huntingSetDmg: state.huntingSetDmg,
    huntingSetMissed: state.huntingSetMissed,
    huntingSetLoot: state.huntingSetLoot,
  }), deepCompare);

  if (usedHuntingSets) {
    for (const set of Object.values(usedHuntingSets)) {
      const { id } = set;

      if (existingHuntingSets[id]) {
        existingHuntingSets[id].hits += toNumber(huntingSetDmg[id]?.count);
        existingHuntingSets[id].misses += toNumber(huntingSetMissed[id]?.count);
        existingHuntingSets[id].loot += toNumber(huntingSetLoot[id]?.total);
      } else {
        existingHuntingSets[id] = {
          ...set,
          dmg: toNumber(huntingSetDmg[id]?.total),
          hits: toNumber(huntingSetDmg[id]?.count),
          misses: toNumber(huntingSetMissed[id]?.count),
          loot: toNumber(huntingSetLoot[id]?.total),
        };
      }

      const totalAttacks = existingHuntingSets[id].hits + existingHuntingSets[id].misses;
      existingHuntingSets[id].dpp = totalAttacks
        ? existingHuntingSets[id].dmg / (totalAttacks * Number(existingHuntingSets[id].decay))
        : 0;
    }
  }

  const activeSets = Object.values(existingHuntingSets).filter(set => set.hits || set.misses);

  const combinedDpp = activeSets.reduce((previous, current) => previous + current.dpp, 0);
  avgDpp = combinedDpp
    ? combinedDpp / activeSets.length
    : 0;

  return avgDpp;
};
