import React from 'react';
import PropTypes from 'prop-types';
import { AreaChart, XAxis, YAxis, Tooltip, CartesianGrid, Area, ResponsiveContainer } from 'recharts';

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
      {payload.value}
    </text>
  </g>
);

XAxisTick.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  payload: PropTypes.object,
};

const CustomTooltip = ({ active, label, payload }) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div className="graph-tooltip">
      <div className="graph-tooltip-label">
        <small>{label}</small>
      </div>
      <div className="graph-tooltip-label">
        <small><strong>Amount</strong>: {payload[0].value}</small>
      </div>
    </div>
  );
};

CustomTooltip.propTypes = {
  active: PropTypes.bool, // eslint-disable-line react/boolean-prop-naming
  label: PropTypes.any,
  payload: PropTypes.array,
};

const ItemGraph = ({ itemLootEvents, itemMaxAmount }) => {
  if (!itemLootEvents || itemLootEvents.length === 0) {
    return <p>Awaiting data</p>;
  }

  const tickCount = itemMaxAmount === 1 ? 1 : 5;

  return (
    <ResponsiveContainer height={400} width="100%">
      <AreaChart
        height={400}
        data={itemLootEvents}
        margin={{ top: 5, right: 20, left: 10, bottom: 25 }}
      >
        <XAxis dataKey="date" height={60} tick={<XAxisTick />} />
        <YAxis type="number" width={40} tickCount={tickCount} />
        <Tooltip content={CustomTooltip} />
        <CartesianGrid stroke="#f5f5f5" />
        <Area type="monotone" dataKey="amount" stroke="#000" fill="#555" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

ItemGraph.defaultProps = {
  itemLootEvents: [],
  itemMaxAmount: 0,
};

ItemGraph.propTypes = {
  itemLootEvents: PropTypes.array,
  itemMaxAmount: PropTypes.number,
};

export default ItemGraph;
