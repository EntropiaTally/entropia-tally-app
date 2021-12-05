import React from 'react';
import PropTypes from 'prop-types';

const Table = ({ header, hasHover, children }) => (
  <table className={`table is-fullwidth ${hasHover ? 'is-hoverable' : ''}`}>
    {header && (
      <thead>
        <tr>
          {header.map(title => (
            <th key={title.toLowerCase()}>{title}</th>
          ))}
        </tr>
      </thead>
    )}
    <tbody>
      {children}
    </tbody>
  </table>
);

Table.defaultProps = {
  header: [],
  hasHover: false,
};

Table.propTypes = {
  header: PropTypes.array,
  hasHover: PropTypes.bool,
  children: PropTypes.any,
};

export default Table;
