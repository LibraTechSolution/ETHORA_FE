import { useState, useEffect } from "react";
import dayjs from 'dayjs';

export const useCheckForexClose = () => {
  const [isClosed, setIsClosed] = useState<boolean>(false);

  useEffect(() => {
    if (
      (dayjs().utc().date() === 25 && dayjs().utc().month() === 11) ||
      (dayjs().utc().date() === 26 && dayjs().utc().month() === 11) ||
      (dayjs().utc().date() === 27 && dayjs().utc().month() === 11) ||
      (dayjs().utc().date() === 1 && dayjs().utc().month() === 0) ||
      (dayjs().utc().date() === 2 && dayjs().utc().month() === 0)
    ) {
      setIsClosed(true);
    } else if (dayjs().utc().day() === 0 || dayjs().utc().day() === 6) {
      setIsClosed(true);
    } else {
      if (dayjs().utc().hour() < 6 || dayjs().utc().hour() >= 16) {
        setIsClosed(true);
      }
    }
  }, []);

  return isClosed;
};