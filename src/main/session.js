'use strict';

const EventEmitter = require('events');
const { v4: uuidv4 } = require('uuid');

const { aggregateHuntingSetData, calculateReturns } = require('../utils/helpers');
const db = require('./database');

class Session {
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

  static async Load(id, instanceId = null) {
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
  }

  static async Create(name = null, config = null) {
    const id = uuidv4();
    const options = { name };
    const instance = new Session(id, null, options, config);
    return instance;
  }

  static async FetchAll() {
    const rows = await db.all('SELECT id, created_at, name FROM sessions ORDER BY DATETIME(created_at) DESC');
    return rows;
  }

  static async FetchInstances(id) {
    const rows = await db.all('SELECT id, session_id, created_at, aggregated, config, notes, run_time FROM session_instances WHERE session_id = ? ORDER BY DATETIME(created_at) DESC', [id]);
    return rows.map(row => {
      row.aggregated = JSON.parse(row.aggregated);
      row.config = JSON.parse(row.config);
      return row;
    });
  }

  static async Delete(id) {
    let success = true;

    try {
      await db.all('DELETE FROM session_instances WHERE session_id = ?', [id]);
      await db.all('DELETE FROM sessions WHERE id = ?', [id]);
    } catch (error) {
      success = false;
      console.error(error);
    }

    return { success, sessionId: id };
  }

  static async DeleteInstance(id) {
    let success = true;

    const { session_id: sessionId } = await db.get('SELECT session_id FROM session_instances WHERE id = ?', [id]);

    try {
      await db.all('DELETE FROM session_instances WHERE id = ?', [id]);
    } catch (error) {
      success = false;
      console.error(error);
    }

    return { success, sessionId, instanceId: id };
  }

  static async MoveInstance(id, newSessionId) {
    await db.run('UPDATE session_instances SET session_id = ? WHERE id = ?', [newSessionId, id]);
  }

  constructor(id = null, instanceId = null, options = {}, config = null) {
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
  }

  startTimer() {
    this.stopTimer();

    this.sessionTimer = setInterval(async () => {
      this.sessionTime += 1;

      if (this.sessionTime % 60 === 0) {
        this.saveLootReturns();
      }

      await this.updateDb();
      this.emitter.emit('session-time-updated', this.sessionTime);
    }, 1000);
  }

  async stopTimer() {
    if (this.sessionTimer) {
      clearInterval(this.sessionTimer);
      await this.updateDb();
    }
  }

  setHuntingSet(huntingSet) {
    if (huntingSet && huntingSet.id) {
      if (!this.config.usedHuntingSets) {
        this.config.usedHuntingSets = {};
      }

      const { id, name, decay } = huntingSet;
      this.config.usedHuntingSets[id] = { id, name, decay };
      this.currentHuntingSet = id;
    } else {
      this.currentHuntingSet = null;
    }
  }

  newEvent(eventData, updateDb = false, customIgnoreList = []) {
    const eventName = eventData.event
      .split('_')
      .map(event => event[0].toUpperCase() + event.slice(1))
      .join('');

    this.customIgnoreList = customIgnoreList;

    const handler = `handle${eventName}Event`;
    this?.[handler]?.(eventData);

    return updateDb ? this.updateDb() : Promise.resolve();
  }

