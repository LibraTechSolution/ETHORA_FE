import { ToastLayout } from '@/components/ToastLayout';
import { Status } from '@/types/faucet.type';
import { ITradingData } from '@/types/trade.type';
import { addComma } from '@/utils/number';
import { Flex } from '@chakra-ui/react';
import dayjs from 'dayjs';
import { useEarlyPnl } from './TradeBox';
import { divide } from '@/utils/operationBigNumber';
import { useEffect, useRef, useState } from 'react';

interface ToastUIType {
  item: ITradingData;
  closeTime: number;
  onClose: () => void;
}
export const ToastCloseTrade = (props: ToastUIType) => {
  const { item, closeTime, onClose } = props;
  const { pnl: earlyPnl } = useEarlyPnl({
    trade: item,
  });
  const [amount, setAmount] = useState<string>('0');
  const { earlycloseAmount } = earlyPnl;
  const firstTime = useRef(true);
  useEffect(() => {
    if (firstTime.current) {
      setAmount(earlycloseAmount);
      firstTime.current = false;
    }
  }, []);

  return (
    <ToastLayout status={Status.SUCCESSS} close={onClose}>
      <p className="text-[#9E9E9F]">
        <span className="text-[#fff]">{item.pair.toUpperCase()}</span>{' '}
        <span className="text-[#fff]">{item.isAbove ? 'Up' : 'Down'}</span> @{' '}
        <span className="pr-2 text-[#fff]">{addComma(divide(item.strike, 8), 2)}</span>
        <span className={+amount <= 0 ? 'text-[#F03D3E]' : 'text-[#1ED768]'}>{(+amount).toFixed(2)}</span>
      </p>
      <Flex className="text-[#9E9E9F]">
        <span>
          {dayjs(item.openDate).format('MM/DD/YYYY')} {dayjs(item.openDate).format('HH:mm:ss')}
        </span>
        <span className="px-1">-</span>
        <span>
          {dayjs(closeTime * 1000).format('MM/DD/YYYY')} {dayjs(closeTime * 1000).format('HH:mm:ss')}
        </span>
      </Flex>
    </ToastLayout>
  );
};
