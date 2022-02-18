const pad = string_ => string_ < 10 ? `0${string_}` : string_;

export const formatTime = seconds => {
  const values = {
    hours: pad(Math.max(Math.floor(seconds / 3600), 0)),
    minutes: pad(Math.max(Math.floor(seconds / 60) % 60, 0)),
    seconds: pad(Math.max(Math.floor(seconds % 60), 0)),
  };

  return `${values.hours}:${values.minutes}:${values.seconds}`;
};

export const formatPED = value => `${value.toFixed(2)} PED`;
