import React, { useEffect, useState, useCallback } from 'react';

import Sidebar from '../components/sidebar';
import Current from './hunting/current';
import History from './hunting/history';

const Hunting = () => {
  const [activeSection, setActiveSection] = useState('current');

  useEffect(() => {
    const sessionChange = () => {
      setActiveSection('current');
    };

    const removeSessionNewLoggerListener = window.api.on('session-new', sessionChange);
    const removeInstanceNewLoggerListener = window.api.on('instance-new', sessionChange);
    const removeInstanceLoadedLoggerListener = window.api.on('instance-loaded', sessionChange);

    return () => {
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
        {activeSection === 'current' && <Current />}
        {activeSection === 'history' && <History loadSessionInstance={loadSessionInstance} />}
      </div>
    </>
  );
};

export default Hunting;
