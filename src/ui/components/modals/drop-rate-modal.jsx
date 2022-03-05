import React from 'react';
import PropTypes from 'prop-types';

import { formatLocalTime } from '@uiUtils/formatting';

import Modal from '@components/modal';
import ItemGraph from '@components/graphs/item-graph';

const DropRateModal = ({ item, lootEvents, isOpen, closeModal }) => {
  if (!isOpen || !item || !lootEvents) {
    return null;
  }

  const firstDate = lootEvents[0] ? new Date(`${lootEvents[0]?.date} GMT`) : null;
  const lastDate = lootEvents[lootEvents.length - 1] ? new Date(`${lootEvents[lootEvents.length - 1]?.date} GMT`) : null;

  if (!firstDate || !lastDate) {
    return null;
  }

  const allEventsSameDay = firstDate.getFullYear() === lastDate.getFullYear()
    && firstDate.getMonth() === lastDate.getMonth()
    && firstDate.getDate() === lastDate.getDate();

  const preparedLoot = lootEvents ? lootEvents.reduce((result, loot) => {
    const amount = loot.name === item ? Number(loot.amount) : 0;
    let date = formatLocalTime(loot.date);

    if (allEventsSameDay) {
      const lootDate = new Date(`${loot.date} GMT`);
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

  const itemMaxAmount = Math.max(...lootEvents.map(row => row.name === item ? row.amount : 0), 0);

  return (
    <Modal
      type="card"
      className="wide-modal"
      title={item}
      isOpen={isOpen}
      closeModal={closeModal}
    >
      <div className="tile tile-toplevel">
        <ItemGraph itemLootEvents={Object.values(preparedLoot)} itemMaxAmount={itemMaxAmount} />
      </div>
    </Modal>
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
