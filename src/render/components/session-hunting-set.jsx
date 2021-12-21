import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

const SessionHuntingSet = ({ sets, activeSet }) => {
  const changeActiveSet = useCallback(event => {
    const newSet = sets.find(set => set.id === event.target.value);
    if (newSet) {
      window.api.call('change-hunting-set', newSet);
    }
  }, [sets]);

  if (!sets || !activeSet) {
    return null;
  }

  return (
    <div className="block">
      <div className="field">
        <label className="label">Hunting set</label>
        <div className="control">
          <div className="select is-small">
            <select defaultValue={activeSet} onChange={changeActiveSet}>
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
