import { createWithEqualityFn } from 'zustand/traditional';

const activeSessionStoreDefaults = {
  active: false,
  id: null,
  instanceId: null,
  sessionName: null,
  sessionCreatedAt: null,
  instanceCreatedAt: null,
  usedHuntingSets: {},
  additionalCost: 0,
  notes: "",
  sessionTime: 0,
};

export const useActiveSessionStore = createWithEqualityFn(set => ({
  ...Object.assign({}, activeSessionStoreDefaults),
  updateLoggerState: data => set(() => ({ active: data })),
  updateName: data => set(() => ({ sessionName: data })),
  updateHuntingSets: data => set(() => ({ usedHuntingSets: data })),
  updateNotes: data => set(() => ({ notes: data })),
  updateTimer: data => set(() => ({ sessionTime: data })),
  updateSession: data => set(state => ({ ...state, ...data })),
  resetUpdate: data => set(() => ({ ...Object.assign({}, activeSessionStoreDefaults), ...data })),
}));


const aggregatedStoreDefaults = {
  allLoot: {},
  attributes: {},
  damageInflicted: {},
  damageInflictedCrit: {},
  damageTaken: {},
  damageTakenCrit: {},
  enemyDodge: {},
  enemyMiss: {},
  globals: {},
  heal: {},
  hofs: {},
  huntingSetDmg: {},
  huntingSetLoot: {},
  huntingSetMissed: {},
  loot: {},
  lootEvent: {},
  playerEvade: {},
  playerMiss: {},
  rareLoot: {},
  skills: {},
  tierUp: {},
};

export const useAggregatedStore = createWithEqualityFn(set => ({
  ...Object.assign({}, aggregatedStoreDefaults),
  updateAggregated: data => set(state => ({ ...state, ...data })),
  resetUpdate: data => set(() => ({ ...Object.assign({}, aggregatedStoreDefaults), ...data })),
}));


const eventStoreDefaults = {
  attributes: [],
  enhancerBreak: [],
  globals: [],
  hofs: [],
  loot: [],
  lootEvent: [],
  position: [],
  returnsOverTime: [],
  skills: [],
  tierUp: [],
};

export const useEventStore = createWithEqualityFn(set => ({
  ...Object.assign({}, eventStoreDefaults),
  updateEvents: data => set(state => ({ ...state, ...data })),
  resetUpdate: data => set(() => ({ ...Object.assign({}, eventStoreDefaults), ...data })),
}));

export const useSettingsStore = createWithEqualityFn(set => ({
  sidebarStyle: null,
  killCount: null,
  darkMode: false,
  huntingSets: [],
  overlay: {},
  updateSettings: data => set(state => ({ ...state, ...data })),
}));

export const useSessionStore = createWithEqualityFn(set => ({
  list: [],
  updateList: data => set({ list: data }),
}));
