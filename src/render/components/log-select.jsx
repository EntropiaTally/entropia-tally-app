import React from 'react';
import PropTypes from 'prop-types';

const LogSelect = ({ currentLog, selectLog }) => (
  <div className="box block">
    <h3 className="title">System</h3>
    <div className="field">
      <div className="control level">
        <button className="button is-small is-info" type="button" onClick={selectLog}>Select log file</button>
        <code className="current-log">{currentLog}</code>
      </div>
      <p className="help">Select the Entropia Universe <code>chat.log</code> file.</p>
    </div>
  </div>
);

LogSelect.propTypes = {
  currentLog: PropTypes.string,
  selectLog: PropTypes.func,
};

export default LogSelect;
