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
});

module.exports = configStorage;
