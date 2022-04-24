import React, { useEffect } from 'react';
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';

import {
  activeSessionState,
  activeSessionTimeState,
  activeSessionAggregatedState,
  activeSessionEventState,
  settingsState
} from './atoms';
import Test from './test';

const EventManager = () => {
  //const [session, setSession] = useRecoilState(sessionState);
  const [activeSession, setActiveSession] = useRecoilState(activeSessionState);
  const [activeSessionAggregated, setActiveSessionAggregated] = useRecoilState(activeSessionAggregatedState);
  const [activeSessionEvents, setActiveSessionEvents] = useRecoilState(activeSessionEventState);
  const [settings, setSettings] = useRecoilState(settingsState);

  useEffect(() => {
    const newData = (eventData) => {
      const { type, data } = eventData;
      //console.log(type, data)
      
      if (type === "session:updated") {
        setActiveSessionAggregated(data.aggregated);
        setActiveSessionEvents(data.events);
      }

      if (type === "settings:updated") {
        setSettings(data);
      }
    };
    const eventListener = window.api2.on('event', newData);

    setTimeout(() => {
      window.api2.request('session:data');
      //window.api2.call('event', { eventKey: 'session:data:get' });
    }, 5000)

    return () => eventListener.removeListener(); 
  }, []);

  return null;
}

const App = () => {
  return (
    <RecoilRoot>
      <Test />
      <EventManager />
    </RecoilRoot>
  );
};

export default App;
