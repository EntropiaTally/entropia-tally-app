import React, { useEffect, useState, useCallback } from 'react';

import Sidebar from '../components/sidebar';
import Current from './hunting/current';
import History from './hunting/history';

const Hunting = () => {
  const [isLogReaderActive, setIsLogReaderActive] = useState(false);
  const [activeSection, setActiveSection] = useState('current');

  useEffect(() => {
    const sessionChange = () => {
      setActiveSection('current');
    };

    const removeLoggerListener = window.api.on('logger-status-changed', status => {
      setIsLogReaderActive(status === 'enabled');
    });

    const removeSessionNewLoggerListener = window.api.on('session-new', sessionChange);
    const removeInstanceNewLoggerListener = window.api.on('instance-new', sessionChange);
    const removeInstanceLoadedLoggerListener = window.api.on('instance-loaded', sessionChange);

    window.api.get('logreader-status').then(status => {
      setIsLogReaderActive(status === 'enabled');
    });

    return () => {
      removeLoggerListener();
      removeSessionNewLoggerListener();
      removeInstanceNewLoggerListener();
      removeInstanceLoadedLoggerListener();
    };
  }, []);

  const loadSessionInstance = useCallback((sessionId, instanceId) => {
    window.api.call('load-instance', { sessionId, instanceId });
    setActiveSection('current');
  }, []);

  return (
    <>
      <Sidebar
        active={activeSection}
        setActivePage={setActiveSection}
      />

      <div className="main-content with-sidebar">
        {activeSection === 'current' && <Current isLogReaderActive={isLogReaderActive} />}
        {activeSection === 'history' && <History loadSessionInstance={loadSessionInstance} />}
      </div>
    </>
  );
};

export default Hunting;
