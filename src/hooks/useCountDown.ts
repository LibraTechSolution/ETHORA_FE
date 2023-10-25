import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

const useCountdown = (targetDate: number) => {

  const [countDown, setCountDown] = useState(
    targetDate - dayjs().utc().unix()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(targetDate - dayjs().utc().unix());
    }, 1000);
    if (countDown <= 0) {
      clearInterval(interval)
    }
    return () => clearInterval(interval);
  }, [countDown, targetDate]);

  return getReturnValues(countDown);
};

const getReturnValues = (countDown: number) => {
  if (countDown < 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, countDown: 0 };

  // calculate time left
  const days = Math.floor(countDown / (60 * 60 * 24));
  const hours = Math.floor(
    (countDown % (60 * 60 * 24)) / (60 * 60)
  );
  const minutes = Math.floor((countDown % (60 * 60)) / (60));
  const seconds = Math.floor((countDown % (60)));

  return { days, hours, minutes, seconds, countDown };
};

export { useCountdown };