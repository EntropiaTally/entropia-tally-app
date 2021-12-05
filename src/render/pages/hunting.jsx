import React, { useEffect, useState, useCallback } from 'react';

import HuntingMenu from '../components/hunting-menu';
import Current from './hunting/current';
import History from './hunting/history';

const Hunting = () => {
  const [isLogReaderActive, setIsLogReaderActive] = useState(false);
  const [isSessionModalActive, setIsSessionModalActive] = useState(false);
  const [isInstanceModalActive, setIsInstanceModalActive] = useState(false);
  const [activeSection, setActiveSection] = useState('current');
  const [sidebarFull, setSidebarFull] = useState(false);
  const [activeSession, setActiveSession] = useState({ id: null, instanceId: null });

  useEffect(() => {
    const sessionNewData = newSessionData => {
      setActiveSession({ id: newSessionData?.id, instanceId: newSessionData?.instanceId });
    };

    const removeLoggerListener = window.api.on('logger-status-changed', status => {
      setIsLogReaderActive(status === 'enabled');
    });

    const removeSessionNewLoggerListener = window.api.on('session-new', sessionNewData);
    const removeInstanceNewLoggerListener = window.api.on('instance-new', sessionNewData);

    window.api.get('active-session').then(sessionNewData);

    window.api.get('logreader-status').then(status => {
      setIsLogReaderActive(status === 'enabled');
    });

    window.api.get('settings').then(settings => {
      setSidebarFull(settings?.sidebarStyle === 'full');
    });

    return () => {
      removeLoggerListener();
      removeSessionNewLoggerListener();
      removeInstanceNewLoggerListener();
    };
  }, []);

  const startNewSession = useCallback(() => {
    window.api.call('new-session');
    setIsSessionModalActive(false);
    setActiveSection('current');
  }, []);

  const startNewInstance = useCallback(() => {
    window.api.call('load-instance', {
      sessionId: activeSession?.id,
      instanceId: 'new',
    });
    setIsInstanceModalActive(false);
    setActiveSection('current');
  }, [activeSession?.id]);

  const loadSessionInstance = useCallback((sessionId, instanceId) => {
    window.api.call('load-instance', { sessionId, instanceId });
    setIsSessionModalActive(false);
    setActiveSection('current');
  }, []);

  const toggleStreamWindow = useCallback(() => {
    window.api.call('stream-window-toggle');
  }, []);

  const toggleSidebar = useCallback(() => {
    const newStyle = sidebarFull ? 'mini' : 'full';
    window.api.set('settings', [{ name: 'sidebarStyle', value: newStyle }]).then(settings => {
      setSidebarFull(settings?.sidebarStyle === 'full');
    });
  }, [sidebarFull]);

  return (
    <>
      <div className={`sidebar has-background-grey-darker${sidebarFull ? '' : ' mini'}`}>
        <HuntingMenu
          active={activeSection}
          isLogReaderActive={isLogReaderActive}
          setActivePage={setActiveSection}
          openNewSessionModal={() => setIsSessionModalActive(true)}
          openNewInstanceModal={() => setIsInstanceModalActive(true)}
          toggleStreamWindow={() => toggleStreamWindow()}
          toggleSidebar={() => toggleSidebar()}
        />
      </div>

      <div className="main-content with-sidebar">
        {activeSection === 'current' && <Current isLogReaderActive={isLogReaderActive} />}
        {activeSection === 'history' && <History loadSessionInstance={loadSessionInstance} />}
      </div>

      <div className={`modal ${isSessionModalActive ? 'is-active' : ''}`}>
        <div className="modal-background" />
        <div className="modal-content">
          <div className="box">
            <div className="block">
              <h2 className="title">Start a new session</h2>
              <p>This will stop any current session.</p>
            </div>
            <div className="buttons">
              <button type="button" className="button is-danger" onClick={startNewSession}>Proceed</button>
              <button type="button" className="button" onClick={() => setIsSessionModalActive(false)}>Cancel</button>
            </div>
          </div>
        </div>
      </div>

      <div className={`modal ${isInstanceModalActive ? 'is-active' : ''}`}>
        <div className="modal-background" />
        <div className="modal-content">
          <div className="box">
            <div className="block">
              <h2 className="title">Start a new instance</h2>
              <p>This will stop any current session instance.</p>
            </div>
            <div className="buttons">
              <button type="button" className="button is-danger" onClick={() => startNewInstance()}>Proceed</button>
              <button type="button" className="button" onClick={() => setIsInstanceModalActive(false)}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hunting;
