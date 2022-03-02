'use strict';

const Store = require('electron-store');

const configStorage = new Store({
  log: {
    type: 'string',
    format: 'uri',
  },
  lastUpdateCheck: {
    type: 'number',
  },
  logReadAll: {
    type: 'boolean',
  },
  avatarName: {
    type: 'string',
  },
  sidebarStyle: {
    type: 'string',
  },
  killCount: {
    type: 'boolean',
  },
  darkMode: {
    type: 'boolean',
  },
  huntingSets: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        default: { type: 'boolean' },
        name: { type: 'string' },
        decay: { type: 'number' },
        shortcut: { type: 'string' },
      },
    },
  },
  overlay: {
    lootTotal: { type: 'boolean' },
    spendTotal: { type: 'boolean' },
    returnPercent: { type: 'boolean' },
    numGlobals: { type: 'boolean' },
    numHofs: { type: 'boolean' },
    killCount: { type: 'boolean' },
    hitPercent: { type: 'boolean' },
    evadePercent: { type: 'boolean' },
    sessionTime: { type: 'boolean' },
  },
  overlaySize: {
    type: 'array',
    items: { type: 'string' },
  },
  overlayPosition: {
    type: 'array',
    items: { type: 'string' },
  },
});

module.exports = configStorage;
