import React, { useEffect, useState } from 'react';

import Sidebar from '../components/sidebar';
import Current from './hunting/current';
import History from './hunting/history';

const Hunting = () => {
  const [activeSection, setActiveSection] = useState('current');

  useEffect(() => {
    const sessionChange = () => {
      setActiveSection('current');
    };

    const removeSessionNewListener = window.api.on('session-new', sessionChange);
    const removeInstanceNewListener = window.api.on('instance-new', sessionChange);
    const removeInstanceLoadedListener = window.api.on('instance-loaded', sessionChange);

    return () => {
      removeSessionNewListener();
      removeInstanceNewListener();
      removeInstanceLoadedListener();
    };
  }, []);

  return (
    <>
      <Sidebar
        active={activeSection}
        setActivePage={setActiveSection}
      />

      <div className="main-content with-sidebar">
        {activeSection === 'current' && <Current />}
        {activeSection === 'history' && <History />}
      </div>
    </>
  );
};

export default Hunting;
