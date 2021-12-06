import React from 'react';
import PropTypes from 'prop-types';
import { LineChart, XAxis, YAxis, Tooltip, CartesianGrid, Line } from 'recharts';

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

const DropRateModal = ({ item, lootEvents, isOpen, closeModal }) => {
  if (!isOpen || !item || !lootEvents) {
    return null;
  }

  const firstDate = lootEvents[0] ? new Date(lootEvents[0]?.date) : null;
  const lastDate = lootEvents[lootEvents.length - 1] ? new Date(lootEvents[lootEvents.length - 1]?.date) : null;

  if (!firstDate || !lastDate) {
    return null;
  }

  const allEventsSameDay = firstDate.getFullYear() === lastDate.getFullYear()
    && firstDate.getMonth() === lastDate.getMonth()
    && firstDate.getDate() === lastDate.getDate();

  const preparedLoot = lootEvents ? lootEvents.reduce((result, loot) => {
    const amount = loot.name === item ? Number(loot.amount) : 0;
    let date = loot.date;

    if (allEventsSameDay) {
      const lootDate = new Date(loot.date);
      const hours = String(lootDate.getHours()).padStart(2, '0');
      const minutes = String(lootDate.getMinutes()).padStart(2, '0');
      const seconds = String(lootDate.getSeconds()).padStart(2, '0');
      date = `${hours}:${minutes}:${seconds}`;
    }

    if (!result[loot.date]) {
      result[loot.date] = {
        amount,
        date,
      };
    } else {
      result[loot.date].amount += amount;
    }

    return result;
  }, {}) : {};

  return (
    <div className={`modal ${isOpen ? 'is-active' : ''}`}>
      <div className="modal-background" />
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">{item}</p>
          <button type="button" className="delete" aria-label="close" onClick={() => closeModal()} />
        </header>
        <section className="modal-card-body content">
          <div className="tile tile-toplevel">
            <LineChart
              width={600}
              height={300}
              data={Object.values(preparedLoot)}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <XAxis dataKey="date" height={60} tick={<XAxisTick />} />
              <YAxis type="number" width={40} />
              <Tooltip />
              <CartesianGrid stroke="#f5f5f5" />
              <Line type="monotone" dataKey="amount" stroke="#485fc7" yAxisId={0} />
            </LineChart>
          </div>
        </section>
      </div>
    </div>
  );
};

DropRateModal.defaultProps = {
  item: null,
  lootEvents: [],
  isOpen: false,
};

DropRateModal.propTypes = {
  item: PropTypes.string,
  lootEvents: PropTypes.array,
  isOpen: PropTypes.bool,
  closeModal: PropTypes.func,
};

export default DropRateModal;
