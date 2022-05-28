import React, { useEffect } from 'react';
import {
  useAggregatedStore,
  useEventStore,
} from './store';
import Test from './test';

const EventManager = () => {
  const setAggregated = useAggregatedStore(state => state.updateAggregated);
  const setEvents = useEventStore(state => state.updateEvents);

  useEffect(() => {
    const newData = eventData => {
      const { type, data } = eventData;
      // Console.log(type, data)

      if (type === 'session:updated') {
        setAggregated(data.aggregated);
        setEvents(data.events);
      }

      if (type === 'settings:updated') {
        // SetSettings(data);
      }
    };

    const eventListener = window.api2.on('event', newData);

    setTimeout(() => {
      window.api2.request('session:data');
      // Window.api2.call('event', { eventKey: 'session:data:get' });
    }, 5000);

    return () => eventListener.removeListener();
  }, [setAggregated, setEvents]);

  return null;
};

const App = () => (
  <>
    <Test />
    <EventManager />
  </>
);

export default App;
