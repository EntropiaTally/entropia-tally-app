import React, { useEffect, useState } from 'react';
import {
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';

import {
  activeSessionState,
  activeSessionTimeState,
  activeSessionAggregatedState,
  activeSessionEventState,
  lootState,
  skillState,
  lootCacheState,
  skillCacheState,
} from './atoms';

const Loot = () => {
  const loot = useRecoilValue(lootCacheState());
  console.log("RENDER LOOT", loot);
  return <div>{JSON.stringify(loot)}</div>;
};

const Skills = () => {
  const skills = useRecoilValue(skillCacheState());
  console.log("RENDER SKILLS", skills);
  return <div>{JSON.stringify(skills)}</div>;
};

const Test = () => {
  /*const session = useRecoilValue(activeSessionState);
  const aggregated = useRecoilValue(activeSessionAggregatedState);
  const events = useRecoilValue(activeSessionEventState);
  //const sessionTwo = useRecoilValue(sessionTwoState);
  
  return (
    <div>
      Session: {JSON.stringify(session)}
      <br />
      Aggregated: {JSON.stringify(aggregated)}
      <br />
      Events: {JSON.stringify(events)}
    </div>
  );*/
  console.log("TEST IS RENDER");
  return (
    <div>
      <Loot />
      <Skills />
    </div>
  );
};

export default Test;
