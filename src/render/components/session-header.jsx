import React, { useEffect, useState, useCallback } from 'react';

const SessionHeader = () => {
  const [isLogRunning, setIsLogRunning] = useState(false);
  const [sessionNameActive, setSessionNameActive] = useState(false);
  const [sessionName, setSessionName] = useState('');

  useEffect(() => {
    const resetCurrentSession = sessionData => {
      setSessionName(sessionData.sessionName);
      setSessionNameActive(false);
    };

    const onSessionUpdated = sessionData => {
      setSessionName(sessionData.sessionName);
    };

    const updateLogStatus = status => setIsLogRunning(status === 'enabled');

    const removeLoggerListener = window.api.on('logger-status-changed', updateLogStatus);
    const removeSessionUpdateListener = window.api.on('session-updated', onSessionUpdated);
    const removeSessionNewListener = window.api.on('session-new', resetCurrentSession);
    const removeInstanceNewListener = window.api.on('instance-new', resetCurrentSession);
    const removeInstanceLoadedListener = window.api.on('instance-loaded', resetCurrentSession);

    window.api.get('active-session').then(onSessionUpdated);
    window.api.get('logreader-status').then(updateLogStatus);

    return () => {
      removeLoggerListener();
      removeSessionUpdateListener();
      removeSessionNewListener();
      removeInstanceNewListener();
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
          className={`button is-small ${isLogRunning ? 'is-danger' : 'is-warning'}`}
          type="button"
          onClick={toggleLogging}
        >
          {isLogRunning ? 'Pause logging' : 'Start logging'}
        </button>
      </div>
    </div>
  );
};

export default SessionHeader;
