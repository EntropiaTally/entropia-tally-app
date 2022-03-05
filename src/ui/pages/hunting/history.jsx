import React, { useEffect, useState } from 'react';

import { formatLocalTime } from '@uiUtils/formatting';

import HistoryModal from '@components/modals/history-modal';
import Table from '@components/table';

const History = () => {
  const [sessions, setSessions] = useState([]);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedSessionData, setSelectedSessionData] = useState(null);

  useEffect(() => {
    window.api.get('sessions').then(savedSessions => {
      setSessions(savedSessions);
    });

    const removeSessionDeletedListener = window.api.on('session-deleted', () => {
      window.api.get('sessions').then(savedSessions => setSessions(savedSessions));
      setHistoryModalOpen(false);
      setSelectedSessionData(null);
    });

    return () => removeSessionDeletedListener();
  }, []);

  const openSession = id => {
    window.api.get('session', { id }).then(sessionData => {
      setSelectedSessionData(sessionData);
      setHistoryModalOpen(true);
    });
  };

  const closeSession = () => {
    setSelectedSessionData(false);
    setHistoryModalOpen(false);
  };

  return (
    <>
      <div className="block block-top">
        <h2 className="title is-4">Session history</h2>
      </div>

      <div className="content box">
        {(!sessions || sessions.length === 0) && (<p>Nothing has been saved yet</p>)}
        {sessions && sessions.length > 0 && (
          <Table hasHover header={['Date', 'Name']}>
            {sessions.map(session => (
              <tr
                key={session.id}
                className="is-clickable"
                onClick={() => openSession(session.id)}
              >
                <td>{formatLocalTime(session.created_at)}</td>
                <td>{session.name ? session.name : '-'}</td>
              </tr>
            ))}
          </Table>
        )}
      </div>

      {selectedSessionData && (
        <HistoryModal
          session={selectedSessionData}
          isOpen={historyModalOpen}
          closeModal={closeSession}
        />
      )}
    </>
  );
};

export default History;
