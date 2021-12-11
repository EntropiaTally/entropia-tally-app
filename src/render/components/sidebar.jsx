import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';

import HuntingMenu from './hunting-menu';

const Sidebar = ({ active, setActivePage }) => {
  const [sidebarStyle, setSidebarStyle] = useState('mini');

  useEffect(() => {
    window.api.get('settings').then(settings => {
      setSidebarStyle(settings?.sidebarStyle);
    });
  }, []);

  const toggleSidebar = useCallback(() => {
    window.api.set('settings', [{
      name: 'sidebarStyle',
      value: sidebarStyle === 'mini' ? 'full' : 'mini',
    }]).then(settings => setSidebarStyle(settings?.sidebarStyle));
  }, [sidebarStyle]);

  return (
    <div className={`sidebar has-background-grey-darker ${sidebarStyle}`}>
      <HuntingMenu
        active={active}
        setActivePage={setActivePage}
        toggleSidebar={toggleSidebar}
      />
    </div>
  );
};

Sidebar.propTypes = {
  active: PropTypes.string,
  setActivePage: PropTypes.func,
};

export default Sidebar;
