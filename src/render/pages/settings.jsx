import React, { useEffect, useState, useCallback } from 'react';

import LogSelect from '../components/log-select';
import AvatarName from '../components/avatar-name';
import HuntingSets from '../components/hunting-sets';

const Settings = () => {
  const [settings, setSettings] = useState({});

  useEffect(() => {
    const receivedSettings = newSettings => setSettings(newSettings);

    const removeSettingsUpdateListener = window.api.on('settings-updated', receivedSettings);

    window.api.get('settings').then(receivedSettings);

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
        </div>
      </div>
    </div>
  );
};

export default Settings;
