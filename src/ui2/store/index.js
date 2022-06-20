import create from 'zustand';

export const useActiveSessionStore = create(set => ({
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
  updateLoggerState: data => set(() => ({ active: data })),
  updateName: data => set(() => ({ sessionName: data })),
  updateHuntingSets: data => set(() => ({ usedHuntingSets: data })),
  updateNotes: data => set(() => ({ notes: data })),
  updateTimer: data => set(() => ({ sessionTime: data })),
  updateSession: data => set(state => ({ ...state, ...data })),
}));

export const useAggregatedStore = create(set => ({
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
  updateAggregated: data => set(state => ({ ...state, ...data })),
}));

export const useEventStore = create(set => ({
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
  updateEvents: data => set(state => ({ ...state, ...data })),
}));

export const useSettingsStore = create(set => ({
  sidebarStyle: null,
  killCount: null,
  darkMode: false,
  huntingSets: [],
  overlay: {},
  updateSettings: data => set(state => ({ ...state, ...data })),
}));

/*export const useHuntingSetStore = create(set => ({
  updateHuntingSets: data => set(state => ({ ...state, ...data })),
}));*/

export const useSessionStore = create(set => ({
  list: [],
  updateList: data => set({ list: data }),
}));
