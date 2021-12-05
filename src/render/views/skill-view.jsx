import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Table from '../components/table';

const SkillView = ({ attributes, skills }) => {
  const sortedAttributes = useMemo(() => {
    const mapped = Object.keys(attributes || {}).map(key => ({ key, ...attributes[key] }));
    return Object.values(mapped).sort((a, b) => b.total - a.total);
  }, [attributes]);

  const sortedSkills = useMemo(() => {
    const mapped = Object.keys(skills || {}).map(key => ({ key, ...skills[key] }));
    return Object.values(mapped).sort((a, b) => b.total - a.total);
  }, [skills]);

  return (
    <>
      <div className="content box info-box">
        <h3 className="title is-5">Attributes</h3>
        {(!sortedAttributes || sortedAttributes.length === 0) && (<p>Nothing has been logged yet</p>)}
        {(sortedAttributes && sortedAttributes.length > 0) && (
          <Table header={['Name', 'Amount']}>
            {sortedAttributes.map(row => (
              <tr key={row.key}>
                <td>{row.key}</td>
                <td><span className="sum">{row.total.toFixed(4)}</span> Points</td>
              </tr>
            ))}
          </Table>
        )}
      </div>
      <div className="content box info-box">
        <h3 className="title is-5">Skills</h3>
        {(!sortedSkills || sortedSkills.length === 0) && (<p>Nothing has been logged yet</p>)}
        {(sortedSkills && sortedSkills.length > 0) && (
          <Table header={['Name', 'Amount']}>
            {sortedSkills.map(row => (
              <tr key={row.key}>
                <td>{row.key}</td>
                <td><span className="sum">{row.total.toFixed(4)}</span> Points</td>
              </tr>
            ))}
          </Table>
        )}
      </div>
    </>
  );
};

SkillView.propTypes = {
  attributes: PropTypes.object,
  skills: PropTypes.object,
};

export default SkillView;
