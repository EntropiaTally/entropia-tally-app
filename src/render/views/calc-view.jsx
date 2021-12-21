import React, { useEffect, useState, useCallback } from 'react';

import Table from '../components/table';

const CalcView = () => {
  const [aggregatedData, setAggregatedData] = useState({ allLoot: 0, additionalCost: null });
  const [instanceHuntingSets, setInstanceHuntingSets] = useState([]);

  useEffect(() => {
    const updateAggregatedData = newData => {
      const allLoot = newData?.aggregated?.allLoot?.total ?? 0;
      const additionalCost = newData?.additionalCost ?? 0;

      if (newData.usedHuntingSets) {
        const fixedSets = Object.values(newData.usedHuntingSets).map(set => ({
          ...set,
          hits: newData?.aggregated?.huntingSetDmg?.[set.id],
          misses: newData?.aggregated?.huntingSetMissed?.[set.id],
        }));
        setInstanceHuntingSets(fixedSets.filter(set => set.hits || set.misses));
      }

      setAggregatedData({ allLoot, additionalCost });
    };

    const removeAggregatedListener = window.api.on('session-data-updated', updateAggregatedData);

    window.api.get('active-session').then(updateAggregatedData);

    return () => removeAggregatedListener();
  }, []);

  const updateAdditionalCost = useCallback(event => {
    const newCost = Number(event.target.value);
    window.api.set('active-session', { additionalCost: newCost });
    setAggregatedData({ ...aggregatedData, additionalCost: newCost });
  }, [aggregatedData]);

  const totalWeaponCost = instanceHuntingSets.reduce((previous, current) => previous + ((current.hits.count + current.misses.count) * (current.decay / 100)), 0);

  const totalCost = totalWeaponCost + aggregatedData.additionalCost;
  const resultValue = aggregatedData.allLoot - totalCost;
  const resultRate = (aggregatedData.allLoot / totalCost) * 100 || 0;

  return (
    <div className="content box info-box">
      <Table hasBorder header={['Description', 'Value']}>
        <tr>
          <td>Total weapon ammo and decay</td>
          <td className="calc-col-width"><span className="sum">{totalWeaponCost.toFixed(4)}</span> PED</td>
        </tr>

        {instanceHuntingSets.length > 1 && instanceHuntingSets.map(set => (
          <tr key={set.id}>
            <td><i className="ri-arrow-right-s-line vert-align-icon" />{set.name}</td>
            <td className="calc-col-width">
              <span className="sum">{((set.hits.count + set.misses.count) * (set.decay / 100)).toFixed(4)}</span> PED
            </td>
          </tr>
        ))}

        <tr>
          <td className="vert-align-middle">Additional costs</td>
          <td className="calc-col-width">
            <div className="control has-icons-right">
              {aggregatedData?.additionalCost !== null && (
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  className="input is-small"
                  defaultValue={aggregatedData.additionalCost}
                  onChange={updateAdditionalCost}
                />
              )}
              <span className="icon is-medium is-right">
                PED
              </span>
            </div>
          </td>
        </tr>
        <tr>
          <td />
          <td />
        </tr>

        <tr>
          <td>Total loot</td>
          <td className="calc-col-width"><span className="sum">{aggregatedData.allLoot.toFixed(4)}</span> PED</td>
        </tr>
        <tr>
          <td>Total costs</td>
          <td className="calc-col-width"><span className="sum">{totalCost.toFixed(4)}</span> PED</td>
        </tr>
        <tr>
          <td />
          <td />
        </tr>
        <tr>
          <td>Result</td>
          <td className="calc-col-width"><span className="sum">{resultRate.toFixed(2)} %</span> ({resultValue.toFixed(4)} PED)</td>
        </tr>
      </Table>
    </div>
  );
};

export default CalcView;
