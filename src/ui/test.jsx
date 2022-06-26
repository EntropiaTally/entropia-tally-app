import React from 'react';
import { useAggregatedStore } from './store';
import { deepCompare } from '@uiUtils/compare';

const Loot = () => {
  const loot = useAggregatedStore(state => state.loot, deepCompare);
  console.log('RENDER LOOT', loot);
  return <div>{JSON.stringify(loot)}</div>;
};

const Skills = () => {
  const skills = useAggregatedStore(state => state.skills, deepCompare);
  console.log('RENDER SKILLS', skills);
  return <div>{JSON.stringify(skills)}</div>;
};

const Test = () => {
  console.log('TEST IS RENDER');
  return (
    <div>
      <Loot />
      <Skills />
    </div>
  );
};

export default Test;
