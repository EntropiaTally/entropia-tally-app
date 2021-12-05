import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import StatBox from './statbox';
import Table from './table';

const HistoryModal = ({ session, isOpen, closeModal, loadSessionInstance }) => {
  const [sessionInstances, setSessionInstances] = useState([]);
  const { id, sessionName } = session;

  useEffect(() => {
    window.api.get('instances', { id }).then(instances => {
      setSessionInstances(instances);
    });
  }, [id]);

  const onLoadSessionInstance = (sessionId, instanceId) => {
    loadSessionInstance(sessionId, instanceId);
    closeModal();
  };

  const combinedSessionStats = useMemo(() =>
    sessionInstances.reduce((previous, current) => {
      const currentLootTotal = current?.aggregated?.allLoot?.total || 0;
      const currentGlobalTotal = current?.aggregated?.globals?.count || 0;
      const currentHofTotal = current?.aggregated?.hofs?.count || 0;
      const currentRareLootTotal = Object.values(current?.aggregated?.rareLoot || {})
        .reduce((previousItem, currentItem) => previousItem + currentItem.count, 0);
      return {
        total: previous.total + currentLootTotal,
        globals: previous.globals + currentGlobalTotal,
        hofs: previous.hofs + currentHofTotal,
        rareLoots: previous.rareLoots + currentRareLootTotal,
      };
    }, { total: 0, globals: 0, hofs: 0, rareLoots: 0 })
  , [sessionInstances]);

  return (
    <div className={`modal ${isOpen ? 'is-active' : ''}`}>
      <div className="modal-background" />
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">{sessionName ? sessionName : '-'}</p>
          <button type="button" className="delete" aria-label="close" onClick={() => closeModal()} />
        </header>
        <section className="modal-card-body content">
          <div className="statboxes-wrapper block">
            <div className="tile tile-toplevel">
              <StatBox
                title="Total loot"
                value={combinedSessionStats?.total.toFixed(2)}
                suffix="PED"
              />
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
          <div className="has-text-danger block">
            Loading an instance will stop any current instance.
          </div>
          <div className="block">
            <button
              className="button is-info is-small"
              type="button"
              onClick={() => onLoadSessionInstance(id, 'new')}
            >
              Start new instance
            </button>
          </div>
          {(!sessionInstances || sessionInstances.length === 0) && (<p>Nothing has been logged yet</p>)}
          {(sessionInstances && sessionInstances.length > 0) && (
            <Table header={['Instances', '']}>
              {sessionInstances.map(instance => (
                <tr key={instance.id}>
                  <td className="fullwidth">{instance.created_at}</td>
                  <td>
                    <a onClick={() => onLoadSessionInstance(instance.session_id, instance.id)}>Load</a>
                  </td>
                </tr>
              ))}
            </Table>
          )}
        </section>
      </div>
    </div>
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
  loadSessionInstance: PropTypes.func,
};

export default HistoryModal;
