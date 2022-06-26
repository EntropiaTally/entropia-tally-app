import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import EditIcon from '@mui/icons-material/Edit';
import TextField from '@mui/material/TextField';

import Header from './header';

import General from './general';
import Loot from './loot';
import Misc from './misc';
import Returns from './returns';
import Notes from './notes';


const tabList = ['General', 'Loot', 'Misc', 'Returns', 'Notes'].map(tab => (
  <Tab key={tab} label={tab} />
));

const TabView = ({ index, selected, children }) => (
  <div role="tabpanel">
    {selected === index && (children)}
  </div>
);

TabView.propTypes = {
  index: PropTypes.number.isRequired,
  selected: PropTypes.number.isRequired,
  children: PropTypes.node,
};

const HuntingPage = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const toggleLogging = () => {
    window.api2.request('logger:status:toggle');
  };

  return (
    <>
      <AppBar position="static">
        <div>
          <Header />
        </div>
        <Tabs
          value={selectedTab}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          onChange={(_event, value) => setSelectedTab(value)}
        >
          {tabList}
        </Tabs>
      </AppBar>

      <div>
        <TabView index={0} selected={selectedTab}>
          <General />
        </TabView>

        <TabView index={1} selected={selectedTab}>
          <Loot />
        </TabView>

        <TabView index={2} selected={selectedTab}>
          <Misc />
        </TabView>

        <TabView index={3} selected={selectedTab}>
          <Returns />
        </TabView>

        <TabView index={4} selected={selectedTab}>
          <Notes />
        </TabView>
      </div>
    </>
  );
};

export default HuntingPage;
