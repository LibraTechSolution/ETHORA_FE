'use client';
import { addComma } from '@/utils/number';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import { Flex, Center, GridItem, Button, Box, Grid, Image, useToast, Tooltip, Text } from '@chakra-ui/react';
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
import useListPairPrice from '@/store/useListPairPrice';
import { calculateOptionIV } from '@/utils/calculateOptionIV';
import { IConfigListPair } from '@/types/config.type';

interface PropsType {
  item: ITradingData;
}

interface CloseBtnPropsType {
  item: ITradingData;
  isDisabled: boolean;
  isTimeOut: boolean;
  handleCloseTrade: () => void;
}

export const useEarlyPnl = ({ trade, lockedAmmount }: { trade: ITradingData; lockedAmmount?: string }) => {
  const { listPairPrice } = useListPairPrice();
  const pair = trade.pair.replace('-', '').toUpperCase();
  const queryClient = useQueryClient();
  let IV = 1384;
  let IVFactorITM = 1000;
  let IVFactorOTM = 50;

  if (
    queryClient &&
    queryClient?.getQueryData(['getDataConfigPair']) &&
    (queryClient.getQueryData(['getDataConfigPair']) as IConfigListPair)
  ) {
    IV = +(queryClient.getQueryData(['getDataConfigPair']) as IConfigListPair)[pair].IV;
    IVFactorITM = +(queryClient.getQueryData(['getDataConfigPair']) as IConfigListPair)[pair].IVFactorITM;
    IVFactorOTM = +(queryClient.getQueryData(['getDataConfigPair']) as IConfigListPair)[pair].IVFactorOTM;
  }

  let probability = useMemo(
    () =>
      getProbability(
        trade,
        +listPairPrice[pair],
        calculateOptionIV(
          trade.isAbove ?? false,
          trade.strike / 1e8,
          +listPairPrice[pair],
          IV,
          IVFactorITM,
          IVFactorOTM,
        ) / 1e4,
      ),
    [trade, listPairPrice, pair],
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
        <Tooltip
          hasArrow
          label={
            <Box p={1} color="white">
              {addComma(+earlycloseAmount, 6)}
            </Box>
          }
          color="white"
          placement="top"
          bg="#050506"
        >
          <span className={`pr-1 text-sm font-normal ${+earlycloseAmount < 0 ? 'text-[#F03D3E]' : 'text-[#1ED768]'}`}>
            {addComma(+earlycloseAmount, 2)}
          </span>
        </Tooltip>
        <Tooltip
          hasArrow
          label={
            <Box p={1} color="white">
              {addComma(probability, 6)}%
            </Box>
          }
          color="white"
          placement="top"
          bg="#050506"
        >
          <span className="text-xs font-normal text-[#38383A]">{addComma(probability, 2)}%</span>
        </Tooltip>
      </p>
    </GridItem>
  );
};

const CloseButton = (props: CloseBtnPropsType) => {
  const { item, handleCloseTrade, isDisabled, isTimeOut } = props;
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
      isDisabled={isDisabled || isTimeOut}
    >
      {isTimeOut ? 'Processing' : `Close at ${(+earlycloseAmount).toFixed(2)}`}
    </Button>
  );
};

const TradeBox = (props: PropsType) => {
  const { item } = props;
  const queryClient = useQueryClient();
  const toast = useToast();
  const { setListLines, listLines } = useListShowLinesStore();
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [isTimeOut, setIsTimeOut] = useState<boolean>(false);

  const handleCloseTrade = async () => {
    setIsDisabled(true);
    try {
      const closingTime = dayjs().utc().unix();
      await closeTrade(item._id);
      queryClient.invalidateQueries({ queryKey: ['getActiveTrades'] });
      queryClient.invalidateQueries({ queryKey: ['getTradingHistory'] });
      queryClient.invalidateQueries({ queryKey: ['getTradeCancel'] });

      toast({
        position: 'top',
        render: ({ onClose }) => <ToastCloseTrade item={item} onClose={onClose} closeTime={closingTime} />,
      });
      const isRemove = listLines.some((line) => line._id === item._id);
      isRemove && setListLines(item);
      setIsDisabled(true);
    } catch (error) {
      setIsDisabled(false);
      toast({
        position: 'top',
        render: ({ onClose }) => <ToastLayout title="Close unsuccessfully" status={Status.ERROR} close={onClose} />,
      });
    }
  };

  const timeOutCallBack = () => {
    queryClient.invalidateQueries({ queryKey: ['getActiveTrades'] });
    const isRemove = listLines.some((line) => line._id === item._id);
    isRemove && setListLines(item);
    setIsTimeOut(true);
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
          endTime={
            item?.userCloseDate
              ? dayjs(item.userCloseDate).utc().unix()
              : dayjs(item.openDate).utc().unix() + item.period
          }
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
        {isTimeOut ? (
          <GridItem>
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
          </GridItem>
        ) : (
          <ShowPnL item={item} />
        )}
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
          <p className="text-sm font-normal text-[#FFFFFF]">
            <Tooltip
              hasArrow
              label={divide(item.tradeSize, 6)}
              bg="#050506"
              color={'white'}
              placement="bottom-start"
              borderRadius={'4px'}
              fontSize={'12px'}
            >
              <span>{addComma(divide(item.tradeSize, 6), 2)} USDC</span>
            </Tooltip>
          </p>
        </GridItem>
        <GridItem>
          <p className="mb-2 text-xs font-normal text-[#9E9E9F]">Max Payout</p>
          <p className="text-sm font-normal text-[#FFFFFF]">
            <Tooltip
              hasArrow
              label={addComma(divide(item.payout ?? 0, 6), 6)}
              bg="#050506"
              color={'white'}
              placement="bottom-start"
              borderRadius={'4px'}
              fontSize={'12px'}
            >
              <span>{addComma(divide(item.payout ?? 0, 6), 2)} USDC</span>
            </Tooltip>
          </p>
        </GridItem>
      </Grid>
      <CloseButton item={item} handleCloseTrade={handleCloseTrade} isDisabled={isDisabled} isTimeOut={isTimeOut} />
    </Box>
  );
};

export default TradeBox;
