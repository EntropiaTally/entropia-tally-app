import { atom, selector } from 'recoil';

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
