import React, { useEffect, useState, useMemo } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import {
  Box,
  CssBaseline,
} from '@mui/material';

import Hunting from './sections/hunting';
import Settings from './sections/settings';
import History from './sections/history';

import Sidebar from './sidebar.jsx';
import { ColorModeContext } from './contexts.js';
import { lightTheme, darkTheme } from './themes.js';
import {
  useActiveSessionStore,
  useAggregatedStore,
  useEventStore,
  useSessionStore,
} from '@store';

const EventManager = () => {
  const [setActiveSession, setLoggerState, setSessionTime] = useActiveSessionStore(state => [
    state.updateSession,
    state.updateLoggerState,
    state.updateTimer,
  ]);
  const setAggregated = useAggregatedStore(state => state.updateAggregated);
  const setEvents = useEventStore(state => state.updateEvents);
  const setSessionList = useSessionStore(state => state.updateList);

  useEffect(() => {
    const newData = eventData => {
      const { type, data } = eventData;
      // console.log(type, data)
      if (type === 'session:updated') {
        // console.log("AGGREGATED", data.aggregated)
        setAggregated(data.aggregated);
        // console.log("EVENTS", data.events)
        setEvents(data.events);
        // console.log("HUNTING SETS", data.usedHuntingSets)
        setActiveSession({ usedHuntingSets: data.usedHuntingSets });
      }

      if (type === 'logger:status:updated') {
        console.log("logger:status:updated", data)
        setLoggerState(data);
      }

      if (type === 'session:time:updated') {
        console.log("session:time:updated", data)
        setSessionTime(data);
      }

      if (type === 'settings:updated') {
        // SetSettings(data);
      }

      //if (type === 'requested:sessions') {
      //  setSessionList(data);
      //}

      if (type === 'session:new') {
        console.log('session:new', data);
      }
    };

    const eventListener = window.api2.on('event', newData);

    setTimeout(() => {
      window.api2.request('session:data');
      //window.api2.request('logger:status:toggle');
      // Window.api2.call('event', { eventKey: 'session:data:get' });
    }, 5000);

    return () => eventListener.removeListener();
  }, [setAggregated, setEvents]);

  return null;
};

const App = () => {
  const [mode, setMode] = useState('light');
  const theme = useMemo(() => mode === 'dark' ? darkTheme : lightTheme, [mode]);

  const colorMode = useMemo(() => ({
    toggleColorMode: () => setMode(previous => previous === 'light' ? 'dark' : 'light'),
    setColorMode: newMode => setMode(newMode),
  }), []);

  return (
    <>
      <EventManager />
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <Box sx={{ display: 'flex' }}>
              <Sidebar />
              <Box component="main" sx={{ flexGrow: 1 }}>
                <Routes>
                  <Route exact path="/settings" element={<Settings />} />
                  <Route exact path="/history" element={<History />} />
                  <Route exact path="/" element={<Hunting />} />
                </Routes>
              </Box>
            </Box>
          </Router>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </>
  );
};

export default App;