  dataPoint(type, data) {
    if (!this.events[type]) {
      this.events[type] = [];
    }

    const dataPoint = { ...data.values };

    if (data?.date !== undefined) {
      dataPoint.date = data.date;
    } else if (data?.sessionTime !== undefined) {
      dataPoint.sessionTime = data.sessionTime;
    }

    this.events[type].push(dataPoint);
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
        if (this.aggregated[type][key].total > 0 && typeTotal > 0) {
          this.aggregated[type][key].percent = Number((this.aggregated[type][key].total / typeTotal) * 100);
        } else {
          this.aggregated[type][key].percent = null;
        }
      }
    }
  }

  saveLootReturns() {
    const sets = this.config?.usedHuntingSets ?? {};

    if (Object.keys(sets).length === 0) {
      return;
    }

    const aggregatedHuntingSet = aggregateHuntingSetData(sets, this.aggregated);
    const combinedValues = calculateReturns(
      aggregatedHuntingSet,
      this.aggregated?.allLoot?.total ?? 0,
      this.config?.additionalCost ?? 0,
    );
    if (combinedValues?.totalCost > 0) {
      this.dataPoint('returnsOverTime', {
        sessionTime: this.sessionTime,
        values: { ...combinedValues },
      });
    }

    this.emitter.emit('session-updated');
  }

  saveLootEvent(updateDb = false) {
    clearTimeout(this.currentEventTimer);
    const lootSize = this.currentLootEvent.length;
    if (lootSize > 0) {
      const firstItemName = this.currentLootEvent[0]?.values?.name;

      // Independent loot. Pick up, mission reward or similar.
      if (lootSize === 1 && Session.IGNORE_LOOT_EVENT_LOOT.includes(firstItemName)) {
        this.currentLootEvent = [];
        this.lastLootTime = null;
        return;
      }

      const lootEventValue = this.currentLootEvent.reduce(
        (previous, current) => (previous + Number(current.values.value)),
        0,
      );

      this.aggregate('lootEvent', null, lootEventValue, 1);
      this.dataPoint('lootEvent', {
        date: this.currentLootEvent[0].date,
        values: { items: this.currentLootEvent.map(loot => loot.values) },
      });

      this.currentLootEvent = [];
      this.lastLootTime = null;
    }

    if (updateDb) {
      this.updateDb();
      this.emitter.emit('session-updated');
    }
  }

  handleLootEvent(data) {
    const { name, amount, value } = data.values;

    if (Session.IGNORE_LOOT.includes(name) || this.customIgnoreList.includes(name)) {
      return;
    }

    const lootTime = new Date(data.date);
    const lastLootTime = this.lastLootTime?.getTime();
    const lastLootTimeExtra = lastLootTime ? new Date(lastLootTime + 1000)?.getTime() : null;
    let includeLoot = false;

    if (lastLootTime !== undefined && lastLootTime !== lootTime.getTime() && lastLootTimeExtra !== lootTime.getTime()) {
      this.saveLootEvent();
    } else if (lastLootTime !== undefined && lastLootTimeExtra === lootTime.getTime()) {
      includeLoot = true;
    }

    if (this.lastLootTime === null || this.lastLootTime?.getTime() === lootTime.getTime() || includeLoot) {
      this.currentLootEvent.push(data);
      if (!includeLoot) {
        this.lastLootTime = lootTime;
      }

      this.currentEventTimer = setTimeout(() => {
        this.saveLootEvent(true);
      }, 1500);
    }

    this.aggregate('allLoot', null, value, amount);

    this.dataPoint('loot', data);
    this.aggregate('loot', name, value, amount);

    if (this.currentHuntingSet) {
      this.aggregate('huntingSetLoot', this.currentHuntingSet, value, amount);
    }
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
    this.aggregate('damageInflicted', null, data.values.amount);

    if (data.values.critical === '1') {
      this.aggregate('damageInflictedCrit', null, data.values.amount);
    }

    if (this.currentHuntingSet) {
      this.aggregate('huntingSetDmg', this.currentHuntingSet, data.values.amount);
    }
  }

  handleDamageTakenEvent(data) {
    this.aggregate('damageTaken', null, data.values.amount);

    if (data.values.critical === '1') {
      this.aggregate('damageTakenCrit', null, data.values.amount);
    }
  }

  handleEnemyMissEvent() {
    this.aggregate('enemyMiss', null, 1);
  }

  handleEnemyEvadeEvent() {
    this.aggregate('enemyEvade', null, 1);

    if (this.currentHuntingSet) {
      this.aggregate('huntingSetMissed', this.currentHuntingSet, 1);
    }
  }

  handleEnemyDodgeEvent() {
    this.aggregate('enemyDodge', null, 1);

    if (this.currentHuntingSet) {
      this.aggregate('huntingSetMissed', this.currentHuntingSet, 1);
    }
  }

  handleEnemyJamEvent() {
    this.aggregate('enemyJam', null, 1);

    if (this.currentHuntingSet) {
      this.aggregate('huntingSetMissed', this.currentHuntingSet, 1);
    }
  }

  handlePlayerDodgeEvent() {
    this.aggregate('playerDodge', null, 1);
  }

  handlePlayerEvadeEvent() {
    this.aggregate('playerEvade', null, 1);
  }

  handlePlayerMissEvent() {
    this.aggregate('playerMiss', null, 1);

    if (this.currentHuntingSet) {
      this.aggregate('huntingSetMissed', this.currentHuntingSet, 1);
    }
  }

  handlePlayerDeflectEvent() {
    this.aggregate('playerDeflect', null, 1);
  }

  handleHealEvent(data) {
    const { target, amount } = data.values;
    this.aggregate('heal', target, amount);
  }

  handlePositionEvent(data) {
    this.dataPoint('position', data);
  }

  handleTierUpEvent(data) {
    this.dataPoint('tierUp', data);
    this.aggregate('tierUp', data.values.item, 0.01);
  }

  handleEnhancerBreakEvent(data) {
    this.dataPoint('enhancerBreak', data);
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

module.exports = Session;
