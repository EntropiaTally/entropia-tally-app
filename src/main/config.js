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
});

module.exports = configStorage;
