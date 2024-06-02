'use client';

import { useCountdown } from '@/hooks/useCountDown';
import { addZeroBefore } from '@/utils/number';
import { Box, Center, Progress, Text } from '@chakra-ui/react';
import { RotateCw } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface PropType {
  endTime: number;
  period: number;
  hideBar?: boolean;
  isLimitOrder?: boolean;
  hideCount?: boolean;
  timeOutCallBack?: () => void;
}

const CountDown = (props: PropType) => {
  const { endTime, period, timeOutCallBack, isLimitOrder, hideBar, hideCount } = props;
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
      {!hideCount && (
        <Center justifyContent={'start'} paddingTop={3} paddingBottom={2}>
          {countDown > 0 ? (
            <p className="mr-2 text-xs font-normal text-[#fff]">
              {addZeroBefore(hours)}h {addZeroBefore(minutes)}m {addZeroBefore(seconds)}s
            </p>
          ) : (
            <Box display="inline-block">
              <Text
                className="inline-block rounded border px-2 font-normal"
                background={'rgba(46, 96, 255, 0.10)'}
                borderColor={'#2E60FF'}
                textColor={'#2E60FF'}
                display="flex"
                alignItems={'center'}
              >
                <RotateCw color="#1E3EF0" size={12} className="mr-1" /> Calculating...
              </Text>
            </Box>
          )}

          {isLimitOrder && <span className="rounded bg-[#252528] px-2 text-[#9E9E9F]">Order expiry</span>}
        </Center>
      )}
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
