import React, { useEffect, useState } from 'react';
import SessionHeader from '../../components/session-header';
import LootView from '../../views/loot-view';
import SkillView from '../../views/skill-view';
import StatsView from '../../views/stats-view';

const Current = () => {
  const [currentTab, setCurrentTab] = useState('loot');

  useEffect(() => {
    const resetCurrentSession = () => {
      setCurrentTab('loot');
    };

    const removeSessionNewLoggerListener = window.api.on('session-new', resetCurrentSession);
    const removeInstanceNewLoggerListener = window.api.on('instance-new', resetCurrentSession);
    const removeInstanceLoadedLoggerListener = window.api.on('instance-loaded', resetCurrentSession);

    return () => {
      removeSessionNewLoggerListener();
      removeInstanceNewLoggerListener();
      removeInstanceLoadedLoggerListener();
    };
  }, []);

  return (
    <>
      <SessionHeader />

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
        </ul>
      </div>

      {currentTab === 'loot' && <LootView />}
      {currentTab === 'skills' && <SkillView />}
      {currentTab === 'stats' && <StatsView />}
    </>
  );
};

export default Current;
