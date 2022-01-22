import React, { useEffect, useState } from 'react';

const pad = string_ => string_ < 10 ? `0${string_}` : string_;

function formatTime(seconds) {
  const values = {
    hours: pad(Math.max(Math.floor(seconds / 3600) % 24, 0)),
    minutes: pad(Math.max(Math.floor(seconds / 60) % 60, 0)),
    seconds: pad(Math.max(Math.floor(seconds % 60), 0)),
  };

  return `${values.hours}:${values.minutes}:${values.seconds}`;
}

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
