import React, { useEffect, useMemo, useState } from 'react';

import Table from '@components/table';

const aggregatedDataDefault = { tierUp: {} };
const eventDataDefault = { tierUp: [], enhancerBreak: [] };

const MiscView = () => {
  const [aggregatedData, setAggregatedData] = useState(aggregatedDataDefault);
  const [eventData, setEventData] = useState(eventDataDefault);

  useEffect(() => {
    const updateAggregatedData = newData => {
      setAggregatedData({ tierUp: newData?.aggregated?.tierUp ?? {} });
      setEventData({
        tierUp: newData?.events?.tierUp ?? [],
        enhancerBreak: newData?.events?.enhancerBreak ?? [],
      });
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

  const enhancerBreaks = useMemo(() => {
    const groupedBreaks = {};

    for (const event of eventData.enhancerBreak) {
      if (!groupedBreaks[event.item]) {
        groupedBreaks[event.item] = [];
      }

      const existingBreak = groupedBreaks[event.item].find(row => row.name === event.name);

      if (!existingBreak) {
        groupedBreaks[event.item].push({ name: event.name, count: 1, value: Number(event.value) });
      } else {
        existingBreak.count += 1;
        existingBreak.value += Number(event.value);
      }
    }

    for (const key of Object.keys(groupedBreaks)) {
      groupedBreaks[key] = groupedBreaks[key].sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
    }

    return groupedBreaks;
  }, [eventData.enhancerBreak]);

  return (
    <>
      <div className="content box info-box">
        <h3 className="title is-5">Enhancer break</h3>
        {(!enhancerBreaks || Object.keys(enhancerBreaks).length === 0) && (<p>Nothing has been logged yet</p>)}
        {(enhancerBreaks && Object.keys(enhancerBreaks).length > 0) && (
          <Table header={['Name', 'Total value', 'Amount']}>
            {Object.keys(enhancerBreaks).map(item => (
              <React.Fragment key={item}>
                <tr>
                  <td><strong>{item}</strong></td>
                  <td />
                  <td />
                </tr>
                {enhancerBreaks[item].map(enhancer => (
                  <tr key={enhancer.name}>
                    <td><i className="ri-arrow-right-s-line vert-align-icon" /> {enhancer.name}</td>
                    <td><span className="sum">{enhancer.value.toFixed(2)}</span> PED</td>
                    <td>{enhancer.count}</td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </Table>
        )}
      </div>

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
    </>
  );
};

export default MiscView;
