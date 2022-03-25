function aggregateHuntingSetData(usedHuntingSets, aggregated = {}, existingHuntingSets = {}) {
  const { huntingSetDmg, huntingSetMissed, huntingSetLoot } = aggregated;

  for (const set of Object.values(usedHuntingSets || {})) {
    const { id } = set;

    if (existingHuntingSets[id]) {
      existingHuntingSets[id].hits += huntingSetDmg?.[id]?.count || 0;
      existingHuntingSets[id].misses += huntingSetMissed?.[id]?.count || 0;
      existingHuntingSets[id].loot += huntingSetLoot?.[id]?.total || 0;
    } else {
      existingHuntingSets[id] = {
        ...set,
        dmg: huntingSetDmg?.[id]?.total || 0,
        hits: huntingSetDmg?.[id]?.count || 0,
        misses: huntingSetMissed?.[id]?.count || 0,
        loot: huntingSetLoot?.[id]?.total || 0,
      };
    }

    const totalAttacks = existingHuntingSets[id].hits + existingHuntingSets[id].misses;
    existingHuntingSets[id].dpp = totalAttacks
      ? existingHuntingSets[id].dmg / (totalAttacks * Number(existingHuntingSets[id].decay))
      : 0;
  }

  return existingHuntingSets;
}

function calculateReturns(aggregatedHuntingSetData, totalLoot, additionalCost = 0) {
  const huntingSetData = Array.isArray(aggregatedHuntingSetData)
    ? aggregatedHuntingSetData
    : Object.values(aggregatedHuntingSetData);

  const combinedValues = huntingSetData.reduce((previous, current) => ({
    cost: previous.cost + ((current.hits + current.misses) * (current.decay / 100)),
    loot: previous.loot + current.loot,
  }), { cost: 0, loot: 0 });

  const trackedLoot = combinedValues.loot;
  const totalWeaponCost = combinedValues.cost;
  const totalCost = combinedValues.cost + additionalCost;
  const resultValue = totalLoot - totalCost;
  const resultRate = totalCost > 0
    ? (trackedLoot / totalCost) * 100 || 0
    : null;

  return { trackedLoot, totalCost, totalWeaponCost, resultValue, resultRate };
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

module.exports = {
  aggregateHuntingSetData,
  calculateReturns,
  sum,
};
