import React from 'react';
import PropTypes from 'prop-types';
import { AreaChart, XAxis, YAxis, Tooltip, CartesianGrid, Area, ResponsiveContainer, ReferenceLine, Label } from 'recharts';

import { formatTime } from '../../utils/formatting';

const XAxisTick = ({ x, y, payload }) => (
  <g transform={`translate(${x},${y})`}>
    <text
      x={0}
      y={0}
      dy={16}
      textAnchor="end"
      fill="#666"
      transform="rotate(-35)"
      className="x-axis-ticks"
    >
      {formatTime(payload.value)}
    </text>
  </g>
);

XAxisTick.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  payload: PropTypes.object,
};

const EvenLabel = ({ value, offset, viewBox }) => (
  <text
    offset={offset}
    x={viewBox.x}
    y={viewBox.y}
    fill="#666"
    textAnchor="start"
    className="recharts-text recharts-label recharts-cartesian-axis-tick-value"
  >
    <tspan x="929" dy="0.355em">{value}</tspan>
  </text>
);

EvenLabel.propTypes = {
  value: PropTypes.any,
  offset: PropTypes.number,
  viewBox: PropTypes.object,
};

const CustomTooltip = ({ active, label, payload }) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div className="graph-tooltip">
      <div className="graph-tooltip-label">
        <small>{formatTime(label)}</small>
      </div>
      <div className="graph-tooltip-label">
        <small><strong>Rate</strong>: {`${payload[0].value}%`}</small>
      </div>
      <div className="graph-tooltip-label">
        <small><strong>PED</strong>: {`${payload[0].payload.resultValue}`}</small>
      </div>
    </div>
  );
};

CustomTooltip.propTypes = {
  active: PropTypes.bool, // eslint-disable-line react/boolean-prop-naming
  label: PropTypes.string,
  payload: PropTypes.object,
};

const ReturnsGraph = ({ returnsOverTime, isPossible }) => {
  if (!isPossible) {
    return <p>It is not possible to show this right now.</p>;
  }

  if (!returnsOverTime || returnsOverTime.length < 2) {
    return <p>Awaiting data</p>;
  }

  return (
    <ResponsiveContainer height={300} width="100%">
      <AreaChart
        height={300}
        data={returnsOverTime}
        margin={{ top: 5, right: 50, left: 10, bottom: 5 }}
      >
        <XAxis dataKey="sessionTime" height={60} tick={<XAxisTick />} />
        <YAxis dataKey="resultRate" type="number" width={45} tickCount={5} tickFormatter={tick => `${tick}%`} />
        <CartesianGrid stroke="#f5f5f5" />
        <Area type="monotone" dataKey="resultRate" stroke="#000" fill="#555" />
        <ReferenceLine isFront y={100} stroke="black" strokeWidth={1} ifOverflow="extendDomain">
          <Label value="100%" position="right" content={EvenLabel} />
        </ReferenceLine>
        <Tooltip content={CustomTooltip} />
      </AreaChart>
    </ResponsiveContainer>
  );
};

ReturnsGraph.defaultProps = {
  returnsOverTime: [],
  isPossible: false,
};

ReturnsGraph.propTypes = {
  returnsOverTime: PropTypes.array,
  isPossible: PropTypes.bool,
};

export default ReturnsGraph;
