import React, { useState } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import General from './general';
import Loot from './loot';

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
  return (
    <>
      <AppBar position="static">
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
          Misc
        </TabView>

        <TabView index={3} selected={selectedTab}>
          Returns
        </TabView>

        <TabView index={4} selected={selectedTab}>
          Notes
        </TabView>
      </div>
    </>
  );
};

export default HuntingPage;
