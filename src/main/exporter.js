function makeNumber(value) {
  return value || 0;
}

// eslint-disable-next-line complexity
async function exportXls(sessionData) {
  const aggregated = sessionData.aggregated || {};
  const events = sessionData.events || {};
  const sheets = [];

  const totalLootValue = makeNumber(aggregated.allLoot?.total);
  const killCount = makeNumber(aggregated.lootEvent?.count);
  const damageInflictedTotal = makeNumber(aggregated.damageInflicted?.total);
  const damageInflictedCount = makeNumber(aggregated.damageInflicted?.count);
  const damageInflictedCritTotal = makeNumber(aggregated.damageInflictedCrit?.total);
  const damageInflictedCritCount = makeNumber(aggregated.damageInflictedCrit?.count);
  const damageTakenTotal = makeNumber(aggregated.damageTaken?.total);
  const damageTakenCount = makeNumber(aggregated.damageTaken?.count);
  const damageTakenCritCount = makeNumber(aggregated.damageTakenCrit?.count);
  const playerDeflectCount = makeNumber(aggregated.playerDeflect?.count);
  const enemyMissCountValue = makeNumber(aggregated.enemyMiss?.count);

  const playerMissedCount = makeNumber(aggregated.playerMiss?.count) + makeNumber(aggregated.enemyDodge?.count) + makeNumber(aggregated.enemyEvade?.count) + makeNumber(aggregated.enemyJam?.count); // Shots fired but missed
  const playerAttackCount = damageInflictedCount + playerMissedCount; // Player attacks attempted
  const playerEvadeCount = makeNumber(aggregated.playerEvade?.count) + makeNumber(aggregated.playerDodge?.count); // Enemy attacks avoided
  const enemyAttackCount = damageTakenCount + playerDeflectCount + enemyMissCountValue + playerEvadeCount; // Enemy attacks attempted
  const enemyHitCount = damageTakenCount + playerDeflectCount; // Enemy attacks that hit incl. player deflections
  const enemyMissCount = enemyAttackCount - enemyHitCount; // Enemy attacks that missed

  const playerAttackHitRate = makeNumber(damageInflictedCount / playerAttackCount) * 100;
  const playerAttackCritRate = makeNumber(damageInflictedCritCount / damageInflictedCount) * 100;

  let general = [];
  general.push(
    ['Session name', sessionData.sessionName],
    ['Session created at', sessionData.sessionCreatedAt],
    ['Run time (seconds)', sessionData.sessionTime],
    ['Total looted (PED)', totalLootValue],
    ['Kills/Loot events', killCount],
    [''],
    ['Offensive stats'],
    ['Damage inflicted', damageInflictedTotal],
    ['Hits', damageInflictedCount],
    ['Misses', playerMissedCount],
    ['Critical hits', damageInflictedCritCount],
    ['Critical damage inflicted', damageInflictedCritTotal],
    ['Total attacks', playerAttackCount],
    ['Hit rate', `${playerAttackHitRate.toFixed(4)}%`],
    ['Critical hit rate', `${playerAttackCritRate.toFixed(4)}%`],
    [''],
    ['Defensive stats'],
    ['Damage received', damageTakenTotal],
    ['Hits received', damageTakenCount],
    ['Critical hits received', damageTakenCritCount],
    ['Attacks evaded', playerEvadeCount],
    [''],
    ['Enemy stats'],
    ['Enemy attacks', enemyAttackCount],
    ['Enemy hit count', enemyHitCount],
    ['Enemy miss count', enemyMissCount],
  );

  if (sessionData.usedHuntingSets) {
    const huntingSets = [];
    const aggHuntingSetDmg = aggregated.huntingSetDmg || {};
    const aggHuntingSetMissed = aggregated.huntingSetMissed || {};
    for (const key of Object.keys(sessionData.usedHuntingSets)) {
      const huntingSet = sessionData.usedHuntingSets[key];
      const setDmgValue = makeNumber(aggHuntingSetDmg[key]?.total);
      const setDmgCount = makeNumber(aggHuntingSetDmg[key]?.count);
      const setMisses = makeNumber(aggHuntingSetMissed[key]?.count);
      const setShotCount = setDmgCount + setMisses;
      if (setShotCount > 0) {
        huntingSets.push([huntingSet.name, Number(huntingSet.decay), Number(setDmgValue), Number(setShotCount), Number(setMisses)]);
      }
    }

    if (huntingSets.length > 0) {
      general.push(
        [''],
        ['Used hunting sets', 'Decay', 'Dmg inflicted', 'Shots fired', 'Missed shots'],
      );
      general = general.concat(huntingSets);
    }
  }

  sheets.push({ name: 'General', data: general, options: {'!cols': [{wch: 30}, {wch: 30}, {wch: 20}, {wch: 20}, {wch: 20}]} });

  if (events.globals) {
    const globals = [];
    const aggGlobals = aggregated.globals;
    globals.push(
      ['Global (count)', makeNumber(aggGlobals.count)],
      ['Global (total value)', makeNumber(aggGlobals.total)],
      ['Global (avg size)', makeNumber(aggGlobals.avg)],
      [''],
      ['Date', 'Value', 'Source'],
    );
    for (const global of sessionData.events.globals) {
      globals.push([global.date, Number(global.value), global.enemy]);
    }

    sheets.push({ name: 'Globals', data: globals, options: {'!cols': [{wch: 19}, {wch: 10}, {wch: 30}]} });
  }

  if (events.hofs) {
    const hofs = [];
    const aggHofs = aggregated.hofs;
    hofs.push(
      ['HoF (count)', makeNumber(aggHofs.count)],
      ['HoF (total value)', makeNumber(aggHofs.total)],
      ['HoF (avg size)', makeNumber(aggHofs.avg)],
      [''],
      ['Date', 'Value', 'Source'],
    );
    for (const hof of events.hofs) {
      hofs.push([hof.date, Number(hof.value), hof.enemy]);
    }

    sheets.push({ name: 'Hofs', data: hofs, options: {'!cols': [{wch: 19}, {wch: 10}, {wch: 30}]} });
  }

  if (events.rareLoot) {
    const rareLoots = [['Date', 'Value', 'Item']];
    for (const rareLoot of events.rareLoot) {
      rareLoots.push([rareLoot.date, Number(rareLoot.value), rareLoot.item]);
    }

    sheets.push({ name: 'Rare loot', data: rareLoots, options: {'!cols': [{wch: 19}, {wch: 10}, {wch: 30}]} });
  }

  if (events.loot) {
    const loots = [['Date', 'Amount', 'Value', 'Loot item']];
    for (const loot of events.loot) {
      loots.push([loot.date, Number(loot.amount), Number(loot.value), loot.name]);
    }

    sheets.push({ name: 'Loot', data: loots, options: {'!cols': [{wch: 19}, {wch: 10}, {wch: 10}, {wch: 30}]} });

    const aggLoot = [['Item', 'Amount', 'Value']];
    for (const key in aggregated.loot) {
      aggLoot.push([key, Number(aggregated.loot[key].count), Number(aggregated.loot[key].total)]);
    }

    sheets.push({ name: 'Loot (aggregated)', data: aggLoot, options: {'!cols': [{wch: 35}, {wch: 15}, {wch: 10}]} });
  }

  if (events.skills) {
    const skills = [['Date', 'Value', 'Skill']];
    for (const skill of events.skills) {
      skills.push([skill.date, Number(skill.value), skill.name]);
    }

    sheets.push({ name: 'Skills', data: skills, options: {'!cols': [{wch: 19}, {wch: 10}, {wch: 30}]} });

    const aggSkills = [['Skill', 'Times gained', 'Total']];
    for (const key in aggregated.skills) {
      aggSkills.push([key, Number(aggregated.skills[key].count), Number(aggregated.skills[key].total)]);
    }

    sheets.push({ name: 'Skills (aggregated)', data: aggSkills, options: {'!cols': [{wch: 35}, {wch: 15}, {wch: 10}]} });
  }

  if (events.attributes) {
    const attributes = [['Date', 'Value', 'Skill']];
    for (const attribute of events.attributes) {
      attributes.push([attribute.date, Number(attribute.value), attribute.name]);
    }

    sheets.push({ name: 'Attributes', data: attributes, options: {'!cols': [{wch: 19}, {wch: 10}, {wch: 30}]} });

    const aggAttributes = [['Attribute', 'Times gained', 'Total']];
    for (const key in aggregated.attributes) {
      aggAttributes.push([key, Number(aggregated.attributes[key].count), Number(aggregated.attributes[key].total)]);
    }

    sheets.push({ name: 'Attributes (aggregated)', data: aggAttributes, options: {'!cols': [{wch: 35}, {wch: 15}, {wch: 10}]} });
  }

  if (events.tierUp) {
    const tierUps = [['Date', 'Tier', 'Item']];
    for (const tierUp of events.tierUp) {
      tierUps.push([tierUp.date, Number(tierUp.tier), tierUp.item]);
    }

    sheets.push({ name: 'Tier up', data: tierUps, options: {'!cols': [{wch: 19}, {wch: 10}, {wch: 30}]} });
  }

  if (events.enhancerBreak) {
    const enhancerBreaks = [['Date', 'Value', 'Remaining', 'Enhancer', 'Source']];
    for (const enhancerBreak of events.enhancerBreak) {
      enhancerBreaks.push([enhancerBreak.date, Number(enhancerBreak.value), Number(enhancerBreak.remaining), enhancerBreak.name, enhancerBreak.item]);
    }

    sheets.push({ name: 'Enhancer breaks', data: enhancerBreaks, options: {'!cols': [{wch: 19}, {wch: 10}, {wch: 10}, {wch: 30}, {wch: 30}]} });
  }

  return sheets;
}

module.exports = {
  exportXls,
};
