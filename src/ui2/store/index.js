import create from 'zustand';

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
