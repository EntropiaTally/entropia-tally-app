import React, { useEffect, useMemo, useState } from 'react';

import Table from '../components/table';

const aggregatedDataDefault = { attributes: null, skills: null };

const SkillView = () => {
  const [aggregatedData, setAggregatedData] = useState(aggregatedDataDefault);

  useEffect(() => {
    const updateAggregatedData = newData => {
      const attributes = newData?.aggregated?.attributes ?? newData?.attributes;
      const skills = newData?.aggregated?.skills ?? newData?.skills;
      setAggregatedData({ attributes, skills });
    };

    const removeAggregatedListener = window.api.on('session-data-updated-aggregated', updateAggregatedData);

    window.api.get('active-session').then(updateAggregatedData);

    return () => removeAggregatedListener();
  }, []);

  const sortedAttributes = useMemo(() => {
    const mapped = Object.keys(aggregatedData.attributes || {}).map(key => ({ key, ...aggregatedData.attributes[key] }));
    return Object.values(mapped).sort((a, b) => b.total - a.total);
  }, [aggregatedData?.attributes]);

  const sortedSkills = useMemo(() => {
    const mapped = Object.keys(aggregatedData.skills || {}).map(key => ({ key, ...aggregatedData.skills[key] }));
    return Object.values(mapped).sort((a, b) => b.total - a.total);
  }, [aggregatedData?.skills]);

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

export default SkillView;
