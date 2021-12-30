'use strict';

const Store = require('electron-store');

const configStorage = new Store({
  log: {
    type: 'string',
    format: 'uri',
  },
  avatarName: {
    type: 'string',
  },
  sidebarStyle: {
    type: 'string',
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
      },
    },
  },
  overlay: {
    lootTotal: { type: 'boolean' },
    spendTotal: { type: 'boolean' },
    returnPercent: { type: 'boolean' },
    numGlobals: { type: 'boolean' },
    numHofs: { type: 'boolean' },
    hitPercent: { type: 'boolean' },
    evadePercent: { type: 'boolean' },
    sessionTime: { type: 'boolean' },
  },
});

module.exports = configStorage;
