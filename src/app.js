'use strict';

const { app, BrowserWindow, Menu, ipcMain, dialog, globalShortcut, shell } = require('electron');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { is } = require('electron-util');
const unhandled = require('electron-unhandled');
const debug = require('electron-debug');
const contextMenu = require('electron-context-menu');
const xlsx = require('node-xlsx').default;

const config = require('./main/config');
const menu = require('./main/menu');
const checkForUpdates = require('./main/updater');
const Session = require('./main/session');
const LogReader = require('./main/log-reader');
const { exportXls } = require('./main/exporter');

let mainWindow;
let overlayWindow;
let session;

unhandled();
debug();
contextMenu();

// Note: Must match `build.appId` in package.json
app.setAppUserModelId('com.EntropiaTally.entropia-tally');

if (!is.development) {
  checkForUpdates();
}

const logReader = new LogReader(config.get('log'), config.get('avatarName'), config.get('logReadAll', false));
const assetPath = is.development ? app.getAppPath() : process.resourcesPath;

const initialHuntingSets = config.get('huntingSets', []);
let activeHuntingSet = initialHuntingSets.find(set => set.default);
if (!activeHuntingSet) {
  activeHuntingSet = initialHuntingSets[0];
}

let customIgnoreList = config.get('ignoreLoot', []);

const createMainWindow = async () => {
  const win = new BrowserWindow({
    icon: path.join(assetPath, 'assets/icon.png'),
    title: app.name,
    show: false,
    minWidth: 870,
    minHeight: 590,
    width: is.development ? 2000 : 1000,
    height: is.development ? 1000 : 768,
    resizable: true,
    webPreferences: {
      devTools: is.development,
      nodeIntegration: false,
      preload: path.resolve(app.getAppPath(), 'src/main/preload.js'),
    },
  });

  win.on('ready-to-show', () => {
    win.show();
  });

  win.on('closed', () => {
    mainWindow = undefined;
    if (overlayWindow) {
      overlayWindow.destroy();
      overlayWindow = undefined;
    }
  });

  await win.loadFile(path.resolve(app.getAppPath(), 'public/index.html'));

  return win;
};

const createOverlayWindow = async _parent => {
  let resizeCooldown = null;
  let moveCooldown = null;
  const overlaySize = config.get('overlaySize', [350, 60]);
  const overlayPosition = config.get('overlayPosition', null);
  const overlaySettings = config.get('overlay', {});
  const overlayOpacity = overlaySettings?.opacity !== undefined
    ? Number(overlaySettings.opacity)
    : 1;

  const overlayOptions = {
    title: `${app.name} - Overlay`,
    frame: false,
    show: false,
    width: overlaySize[0],
    height: overlaySize[1],
    resizable: true,
    alwaysOnTop: true,
    opacity: overlayOpacity,
    webPreferences: {
      devTools: is.development,
      nodeIntegration: false,
      preload: path.resolve(app.getAppPath(), 'src/main/preload.js'),
    },
  };

  if (overlayPosition !== null) {
    overlayOptions.x = overlayPosition[0];
    overlayOptions.y = overlayPosition[1];
  }

  const win = new BrowserWindow(overlayOptions);

  win.on('ready-to-show', () => {
    win.show();
    win.setAlwaysOnTop(true, 'screen-saver', 1);
  });

  win.on('resize', () => {
    if (resizeCooldown) {
      clearTimeout(resizeCooldown);
    }

    resizeCooldown = setTimeout(() => {
      config.set('overlaySize', win.getSize());
    }, 1000);
  });

  win.on('move', () => {
    if (moveCooldown) {
      clearTimeout(moveCooldown);
    }

    moveCooldown = setTimeout(() => {
      const bounds = win.getBounds();
      config.set('overlayPosition', [bounds.x, bounds.y]);
    }, 1000);
  });

  win.on('closed', () => {
    overlayWindow = undefined;
    if (mainWindow) {
      mainWindow.webContents.send('overlay-closed', true);
    }
  });

  await win.loadFile(path.resolve(app.getAppPath(), 'public/overlay.html'));

  return win;
};

// Prevent multiple instances of the app
if (!app.requestSingleInstanceLock()) {
  app.quit();
}

app.on('second-instance', () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }

    mainWindow.show();
  }
});

app.on('window-all-closed', () => {
  if (!is.macos) {
    app.quit();
  }
});

app.on('activate', async () => {
  if (!mainWindow) {
    mainWindow = await createMainWindow();
  }
});

