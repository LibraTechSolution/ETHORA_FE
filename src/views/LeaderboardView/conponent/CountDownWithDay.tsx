'use client';

import { useCountdown } from '@/hooks/useCountDown';
import { addZeroBefore } from '@/utils/number';
import { Center, Progress, Text } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';

interface PropType {
  endTime: number;
  timeOutCallBack?: () => void;
}

const CountDownWithDay = (props: PropType) => {
  const { endTime, timeOutCallBack } = props;
  const { days, hours, minutes, seconds, countDown } = useCountdown(endTime);
  const isFirstCallRef = useRef(true);

  useEffect(() => {
    if (countDown === 0 && timeOutCallBack && isFirstCallRef.current) {
      timeOutCallBack();
      isFirstCallRef.current = false;
    }
  }, [countDown, timeOutCallBack]);

  return (
    <>
      <Center justifyContent={'start'}>
        {countDown > 0 ? (
          <Text fontSize={'2xl'}>
            {addZeroBefore(days)}:{addZeroBefore(hours)}:{addZeroBefore(minutes)}:{addZeroBefore(seconds)}
          </Text>
        ) : (
          <p className="mr-2 text-xs font-normal text-[#fff]">Processing...</p>
        )}
      </Center>
    </>
  );
};

export default CountDownWithDay;
