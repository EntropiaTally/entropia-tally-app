import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';

import StatBox from './statbox';
import Table from './table';
import Modal from './modal';

const HistoryModal = ({ session, isOpen, closeModal }) => {
  const [sessionInstances, setSessionInstances] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeDeleteData, setActiveDeleteData] = useState(null);
  const { id, sessionName, sessionCreatedAt } = session;

  useEffect(() => {
    window.api.get('instances', { id }).then(instances => {
      setSessionInstances(instances);
    });

    const removeInstanceDeletedListener = window.api.on('instance-deleted', ({ sessionId }) => {
      window.api.get('instances', { id: sessionId }).then(instances => {
        setSessionInstances(instances);
      });
    });

    return () => removeInstanceDeletedListener();
  }, [id]);

  const combinedSessionStats = useMemo(() =>
    sessionInstances.reduce((previous, current) => {
      const currentLootTotal = current?.aggregated?.allLoot?.total || 0;
      const currentGlobalTotal = current?.aggregated?.globals?.count || 0;
      const currentHofTotal = current?.aggregated?.hofs?.count || 0;
      const currentRareLootTotal = Object.values(current?.aggregated?.rareLoot || {})
        .reduce((previousItem, currentItem) => previousItem + currentItem.count, 0);
      const usedHuntingSets = current?.config?.usedHuntingSets;
      const additionalCost = current?.config?.additionalCost || 0;
      const updatedSets = previous.usedSets;

      for (const set of Object.values(usedHuntingSets || {})) {
        if (updatedSets[set.id]) {
          updatedSets[set.id].hits.count += current?.aggregated?.huntingSetDmg?.[set.id]?.count || 0;
          updatedSets[set.id].misses.count += current?.aggregated?.huntingSetMissed?.[set.id]?.count || 0;
          updatedSets[set.id].loot.total += current?.aggregated?.huntingSetLoot?.[set.id]?.total || 0;
        } else {
          updatedSets[set.id] = {
            ...set,
            hits: { count: current?.aggregated?.huntingSetDmg?.[set.id]?.count || 0 },
            misses: { count: current?.aggregated?.huntingSetMissed?.[set.id]?.count || 0 },
            loot: { total: current?.aggregated?.huntingSetLoot?.[set.id]?.total || 0 },
          };
        }
      }

      return {
        total: previous.total + currentLootTotal,
        globals: previous.globals + currentGlobalTotal,
        hofs: previous.hofs + currentHofTotal,
        rareLoots: previous.rareLoots + currentRareLootTotal,
        usedSets: updatedSets,
        additionalCost: previous.additionalCost + additionalCost,
      };
    }, { total: 0, globals: 0, hofs: 0, rareLoots: 0, usedSets: {}, additionalCost: 0 })
  , [sessionInstances]);

  const onLoadSessionInstance = (sessionId, instanceId) => {
    window.api.call('load-instance', { sessionId, instanceId });
    closeModal();
  };

  const onDeleteData = (type, id) => {
    window.api.delete(type, id).then(deleted => {
      if (deleted) {
        setActiveDeleteData(null);
        setIsDeleteModalOpen(false);
      } else {
        console.error('FAILED TO DELETE');
      }
    });
  };

  const openDeleteModal = (type, id) => {
    setActiveDeleteData({ type, id });
    setIsDeleteModalOpen(true);
  };

  const combinedValues = Object.values(combinedSessionStats.usedSets).reduce((previous, current) => {
    const hits = current.hits?.count ?? 0;
    const misses = current.misses?.count ?? 0;
    const loot = current.loot?.total ?? 0;
    return {
      cost: previous.cost + ((hits + misses) * (current.decay / 100)),
      loot: previous.loot + loot,
    };
  }, { cost: 0, loot: 0 });

  const totalCost = combinedValues.cost + combinedSessionStats.additionalCost;
  const resultRate = totalCost > 0
    ? (combinedValues.loot / totalCost) * 100 || 0
    : null;

  const modifiedSessionInstances = sessionInstances.map(instance => {
    if (instance.notes && instance.notes.length > 24) {
      instance.notes = instance.notes.slice(0, 24) + '...';
    }

    return instance;
  });

  return (
    <>
      <Modal
        type="card"
        isOpen={isOpen}
        title={sessionName ? sessionName : sessionCreatedAt}
        closeModal={closeModal}
      >
        <div className="statboxes-wrapper block">
          <div className="tile tile-toplevel">
            <StatBox
              title="Total loot"
              value={combinedSessionStats?.total.toFixed(2)}
              suffix="PED"
            />
            {combinedSessionStats?.total > combinedValues?.loot && (
              <StatBox
                title="Tracked loot "
                value={combinedValues?.loot.toFixed(2)}
                suffix="PED"
              />
            )}
            <StatBox
              title="Total spent"
              value={totalCost.toFixed(2)}
              suffix="PED"
            />
            <StatBox
              title="Returns"
              value={resultRate ? resultRate.toFixed(2) : 0}
              suffix="%"
            />
          </div>
          <div className="tile tile-toplevel">
            <StatBox
              title="Globals"
              value={combinedSessionStats?.globals ?? 0}
            />
            <StatBox
              title="HoFs"
              value={combinedSessionStats?.hofs ?? 0}
            />
            <StatBox
              title="Rare items"
              value={combinedSessionStats?.rareLoots ?? 0}
            />
          </div>
        </div>
        <div className="buttons">
          <button
            className="button is-info is-small"
            type="button"
            onClick={() => onLoadSessionInstance(id, 'new')}
          >
            Start new run
          </button>
          <button
            className="button is-danger is-small"
            type="button"
            onClick={() => openDeleteModal('session', id)}
          >
            Delete session
          </button>
        </div>
        {(!modifiedSessionInstances || modifiedSessionInstances.length === 0) && (<p>Nothing has been saved yet</p>)}
        {(modifiedSessionInstances && modifiedSessionInstances.length > 0) && (
          <Table header={['Run', 'Notes', 'Actions']}>
            {modifiedSessionInstances.map(instance => (
              <tr key={instance.id}>
                <td className="halfwidth">{instance.created_at}</td>
                <td className="halfwidth">{instance.notes}</td>
                <td className="has-text-right">
                  <a className="table-action" onClick={() => onLoadSessionInstance(instance.session_id, instance.id)}>Load</a>
                  <a className="table-action has-text-danger" onClick={() => openDeleteModal('instance', instance.id)}>Delete</a>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </Modal>

      {activeDeleteData && (
        <Modal
          type="card"
          isOpen={isDeleteModalOpen}
          title="Confirm delete"
          closeModal={() => setIsDeleteModalOpen(false)}
        >
          <p className="has-text-danger">
            You are about to permanently delete data. Are you sure?
          </p>
          <div className="buttons">
            <button
              className="button is-danger"
              type="button"
              onClick={() => onDeleteData(activeDeleteData.type, activeDeleteData.id)}
            >
              DELETE
            </button>
            <button
              className="button"
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

HistoryModal.defaultProps = {
  session: {},
  isOpen: false,
};

HistoryModal.propTypes = {
  session: PropTypes.object,
  isOpen: PropTypes.bool,
  closeModal: PropTypes.func,
};

export default HistoryModal;
