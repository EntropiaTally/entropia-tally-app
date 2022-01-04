import React, { useEffect, useMemo, useState } from 'react';

import Table from '../components/table';

const aggregatedDataDefault = { tierUp: {} };
const eventDataDefault = { tierUp: [] };

const MiscView = () => {
  const [aggregatedData, setAggregatedData] = useState(aggregatedDataDefault);
  const [eventData, setEventData] = useState(eventDataDefault);

  useEffect(() => {
    const updateAggregatedData = newData => {
      setAggregatedData({ tierUp: newData?.aggregated?.tierUp ?? {} });
      setEventData({ tierUp: newData?.events?.tierUp ?? [] });
    };

    const removeAggregatedListener = window.api.on('session-data-updated', updateAggregatedData);

    window.api.get('active-session').then(updateAggregatedData);

    return () => removeAggregatedListener();
  }, []);

  const sortedTierUps = useMemo(() => {
    const mapped = Object.keys(aggregatedData.tierUp).map(key => {
      const tierEvents = eventData.tierUp.filter(event => event.item === key);
      const sortedTierEvents = tierEvents.sort((a, b) => (a.tier > b.tier) ? -1 : ((b.tier > a.tier) ? 1 : 0))[0];
      return { key, ...aggregatedData.tierUp[key], tier: sortedTierEvents?.tier };
    });
    return Object.values(mapped).sort((a, b) => (a.total > b.total) ? -1 : ((b.total > a.total) ? 1 : 0));
  }, [aggregatedData.tierUp, eventData.tierUp]);

  return (
    <div className="content box info-box">
      <h3 className="title is-5">Tier increase</h3>
      {(!sortedTierUps || sortedTierUps.length === 0) && (<p>Nothing has been logged yet</p>)}
      {(sortedTierUps && sortedTierUps.length > 0) && (
        <Table header={['Name', 'Increase', 'Tier']}>
          {sortedTierUps.map(row => (
            <tr key={row.key}>
              <td>{row.key}</td>
              <td>{row.total.toFixed(2)}</td>
              <td>{row.tier}</td>
            </tr>
          ))}
        </Table>
      )}
    </div>
  );
};

export default MiscView;
