import React, { useEffect, useState, useCallback } from 'react';
import LogSelect from '../components/log-select';
import AvatarName from '../components/avatar-name';

const Settings = () => {
  const [settings, setSettings] = useState({});

  useEffect(() => {
    window.api.get('settings').then(existingSettings => {
      setSettings(existingSettings);
    });
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
        </div>
      </div>
    </div>
  );
};

export default Settings;
