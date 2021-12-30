import React, { useState, useEffect } from 'react';

/* Not in use right now
const pad = string_ => string_ < 10 ? `0${string_}` : string_;

function formatTime(seconds) {
  const values = {
    hours: pad(Math.max(Math.floor(seconds / 3600) % 24, 0)),
    minutes: pad(Math.max(Math.floor(seconds / 60) % 60, 0)),
    seconds: pad(Math.max(Math.floor(seconds % 60), 0)),
  };

  return `${values.hours}:${values.minutes}:${values.seconds}`;
}
*/

function formatPED(value) {
  return `${value.toFixed(2)} PED`;
}

function sum(...values) {
  let result = 0;

  for (const value of values) {
    if (value) {
      result += value;
    }
  }

  return result;
}

const Overlay = () => {
  const [settings, setSettings] = useState(null);
  const [data, setData] = useState(null);

  function updateData(newData) {
    const additionalCost = newData?.additionalCost ?? 0;
    const spentPED = Object.keys(newData?.aggregated?.huntingSetDmg ?? {}).reduce((all, key) => {
      const numberHits = newData.aggregated?.huntingSetDmg?.[key]?.count ?? 0;
      const numberMiss = newData.aggregated?.huntingSetMissed?.[key]?.count ?? 0;
      const costPerShot = newData.usedHuntingSets[key].decay / 100;

      return all + ((numberHits + numberMiss) * costPerShot);
    }, 0) + additionalCost;

    const lootedPED = Object.values(newData.aggregated?.huntingSetLoot ?? {}).reduce((all, set) => all + (set.total ?? 0), 0);

    const damageInflictedCount = newData?.aggregated?.damageInflicted?.count ?? 0;
    const playerAttackCount = sum(
      damageInflictedCount,
      newData?.aggregated?.playerMiss?.count,
      newData?.aggregated?.enemyDodge?.count,
      newData?.aggregated?.enemyEvade?.count,
      newData?.aggregated?.enemyJam?.count,
    );

    const playerAttackHitRate = (damageInflictedCount / playerAttackCount) * 100;
    const damageTakenCount = newData?.aggregated?.damageTaken?.count ?? 0;
    const playerDeflectCount = newData?.aggregated?.playerDeflect?.count ?? 0;
    const enemyMissCountValue = newData?.aggregated?.enemyMiss?.count ?? 0;
    const playerEvadeCount = sum(newData?.aggregated?.playerEvade?.count, newData?.aggregated?.playerDodge?.count);
    const enemyAttackCount = sum(damageTakenCount, playerDeflectCount, enemyMissCountValue, playerEvadeCount);
    const enemyAttackMissRate = ((playerEvadeCount + enemyMissCountValue) / enemyAttackCount) * 100;

    const returnPercent = (lootedPED / spentPED) * 100;

    setData({
      ...data,
      totalLoot: newData?.aggregated?.allLoot?.total ?? 0,
      totalSpend: spentPED,
      returnPercent: Number.isNaN(returnPercent) ? 0 : returnPercent,
      numGlobals: newData.aggregated?.globals?.count || 0,
      numHofs: newData.aggregated?.hofs?.count || 0,
      hitPercent: Number.isNaN(playerAttackHitRate) ? 0 : playerAttackHitRate,
      evadePercent: Number.isNaN(enemyAttackMissRate) ? 0 : enemyAttackMissRate,
      sessionTime: 500,
    });
  }

  useEffect(() => {
    window.api.on('instance-loaded', console.log);
    window.api.on('session-updated', updateData);
    window.api.on('session-data-updated', updateData);

    window.api.on('settings-updated', newSettings => {
      setSettings(newSettings.overlay);
    });

    window.api.get('active-session').then(updateData);
    window.api.get('settings').then(newSettings => {
      setSettings(newSettings.overlay);
    });
  }, []);

  if (!settings || !data) {
    return null;
  }

  const allDisabled = [
    settings.lootTotal,
    settings.spendTotal,
    settings.returnPercent,
    settings.numGlobals,
    settings.numHofs,
    settings.hitPercent,
    settings.evadePercent,
  ].filter(val => !!val).length === 0;

  return (
    <div className="overlay p-2">
      {allDisabled && (
        <div className="overlay__item overlay__warning">
          Enable which stats to show in the settings.
        </div>
      )}

      {settings.lootTotal && (
        <div className="overlay__item overlay__totalLoot">
          <div className="overlay__label">Total loot</div>
          <div className="overlay__value">{formatPED(data.totalLoot)}</div>
        </div>
      )}

      {settings.spendTotal && (
        <div className="overlay__item overlay__totalSpend">
          <div className="overlay__label">Total spent</div>
          <div className="overlay__value">{formatPED(data.totalSpend)}</div>
        </div>
      )}

      {settings.returnPercent && (
        <div className="overlay__item overlay__returnPercent">
          <div className="overlay__label">Returns</div>
          <div className="overlay__value">{data.returnPercent.toFixed(2)}%</div>
        </div>
      )}

      {settings.numGlobals && (
        <div className="overlay__item overlay__numGlobals">
          <div className="overlay__label">Globals</div>
          <div className="overlay__value">{data.numGlobals}</div>
        </div>
      )}

      {settings.numHofs && (
        <div className="overlay__item overlay__numHofs">
          <div className="overlay__label">HoFs</div>
          <div className="overlay__value">{data.numHofs}</div>
        </div>
      )}

      {settings.hitPercent && (
        <div className="overlay__item overlay__hitPercent">
          <div className="overlay__label">Hit%</div>
          <div className="overlay__value">{data.hitPercent.toFixed(2)}%</div>
        </div>
      )}

      {settings.evadePercent && (
        <div className="overlay__item overlay__evadePercent">
          <div className="overlay__label">Evade%</div>
          <div className="overlay__value">{data.evadePercent.toFixed(2)}%</div>
        </div>
      )}

      {/*
        settings.sessionTime && (
        <div className="overlay__item overlay__sessionTime">
          <div className="overlay__label">Session time</div>
          <div className="overlay__value">{formatTime(data.sessionTime)}</div>
        </div>
      )
      */}
    </div>
  );
};

export default Overlay;
