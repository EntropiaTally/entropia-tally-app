import React from 'react';
import PropTypes from 'prop-types';

const OVERLAY_TOGGLES = [
  { label: 'Total loot (PED)', key: 'lootTotal', default: false },
  { label: 'Total spent (PED)', key: 'spendTotal', default: false },
  { label: 'Returns (%)', key: 'returnPercent', default: false },
  { label: 'Global count', key: 'numGlobals', default: false },
  { label: 'HoF count', key: 'numHofs', default: false },
  { label: 'Hit rate (%)', key: 'hitPercent', default: false },
  { label: 'Evade rate (%)', key: 'evadePercent', default: false },
  { label: 'Session time', key: 'sessionTime', default: false },
];

const OverlaySettings = ({ settings, onChange }) => {
  const handleChange = (key, value) => {
    onChange({ ...settings, [key]: value });
  }

  const items = OVERLAY_TOGGLES.map((toggle, index) =>
    <div className="control" key={index}>
      <label className="label">
        <input
          type="checkbox"
          className="checkbox mr-2"
          checked={settings?.[toggle.key] ?? toggle.default}
          onChange={evt => handleChange(toggle.key, evt.target.checked)}
        />
        {toggle.label}
      </label>
    </div>
  );

  return (
    <div className="box block">
      <h3 className="title">Overlay</h3>

      {items}
    </div>
  );
};

export default OverlaySettings;
