'use client';

import { useCountdown } from '@/hooks/useCountDown';
import { addZeroBefore } from '@/utils/number';
import { Center, Progress } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';

interface PropType {
  endTime: number;
  period: number;
  hideBar?: boolean;
  isLimitOrder?: boolean;
  timeOutCallBack?: () => void;
}

const CountDown = (props: PropType) => {
  const { endTime, period, timeOutCallBack, isLimitOrder, hideBar } = props;
  const { hours, minutes, seconds, countDown } = useCountdown(endTime);
  const isFirstCallRef = useRef(true);

  useEffect(() => {
    if (countDown === 0 && timeOutCallBack && isFirstCallRef.current) {
      timeOutCallBack();
      isFirstCallRef.current = false;
    }
  }, [countDown, timeOutCallBack]);

  return (
    <>
      <Center justifyContent={'start'} paddingTop={3} paddingBottom={2}>
        {countDown > 0 ? (
          <p className="mr-2 text-xs font-normal text-[#fff]">
            {addZeroBefore(hours)}h {addZeroBefore(minutes)}m {addZeroBefore(seconds)}s
          </p>
        ) : (
          <p className="mr-2 text-xs font-normal text-[#fff]">Processing...</p>
        )}

        {isLimitOrder && <span className="rounded bg-[#252528] px-2 text-[#9E9E9F]">Order expiry</span>}
      </Center>
      {!hideBar && (
        <Progress
          value={Math.floor((countDown / period) * 100)}
          size="xs"
          colorScheme="primary"
          bgColor="#303035"
          rounded="2xl"
          h="2"
          w="full"
        />
      )}
    </>
  );
};

export default CountDown;
