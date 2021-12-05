import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

let delay;

const AvatarName = ({ currentAvatarName, updateAvatarName }) => {
  const onAvatarNameChanged = useCallback(event => {
    if (delay) {
      clearTimeout(delay);
    }

    delay = setTimeout(() => {
      if (currentAvatarName !== event.target.value) {
        updateAvatarName(event.target.value);
      }
    }, 500);
  }, [currentAvatarName, updateAvatarName]);

  return (
    <div className="box block">
      <h3 className="title">Avatar</h3>
      <div className="field">
        <label className="label">
          Avatar name
        </label>
        <div className="control">
          <input
            type="text"
            className="input"
            placeholder="Firstname Middlename Lastname"
            defaultValue={currentAvatarName}
            onChange={onAvatarNameChanged}
            onBlur={onAvatarNameChanged}
          />
        </div>
        <p className="help">Full avatar name. Used to correctly track Globals, HoFs and Rare Loot.</p>
      </div>
    </div>
  );
};

AvatarName.propTypes = {
  currentAvatarName: PropTypes.string,
  updateAvatarName: PropTypes.func,
};

export default AvatarName;
