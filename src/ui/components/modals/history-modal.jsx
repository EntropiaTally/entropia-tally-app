import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';

import { aggregateHuntingSetData, calculateReturns } from '@utils/helpers';
import { formatTime, formatLocalTime } from '@uiUtils/formatting';

import StatBox from '@components/statbox';
import Table from '@components/table';
import Modal from '@components/modal';

const HistoryModal = ({ session, sessions, isOpen, closeModal }) => {
  const [sessionInstances, setSessionInstances] = useState([]);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeDeleteData, setActiveDeleteData] = useState(null);
  const [isKillCountEnabled, setIsKillCountEnabled] = useState(false);
  const [instanceMoveTarget, setInstanceMoveTarget] = useState(null);
  const [instanceMoveSource, setInstanceMoveSource] = useState(null);

  const { id, sessionName, sessionCreatedAt } = session;

  useEffect(() => {
    window.api.get('instances', { id }).then(instances => {
      setSessionInstances(instances);
    });

    window.api.get('settings').then(settings => setIsKillCountEnabled(Boolean(settings?.killCount)));

    const removeInstanceDeletedListener = window.api.on('instance-deleted', ({ sessionId }) => {
      window.api.get('instances', { id: sessionId }).then(instances => {
        setSessionInstances(instances);
      });
    });

    return () => removeInstanceDeletedListener();
  }, [id]);

  const combinedSessionStats = useMemo(() =>
    sessionInstances.reduce((previous, current) => {
      const { aggregated, config } = current;

      const currentLootTotal = aggregated?.allLoot?.total || 0;
      const currentGlobalTotal = aggregated?.globals?.count || 0;
      const currentHofTotal = aggregated?.hofs?.count || 0;
      const currentRareLootTotal = Object.values(aggregated?.rareLoot || {})
        .reduce((previousItem, currentItem) => previousItem + currentItem.count, 0);
      const usedHuntingSets = config?.usedHuntingSets;
      const additionalCost = config?.additionalCost || 0;
      const lootEventTotal = aggregated?.lootEvent?.count || 0;

      aggregateHuntingSetData(usedHuntingSets, aggregated, previous.usedSets);

      return {
        total: previous.total + currentLootTotal,
        globals: previous.globals + currentGlobalTotal,
        hofs: previous.hofs + currentHofTotal,
        rareLoots: previous.rareLoots + currentRareLootTotal,
        usedSets: previous.usedSets,
        additionalCost: previous.additionalCost + additionalCost,
        lootEvents: previous.lootEvents + lootEventTotal,
        runTime: previous.runTime + (current?.run_time ?? 0),
      };
    }, { total: 0, globals: 0, hofs: 0, rareLoots: 0, usedSets: {}, additionalCost: 0, lootEvents: 0, runTime: 0 })
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

  const exportInstance = (sessionId, instanceId) => {
    window.api.exportInstance(sessionId, instanceId).then(success => {
      if (!success) {
        console.error('FAILED TO EXPORT');
      }
    });
  };

  const moveModalOpen = instanceId => {
    setInstanceMoveSource(instanceId);
    setInstanceMoveTarget(null);
    setIsMoveModalOpen(true);
  };

  const moveInstanceToSession = (targetSessionId, instanceId) => {
    window.api.call('move-instance', { targetSessionId, instanceId });
    setInstanceMoveSource(null);
    setIsMoveModalOpen(false);
    closeModal();
  };

  const { trackedLoot, totalCost, resultRate } = calculateReturns(
    combinedSessionStats.usedSets,
    combinedSessionStats.total,
    combinedSessionStats.additionalCost,
  );

  const modifiedSessionInstances = sessionInstances.map(instance => {
    if (instance.notes && instance.notes.length > 36) {
      instance.notes = instance.notes.slice(0, 36) + '...';
    }

    return instance;
  });

  const filteredSessions = sessions.filter(sessionData => sessionData.id !== session.id);

  return (
    <>
      <Modal
        type="card"
        isOpen={isOpen}
        title={sessionName ? sessionName : formatLocalTime(sessionCreatedAt)}
        closeModal={closeModal}
      >
        <div className="statboxes-wrapper block">
          <div className="tile tile-toplevel">
            <StatBox
              title="Total loot"
              value={combinedSessionStats?.total.toFixed(2)}
              suffix="PED"
            />
            {combinedSessionStats?.total > trackedLoot && (
              <StatBox
                title="Tracked loot "
                value={trackedLoot.toFixed(2)}
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
          <div className="tile tile-toplevel">
            {isKillCountEnabled && (
              <StatBox
                title="Kill count / Loot Events"
                value={combinedSessionStats?.lootEvents ?? 0}
              />
            )}
            <StatBox
              title="Total time"
              value={formatTime(combinedSessionStats?.runTime ?? 0, true)}
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
                <td className="halfwidth">{formatLocalTime(instance.created_at)}</td>
                <td className="halfwidth">{instance.notes ? instance.notes : '-'}</td>
                <td className="has-text-right">
                  <a className="table-action" onClick={() => onLoadSessionInstance(instance.session_id, instance.id)}>Load</a>
                  <a className="table-action has-text-info" onClick={() => moveModalOpen(instance.id)}>Move</a>
                  <a className="table-action has-text-warning-dark" onClick={() => exportInstance(instance.session_id, instance.id)}>Export</a>
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

      {isMoveModalOpen && (
        <Modal
          type="card"
          isOpen={isMoveModalOpen}
          title="Move run to another session"
          closeModal={() => setIsMoveModalOpen(false)}
        >
          <p>
            Select the session you want to move this instance to.
          </p>
          <div className="block">
            <select className="select fullwidth" onChange={event => setInstanceMoveTarget(event.target.value)}>
              <option key="0">---</option>
              {filteredSessions.map(sessionData => (
                <option key={sessionData.id} value={sessionData.id}>
                  {`${sessionData.name ? `${sessionData.name} - ` : ''}${formatLocalTime(sessionData.created_at)}`}
                </option>
              ))}
            </select>
          </div>
          <div className="buttons">
            <button
              className="button is-danger"
              type="button"
              onClick={() => moveInstanceToSession(instanceMoveTarget, instanceMoveSource)}
            >
              Confirm
            </button>
            <button
              className="button"
              type="button"
              onClick={() => setIsMoveModalOpen(false)}
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
  sessions: [],
  isOpen: false,
};

HistoryModal.propTypes = {
  session: PropTypes.object,
  sessions: PropTypes.array,
  isOpen: PropTypes.bool,
  closeModal: PropTypes.func,
};

export default HistoryModal;
