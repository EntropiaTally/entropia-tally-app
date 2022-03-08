/* eslint-disable complexity */
import React, { useState, useEffect, useCallback } from 'react';

import { sum } from '@utils/helpers';
import { formatPED } from '@uiUtils/formatting';

import SessionTimer from '@components/session-timer';

const Overlay = () => {
  const [settings, setSettings] = useState(null);
  const [isKillCountEnabled, setIsKillCountEnabled] = useState(false);
  const [isLogRunning, setIsLogRunning] = useState(false);
  const [allHuntingSet, setAllHuntingSet] = useState(null);
  const [activeHuntingSet, setActiveHuntingSet] = useState(null);
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
    const returnTotal = lootedPED - spentPED;

    setData({
      ...data,
      returnTotal,
      totalLoot: newData?.aggregated?.allLoot?.total ?? 0,
      totalSpend: spentPED,
      returnPercent: Number.isNaN(returnPercent) ? 0 : returnPercent,
      numGlobals: newData.aggregated?.globals?.count || 0,
      numHofs: newData.aggregated?.hofs?.count || 0,
      numKills: newData.aggregated?.lootEvent?.count || 0,
      hitPercent: Number.isNaN(playerAttackHitRate) ? 0 : playerAttackHitRate,
      evadePercent: Number.isNaN(enemyAttackMissRate) ? 0 : enemyAttackMissRate,
    });
  }

  const onHuntingSetChange = useCallback(event => {
    const newSet = allHuntingSet.find(set => set.id === event.target.value);
    if (newSet) {
      window.api.call('change-hunting-set', newSet);
    }
  }, [allHuntingSet]);

  useEffect(() => {
    const addCustomCss = css => {
      const documentHead = document.querySelector('head');
      const existingStyles = document.querySelector('.custom-style');

      if (existingStyles) {
        existingStyles.remove();
      }

      if (css && documentHead) {
        const newStyles = document.createElement('style');
        newStyles.classList.add('custom-style');
        newStyles.innerHTML = css;
        documentHead.append(newStyles);
      }
    };

    const updateSettings = newSettings => {
      setSettings(newSettings.overlay);
      setIsKillCountEnabled(newSettings.killCount);
      addCustomCss(newSettings.overlay?.customCss);

      if (newSettings?.activeHuntingSet && Array.isArray(newSettings?.huntingSets) && newSettings.huntingSets.length > 0) {
        const activeSet = newSettings.huntingSets.find(set => set.id === newSettings?.activeHuntingSet);
        setActiveHuntingSet(activeSet.name);
        setAllHuntingSet(newSettings.huntingSets);
      }
    };

    const updateLogStatus = status => setIsLogRunning(status === 'enabled');

    const removeLoggerListener = window.api.on('logger-status-changed', updateLogStatus);

    window.api.on('instance-loaded', updateData);
    window.api.on('session-updated', updateData);
    window.api.on('session-data-updated', updateData);
    window.api.on('settings-updated', updateSettings);

    window.api.get('active-session').then(updateData);
    window.api.get('settings').then(updateSettings);
    window.api.get('logreader-status').then(updateLogStatus);

    return () => removeLoggerListener();
  }, []);

  const toggleLogging = useCallback(() => {
    window.api.call('logging-status-toggle');
  }, []);

  const allDisabled = [
    settings?.loggingToggle,
    settings?.sessionTime,
    settings?.huntingSet,
    settings?.lootTotal,
    settings?.spendTotal,
    settings?.returnTotal,
    settings?.returnPercent,
    settings?.numGlobals,
    settings?.numHofs,
    settings?.hitPercent,
    settings?.evadePercent,
    settings?.killCount && isKillCountEnabled,
  ].filter(value => Boolean(value)).length === 0;

  const toggleIcon = isLogRunning ? 'ri-pause-fill' : 'ri-play-fill';

  if (!settings || !data) {
    return null;
  }

  return (
    <div className="overlay p-2">
      {allDisabled && (
        <div className="overlay__item overlay__warning">
          Enable which stats to show in the settings.
        </div>
      )}

      {settings.loggingToggle && (
        <div className="overlay__item overlay__loggingToggle">
          <div className="overlay__label">Logging status</div>
          <div className="overlay__value" onClick={toggleLogging}>
            <i className={`icon ${toggleIcon}`} />
          </div>
        </div>
      )}

      {settings.sessionTime && (
        <div className="overlay__item overlay__sessionTime">
          <div className="overlay__label">Time</div>
          <div className="overlay__value">
            <SessionTimer />
            {settings.sessionTimeToggle && (
              <div className="overlay__sessionTimeToggle" onClick={toggleLogging}>
                <i className={`icon ${toggleIcon}`} />
              </div>
            )}
          </div>
        </div>
      )}

      {settings.huntingSet && activeHuntingSet && (
        <div className="overlay__item overlay__huntingSet">
          <div className="overlay__label">Set</div>
          <div className="overlay__value">
            {activeHuntingSet}
            {allHuntingSet && (
              <select onChange={onHuntingSetChange}>
                {allHuntingSet.map(set => (
                  <option key={set.id} value={set.id}>{set.name}</option>
                ))}
              </select>
            )}
          </div>
        </div>
      )}

      {isKillCountEnabled && settings.killCount && (
        <div className="overlay__item overlay__killCount">
          <div className="overlay__label">Kills</div>
          <div className="overlay__value">{data.numKills}</div>
        </div>
      )}

      {settings.lootTotal && (
        <div className="overlay__item overlay__totalLoot">
          <div className="overlay__label">Loot</div>
          <div className="overlay__value">{formatPED(data.totalLoot)}</div>
        </div>
      )}

      {settings.spendTotal && (
        <div className="overlay__item overlay__totalSpend">
          <div className="overlay__label">Spent</div>
          <div className="overlay__value">{formatPED(data.totalSpend)}</div>
        </div>
      )}

      {settings.returnTotal && (
        <div className="overlay__item overlay__returnTotal">
          <div className="overlay__label">Returns</div>
          <div className="overlay__value">{formatPED(data.returnTotal)}</div>
        </div>
      )}

      {settings.returnPercent && (
        <div className="overlay__item overlay__returnPercent">
          <div className="overlay__label">Returns</div>
          <div className="overlay__value">{data.returnPercent.toFixed(2)} %</div>
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
          <div className="overlay__label">Hit</div>
          <div className="overlay__value">{data.hitPercent.toFixed(2)}%</div>
        </div>
      )}

      {settings.evadePercent && (
        <div className="overlay__item overlay__evadePercent">
          <div className="overlay__label">Evade</div>
          <div className="overlay__value">{data.evadePercent.toFixed(2)}%</div>
        </div>
      )}
    </div>
  );
};

export default Overlay;
