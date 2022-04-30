import React, { useState, useMemo } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import {
  Box,
  CssBaseline,
} from '@mui/material';

import MainContent from './main-content.jsx';
import Settings from './settings/settings.jsx';
import Sidebar from './sidebar.jsx';
import { ColorModeContext } from './contexts.js';
import { lightTheme, darkTheme } from './themes.js';

const App = () => {
  const [mode, setMode] = useState('light');
  const theme = useMemo(() => mode === 'dark' ? darkTheme : lightTheme, [mode]);

  const colorMode = useMemo(() => ({
    toggleColorMode: () => setMode(previous => previous === 'light' ? 'dark' : 'light'),
    setColorMode: newMode => setMode(newMode),
  }), []);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Box sx={{ display: 'flex' }}>
            <Sidebar />
            <Box component="main" sx={{ flexGrow: 1 }}>
              <Routes>
                <Route exact path="/settings" element={<Settings />} />
                <Route exact path="/" element={<MainContent />} />
              </Routes>
            </Box>
          </Box>
        </Router>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;
