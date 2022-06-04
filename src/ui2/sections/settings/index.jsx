import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';

const Settings = () => (
  <Box>
    <Card>
      <CardContent>
        <Button variant="contained">Contained</Button>
        <FormGroup>
          <FormControlLabel control={<Switch defaultChecked />} label="Label" />
          <FormControlLabel disabled control={<Switch />} label="Disabled" />
        </FormGroup>
      </CardContent>
    </Card>
  </Box>
);

export default Settings;
