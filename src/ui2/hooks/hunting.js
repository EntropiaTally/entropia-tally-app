import { useActiveSessionStore, useAggregatedStore, useEventStore } from '@store';
import { deepCompare, shallowCompare, arrayCompare } from '@uiUtils2/compare';
import { toNumber } from '@utils/helpers';

export const useExistingHuntingSets = () => {
  const existingHuntingSets = {};

  const usedHuntingSets = useActiveSessionStore(state => state.usedHuntingSets, shallowCompare);
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

  return existingHuntingSets;
};

export const useDpp = () => {
  const existingHuntingSets = useExistingHuntingSets();

  const activeSets = Object.values(existingHuntingSets).filter(set => set.hits || set.misses);
  const combinedDpp = activeSets.reduce((previous, current) => previous + current.dpp, 0);

  return combinedDpp ? combinedDpp / activeSets.length : 0;
};

export const useTierUp = () => {
  const aggregatedTierUps = useAggregatedStore(state => state.tierUp, deepCompare);
  const eventTierUps = useEventStore(state => state.tierUp, arrayCompare);

  const mapped = Object.keys(aggregatedTierUps).map(key => {
    const tierEvents = eventTierUps.filter(event => event.item === key);
    const sortedTierEvents = tierEvents.sort((a, b) => (a.tier > b.tier) ? -1 : ((b.tier > a.tier) ? 1 : 0))[0];
    return { key, ...aggregatedTierUps[key], tier: sortedTierEvents?.tier };
  });
    
  return Object.values(mapped).sort((a, b) => (a.total > b.total) ? -1 : ((b.total > a.total) ? 1 : 0));
};

export const useEnhancerBreaks = () => {
  const enhancerBreaks = useEventStore(state => state.enhancerBreak, arrayCompare);

  const groupedBreaks = {};

  for (const event of enhancerBreaks) {
    if (!groupedBreaks[event.item]) {
      groupedBreaks[event.item] = [];
    }

    const existingBreak = groupedBreaks[event.item].find(row => row.name === event.name);

    if (!existingBreak) {
      groupedBreaks[event.item].push({ name: event.name, count: 1, value: Number(event.value) });
    } else {
      existingBreak.count += 1;
      existingBreak.value += Number(event.value);
    }
  }

  for (const key of Object.keys(groupedBreaks)) {
    groupedBreaks[key] = groupedBreaks[key].sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
  }

  return groupedBreaks;
};
