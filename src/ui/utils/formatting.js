const pad = string_ => string_ < 10 ? `0${string_}` : string_;

export const formatTime = (seconds, days = false) => {
  const values = {
    days: Math.max(Math.floor((seconds / 3600) / 24), 0),
    dayHours: pad(Math.max(Math.floor(seconds / 3600) % 24, 0)),
    hours: pad(Math.max(Math.floor(seconds / 3600), 0)),
    minutes: pad(Math.max(Math.floor(seconds / 60) % 60, 0)),
    seconds: pad(Math.max(Math.floor(seconds % 60), 0)),
  };

  if (days && values.days > 0) {
    const dayLabel = values.days > 1 ? 'days' : 'day';
    return `${values.days} ${dayLabel}, ${values.dayHours}:${values.minutes}:${values.seconds}`;
  }

  return `${values.hours}:${values.minutes}:${values.seconds}`;
};

export const formatPED = value => `${value.toFixed(2)} PED`;
