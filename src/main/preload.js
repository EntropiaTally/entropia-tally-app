'use strict';

const { contextBridge, ipcRenderer } = require('electron');

const getters = new Set(['active-session', 'session', 'sessions', 'instances', 'settings', 'logreader-status', 'development-mode']);
const setters = new Set(['active-session', 'settings']);
const actions = new Set(['new-session', 'new-instance', 'load-instance', 'stream-window-toggle', 'logging-status-toggle']);

contextBridge.exposeInMainWorld(
  'api', {
    on(eventName, callback) {
      const subscription = (event, data) => callback(data);
      ipcRenderer.on(eventName, subscription);

      return () => {
        ipcRenderer.removeListener(eventName, subscription);
      };
    },
    get(dataType, args) {
      if (getters.has(dataType)) {
        return ipcRenderer.invoke('get-data', { dataType, args });
      }
    },
    set(dataType, values) {
      if (setters.has(dataType)) {
        return ipcRenderer.invoke('set-data', { type: dataType, values });
      }
    },
    call(action, args = {}) {
      if (actions.has(action)) {
        ipcRenderer.send(action, args);
      }
    },
    selectLogFile() {
      return ipcRenderer.invoke('select-logfile');
    },
    removeListener: (eventName, callback) => {
      ipcRenderer.removeListener(eventName, callback);
    },
    removeAllListeners: eventName => {
      ipcRenderer.removeAllListeners(eventName);
    },
  },
);
