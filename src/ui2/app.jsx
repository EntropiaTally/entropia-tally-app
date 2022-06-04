import React, { useEffect, useState, useMemo } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import {
  Box,
  CssBaseline,
} from '@mui/material';

import Hunting from './sections/hunting';
import Settings from './sections/settings';

import Sidebar from './sidebar.jsx';
import { ColorModeContext } from './contexts.js';
import { lightTheme, darkTheme } from './themes.js';
import {
  useAggregatedStore,
  useEventStore,
} from '@store';

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
