import React from 'react';
import PropTypes from 'prop-types';

const HuntingMenu = ({ active, isLogReaderActive, setActivePage, openNewSessionModal, openNewInstanceModal, toggleStreamWindow, toggleSidebar }) => (
  <div className="block">
    <aside className="menu">
      <h2 className="title has-text-white">Hunting</h2>
      <ul className="menu-list">
        <li>
          <a
            className={active === 'current' ? 'is-active' : ''}
            onClick={() => setActivePage('current')}
          >
            Current session
            {isLogReaderActive && <span className="tag is-success">active</span>}
            {!isLogReaderActive && <span className="tag is-danger">inactive</span>}
          </a>
          <ul>
            {false && (
              <li>
                <a onClick={toggleStreamWindow}>
                  Overlay
                </a>
              </li>
            )}
            <li><a onClick={openNewSessionModal}>New session</a></li>
            <li><a onClick={openNewInstanceModal}>New instance</a></li>
          </ul>
        </li>
        <li>
          <a
            className={active === 'history' ? 'is-active' : ''}
            onClick={() => setActivePage('history')}
          >
            Session history
          </a>
        </li>
      </ul>
    </aside>
    <aside className="menu-mini">
      <ul>
        <li>
          <a
            title="Current session"
            className={active === 'current' ? 'is-active' : ''}
            onClick={() => setActivePage('current')}
          >
            <i className={`ri-play-fill ${isLogReaderActive ? 'green' : 'red'}`} />
          </a>
        </li>
        <li>
          <a
            title="New session"
            onClick={openNewSessionModal}
          >
            <i className="ri-add-line"/>
          </a>
        </li>
        <li>
          <a
            title="New instance"
            onClick={openNewInstanceModal}
          >
            <i className="ri-add-circle-line"/>
          </a>
        </li>
        <li>
          <a
            title="Session history"
            className={active === 'history' ? 'is-active' : ''}
            onClick={() => setActivePage('history')}
          >
            <i className="ri-history-line" />
          </a>
        </li>
      </ul>
    </aside>

    <i className="ri-arrow-left-right-line sidebar-toggle" onClick={toggleSidebar} />
  </div>
);

HuntingMenu.propTypes = {
  active: PropTypes.string,
  isLogReaderActive: PropTypes.bool,
  setActivePage: PropTypes.func,
  openNewSessionModal: PropTypes.func,
  openNewInstanceModal: PropTypes.func,
  toggleStreamWindow: PropTypes.func,
  toggleSidebar: PropTypes.func,
};

export default HuntingMenu;
