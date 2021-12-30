import React, { useEffect, useState, useCallback } from 'react';

import LogSelect from '../components/log-select';
import AvatarName from '../components/avatar-name';
import HuntingSets from '../components/hunting-sets';
import OverlaySettings from '../components/overlay-settings';

const Settings = () => {
  const [settings, setSettings] = useState({});

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

  return (
    <div className="container">
      <div className="settings-content content">
        <div className="block block-top with-margin">
          <h2 className="title">Settings</h2>
          <LogSelect
            currentLog={settings?.log}
            selectLog={selectLog}
          />
          <AvatarName
            currentAvatarName={settings?.avatarName}
            updateAvatarName={avatarName => updateSettings('avatarName', avatarName)}
          />

          <HuntingSets huntingSets={settings.huntingSets} />

          <OverlaySettings
            settings={settings.overlay}
            onChange={overlaySettings => updateSettings('overlay', overlaySettings)}
          />

          <div className="block-top" />
        </div>
      </div>
    </div>
  );
};

export default Settings;
