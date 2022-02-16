import React from 'react';
import PropTypes from 'prop-types';

const StatBox = ({ title, value, suffix }) => (
  <div className="tile is-parent">
    <div className="statbox notification">
      <div>
        <h5 className="title">{title}</h5>
        <div>
          {suffix ? (
            <span className="sum">{value}</span>
          ) : (value)} {suffix}
        </div>
      </div>
    </div>
  </div>
);

StatBox.defaultProps = {
  title: '',
  value: '',
  suffix: null,
};

StatBox.propTypes = {
  title: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  suffix: PropTypes.any,
};

export default StatBox;
