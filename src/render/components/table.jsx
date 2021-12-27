import React from 'react';
import PropTypes from 'prop-types';

const Table = ({ header, hasHover, hasBorder, children }) => (
  <table className={`table is-fullwidth ${hasHover ? 'is-hoverable' : ''} ${hasBorder ? 'is-bordered' : ''}`}>
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
  hasBorder: false,
};

Table.propTypes = {
  header: PropTypes.array,
  hasHover: PropTypes.bool,
  hasBorder: PropTypes.bool,
  children: PropTypes.any,
};

export default Table;
