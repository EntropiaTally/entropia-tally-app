'use strict';

const { app, dialog, shell } = require('electron');
const { autoUpdater } = require('electron-updater');
const semverGt = require('semver/functions/gt');
const pck = require('../../package.json');
const config = require('./config');

autoUpdater.autoDownload = false;

function checkLatestVersion(currentVersion) {
  const { net } = require('electron');

  return new Promise((resolve, reject) => {
    let data = '';

    const request = net.request({
      method: 'GET',
      protocol: 'https:',
      hostname: 'api.github.com',
      port: 443,
      path: `/repos/${pck.repository}/releases/latest`,
    });

    request.on('response', response => {
      response.on('data', chunk => {
        data += chunk;
      });
      response.on('error', error => reject(error));
      response.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const latestVersion = parsed?.tag_name?.replace('v', '');

          if (!parsed?.draft && latestVersion && semverGt(latestVersion, currentVersion)) {
            resolve({
              version: latestVersion,
              url: parsed?.html_url,
            });
          } else {
            reject();
          }
        } catch (error) {
          reject(error);
        }
      });
    });

    request.end();
  });
}

autoUpdater.on('update-available', updateInfo => {
  dialog.showMessageBox({
    type: 'info',
    title: 'New update available',
    message: `A new version (v${updateInfo.version}) is available!\n\rDo you want update now?`,
    buttons: ['Yes', 'No'],
  }).then(status => {
    if (status.response === 0) {
      autoUpdater.downloadUpdate();
    }
  });
});

autoUpdater.on('update-downloaded', () => {
  dialog.showMessageBox({
    title: 'Update complete',
    message: 'Application will be restarted.',
  }).then(() => {
    setImmediate(() => autoUpdater.quitAndInstall());
  });
});

function checkForUpdates(force = false) {
  const currentTime = Date.now();
  const lastUpdateCheck = config.get('lastUpdateCheck', 0);

  // Check for update, if last check date + 168h(7d) is less than current time
  if (force || (lastUpdateCheck + 604_800_000) <= currentTime) {
    if (autoUpdater.isUpdaterActive() && process.env.PORTABLE_EXECUTABLE_APP_FILENAME === undefined) {
      autoUpdater.checkForUpdates();
    } else {
      app.whenReady().then(() => {
        checkLatestVersion(app.getVersion()).then(({ version, url }) => {
          dialog.showMessageBox({
            type: 'info',
            title: 'Update',
            message: `A new version (v${version}) is available!\n\rDo you want to check it out?`,
            buttons: ['Yes', 'No'],
          }).then(status => {
            if (status.response === 0) {
              shell.openExternal(url);
            }
          });
        }).catch(() => {
          console.log('NO NEW VERSION FOUND');
        });
      });
    }

    config.set('lastUpdateCheck', currentTime);
  }
}

module.exports = checkForUpdates;
