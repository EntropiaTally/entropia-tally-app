import React from 'react';
import PropTypes from 'prop-types';

const LogSelect = ({ currentLog, isReadAllEnabled, selectLog, updateReadAllStatus }) => (
  <div className="box block">
    <h3 className="title">System</h3>
    <div className="field">
      <div className="control level">
        <button className="button is-small is-info" type="button" onClick={selectLog}>Select log file</button>
        <code className="current-log">{currentLog}</code>
      </div>
      <p className="help">Select the Entropia Universe <code>chat.log</code> file.</p>
    </div>
    <div className="field">
      <label className="checkbox">
        <input
          type="checkbox"
          className="checkbox-center"
          checked={isReadAllEnabled}
          onChange={updateReadAllStatus}
        />
        <span className="help-inline is-warning">
          <span className="has-text-weight-bold">ADVANCED</span>: Read log from start (This can take a long time)
        </span>
      </label>
    </div>
  </div>
);

LogSelect.propTypes = {
  currentLog: PropTypes.string,
  isReadAllEnabled: PropTypes.bool,
  selectLog: PropTypes.func.isRequired,
  updateReadAllStatus: PropTypes.func.isRequired,
};

export default LogSelect;
