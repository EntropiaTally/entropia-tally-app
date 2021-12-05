import React, { useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import Table from '../components/table';
import StatBox from '../components/statbox';
import DropRateModal from '../components/drop-rate-modal';

const LootView = ({ loot, globals, hofs, rareLoot, lootEvents }) => {
  const [dropRateItem, setDropRateItem] = useState(null);
  const [dropRateModalOpen, setDropRateModalOpen] = useState(false);

  const totalLootValue = useMemo(() => (
    Object.values(loot).reduce((previous, current) => (
      { total: previous.total + current.total }), { total: 0 },
    )?.total
  ), [loot]);

  const rareLootCount = useMemo(() => (
    Object.values(rareLoot).reduce((previous, current) => (
      { count: previous.count + current.count }), { count: 0 },
    )?.count
  ), [rareLoot]);

  const sortedLoot = useMemo(() => {
    const mapped = Object.keys(loot).map(key => ({ key, ...loot[key] }));
    return Object.values(mapped).sort((a, b) => b.percent - a.percent);
  }, [loot]);

  const openDropRateModal = useCallback(item => {
    setDropRateItem(item);
    setDropRateModalOpen(true);
  }, []);

  const closeDropRateModal = useCallback(() => {
    setDropRateItem(null);
    setDropRateModalOpen(false);
  }, []);

  return (
    <>
      <div className="content box info-box">
        <h3 className="title is-5">General</h3>
        <div className="statboxes-wrapper">
          <div className="tile tile-toplevel">
            <StatBox
              title="Total loot"
              value={totalLootValue.toFixed(2)}
              suffix="PED"
            />
            <StatBox
              title="Globals"
              value={globals?.count ?? 0}
            />
            <StatBox
              title="HoFs"
              value={hofs?.count ?? 0}
            />
            <StatBox
              title="Rare items"
              value={rareLootCount}
            />
          </div>
        </div>
      </div>

      <div className="content box info-box">
        <h3 className="title is-5">Items</h3>
        {(!sortedLoot || sortedLoot.length === 0) && (<p>Nothing has been logged yet</p>)}
        {(sortedLoot && sortedLoot.length > 0) && (
          <Table hasHover header={['Name', 'Amount', 'Value', 'Distribution']}>
            {sortedLoot.map(row => (
              <tr key={row.key} className="clickable" title="Show events" onClick={() => openDropRateModal(row.key)}>
                <td>{row.key}</td>
                <td>{row.count.toLocaleString()}</td>
                <td><span className="sum">{row.total.toFixed(2)}</span> PED</td>
                <td>{row.percent.toFixed(2)} %</td>
              </tr>
            ))}
          </Table>
        )}
      </div>

      <DropRateModal
        item={dropRateItem}
        lootEvents={lootEvents}
        isOpen={dropRateModalOpen}
        closeModal={closeDropRateModal}
      />
    </>
  );
};

LootView.defaultProps = {
  loot: {},
  globals: {},
  hofs: {},
  rareLoot: {},
  lootEvents: [],
};

LootView.propTypes = {
  loot: PropTypes.object,
  globals: PropTypes.object,
  hofs: PropTypes.object,
  rareLoot: PropTypes.object,
  lootEvents: PropTypes.array,
};

export default LootView;
