import { useAggregatedStore } from '@store';
import { shallowCompare } from '@uiUtils2/compare';
import { toNum } from '@utils/helpers';

export const useGeneralLoot = () => {
  const lootData = useAggregatedStore(state => ({
    allLoot: toNum(state.allLoot?.total),
    globals: toNum(state.globals?.count),
    hofs: toNum(state.hofs?.count),
    rareLoot: toNum(state.rareLoot?.count),
  }), shallowCompare);

  return lootData;
};
