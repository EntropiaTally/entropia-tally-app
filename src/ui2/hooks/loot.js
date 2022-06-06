import { useAggregatedStore, useEventStore } from '@store';
import { deepCompare, shallowCompare, arrayCompare } from '@uiUtils2/compare';
import { toNumber } from '@utils/helpers';

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
