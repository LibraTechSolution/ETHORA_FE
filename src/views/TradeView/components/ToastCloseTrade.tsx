import { ToastLayout } from '@/components/ToastLayout';
import { Status } from '@/types/faucet.type';
import { ITradingData } from '@/types/trade.type';
import { addComma } from '@/utils/number';
import { Flex } from '@chakra-ui/react';
import dayjs from 'dayjs';
import { useEarlyPnl } from './TradeBox';
import { divide } from '@/utils/operationBigNumber';

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
  const { earlycloseAmount } = earlyPnl;
  console.log(item);
  return (
    <ToastLayout status={Status.SUCCESSS} close={onClose}>
      <p className="text-[#9E9E9F]">
        <span className="text-[#fff]">{item.pair.toUpperCase()}</span>{' '}
        <span className="text-[#fff]">{item.isAbove ? 'Up' : 'Down'}</span> @{' '}
        <span className="pr-2 text-[#fff]">{addComma(divide(item.strike, 8), 2)}</span>
        <span className={+earlycloseAmount <= 0 ? 'text-[#F03D3E]' : 'text-[#1ED768]'}>
          {(+earlycloseAmount).toFixed(2)}
        </span>
      </p>
      <Flex className="text-[#9E9E9F]">
        <span>
          {dayjs(item.openDate).format('MM/DD/YYYY')} {dayjs(item.openDate).format('HH:mm:ss')}
        </span>
        <span className="px-1">-</span>
        <span>
          {dayjs(closeTime).format('MM/DD/YYYY')} {dayjs(closeTime).format('HH:mm:ss')}
        </span>
      </Flex>
    </ToastLayout>
  );
};
