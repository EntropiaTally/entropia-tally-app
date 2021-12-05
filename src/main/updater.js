const { app, dialog, shell } = require('electron');
const { autoUpdater } = require('electron-updater');
const semverGt = require('semver/functions/gt');
const pck = require('../../package.json');

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

function checkForUpdates() {
  if (autoUpdater.isUpdaterActive()) {
    autoUpdater.checkForUpdatesAndNotify();
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
}

module.exports = checkForUpdates;
