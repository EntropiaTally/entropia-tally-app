import React from 'react';
import PropTypes from 'prop-types';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const InfoBox = ({ title, subtitle }) => (
  <Card>
    <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="subtitle1">
        {subtitle}
      </Typography>
    </CardContent>
  </Card>
);

InfoBox.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
};

export default InfoBox;
