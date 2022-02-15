import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';

import Modal from '@components/modal';

const Tag = ({ isActive }) => (
  <span className={`tag is-${isActive ? 'success' : 'danger'}`}>
    {isActive ? 'active' : 'inactive'}
  </span>
);

Tag.propTypes = {
  isActive: PropTypes.bool,
};

const MenuItem = ({ isActive, title, iconClass, onClick, children }) => (
  <a className={isActive ? 'is-active' : null} title={title} onClick={onClick}>
    {children}
    {iconClass && (<i className={iconClass} />)}
  </a>
);

MenuItem.propTypes = {
  isActive: PropTypes.bool,
  title: PropTypes.string,
  iconClass: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.any,
};

const HuntingMenu = ({ active, setActivePage, toggleSidebar }) => {
  const [isLogRunning, setIsLogRunning] = useState(false);
  const [isOverlayRunning, setIsOverlayRunning] = useState(false);
  const [isSessionModalActive, setIsSessionModalActive] = useState(false);
  const [isInstanceModalActive, setIsInstanceModalActive] = useState(false);

  useEffect(() => {
    const updateLogStatus = status => setIsLogRunning(status === 'enabled');

    const removeLogStatusListener = window.api.on('logger-status-changed', updateLogStatus);

    window.api.get('logreader-status').then(updateLogStatus);

    const removeOverlayClosedListener = window.api.on('overlay-closed', _closed => {
      setIsOverlayRunning(false);
    });

    window.api.get('overlay-window-status').then(status => setIsOverlayRunning(status === 'enabled'));

    return () => {
      removeLogStatusListener();
      removeOverlayClosedListener();
    };
  }, []);

  const startNewSession = useCallback(() => {
    window.api.call('new-session');
    setIsSessionModalActive(false);
    setActivePage('current');
  }, [setActivePage]);

  const startNewInstance = useCallback(async () => {
    window.api.call('new-instance');
    setIsInstanceModalActive(false);
    setActivePage('current');
  }, [setActivePage]);

  const toggleOverlay = () => {
    window.api.call('overlay-window-toggle');
    setIsOverlayRunning(!isOverlayRunning);
  };

  return (
    <>
      <div className="block">
        <aside className="menu">
          <h2 className="title mt-4">Hunting</h2>
          <ul className="menu-list">
            <li>
              <MenuItem isActive={active === 'current'} onClick={() => setActivePage('current')}>
                Current session <Tag isActive={isLogRunning} />
              </MenuItem>
              <ul>
                <li><MenuItem onClick={() => setIsSessionModalActive(true)}>New session</MenuItem></li>
                <li><MenuItem onClick={() => setIsInstanceModalActive(true)}>New run</MenuItem></li>
              </ul>
            </li>
            <li>
              <MenuItem isActive={active === 'history'} onClick={() => setActivePage('history')}>
                Session history
              </MenuItem>
            </li>
            <li>
              <MenuItem isActive={isOverlayRunning} onClick={() => toggleOverlay()}>
                Toggle overlay
              </MenuItem>
            </li>
          </ul>
        </aside>
        <aside className="menu-mini mt-4">
          <ul>
            <li>
              <MenuItem
                isActive={active === 'current'}
                title="Current session"
                iconClass={`ri-play-fill ${isLogRunning ? 'active' : 'inactive'}`}
                onClick={() => setActivePage('current')}
              />
            </li>
            <li>
              <MenuItem
                title="New session"
                iconClass="ri-add-line"
                onClick={() => setIsSessionModalActive(true)}
              />
            </li>
            <li>
              <MenuItem
                title="New run"
                iconClass="ri-add-circle-line"
                onClick={() => setIsInstanceModalActive(true)}
              />
            </li>
            <li>
              <MenuItem
                isActive={active === 'history'}
                title="Session history"
                iconClass="ri-history-line"
                onClick={() => setActivePage('history')}
              />
            </li>
            <li>
              <MenuItem
                isActive={isOverlayRunning}
                title="Toggle overlay"
                iconClass="ri-window-2-fill"
                onClick={() => toggleOverlay()}
              />
            </li>
          </ul>
        </aside>

        <i className="ri-arrow-left-right-line sidebar-toggle" onClick={toggleSidebar} />
      </div>
      <Modal isOpen={isSessionModalActive}>
        <div className="block">
          <h2 className="title">Start a new session</h2>
          <p>This will stop any current session.</p>
        </div>
        <div className="buttons">
          <button type="button" className="button is-danger" onClick={startNewSession}>Proceed</button>
          <button type="button" className="button" onClick={() => setIsSessionModalActive(false)}>Cancel</button>
        </div>
      </Modal>
      <Modal isOpen={isInstanceModalActive}>
        <div className="block">
          <h2 className="title">Start a new run</h2>
          <p>This will stop any current session run.</p>
        </div>
        <div className="buttons">
          <button type="button" className="button is-danger" onClick={startNewInstance}>Proceed</button>
          <button type="button" className="button" onClick={() => setIsInstanceModalActive(false)}>Cancel</button>
        </div>
      </Modal>
    </>
  );
};

HuntingMenu.propTypes = {
  active: PropTypes.string,
  setActivePage: PropTypes.func,
  toggleSidebar: PropTypes.func,
};

export default HuntingMenu;