function registerShortcuts() {
  const huntingSets = config.get('huntingSets', []);
  const registrationStatus = {};

  globalShortcut.unregisterAll();

  // Register keyboard shortcuts
  for (const huntingSet of huntingSets) {
    if (huntingSet.shortcut) {
      registrationStatus[huntingSet.id] = globalShortcut.register(huntingSet.shortcut, () => {
        setSelectedHuntingSet(huntingSet);
      });
    }
  }

  // Remove shortcuts that failed to register
  if (Object.keys(registrationStatus).length > 0) {
    const cleanedHuntingSets = huntingSets.map(set => {
      const updatedSet = { ...set };

      if (registrationStatus[set.id] === false && updatedSet?.shortcut) {
        delete updatedSet.shortcut;
      }

      return updatedSet;
    });

    config.set('huntingSets', cleanedHuntingSets);

    if (mainWindow) {
      const updatedSettings = getSettings();
      mainWindow.webContents.send('settings-updated', updatedSettings);

      if (overlayWindow) {
        overlayWindow.webContents.send('settings-updated', updatedSettings);
      }
    }
  }
}

// Functions

function getSettings() {
  return {
    log: config.get('log', null),
    logReadAll: config.get('logReadAll', false),
    avatarName: config.get('avatarName', null),
    sidebarStyle: config.get('sidebarStyle', 'full'),
    huntingSets: config.get('huntingSets', []),
    activeHuntingSet: activeHuntingSet?.id,
    overlay: config.get('overlay', {}),
    killCount: config.get('killCount', false),
    darkMode: config.get('darkMode', false),
    ignoreLoot: config.get('ignoreLoot', []),
  };
}

function setDefaultHuntingSet() {
  activeHuntingSet = config.get('huntingSets', []).find(set => set.default);

  if (!activeHuntingSet) {
    activeHuntingSet = config.get('huntingSets', [])[0];
  }

  const updatedSettings = getSettings();
  mainWindow.webContents.send('settings-updated', updatedSettings);

  if (overlayWindow) {
    overlayWindow.webContents.send('settings-updated', updatedSettings);
  }
}

function receivedLoggerEvent({ data, lastLine }) {
  session.newEvent(data, false, customIgnoreList).then(() => {
    // Only send the complete package
    if (lastLine) {
      const sessionData = session.getData();

      mainWindow.webContents.send('session-data-updated', sessionData);
      mainWindow.webContents.send('session-data-updated-aggregated', sessionData?.aggregated);
      mainWindow.webContents.send('session-data-updated-events', sessionData?.events);

      if (overlayWindow && overlayWindow.isVisible()) {
        overlayWindow.webContents.send('session-data-updated', sessionData);
        overlayWindow.webContents.send('session-data-updated-aggregated', sessionData?.aggregated);
        overlayWindow.webContents.send('session-data-updated-events', sessionData?.events);
      }
    }
  });
}

function sessionTimeUpdated(seconds) {
  mainWindow.webContents.send('session-time-updated', seconds);

  if (overlayWindow && overlayWindow.isVisible()) {
    overlayWindow.webContents.send('session-time-updated', seconds);
  }
}

function sessionForcedUpdate() {
  const sessionData = session.getData();

  mainWindow.webContents.send('session-data-updated', sessionData);
  mainWindow.webContents.send('session-data-updated-aggregated', sessionData?.aggregated);
  mainWindow.webContents.send('session-data-updated-events', sessionData?.events);

  if (overlayWindow && overlayWindow.isVisible()) {
    overlayWindow.webContents.send('session-data-updated', sessionData);
    overlayWindow.webContents.send('session-data-updated-aggregated', sessionData?.aggregated);
    overlayWindow.webContents.send('session-data-updated-events', sessionData?.events);
  }
}

function stopLogReader() {
  if (logReader) {
    logReader.stop();
    logReader.removeListener('event', receivedLoggerEvent);
    mainWindow.webContents.send('logger-status-changed', 'disabled');

    if (overlayWindow) {
      overlayWindow.webContents.send('logger-status-changed', 'disabled');
    }
  }
}

async function startNewSession(emit = true) {
  stopLogReader();
  setDefaultHuntingSet();

  session.emitter.removeAllListeners();
  session = await Session.Create();
  session.setHuntingSet(activeHuntingSet);
  session.emitter.on('session-updated', sessionForcedUpdate);
  session.emitter.on('session-time-updated', sessionTimeUpdated);

  if (emit) {
    mainWindow.webContents.send('session-new', session.getData());

    if (overlayWindow) {
      overlayWindow.webContents.send('session-new', session.getData());
    }
  }
}

function startNewInstance(emit = true) {
  stopLogReader();
  setDefaultHuntingSet();

  if (session) {
    session.createNewInstance();
    session.setHuntingSet(activeHuntingSet);

    if (emit) {
      mainWindow.webContents.send('instance-new', session.getData());

      if (overlayWindow) {
        overlayWindow.webContents.send('instance-new', session.getData());
      }
    }
  }
}

// Logger Events

