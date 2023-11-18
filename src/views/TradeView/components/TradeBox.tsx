'use client';
import useTradeStore from '@/store/useTradeStore';
import { addComma } from '@/utils/number';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import { Flex, Center, GridItem, Button, Box, Grid, Image, useToast, Tooltip } from '@chakra-ui/react';
import CountDown from './CountDown';
import dayjs from 'dayjs';
import { ITradingData, State } from '@/types/trade.type';
import { closeTrade } from '@/services/trade';
import { useQueryClient } from '@tanstack/react-query';
import { ToastLayout } from '@/components/ToastLayout';
import { Status } from '@/types/faucet.type';
import { getProbability } from '@/utils/helper';
import { useEffect, useMemo, useState } from 'react';
import { divide, subtract, multiply, gte } from '@/utils/operationBigNumber';
import { Address, useContractRead } from 'wagmi';
import optionsConfigABI from '@/config/abi/optionsConfigABI';
import BigNumber from 'bignumber.js';
import useListShowLinesStore from '@/store/useListShowLinesStore';
import { ShowPrice } from './ShowPrice';
import { RotateCw } from 'lucide-react';
import { useGetTradeContract } from '@/hooks/useGetTradeContract';
import { ToastCloseTrade } from './ToastCloseTrade';

interface PropsType {
  item: ITradingData;
}

interface CloseBtnPropsType {
  item: ITradingData;
  isDisabled: boolean;
  handleCloseTrade: () => void;
}

export const useEarlyPnl = ({ trade, lockedAmmount }: { trade: ITradingData; lockedAmmount?: string }) => {
  const { price } = useTradeStore();
  const { optionConfigSC } = useGetTradeContract();
  const { data: iv } = useContractRead({
    address: optionConfigSC as Address,
    abi: optionsConfigABI,
    functionName: 'iv',
  });

  let probability = useMemo(
    () => getProbability(trade, +price, new BigNumber(iv?.toString() ?? '0').toNumber()),
    [trade, price, iv],
  );
  if (!probability) probability = 0;
  return {
    pnl: calculatePnlForProbability({
      trade,
      probability,
      decimals: 6,
      lockedAmmount,
    }),
    probability,
  };
};

export const calculatePnlForProbability = ({
  trade,
  probability,
  lockedAmmount,
  decimals,
}: {
  trade: ITradingData;
  probability: number;
  decimals: number;
  lockedAmmount?: string;
}) => {
  const lockedAmount = trade.lockedAmount || lockedAmmount;
  const tradeSize = trade.tradeSize;

  const earlycloseAmount = divide(
    subtract(multiply(lockedAmount?.toString() ?? '0', (probability / 100).toString()), tradeSize.toString()),
    decimals,
  ) as string;

  const isWin = gte(earlycloseAmount, '0');
  return { earlycloseAmount, isWin, probability };
};

const ShowPnL = (props: PropsType) => {
  const { item } = props;
  const { pnl: earlyPnl } = useEarlyPnl({
    trade: item,
  });
  const { earlycloseAmount, isWin, probability } = earlyPnl;
  return (
    <GridItem>
      <p className="mb-2 text-xs font-normal text-[#9E9E9F]">PnL|Probability</p>
      <p>
        <span className={`pr-1 text-sm font-normal ${+earlycloseAmount < 0 ? 'text-[#F03D3E]' : 'text-[#1ED768]'}`}>
          {(+earlycloseAmount).toFixed(2)}
        </span>
        <span className="text-xs font-normal text-[#38383A]">{probability.toFixed(2)}%</span>
      </p>
    </GridItem>
  );
};

const CloseButton = (props: CloseBtnPropsType) => {
  const { item, handleCloseTrade, isDisabled } = props;
  const { pnl: earlyPnl } = useEarlyPnl({
    trade: item,
  });
  const { earlycloseAmount } = earlyPnl;
  return (
    <Button
      bg={+earlycloseAmount < 0 ? '#F03D3E' : '#1ED768'}
      color="#fff"
      w="full"
      _hover={{ bgColor: +earlycloseAmount < 0 ? '#F03D3E' : '#1ED768', textColor: '#fff' }}
      _active={{ bgColor: +earlycloseAmount < 0 ? '#F03D3E' : '#1ED768', textColor: '#fff' }}
      rounded="md"
      onClick={handleCloseTrade}
      isDisabled={isDisabled}
    >
      Close at {(+earlycloseAmount).toFixed(2)}
    </Button>
  );
};

