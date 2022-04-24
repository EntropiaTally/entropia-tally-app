import { atom, selector, selectorFamily } from 'recoil';

export const activeSessionState = atom({
  key: 'activeSessionState',
  default: {},
});

export const activeSessionTimeState = atom({
  key: 'activeSessionTimeState',
  default: 0,
});

export const activeSessionAggregatedState = atom({
  key: 'activeSessionAggregatedState',
  default: {},
});

export const activeSessionEventState = atom({
  key: 'activeSessionEventState',
  default: {},
});

export const settingsState = atom({
  key: 'settingsState',
  default: {},
});

export const lootState = selector({
  key: 'lootState', // unique ID (with respect to other atoms/selectors)
  get: ({ get }) => {
    const aggregated = get(activeSessionAggregatedState);

    return JSON.stringify(aggregated.loot);
  },
});

export const skillState = selector({
  key: 'skillState', // unique ID (with respect to other atoms/selectors)
  get: ({ get }) => {
    const aggregated = get(activeSessionAggregatedState);

    return JSON.stringify(aggregated.skills);
  },
});

export const lootCacheState = selectorFamily({
  key: 'lootCacheState',
  get: () => ({get}) => {
    const lootStateString = get(lootState);
    return lootStateString ? JSON.parse(lootStateString) : {};
  },
});

export const skillCacheState = selectorFamily({
  key: 'skillCacheState',
  get: () => ({get}) => {
    const skillStateString = get(skillState);
    return skillStateString ? JSON.parse(skillStateString) : {};
  },
});

/*export const sessionOneState = selector({
  key: 'sessionOneState', // unique ID (with respect to other atoms/selectors)
  get: ({ get }) => {
    const session = get(sessionState);

    return session.one;
  },
});

export const sessionTwoState = selector({
  key: 'sessionTwoState', // unique ID (with respect to other atoms/selectors)
  get: ({ get }) => {
    const session = get(sessionState);

    return session.two;
  },
});*/
