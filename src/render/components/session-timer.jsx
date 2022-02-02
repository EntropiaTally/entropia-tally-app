import React, { useEffect, useState } from 'react';

import { formatTime } from '../utils/formatting';

const defaultTime = '00:00:00';

const SessionTimer = () => {
  const [currentTime, setCurrentTime] = useState(defaultTime);

  useEffect(() => {
    const resetTimer = () => setCurrentTime(defaultTime);

    const updateCurrentTime = data => {
      const seconds = data?.sessionTime ?? data;

      setCurrentTime(formatTime(seconds));
    };

    window.api.get('active-session').then(updateCurrentTime);

    const removeSessionTimeListener = window.api.on('session-time-updated', updateCurrentTime);
    const removeSessionNewListener = window.api.on('session-new', resetTimer);
    const removeInstanceNewListener = window.api.on('instance-new', resetTimer);

    return () => {
      removeSessionTimeListener();
      removeSessionNewListener();
      removeInstanceNewListener();
    };
  }, []);

  return (
    <div className="session-timer">
      {currentTime}
    </div>
  );
};

export default SessionTimer;
