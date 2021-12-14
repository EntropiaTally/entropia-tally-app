'use strict';

const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const path = require('path');
const { is } = require('electron-util');
const unhandled = require('electron-unhandled');
const debug = require('electron-debug');
const contextMenu = require('electron-context-menu');

const config = require('./config');
const menu = require('./menu');
const checkForUpdates = require('./updater');
const Session = require('./session');
const LogReader = require('./log-reader');

let mainWindow;
let streamWindow;
let session;

unhandled();
debug();
contextMenu();

// Note: Must match `build.appId` in package.json
app.setAppUserModelId('com.Entropia-Tracker.entropia-tracker');

if (!is.development) {
  checkForUpdates();
}

const logReader = new LogReader(config.get('log'), config.get('avatarName'));
const assetPath = is.development ? app.getAppPath() : process.resourcesPath;

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
  });

  await win.loadFile(path.resolve(app.getAppPath(), 'public/index.html'));

  return win;
};

const createStreamWindow = async parent => {
  const win = new BrowserWindow({
    parent,
    title: `${app.name} - Stream`,
    frame: false,
    show: false,
    width: 250,
    height: 100,
    resizable: true,
    alwaysOnTop: true,
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
    streamWindow = undefined;
  });

  await win.loadFile(path.resolve(app.getAppPath(), 'public/stream.html'));

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

(async () => {
  await app.whenReady();
  session = await Session.Create();
  Menu.setApplicationMenu(menu);
  mainWindow = await createMainWindow();
})();

// Functions

function getSettings() {
  return {
    log: config.get('log', null),
    avatarName: config.get('avatarName', null),
    sidebarStyle: config.get('sidebarStyle', 'full'),
  };
}

function receivedLoggerEvent({ data, lastLine }) {
  session.newEvent(data, lastLine).then(() => {
    // Only send the complete package
    if (lastLine) {
      const sessionData = session.getData();

      mainWindow.webContents.send('session-data-updated', sessionData);
      mainWindow.webContents.send('session-data-updated-aggregated', sessionData?.aggregated);
      mainWindow.webContents.send('session-data-updated-events', sessionData?.events);

      if (streamWindow && streamWindow.isVisible()) {
        streamWindow.webContents.send('session-data-updated', sessionData);
        streamWindow.webContents.send('session-data-updated-aggregated', sessionData?.aggregated);
        streamWindow.webContents.send('session-data-updated-events', sessionData?.events);
      }
    }
  });
}

function stopLogReader() {
  if (logReader) {
    logReader.stop();
    logReader.removeListener('event', receivedLoggerEvent);
    mainWindow.webContents.send('logger-status-changed', 'disabled');
  }
}

async function startNewSession(emit = true) {
  stopLogReader();

  session = await Session.Create();
  if (emit) {
    mainWindow.webContents.send('session-new', session.getData());
  }
}

function startNewInstance(emit = true) {
  stopLogReader();

  if (session) {
    session.createNewInstance();
    if (emit) {
      mainWindow.webContents.send('instance-new', session.getData());
    }
  }
}

// Logger Events

logReader.on('logger-status-changed', () => {
  mainWindow.webContents.send('logger-status-changed', logReader.active ? 'enabled' : 'disabled');
});

// Ipc Events

ipcMain.on('show-settings', () => {
  if (mainWindow) {
    mainWindow.webContents.send('goto', 'settings');
  }
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

ipcMain.on('stream-window-toggle', () => {
  if (!streamWindow) {
    createStreamWindow(mainWindow).then(newWindow => {
      streamWindow = newWindow;
    });
  } else if (streamWindow && streamWindow.isVisible()) {
    streamWindow.close();
  }
});

ipcMain.on('new-session', startNewSession);

ipcMain.on('new-instance', startNewInstance);

ipcMain.on('load-instance', async (_event, { sessionId, instanceId }) => {
  if (logReader) {
    logReader.stop();
    logReader.removeListener('event', receivedLoggerEvent);
    mainWindow.webContents.send('logger-status-changed', 'disabled');
  }

  if (session) {
    const selectedInstanceId = (instanceId === 'new') ? null : instanceId;
    session = await Session.Load(sessionId, selectedInstanceId);
    if (instanceId === 'new') {
      session.createNewInstance();
      mainWindow.webContents.send('instance-new', session.getData());
    }

    mainWindow.webContents.send('instance-loaded', session.getData());
  }
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
    case 'stream-window-status':
      response = streamWindow && streamWindow.isVisible() ? 'enabled' : 'disabled';
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
      }
    }

    response = getSettings();
  } else if (data.type === 'active-session') {
    const sessionData = await session.setData(data.values);
    mainWindow.webContents.send('session-updated', sessionData);
  }

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
  }

  return status.success;
});