logReader.on('logger-status-changed', () => {
  if (logReader.active) {
    session.startTimer();
  } else {
    session.stopTimer();
  }

  mainWindow.webContents.send('logger-status-changed', logReader.active ? 'enabled' : 'disabled');

  if (overlayWindow) {
    overlayWindow.webContents.send('logger-status-changed', logReader.active ? 'enabled' : 'disabled');
  }
});

// Ipc Events

ipcMain.on('show-settings', () => {
  if (mainWindow) {
    mainWindow.webContents.send('goto', 'settings');
  }
});

ipcMain.on('check-updates', () => {
  checkForUpdates(true);
});

ipcMain.on('goto-wiki-weapontool', () => {
  shell.openExternal('http://www.entropiawiki.com/WeaponCompareV2.aspx');
});

ipcMain.on('goto-shortcut-guide', () => {
  shell.openExternal('https://entropiatally.github.io/keyboard-shortcuts/');
});

ipcMain.on('goto-css-guide', () => {
  shell.openExternal('https://entropiatally.github.io/overlay/');
});

ipcMain.on('logging-status-toggle', () => {
  if (logReader) {
    if (!logReader.active) {
      logReader.on('event', receivedLoggerEvent);
      logReader.start();
    } else {
      logReader.removeListener('event', receivedLoggerEvent);
      logReader.stop();
    }
  }
});

ipcMain.on('overlay-window-toggle', async () => {
  if (overlayWindow) {
    overlayWindow.destroy();
  } else {
    overlayWindow = await createOverlayWindow();
  }
});

ipcMain.on('new-session', startNewSession);

ipcMain.on('new-instance', startNewInstance);

ipcMain.on('load-instance', async (_event, { sessionId, instanceId }) => {
  if (logReader) {
    logReader.stop();
    logReader.removeListener('event', receivedLoggerEvent);
    mainWindow.webContents.send('logger-status-changed', 'disabled');

    if (overlayWindow) {
      overlayWindow.webContents.send('logger-status-changed', 'disabled');
    }
  }

  if (session) {
    session.emitter.removeAllListeners();
    const selectedInstanceId = (instanceId === 'new') ? null : instanceId;
    session = await Session.Load(sessionId, selectedInstanceId);

    if (instanceId === 'new') {
      session.createNewInstance();
      mainWindow.webContents.send('instance-new', session.getData());

      if (overlayWindow) {
        overlayWindow.webContents.send('instance-new', session.getData());
      }
    }

    session.setHuntingSet(activeHuntingSet);
    session.emitter.on('session-updated', sessionForcedUpdate);
    session.emitter.on('session-time-updated', sessionTimeUpdated);

    mainWindow.webContents.send('instance-loaded', session.getData());

    if (overlayWindow) {
      overlayWindow.webContents.send('instance-loaded', session.getData());
    }
  }
});

ipcMain.on('move-instance', async (_event, { targetSessionId, instanceId }) => {
  if (logReader) {
    logReader.stop();
    logReader.removeListener('event', receivedLoggerEvent);
    mainWindow.webContents.send('logger-status-changed', 'disabled');

    if (overlayWindow) {
      overlayWindow.webContents.send('logger-status-changed', 'disabled');
    }
  }

  if (instanceId && targetSessionId) {
    await Session.MoveInstance(instanceId, targetSessionId);

    if (session.instanceId === instanceId) {
      session = await Session.Load(targetSessionId, instanceId);
    }
  }
});

function setSelectedHuntingSet(selectedHuntingSet) {
  if (session) {
    activeHuntingSet = selectedHuntingSet;
    session.setHuntingSet(selectedHuntingSet);

    const updatedSettings = getSettings();
    mainWindow.webContents.send('settings-updated', updatedSettings);

    if (overlayWindow) {
      overlayWindow.webContents.send('settings-updated', updatedSettings);
    }
  }
}

ipcMain.on('change-hunting-set', (_event, selectedHuntingSet) => {
  setSelectedHuntingSet(selectedHuntingSet);
});

ipcMain.handle('export-instance', async (_event, { sessionId, instanceId }) => {
  const exportSession = await Session.Load(sessionId, instanceId);
  const exportData = exportSession.getData();
  const exportSheets = await exportXls(exportData);

  const options = {
    title: 'Save file',
    defaultPath: `entropia_tally_run_${exportData.instanceCreatedAt.replaceAll(' ', '_').replaceAll(':', '')}.xls`,
    buttonLabel: 'Save',

    filters: [
      {name: 'Excel (xls)', extensions: ['xls']},
      {name: 'All Files', extensions: ['*']},
    ],
  };

  return dialog.showSaveDialog(null, options)
    .then(({ filePath }) => {
      const buffer = xlsx.build(exportSheets);
      fs.writeFileSync(filePath, buffer, 'utf-8');
    })
    .then(() => true)
    .catch(() => false);
});

