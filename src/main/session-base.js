'use strict';

const EventEmitter = require('events');
const { v4: uuidv4 } = require('uuid');

const db = require('./database');
const appEvents = require('./app-events');

class SessionBase {
  static IGNORE_LOOT = ['Universal Ammo', 'Strongbox Key'];
  static IGNORE_LOOT_EVENT_LOOT = [
    'Mayhem Token',
    'Daily Token',
    'Bombardo',
    'Caroot',
    'Haimoros',
    'Papplon',
    'Common Dung',
    'Brukite',
    'Kaldon',
    'Nissit',
    'Rutol',
    'Sopur',
    'Trutun',
    'Vibrant Sweat',
  ];

  constructor(id, instanceId, options, config) {
    this.id = id;
    this.instanceId = instanceId;
    this.name = options?.name;
    this.instanceCreatedAt = options?.instanceCreatedAt;
    this.createdAt = options?.createdAt;
    this.events = {};
    this.aggregated = {};
    this.config = config || {};
    this.currentHuntingSet = null;
    this.notes = '';
    this.lastLootTime = null;
    this.currentLootEvent = [];
    this.currentEventTimer = null;
    this.sessionTime = options?.sessionTime ?? 0;
    this.sessionTimer = null;
    this.customIgnoreList = [];

    this.emitter = new EventEmitter();

    this.newEventBind = this.newEvent.bind(this);
    appEvents.on('logger:event', this.newEventBind);

    this.getDataBind = this.getData.bind(this);
    appEvents.on('session:data:get', this.getDataBind);
  }

  destruct() {
    appEvents.removeListener('logger:event', this.newEventBind);
    appEvents.removeListener('session:data:get', this.getDataBind);
  }

  snakeToCamel(snakeString, capital = true) {
    let camelString = snakeString
      .split('_')
      .map(part => part[0].toUpperCase() + part.slice(1))
      .join('');

    if (!capital) {
      camelString = camelString.charAt(0).toLowerCase() + camelString.slice(1);
    }

    return camelString;
  }

  newEvent(eventData, updateDb = false, customIgnoreList = []) {
    console.log('EVENT', eventData, updateDb, customIgnoreList);
    const eventName = this.snakeToCamel(eventData.event);
    this.customIgnoreList = customIgnoreList;

    this?.[`event${eventName}`]?.(eventData);

    appEvents.emit('session:updated', this.getData());

    return updateDb ? this.updateDb() : Promise.resolve();
  }

  getData(events = true) {
    const data = {
      id: this.id,
      instanceId: this.instanceId,
      sessionName: this.name,
      sessionCreatedAt: this.createdAt,
      instanceCreatedAt: this.instanceCreatedAt,
      usedHuntingSets: this.config.usedHuntingSets,
      additionalCost: this.config.additionalCost,
      notes: this.notes,
      sessionTime: this.sessionTime,
    };

    if (events) {
      data.events = this.events;
      data.aggregated = this.aggregated;
    }

    console.log('EMIT GET DATA');
    appEvents.emit('session:updated', data);

    return data;
  }

  createNewInstance() {
    this.instanceId = uuidv4();
    this.aggregated = {};
    this.instanceCreatedAt = null;
    this.createdAt = null;
    this.events = {};
    this.config = {};
    this.notes = '';
    this.sessionTime = 0;
  }

  async createNewSession() {
    if (this.instanceId === null) {
      this.instanceId = uuidv4();
      await db.run('INSERT INTO sessions(id, name) VALUES(?, ?)', [this.id, this.name]);

      const result = await db.get('SELECT created_at FROM sessions WHERE id = ?', [this.id]);
      this.createdAt = result.created_at;
    }
  }

  async updateDb() {
    await this.createNewSession();
    await db.run('REPLACE INTO session_instances(id, session_id, created_at, events, aggregated, config, notes, run_time) VALUES(?, ?, ?, ?, ?, ?, ?, ?)', [
      this.instanceId,
      this.id,
      this.instanceCreatedAt,
      JSON.stringify(this.events),
      JSON.stringify(this.aggregated),
      JSON.stringify(this.config),
      this.notes,
      this.sessionTime,
    ]);

    if (!this.instanceCreatedAt) {
      const result = await db.get('SELECT created_at FROM session_instances WHERE id = ? AND session_id = ?', [this.instanceId, this.id]);
      this.instanceCreatedAt = result?.created_at;
    }
  }

  async setName(name) {
    this.name = name;
    await this.createNewSession();
    await db.run('UPDATE sessions SET name = ? WHERE id = ?', [name, this.id]);
  }

  async setNotes(notes) {
    this.notes = notes;
    await this.createNewSession();
    await db.run('UPDATE session_instances SET notes = ? WHERE id = ?', [notes, this.instanceId]);
  }

  async setData(data) {
    if (data?.name) {
      await this.setName(data.name);
    }

    if (data?.additionalCost !== null) {
      this.config.additionalCost = data.additionalCost;
      await this.updateDb();
    }

    return this.getData(true);
  }
}

module.exports = SessionBase;
