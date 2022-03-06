import React, { useEffect, useState, useCallback } from 'react';

import LogSelect from './components/log-select';
import AvatarName from './components/avatar-name';
import HuntingSets from './components/hunting-sets';
import OverlaySettings from './components/overlay-settings';

const Settings = () => {
  const [settings, setSettings] = useState({});
  const [ignoreLootValue, setIgnoreLootValue] = useState('');

  useEffect(() => {
    const removeSettingsUpdateListener = window.api.on('settings-updated', setSettings);
    window.api.get('settings').then(setSettings);

    return () => removeSettingsUpdateListener();
  }, []);

  const selectLog = useCallback(() => {
    window.api.selectLogFile().then(updatedSettings => {
      setSettings(updatedSettings);
    });
  }, []);

  const updateSettings = useCallback((name, value) => {
    window.api.set('settings', [{ name, value }]).then(updatedSettings => {
      setSettings(updatedSettings);
    });
  }, []);

  useEffect(() => {
    setIgnoreLootValue(settings?.ignoreLoot?.join('\r\n'));
  }, [settings?.ignoreLoot]);

  return (
    <div className="container">
      <div className="settings-content content">
        <div className="block block-top with-margin">
          <h2 className="title">Settings</h2>
          <LogSelect
            currentLog={settings?.log}
            selectLog={selectLog}
            isReadAllEnabled={Boolean(settings?.logReadAll)}
            updateReadAllStatus={event => {
              if (event.target.checked) {
                if (confirm('Are you sure?\n\rThis will read the entire log upon starting and may cause duplicate entries if used multiple times or on existing runs.')) { // eslint-disable-line no-alert
                  updateSettings('logReadAll', event.target.checked);
                }
              } else {
                updateSettings('logReadAll', event.target.checked);
              }
            }}
          />

          <AvatarName
            currentAvatarName={settings?.avatarName}
            updateAvatarName={avatarName => updateSettings('avatarName', avatarName)}
          />

          <div className="box block">
            <h3 className="title">Options</h3>
            <div className="control">
              <label className="checkbox">
                <input
                  type="checkbox"
                  className="checkbox mr-2"
                  checked={settings?.killCount ?? false}
                  onChange={evt => updateSettings('killCount', evt.target.checked)}
                />
                {' '}
                Show kill count (May be inaccurate, looting multiple mobs at the same time or loot lag may skew results)
              </label>
            </div>
            <div className="control">
              <label className="checkbox">
                <input
                  type="checkbox"
                  className="checkbox mr-2"
                  checked={settings?.darkMode ?? false}
                  onChange={evt => updateSettings('darkMode', evt.target.checked)}
                />
                {' '}
                Dark mode
              </label>
            </div>
          </div>

          <HuntingSets huntingSets={settings.huntingSets} />

          <OverlaySettings
            settings={settings.overlay}
            onChange={overlaySettings => updateSettings('overlay', overlaySettings)}
          />

          <div className="box block">
            <h3 className="title">Loot ignore list</h3>
            <div className="control">
              <label><small>One item per line</small></label>
              <textarea
                className="textarea"
                defaultValue={settings?.ignoreLoot?.join('\r\n')}
                onChange={evt => setIgnoreLootValue(evt.target.value)}
                onBlur={evt => setIgnoreLootValue(evt.target.value)}
              />
              <button
                type="button"
                onClick={() => updateSettings('ignoreLoot', ignoreLootValue?.split(/\r?\n/)?.filter(item => item !== ''))}
              >
                Save
              </button>
            </div>
          </div>

          <div className="block-top" />
        </div>
      </div>
    </div>
  );
};

export default Settings;
