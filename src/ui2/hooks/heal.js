import { useAggregatedStore } from '@store';
import { deepCompare } from '@uiUtils2/compare';
import { toNum } from '@utils/helpers';

export const useHeal = (avatarName = null) => {
  const heal = useAggregatedStore(state => state.heal, deepCompare);

  const targetUser = avatarName ? avatarName : 'yourself';
  const healYourselfTotal = toNum(heal[targetUser]?.total);
  const healTotal = Object.values(heal).reduce((previous, current) => previous + current.total, 0);
  const healOthersTotal = healTotal - healYourselfTotal;

  const mappedHeal = Object.keys(heal).map(key => ({ key, ...heal[key] }));
  const sortedHeal = Object.values(mappedHeal).sort((a, b) => b.percent - a.percent);

  return {
    healAll: sortedHeal,
    healTotal,
    healYourselfTotal,
    healOthersTotal,
  };
};
