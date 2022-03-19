import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const OVERLAY_TOGGLES = [
  { label: 'Start/stop logging', key: 'loggingToggle', default: false },
  { label: 'Session time', key: 'sessionTime', default: false },
  { label: 'Include logging toggle', key: 'sessionTimeToggle', default: false, subOption: true },
  { label: 'Active hunting set', key: 'huntingSet', default: false },
  { label: 'Total loot (PED)', key: 'lootTotal', default: false },
  { label: 'Total spent (PED)', key: 'spendTotal', default: false },
  { label: 'Returns (PED)', key: 'returnTotal', default: false },
  { label: 'Returns (%)', key: 'returnPercent', default: false },
  { label: 'Global count', key: 'numGlobals', default: false },
  { label: 'HoF count', key: 'numHofs', default: false },
  { label: 'Kill count (requires \'Show kill count\' to be enabled)', key: 'killCount', default: false },
  { label: 'Hit rate (%)', key: 'hitPercent', default: false },
  { label: 'Evade rate (%)', key: 'evadePercent', default: false },
  { label: 'Avg. loot size (requires \'Show kill count\' to be enabled)', key: 'avgLootValue', default: false },
  { label: 'Avg. kill cost (requires \'Show kill count\' to be enabled)', key: 'avgKillCost', default: false },
];

const OverlaySettings = ({ settings, onChange }) => {
  const [customCss, setCustomCss] = useState('');

  useEffect(() => {
    setCustomCss(settings?.customCss);
  }, [settings?.customCss]);

  const handleChange = (key, value) => {
    onChange({ ...settings, [key]: value });
  };

  const items = OVERLAY_TOGGLES.map(toggle => (
    <div key={toggle.key} className={`control${toggle?.subOption ? ' pl-5' : ''}`}>
      <label className="checkbox">
        <input
          type="checkbox"
          className="checkbox mr-2"
          checked={settings?.[toggle.key] ?? toggle.default}
          onChange={evt => handleChange(toggle.key, evt.target.checked)}
        />
        {toggle.label}
      </label>
    </div>
  ));

  return (
    <div className="box block">
      <h3 className="title">Overlay</h3>

      <div className="block">{items}</div>

      <div className="block">
        <label className="label">Opacity (Windows only)</label>
        <input type="range" min="0.1" max="1.0" step="0.1" className="fullwidth" value={settings?.opacity ?? 1} onChange={event => handleChange('opacity', event.target.value)} />
      </div>

      <div className="control">
        <label className="label">Custom CSS - <a onClick={() => window.api.call('goto-css-guide')}>Guide</a></label>
        <textarea className="textarea w-full" value={customCss} onChange={event => setCustomCss(event.target.value)} />
        <button type="button" className="button is-small is-info mt-2" onClick={() => handleChange('customCss', customCss)}>Save styles</button>
      </div>
    </div>
  );
};

OverlaySettings.defaultProps = {
  settings: {},
};

OverlaySettings.propTypes = {
  settings: PropTypes.object,
  onChange: PropTypes.func.isRequired,
};

export default OverlaySettings;
