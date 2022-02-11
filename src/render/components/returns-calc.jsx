import React, { useEffect, useState, useCallback } from 'react';

import { aggregateHuntingSetData, calculateReturns } from '../../utils/helpers';

import Table from './table';

const ReturnsCalc = () => {
  const [aggregatedData, setAggregatedData] = useState({ allLoot: 0, additionalCost: null });
  const [instanceHuntingSets, setInstanceHuntingSets] = useState([]);

  useEffect(() => {
    const updateAggregatedData = newData => {
      const allLoot = newData?.aggregated?.allLoot?.total ?? 0;
      const additionalCost = newData?.additionalCost ?? 0;

      if (newData.usedHuntingSets) {
        const fixedSets = aggregateHuntingSetData(newData.usedHuntingSets, newData?.aggregated);
        setInstanceHuntingSets(Object.values(fixedSets).filter(set => set.hits || set.misses));
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

  const { totalCost, totalWeaponCost, resultValue, resultRate } = calculateReturns(
    instanceHuntingSets,
    aggregatedData.allLoot,
    aggregatedData.additionalCost,
  );

  return (
    <Table hasBorder header={['Description', 'Value']}>
      {instanceHuntingSets.length > 0 && (
        <tr>
          <td>Total weapon cost (ammo and decay)</td>
          <td className="calc-col-width">
            <span className="sum">{totalWeaponCost.toFixed(4)}</span> PED
          </td>
        </tr>
      )}

      {instanceHuntingSets.map(set => {
        const hits = set.hits ?? 0;
        const misses = set.misses ?? 0;

        return (
          <tr key={set.id}>
            <td><i className="ri-arrow-right-s-line vert-align-icon" />{set.name}</td>
            <td className="calc-col-width">
              <span className="sum">{((hits + misses) * (set.decay / 100)).toFixed(4)}</span> PED
            </td>
          </tr>
        );
      })}

      <tr>
        <td className="vert-align-middle">Additional costs (armor, healing...)</td>
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
            <span className="icon is-medium is-right">PED</span>
          </div>
        </td>
      </tr>
      <tr>
        <td />
        <td />
      </tr>

      <tr>
        <td>Total costs</td>
        <td className="calc-col-width"><span className="sum">{totalCost.toFixed(4)}</span> PED</td>
      </tr>
      <tr>
        <td>Total loot</td>
        <td className="calc-col-width"><span className="sum">{aggregatedData.allLoot.toFixed(4)}</span> PED</td>
      </tr>

      <tr>
        <td />
        <td />
      </tr>
      <tr>
        <td>Result</td>
        <td className="calc-col-width">
          {resultRate !== null && (
            <>
              <span><span className="sum">{resultRate.toFixed(2)}</span> %</span>
              <span>&nbsp;(<span className="sum">{resultValue.toFixed(4)}</span> PED)</span>
            </>
          )}
          {resultRate === null && <><span className="sum">{resultValue.toFixed(4)}</span> PED</>}
        </td>
      </tr>
    </Table>
  );
};

export default ReturnsCalc;
