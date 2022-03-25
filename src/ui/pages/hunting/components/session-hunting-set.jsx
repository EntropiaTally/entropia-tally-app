import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

const SessionHuntingSet = ({ sets, activeSet }) => {
  const [selectedSet, setSelectedSet] = useState(null);

  const changeActiveSet = useCallback(event => {
    const newSet = sets.find(set => set.id === event.target.value);
    if (newSet) {
      setSelectedSet(newSet.id);
      window.api.call('change-hunting-set', newSet);
    }
  }, [sets]);

  useEffect(() => {
    setSelectedSet(activeSet);
  }, [activeSet]);

  if (!sets || !activeSet || !selectedSet) {
    return null;
  }

  return (
    <div className="block">
      <div className="field flex-center">
        <label className="label inline-label">Weapon set</label>
        <div className="control flex-1 threequarterwidth">
          <div className="select is-small">
            <select value={selectedSet} onChange={changeActiveSet}>
              {sets && sets.map(set => (
                <option key={set.id} value={set.id}>{set.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

SessionHuntingSet.propTypes = {
  sets: PropTypes.array,
  activeSet: PropTypes.string,
};

export default SessionHuntingSet;
