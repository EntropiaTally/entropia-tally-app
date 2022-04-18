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
} from './atoms';

const Test = () => {
  const session = useRecoilValue(activeSessionState);
  const aggregated = useRecoilValue(activeSessionAggregatedState);
  const events = useRecoilValue(activeSessionEventState);
  //const sessionTwo = useRecoilValue(sessionTwoState);
  console.log("TEST IS RENDER");
  return (
    <div>
      Session: {JSON.stringify(session)}
      <br />
      Aggregated: {JSON.stringify(aggregated)}
      <br />
      Events: {JSON.stringify(events)}
    </div>
  );
};

export default Test;