// Ipc Events with response

ipcMain.handle('select-logfile', async () => {
  const file = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'Log files', extensions: ['log'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  });

  if (file.canceled) {
    return false;
  }

  config.set('log', file.filePaths[0]);
  logReader.setLogFile(file.filePaths[0]);

  return getSettings();
});

ipcMain.handle('get-data', async (_event, { dataType, args }) => {
  let response;
  let loadedSession;

  switch (dataType) {
    case 'settings':
      response = getSettings();
      break;
    case 'logreader-status':
      response = logReader && logReader.active ? 'enabled' : 'disabled';
      break;
    case 'active-session':
      response = session ? session.getData() : {};
      break;
    case 'session':
      loadedSession = await Session.Load(args.id, args?.instanceId);
      response = loadedSession.getData();
      break;
    case 'sessions':
      response = await Session.FetchAll();
      break;
    case 'instances':
      response = await Session.FetchInstances(args.id);
      break;
    case 'overlay-window-status':
      response = overlayWindow && overlayWindow.isVisible() ? 'enabled' : 'disabled';
      break;
    case 'development-mode':
      response = is.development;
      break;
    default:
  }

  return response;
});

ipcMain.handle('set-data', async (_event, data) => {
  let response;

  if (data.type === 'settings') {
    for (const setting of data.values) {
      config.set(setting.name, setting.value);
      if (setting.name === 'avatarName') {
        logReader.setAvatarName(setting.value);
      } else if (setting.name === 'logReadAll') {
        logReader.updateReadFullLogStatus(setting.value);
      } else if (setting.name === 'overlay' && overlayWindow && setting?.value?.opacity) {
        overlayWindow.setOpacity(Number(setting.value.opacity));
      } else if (setting.name === 'ignoreLoot') {
        customIgnoreList = config.get('ignoreLoot', []);
      }
    }

    response = getSettings();

    mainWindow.webContents.send('settings-updated', response);
    if (overlayWindow) {
      overlayWindow.webContents.send('settings-updated', response);
    }
  } else if (data.type === 'active-session') {
    const sessionData = await session.setData(data.values);
    mainWindow.webContents.send('session-updated', sessionData);

    if (overlayWindow) {
      overlayWindow.webContents.send('session-updated', sessionData);
    }
  }

  return response;
});

ipcMain.handle('set-session-notes', async (_event, notes) => {
  await session.setNotes(notes);
});

ipcMain.handle('set-hunting-sets', (_event, sets) => {
  let response = false;
  const currentSavedSets = config.get('huntingSets', []);

  try {
    const updatedSets = sets.map(set => {
      set.id = set.id ? set.id : uuidv4();
      if (set.default === undefined) {
        const wasDefault = currentSavedSets.find(originalSet => originalSet.id === set.id)?.default;
        if (wasDefault !== null) {
          set.default = wasDefault;
        }
      }

      set.default = (set.default !== undefined) ? set.default : false;
      return set;
    });

    const confirmActiveHuntingSet = updatedSets.find(set => set.id === activeHuntingSet?.id);

    config.set('huntingSets', updatedSets);

    // Active set has been removed, set default
    if (!confirmActiveHuntingSet) {
      setDefaultHuntingSet();
      if (session) {
        session.setHuntingSet(activeHuntingSet);
      }
    }

    response = true;
  } catch (error) {
    console.error(error);
  }

  const updatedSettings = getSettings();
  mainWindow.webContents.send('settings-updated', updatedSettings);

  if (overlayWindow) {
    overlayWindow.webContents.send('settings-updated', updatedSettings);
  }

  registerShortcuts();

  return response;
});

ipcMain.handle('delete', async (_event, { type, id }) => {
  let status = false;
  const currentSessionData = session ? session.getData(false) : null;

  if (type === 'session') {
    status = await Session.Delete(id);
  } else if (type === 'instance') {
    status = await Session.DeleteInstance(id);
  }

  if (status.success) {
    if (currentSessionData) {
      if (type === 'session' && currentSessionData.id === id) {
        startNewSession(false);
      } else if (type === 'instance' && currentSessionData.instanceId === id) {
        startNewInstance(false);
      }
    }

    mainWindow.webContents.send(`${type}-deleted`, status);

    if (overlayWindow) {
      overlayWindow.webContents.send(`${type}-deleted`, status);
    }
  }

  return status.success;
});

(async () => {
  await app.whenReady();

  session = await Session.Create();
  session.setHuntingSet(activeHuntingSet);
  session.emitter.on('session-updated', sessionForcedUpdate);
  session.emitter.on('session-time-updated', sessionTimeUpdated);

  setTimeout(() => {
    registerShortcuts();
  }, 1000);

  Menu.setApplicationMenu(menu);
  mainWindow = await createMainWindow();
})();
