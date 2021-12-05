'use strict';

/// const Crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const db = require('./database');

class Session {
  static IGNORE_LOOT = ['Universal Ammo'];

  static async Load(id, instanceId = null) {
    let data = null;
    data = await (instanceId
      ? db.get('SELECT s.id, si.id AS instance_id, s.name, si.events, si.aggregated FROM sessions AS s LEFT JOIN session_instances AS si ON s.id = si.session_id WHERE s.id = ? AND si.id = ?', [id, instanceId])
      : db.get('SELECT s.id, si.id AS instance_id, s.name, si.events, si.aggregated FROM sessions AS s LEFT JOIN session_instances AS si ON s.id = si.session_id WHERE s.id = ?', [id]));

    const instance = new Session(id, data?.name, data?.instance_id);

    if (data?.events) {
      instance.events = JSON.parse(data.events);
    }

    if (data?.aggregated) {
      instance.aggregated = JSON.parse(data.aggregated);
    }

    return instance;
  }

  static async Create(name = null) {
    const id = uuidv4();
    const instance = new Session(id, name);
    return instance;
  }

  static async FetchAll() {
    const rows = await db.all('SELECT id, created_at, name FROM sessions ORDER BY DATETIME(created_at) DESC');
    return rows;
  }

  static async FetchInstances(id) {
    const rows = await db.all('SELECT id, session_id, created_at, aggregated FROM session_instances WHERE session_id = ? ORDER BY DATETIME(created_at) DESC', [id]);
    return rows.map(row => {
      row.aggregated = JSON.parse(row.aggregated);
      return row;
    });
  }

  constructor(id = null, name = null, instanceId = null) {
    this.id = id;
    this.instanceId = instanceId;
    this.name = name;
    this.events = {};
    this.aggregated = {};
  }

  newEvent(eventData, updateDb = true) {
    const eventName = eventData.event
      .split('_')
      .map(event => event[0].toUpperCase() + event.slice(1))
      .join('');

    const handler = `handle${eventName}Event`;
    this?.[handler]?.(eventData);

    return updateDb ? this.updateDb() : Promise.resolve();
  }

  /// hashString(string) {
  ///   return Crypto.createHash('sha1').update(string.toLowerCase()).digest('hex');
  /// }

  dataPoint(type, data) {
    if (!this.events[type]) {
      this.events[type] = [];
    }

    this.events[type].push({ ...data.values, date: data.date });
  }

  aggregate(type, name, value, count = 1) {
    if (!this.aggregated[type]) {
      this.aggregated[type] = {};
    }

    const newDefault = {
      count: 0,
      total: 0,
      avg: 0,
      percent: 0,
    };

    if (name && !this.aggregated[type][name]) {
      this.aggregated[type][name] = newDefault;
    } else if (!name && this.aggregated[type].total === undefined) {
      this.aggregated[type] = newDefault;
    }

    const row = !name ? this.aggregated[type] : this.aggregated[type][name];

    row.count += Number(count);
    row.total += Number(value);
    row.avg = row.total / row.count;

    if (name) {
      const typeTotal = Object.values(this.aggregated[type])
        .reduce((previous, current) => previous + current.total, 0);

      for (const key in this.aggregated[type]) {
        this.aggregated[type][key].percent = Number((this.aggregated[type][key].total / typeTotal) * 100);
      }
    }
  }

  handleLootEvent(data) {
    const { name, amount, value } = data.values;

    if (Session.IGNORE_LOOT.includes(name)) {
      return;
    }

    this.aggregate('allLoot', null, value, amount);
    this.dataPoint('loot', data);
    this.aggregate('loot', name, value, amount);
  }

  handleRareLootEvent(data) {
    const { item, value } = data.values;
    this.dataPoint('rareLoot', data);
    this.aggregate('rareLoot', item, value);
  }

  handleGlobalEvent(data) {
    this.dataPoint('globals', data);
    this.aggregate('globals', null, data.values.value);
  }

  handleHallOfFameEvent(data) {
    this.dataPoint('hofs', data);
    this.aggregate('hofs', null, data.values.value);
  }

  handleSkillEvent(data) {
    const { name, value } = data.values;
    this.dataPoint('skills', data);
    this.aggregate('skills', name, value);
  }

  handleAttributeEvent(data) {
    const { name, value } = data.values;
    this.dataPoint('attributes', data);
    this.aggregate('attributes', name, value);
  }

  handleDamageInflictedEvent(data) {
    /// this.dataPoint('damageInflicted', data);
    this.aggregate('damageInflicted', null, data.values.amount);

    if (data.values.critical === '1') {
      this.aggregate('damageInflictedCrit', null, data.values.amount);
    }
  }

  handleDamageTakenEvent(data) {
    /// this.dataPoint('damageTaken', data);
    this.aggregate('damageTaken', null, data.values.amount);

    if (data.values.critical === '1') {
      this.aggregate('damageTakenCrit', null, data.values.amount);
    }
  }

  handleEnemyMissEvent() {
    /// this.dataPoint('enemyMiss', data);
    this.aggregate('enemyMiss', null, 1);
  }

  handleEnemyEvadeEvent() {
    /// this.dataPoint('enemyEvade', data);
    this.aggregate('enemyEvade', null, 1);
  }

  handleEnemyDodgeEvent() {
    /// this.dataPoint('enemyDodge', data);
    this.aggregate('enemyDodge', null, 1);
  }

  handlePlayerDodgeEvent() {
    /// this.dataPoint('playerDodge', data);
    this.aggregate('playerDodge', null, 1);
  }

  handlePlayerEvadeEvent() {
    /// this.dataPoint('playerEvade', data);
    this.aggregate('playerEvade', null, 1);
  }

  handlePlayerDeflectEvent() {
    /// this.dataPoint('playerDeflect', data);
    this.aggregate('playerDeflect', null, 1);
  }

  handlePositionEvent(data) {
    this.dataPoint('position', data.values);
  }

  getData() {
    return {
      id: this.id,
      instanceId: this.instanceId,
      sessionName: this.name,
      events: this.events,
      aggregated: this.aggregated,
    };
  }

  createNewInstance() {
    this.instanceId = uuidv4();
    this.aggregated = {};
    this.events = {};
  }

  async createNewSession() {
    if (this.instanceId === null) {
      this.instanceId = uuidv4();
      await db.run('INSERT INTO sessions(id, name) VALUES(?, ?)', [this.id, this.name]);
    }
  }

  async updateDb() {
    await this.createNewSession();
    await db.run('REPLACE INTO session_instances(id, session_id, events, aggregated) VALUES(?, ?, ?, ?)', [
      this.instanceId,
      this.id,
      JSON.stringify(this.events),
      JSON.stringify(this.aggregated),
    ]);
  }

  async setName(name) {
    this.name = name;
    await this.createNewSession();
    await db.run('UPDATE sessions SET name = ? WHERE id = ?', [name, this.id]);
  }

  async setData(data) {
    if (data?.name) {
      await this.setName(data.name);
    }

    return this.getData();
  }
}

module.exports = Session;
