'use strict';

const { v4: uuidv4 } = require('uuid');

const db = require('./database');
const Session = require('./session');

const SessionStorage = {
  async Load(id, instanceId = null) {
    const data = await (instanceId
      ? db.get('SELECT s.id, si.id AS instance_id, s.name, s.created_at, si.created_at AS instance_created_at, si.events, si.aggregated, si.config, si.notes, si.run_time FROM sessions AS s LEFT JOIN session_instances AS si ON s.id = si.session_id WHERE s.id = ? AND si.id = ?', [id, instanceId])
      : db.get('SELECT s.id, si.id AS instance_id, s.name, s.created_at, si.created_at AS instance_created_at, si.events, si.aggregated, si.config, si.notes, si.run_time FROM sessions AS s LEFT JOIN session_instances AS si ON s.id = si.session_id WHERE s.id = ?', [id]));

    const options = { name: data?.name, createdAt: data?.created_at, instanceCreatedAt: data?.instance_created_at, sessionTime: data?.run_time };
    const config = data?.config ? JSON.parse(data.config) : 0;

    const instance = new Session(id, data?.instance_id, options, config);

    if (data?.events) {
      instance.events = JSON.parse(data.events);
    }

    if (data?.aggregated) {
      instance.aggregated = JSON.parse(data.aggregated);
    }

    if (data?.notes) {
      instance.notes = data.notes;
    }

    return instance;
  },

  async Create(name = null, config = null) {
    const id = uuidv4();
    const options = { name };
    const instance = new Session(id, null, options, config);
    return instance;
  },

  async FetchAll() {
    const rows = await db.all('SELECT id, created_at, name FROM sessions ORDER BY DATETIME(created_at) DESC');
    return rows;
  },

  async FetchInstances(id) {
    const rows = await db.all('SELECT id, session_id, created_at, aggregated, config, notes, run_time FROM session_instances WHERE session_id = ? ORDER BY DATETIME(created_at) DESC', [id]);
    return rows.map(row => {
      row.aggregated = JSON.parse(row.aggregated);
      row.config = JSON.parse(row.config);
      return row;
    });
  },

  async Delete(id) {
    let success = true;

    try {
      await db.all('DELETE FROM session_instances WHERE session_id = ?', [id]);
      await db.all('DELETE FROM sessions WHERE id = ?', [id]);
    } catch (error) {
      success = false;
      console.error(error);
    }

    return { success, sessionId: id };
  },

  async DeleteInstance(id) {
    let success = true;

    const { session_id: sessionId } = await db.get('SELECT session_id FROM session_instances WHERE id = ?', [id]);

    try {
      await db.all('DELETE FROM session_instances WHERE id = ?', [id]);
    } catch (error) {
      success = false;
      console.error(error);
    }

    return { success, sessionId, instanceId: id };
  },

  async MoveInstance(id, newSessionId) {
    await db.run('UPDATE session_instances SET session_id = ? WHERE id = ?', [newSessionId, id]);
  },
};

module.exports = SessionStorage;
