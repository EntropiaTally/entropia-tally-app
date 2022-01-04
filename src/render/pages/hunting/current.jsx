import React, { useEffect, useState } from 'react';

import SessionHeader from '../../components/session-header';
import SessionHuntingSet from '../../components/session-hunting-set';
import LootView from '../../views/loot-view';
import SkillView from '../../views/skill-view';
import StatsView from '../../views/stats-view';
import MiscView from '../../views/misc-view';
import CalcView from '../../views/calc-view';
import NotesView from '../../views/notes-view';

const Current = () => {
  const [currentTab, setCurrentTab] = useState('loot');
  const [avatarName, setAvatarName] = useState('none');
  const [huntingSets, setHuntingSets] = useState([]);
  const [activeHuntingSet, setActiveHuntingSet] = useState(null);

  useEffect(() => {
    const resetCurrentSession = () => {
      setCurrentTab('loot');
    };

    const updateSettings = settings => {
      setHuntingSets(settings?.huntingSets);
      setActiveHuntingSet(settings?.activeHuntingSet);
      setAvatarName(settings?.avatarName);
    };

    window.api.get('settings').then(updateSettings);

    const removeSessionNewListener = window.api.on('session-new', resetCurrentSession);
    const removeInstanceNewListener = window.api.on('instance-new', resetCurrentSession);
    const removeInstanceLoadedListener = window.api.on('instance-loaded', resetCurrentSession);
    const removeSettingsUpdatedListener = window.api.on('settings-updated', updateSettings);

    return () => {
      removeSessionNewListener();
      removeInstanceNewListener();
      removeInstanceLoadedListener();
      removeSettingsUpdatedListener();
    };
  }, []);

  return (
    <>
      <SessionHeader />

      <SessionHuntingSet sets={huntingSets} activeSet={activeHuntingSet} />

      <div className="tabs">
        <ul>
          <li className={currentTab === 'loot' ? 'is-active' : ''}>
            <a onClick={() => setCurrentTab('loot')}>Loot</a>
          </li>
          <li className={currentTab === 'skills' ? 'is-active' : ''}>
            <a onClick={() => setCurrentTab('skills')}>Skills</a>
          </li>
          <li className={currentTab === 'stats' ? 'is-active' : ''}>
            <a onClick={() => setCurrentTab('stats')}>Stats</a>
          </li>
          <li className={currentTab === 'misc' ? 'is-active' : ''}>
            <a onClick={() => setCurrentTab('misc')}>Misc</a>
          </li>
          <li className={currentTab === 'calc' ? 'is-active' : ''}>
            <a onClick={() => setCurrentTab('calc')}>Returns</a>
          </li>
          <li className={currentTab === 'notes' ? 'is-active' : ''}>
            <a onClick={() => setCurrentTab('notes')}>Notes</a>
          </li>
        </ul>
      </div>

      {currentTab === 'loot' && <LootView />}
      {currentTab === 'skills' && <SkillView />}
      {currentTab === 'stats' && <StatsView avatarName={avatarName} />}
      {currentTab === 'misc' && <MiscView />}
      {currentTab === 'calc' && <CalcView />}
      {currentTab === 'notes' && <NotesView />}
    </>
  );
};

export default Current;
