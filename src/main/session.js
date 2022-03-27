'use strict';

const { aggregateHuntingSetData, calculateReturns } = require('../utils/helpers');
const SessionBase = require('./session-base');

class Session extends SessionBase {
  constructor(id = null, instanceId = null, options = {}, config = null) {
    super(id, instanceId, options, config);
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
    this.dataPoint('rareLoot', data);
    this.aggregate('rareLoot', data.values.item, data.values.value);
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
    this.dataPoint('skills', data);
    this.aggregate('skills', data.values.name, data.values.value);
  }

  handleAttributeEvent(data) {
    this.dataPoint('attributes', data);
    this.aggregate('attributes', data.values.name, data.values.value);
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
    this.aggregate('heal', data.values.target, data.values.amount);
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
}

module.exports = Session;
