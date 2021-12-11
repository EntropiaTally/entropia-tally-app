import React, { useEffect, useState, useMemo } from 'react';
import Table from '../components/table';
import StatBox from '../components/statbox';
import DropRateModal from '../components/drop-rate-modal';

const LootView = () => {
  const [lootData, setLootData] = useState({});
  const [lootEvents, setLootEvents] = useState([]);

  const [dropRateItem, setDropRateItem] = useState(null);
  const [dropRateModalOpen, setDropRateModalOpen] = useState(false);

  useEffect(() => {
    const resetData = () => {
      setLootData({});
      setLootEvents([]);
    };

    const updateData = newData => {
      setLootData({
        loot: newData?.aggregated?.loot ?? {},
        globals: newData?.aggregated?.globals ?? {},
        hofs: newData?.aggregated?.hofs ?? {},
        rareLoot: newData?.aggregated?.rareLoot ?? {},
      });
      setLootEvents(newData?.events?.loot ?? []);
    };

    const removeSessionDataListener = window.api.on('session-data-updated', updateData);
    const removeSessionNewLoggerListener = window.api.on('session-new', resetData);
    const removeInstanceNewLoggerListener = window.api.on('instance-new', resetData);
    const removeInstanceLoadedLoggerListener = window.api.on('instance-loaded', resetData);

    window.api.get('active-session').then(updateData);

    return () => {
      removeSessionDataListener();
      removeSessionNewLoggerListener();
      removeInstanceNewLoggerListener();
      removeInstanceLoadedLoggerListener();
    };
  }, []);

  const totalLootValue = useMemo(() => (
    Object.values(lootData?.loot ?? {}).reduce((previous, current) => (
      { total: previous.total + current.total }), { total: 0 },
    )?.total
  ), [lootData?.loot]);

  const rareLootCount = useMemo(() => (
    Object.values(lootData?.rareLoot ?? {}).reduce((previous, current) => (
      { count: previous.count + current.count }), { count: 0 },
    )?.count
  ), [lootData?.rareLoot]);

  const sortedLoot = useMemo(() => {
    const mapped = Object.keys(lootData?.loot ?? {}).map(key => ({ key, ...lootData?.loot[key] }));
    return Object.values(mapped).sort((a, b) => b.percent - a.percent);
  }, [lootData?.loot]);

  const openDropRateModal = item => {
    setDropRateItem(item);
    setDropRateModalOpen(true);
  };

  const closeDropRateModal = () => {
    setDropRateItem(null);
    setDropRateModalOpen(false);
  };

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
              value={lootData?.globals?.count ?? 0}
            />
            <StatBox
              title="HoFs"
              value={lootData?.hofs?.count ?? 0}
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

export default LootView;
