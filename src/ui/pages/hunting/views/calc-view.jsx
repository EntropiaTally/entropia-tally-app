import React, { useEffect, useState } from 'react';

import ReturnsCalc from '../components/returns-calc';
import ReturnsGraph from '@components/graphs/returns-graph';

const ReturnsOverTimeWrapper = () => {
  const [returnsOverTime, setReturnsOverTime] = useState([]);
  const [hasUsedHuntingSets, setHasUsedHuntingSets] = useState(false);

  useEffect(() => {
    const updateSessionData = newData => {
      const overTimeEvents = newData?.events?.returnsOverTime ?? [];

      if (!hasUsedHuntingSets && Object.keys(newData?.usedHuntingSets || []).length > 0) {
        setHasUsedHuntingSets(true);
      }

      if (overTimeEvents.length > 1 && returnsOverTime.length < overTimeEvents.length) {
        setReturnsOverTime(
          overTimeEvents.map(returnData => ({
            resultValue: Number(returnData.resultValue.toFixed(2)),
            resultRate: Number(returnData.resultRate.toFixed(2)),
            sessionTime: returnData.sessionTime,
          })),
        );
      }
    };

    const removeSessionListener = window.api.on('session-data-updated', updateSessionData);

    if (!returnsOverTime || !hasUsedHuntingSets) {
      window.api.get('active-session').then(updateSessionData);
    }

    return () => removeSessionListener();
  }, [returnsOverTime, hasUsedHuntingSets]);

  return (
    <ReturnsGraph
      returnsOverTime={returnsOverTime}
      isPossible={hasUsedHuntingSets}
    />
  );
};

const CalcView = () => (
  <div className="content box info-box">
    <div>
      <h2 className="title is-5">Returns</h2>
      <ReturnsCalc />
    </div>
    <div className="mt-5">
      <h2 className="title is-5">Returns over time</h2>
      <ReturnsOverTimeWrapper />
    </div>
  </div>
);

export default CalcView;