const TradeBox = (props: PropsType) => {
  const { item } = props;
  const { price } = useTradeStore();
  const queryClient = useQueryClient();
  const toast = useToast();
  const { setListLines, listLines } = useListShowLinesStore();
  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  const handleCloseTrade = async () => {
    try {
      const closingTime = dayjs().utc().unix();
      await closeTrade(item._id, closingTime.toString());
      queryClient.invalidateQueries({ queryKey: ['getActiveTrades'] });
      queryClient.invalidateQueries({ queryKey: ['getTradingHistory'] });
      queryClient.invalidateQueries({ queryKey: ['getTradeCancel'] });

      toast({
        position: 'top',
        render: ({ onClose }) => <ToastCloseTrade item={item} onClose={onClose} closeTime={closingTime} />,
      });
      const isRemove = listLines.some((line) => line._id === item._id);
      isRemove && setListLines(item);
    } catch (error) {
      toast({
        position: 'top',
        render: ({ onClose }) => <ToastLayout title="Close Unsuccessfully" status={Status.ERROR} close={onClose} />,
      });
    }
  };

  const timeOutCallBack = () => {
    queryClient.invalidateQueries({ queryKey: ['getActiveTrades'] });
    const isRemove = listLines.some((line) => line._id === item._id);
    isRemove && setListLines(item);
  };

  const reloadData = () => {
    queryClient.invalidateQueries({ queryKey: ['getActiveTrades'] });
  };

  useEffect(() => {
    if (item.state === State.OPENED) {
      const time =
        dayjs().utc().unix() > dayjs(item.openDate).add(1, 'minutes').utc().unix()
          ? 0
          : (dayjs(item.openDate).add(1, 'minutes').utc().unix() - dayjs().utc().unix()) * 1000;
      setTimeout(() => {
        setIsDisabled(false);
      }, time);
    }
  }, [item.openDate, item.state]);

  return (
    <Box bg="#0c0c10" padding={{ base: '10px', '2xl': '20px' }} marginBottom={2} rounded={'10px'}>
      <Flex alignItems="center" justifyContent="space-between" display={{ base: 'flex', xl: 'block', '4xl': 'flex' }}>
        <Center justifyContent={'initial'}>
          <Image alt="" src={`/images/icons/${item.pair}.png`} w="20px" h="20px" />
          <p className="px-2 text-sm font-normal text-[#fff]">{item.pair && item.pair.toUpperCase()}</p>
          {item.isAbove ? (
            <span className="flex h-6 items-center rounded border border-[#1ED768] px-[6px] text-sm font-normal text-[#1ED768]">
              <TriangleUpIcon color={'#1ED768'} marginRight="4px" />
              Up
            </span>
          ) : (
            <span className="flex h-6 items-center rounded border border-[#F03D3E] px-[6px] text-sm font-normal text-[#F03D3E]">
              <TriangleDownIcon color={'#F03D3E'} marginRight="4px" />
              Down
            </span>
          )}
        </Center>
        <Center justifyContent={{ base: 'initial', '4xl': 'end' }}>
          <span className="rounded bg-[#252528] px-2 text-[#9E9E9F]">Market</span>
        </Center>
      </Flex>
      {item.state === State.OPENED ? (
        <CountDown
          endTime={dayjs(item.openDate).utc().unix() + item.period}
          period={item.period}
          timeOutCallBack={timeOutCallBack}
        />
      ) : (
        <span className="flex items-center text-xs font-normal text-[#9E9E9F]">
          <span className="mr-1">{item.state === State.QUEUED ? 'In queue...' : 'Processing...'}</span>
          <RotateCw color="#1E3EF0" cursor="pointer" onClick={reloadData} />
        </span>
      )}
      <Box marginTop="2" marginBottom="3">
        <span className="rounded bg-[#252528] px-2 py-1 text-sm text-[#fff]">USDC</span>
      </Box>
      <Grid templateColumns="repeat(2, 1fr)" borderBottom="1px solid #242428" paddingBottom="3" marginBottom="3">
        <ShowPnL item={item} />
        <GridItem>
          <p className="mb-2 text-xs font-normal text-[#9E9E9F]">Current Price</p>
          {item?.pair && (
            <p className="text-sm font-normal text-[#FFFFFF]">
              <ShowPrice pair={item.pair.replace('-', '').toUpperCase()} /> {item.pair.split('-')[1].toUpperCase()}
            </p>
          )}
        </GridItem>
      </Grid>
      <Grid templateColumns="repeat(2, 1fr)" marginBottom="3">
        <GridItem>
          <p className="mb-2 text-xs font-normal text-[#9E9E9F]">Trade Size</p>
          <Tooltip
            hasArrow
            label={divide(item.tradeSize, 6)}
            bg="#050506"
            color={'white'}
            placement="bottom-start"
            borderRadius={'4px'}
            fontSize={'12px'}
          >
            <p className="text-sm font-normal text-[#FFFFFF]">{addComma(divide(item.tradeSize, 6), 2)} USDC</p>
          </Tooltip>
        </GridItem>
        <GridItem>
          <p className="mb-2 text-xs font-normal text-[#9E9E9F]">Max Payout</p>
          <p className="text-sm font-normal text-[#FFFFFF]">{addComma(divide(item.payout ?? 0, 6), 2)} USDC</p>
        </GridItem>
      </Grid>
      <CloseButton item={item} handleCloseTrade={handleCloseTrade} isDisabled={isDisabled} />
    </Box>
  );
};

export default TradeBox;
