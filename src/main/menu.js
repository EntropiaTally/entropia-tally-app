'use strict';

const path = require('path');
const { app, Menu, shell, ipcMain } = require('electron');
const {
  is,
  aboutMenuItem,
  openUrlMenuItem,
  openNewGitHubIssue,
  debugInfo,
} = require('electron-util');
const config = require('./config');

const assetPath = is.development ? app.getAppPath() : process.resourcesPath;

const showPreferences = () => {
  ipcMain.emit('show-settings', true);
};

const helpSubmenu = [
  openUrlMenuItem({
    label: 'Website',
    url: 'https://github.com/EntropiaTally/entropia-tally-app',
  }),
  {
    label: 'Check for updates',
    click() {
      ipcMain.emit('check-updates', true);
    },
  },
  {
    label: 'Report an Issue…',
    click() {
      const body = `
<!-- Please describe your issue as detailed as possible and the steps to reproduce it. -->

---

${debugInfo()}`;

      openNewGitHubIssue({
        user: 'EntropiaTally',
        repo: 'entropia-tally-app',
        body,
      });
    },
  },
  {
    type: 'separator',
  },
  {
    label: 'Show Raw Config',
    click() {
      config.openInEditor();
    },
  },
  {
    label: 'Show App Data',
    click() {
      shell.showItemInFolder(app.getPath('userData'));
    },
  },
  {
    label: 'Delete Settings',
    click() {
      config.clear();
      app.relaunch();
      app.quit();
    },
  },
  {
    label: 'Delete App Data',
    click() {
      shell.trashItem(app.getPath('userData'));
      app.relaunch();
      app.quit();
    },
  },
];

if (!is.macos) {
  helpSubmenu.push(
    {
      type: 'separator',
    },
    aboutMenuItem({
      icon: path.join(assetPath, 'assets/icon.png'),
      text: 'Created by Slazor & Goosk',
    }),
  );
}

const otherTemplate = [
  {
    role: 'fileMenu',
    submenu: [
      {
        label: 'Settings',
        click() {
          showPreferences();
        },
      },
      {
        type: 'separator',
      },
      {
        role: 'quit',
      },
    ],
  },
  {
    role: 'help',
    submenu: helpSubmenu,
  },
];

const template = otherTemplate;

module.exports = Menu.buildFromTemplate(template);
