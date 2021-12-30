import React, { useState, useEffect } from 'react';

const pad = str => str < 10 ? `0${str}` : str;

function formatTime(seconds) {
  const values = {
    hours: pad(Math.max(Math.floor(seconds / 3600) % 24, 0)),
    minutes: pad(Math.max(Math.floor(seconds / 60) % 60, 0)),
    seconds: pad(Math.max(Math.floor(seconds % 60), 0))
  };

  return `${values.hours}:${values.minutes}:${values.seconds}`;
}

function formatPED(value) {
  return `${value.toFixed(2)} PED`;
}

const Overlay = () => {
  const [settings, setSettings] = useState(null);
  const [data, setData] = useState(null);

  function updateData(newData) {
    setData({
      ...data,
      totalLoot: newData.aggregated.allLoot.total,
      totalSpend: 5.00, // TODO
      returnPercent: 90.5, // TODO
      numGlobals: 5, // TODO,
      numHofs: 10, // TODO,
      hitPercent: 95.5, // TODO
      evadePercent: 30.2, // TODO
      sessionTime: 500, // TODO
    });
  }

  useEffect(() => {
    window.api.on('instance-loaded', console.log);
    window.api.on('session-updated', updateData);
    window.api.on('session-data-updated', updateData);

    window.api.on('settings-updated', newSettings => {
      setSettings(newSettings.overlay);
    });

    window.api.get('settings').then(newSettings => {
      setSettings(newSettings.overlay);
    });
  }, []);

  if (!settings || !data) {
    return null;
  }

  return (
    <div className="overlay p-2">
      {settings.lootTotal &&
        <div className="overlay__item overlay__totalLoot">
          <div className="overlay__label">Total loot</div>
          <div className="overlay__value">{formatPED(data.totalLoot)}</div>
        </div>
      }

      {settings.spendTotal &&
        <div className="overlay__item overlay__totalSpend">
          <div className="overlay__label">Total spent</div>
          <div className="overlay__value">{formatPED(data.totalSpend)}</div>
        </div>
      }

      {settings.returnPercent &&
        <div className="overlay__item overlay__returnPercent">
          <div className="overlay__label">Returns</div>
          <div className="overlay__value">{data.returnPercent.toFixed(2)}%</div>
        </div>
      }

      {settings.numGlobals &&
        <div className="overlay__item overlay__numGlobals">
          <div className="overlay__label">Globals</div>
          <div className="overlay__value">{data.numGlobals}</div>
        </div>
      }

      {settings.numHofs &&
        <div className="overlay__item overlay__numHofs">
          <div className="overlay__label">HoFs</div>
          <div className="overlay__value">{data.numHofs}</div>
        </div>
      }

      {settings.hitPercent &&
        <div className="overlay__item overlay__hitPercent">
          <div className="overlay__label">Hit%</div>
          <div className="overlay__value">{data.hitPercent}%</div>
        </div>
      }

      {settings.evadePercent &&
        <div className="overlay__item overlay__evadePercent">
          <div className="overlay__label">Evade%</div>
          <div className="overlay__value">{data.evadePercent}%</div>
        </div>
      }

      {settings.sessionTime &&
        <div className="overlay__item overlay__sessionTime">
          <div className="overlay__label">Session time</div>
          <div className="overlay__value">{formatTime(data.sessionTime)}</div>
        </div>
      }
    </div>
  );
};

export default Overlay;
