'use strict';

const { v4: uuidv4 } = require('uuid');

const db = require('./database');
const Session = require('./session');

const SessionStorage = {
  ALL_DATA_QUERY: 'SELECT s.id, si.id AS instanceId, s.name, s.created_at AS createdAt, si.created_at AS instanceCreatedAt, si.events, si.aggregated, si.config, si.notes, si.run_time AS sessionTime FROM session_instances AS si LEFT JOIN sessions AS s ON s.id = si.session_id WHERE',
  SESSION_QUERY: 'SELECT id, name, created_at AS createdAt FROM sessions WHERE',

  prepareLoaded(sessionData) {
    const { name, createdAt, instanceCreatedAt, sessionTime } = sessionData;
    const options = {
      name,
      createdAt,
      instanceCreatedAt,
      sessionTime,
    };

    const config = sessionData?.config
      ? JSON.parse(sessionData.config)
      : null;

    const events = sessionData?.events
      ? JSON.parse(sessionData.events)
      : {};

    const aggregated = sessionData?.aggregated
      ? JSON.parse(sessionData.aggregated)
      : {};

    const notes = sessionData?.notes ?? null;

    return { options, config, events, aggregated, notes };
  },

  async Load(instanceId) {
    const query = [SessionStorage.ALL_DATA_QUERY, 'si.id = ?'];
    const data = await db.get(query.join(' '), [instanceId]);

    const { options, config, events, aggregated, notes } = SessionStorage.prepareLoaded(data);

    const instance = new Session(id, instanceId, options, config);
    instance.events = events;
    instance.aggregated = aggregated;
    instance.notes = notes;

    return instance;
  },

  async LoadSession(id, includeInstances = true) {
    const query = [SessionStorage.SESSION_QUERY, 'id = ?'];
    const data = await db.get(query.join(' '), [id]);

    data.instances = includeInstances
      ? await SessionStorage.FetchInstances(id)
      : [];

    return data;
  },

  async Create(options = {}, config = {}) {
    const instance = new Session(uuidv4(), null, options, config);
    return instance;
  },

  async FetchAll() {
    const rows = await db.all('SELECT id, created_at, name FROM sessions ORDER BY DATETIME(created_at) DESC');
    return rows;
  },

  async FetchInstances(id) {
    const rows = await db.all('SELECT id, session_id, created_at, events, aggregated, config, notes, run_time FROM session_instances WHERE session_id = ? ORDER BY DATETIME(created_at) DESC', [id]);
    return rows.map(row => {
      const { config, events, aggregated } = SessionStorage.prepareLoaded(row);

      row.config = config;
      row.events = events;
      row.aggregated = aggregated;

      return row;
    });
  },

  async Delete(id) {
    let success = true;
    const condition = [id];
    try {
      await db.all('DELETE FROM session_instances WHERE session_id = ?', condition);
      await db.all('DELETE FROM sessions WHERE id = ?', condition);
    } catch (error) {
      success = false;
      console.error(error);
    }

    return { success, sessionId: id };
  },

  async DeleteInstance(id) {
    let success = true;
    const condition = [id];

    const { session_id: sessionId } = await db.get('SELECT session_id FROM session_instances WHERE id = ?', condition);

    try {
      await db.all('DELETE FROM session_instances WHERE id = ?', condition);
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
