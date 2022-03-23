'use strict';

const { contextBridge, ipcRenderer } = require('electron');

const getters = new Set(['active-session', 'session', 'sessions', 'instances', 'settings', 'logreader-status', 'development-mode', 'overlay-window-status']);
const setters = new Set(['active-session', 'settings']);
const actions = new Set(['new-session', 'new-instance', 'load-instance', 'overlay-window-toggle', 'logging-status-toggle', 'goto-wiki-weapontool', 'goto-css-guide', 'goto-shortcut-guide', 'change-hunting-set']);
const deletes = new Set(['session', 'instance']);

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

      if (dataType === 'hunting-sets') {
        return ipcRenderer.invoke('set-hunting-sets', values);
      }

      if (dataType === 'session-notes') {
        return ipcRenderer.invoke('set-session-notes', values);
      }
    },
    delete(type, id) {
      if (deletes.has(type)) {
        return ipcRenderer.invoke('delete', { type, id });
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
    exportInstance(sessionId, instanceId) {
      console.log('API', sessionId, instanceId);
      return ipcRenderer.invoke('export-instance', { sessionId, instanceId });
    },
    removeListener: (eventName, callback) => {
      ipcRenderer.removeListener(eventName, callback);
    },
    removeAllListeners: eventName => {
      ipcRenderer.removeAllListeners(eventName);
    },
  },
);
