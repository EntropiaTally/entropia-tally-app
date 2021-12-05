import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import LootView from '../../views/loot-view';
import SkillView from '../../views/skill-view';
import StatsView from '../../views/stats-view';

const Current = ({ isLogReaderActive }) => {
  const [sessionName, setSessionName] = useState('');
  const [sessionNameActive, setSessionNameActive] = useState(false);
  const [currentTab, setCurrentTab] = useState('loot');
  const [sessionData, setSessionData] = useState({});

  useEffect(() => {
    const resetCurrentSession = newSessionData => {
      setSessionData(newSessionData);
      setSessionName(newSessionData.sessionName);
      setSessionNameActive(false);
      setCurrentTab('loot');
    };

    const removeSessionListener = window.api.on('session-updated', newSessionData => {
      setSessionData({ aggregated: newSessionData.aggregated, events: newSessionData.events });
      setSessionName(newSessionData.sessionName);
    });

    const removeSessionResetListener = window.api.on('session-new', resetCurrentSession);
    const removeInstanceResetListener = window.api.on('instance-new', resetCurrentSession);
    const removeInstanceLoadedListener = window.api.on('instance-loaded', resetCurrentSession);

    window.api.get('active-session').then(newSessionData => {
      setSessionData({ aggregated: newSessionData.aggregated, events: newSessionData.events });
      setSessionName(newSessionData.sessionName);
    });

    return () => {
      removeSessionListener();
      removeSessionResetListener();
      removeInstanceResetListener();
      removeInstanceLoadedListener();
    };
  }, []);

  const toggleLogging = useCallback(() => {
    window.api.call('logging-status-toggle');
  }, []);

  const updateSessionName = useCallback(() => {
    window.api.set('active-session', { name: sessionName });
    setSessionNameActive(false);
  }, [sessionName]);

  return (
    <>
      <div />
      <div className="block level block-top">
        <div className="session-name">
          {sessionNameActive && (
            <div className="control has-icons-right">
              <input
                id="session-name"
                type="text"
                className="input is-small"
                placeholder="Enter a session name"
                defaultValue={sessionName}
                onChange={event => setSessionName(event.target.value)}
              />
              <span className="icon is-right">
                <i className="ri-check-line" onClick={() => updateSessionName()} />
              </span>
            </div>
          )}
          {!sessionNameActive && (
            <h2 className="title is-4">{sessionName ? sessionName : 'Session'} <span className="icon"><i className="ri-pencil-fill" onClick={() => setSessionNameActive(true)} /></span></h2>
          )}
        </div>
        <div>
          <button
            className={`button is-small ${isLogReaderActive ? 'is-danger' : 'is-warning'}`}
            type="button"
            onClick={toggleLogging}
          >
            {isLogReaderActive ? 'Pause logging' : 'Start logging'}
          </button>
        </div>
      </div>

      <div className="tabs">
        <ul>
          <li className={currentTab === 'loot' ? 'is-active' : ''} onClick={() => setCurrentTab('loot')}>
            <a>Loot</a>
          </li>
          <li className={currentTab === 'skills' ? 'is-active' : ''} onClick={() => setCurrentTab('skills')}>
            <a>Skills</a>
          </li>
          <li className={currentTab === 'stats' ? 'is-active' : ''} onClick={() => setCurrentTab('stats')}>
            <a>Stats</a>
          </li>
        </ul>
      </div>

      {currentTab === 'loot' && (
        <LootView
          loot={sessionData?.aggregated?.loot}
          globals={sessionData?.aggregated?.globals}
          hofs={sessionData?.aggregated?.hofs}
          rareLoot={sessionData?.aggregated?.rareLoot}
          lootEvents={sessionData?.events?.loot}
        />
      )}
      {currentTab === 'skills' && (
        <SkillView
          skills={sessionData?.aggregated?.skills}
          attributes={sessionData?.aggregated?.attributes}
        />
      )}
      {currentTab === 'stats' && (
        <StatsView
          damageInflicted={sessionData?.aggregated?.damageInflicted}
          damageInflictedCrit={sessionData?.aggregated?.damageInflictedCrit}
          damageTaken={sessionData?.aggregated?.damageTaken}
          damageTakenCrit={sessionData?.aggregated?.damageTakenCrit}
          enemyMiss={sessionData?.aggregated?.enemyMiss}
          enemyEvade={sessionData?.aggregated?.enemyEvade}
          enemyDodge={sessionData?.aggregated?.enemyDodge}
          playerDodge={sessionData?.aggregated?.playerDodge}
          playerEvade={sessionData?.aggregated?.playerEvade}
          playerDeflect={sessionData?.aggregated?.playerDeflect}
        />
      )}
    </>
  );
};

Current.defaultProps = {
  isLogReaderActive: false,
};

Current.propTypes = {
  isLogReaderActive: PropTypes.bool,
};

export default Current;
