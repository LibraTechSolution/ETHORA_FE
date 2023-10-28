'use client';
import useTradeStore from '@/store/useTradeStore';
import { addComma } from '@/utils/number';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import { Flex, Center, GridItem, Button, Box, Grid, Image, useToast, Tooltip } from '@chakra-ui/react';
import CountDown from './CountDown';
import dayjs from 'dayjs';
import { ITradingData } from '@/types/trade.type';
import { closeTrade } from '@/services/trade';
import { useQueryClient } from '@tanstack/react-query';
import { ToastLayout } from '@/components/ToastLayout';
import { Status } from '@/types/faucet.type';
import { getProbability } from '@/utils/helper';
import { useMemo } from 'react';
import { divide, subtract, multiply, gte } from '@/utils/operationBigNumber';
import { Address, useContractRead } from 'wagmi';
import { appConfig } from '@/config';
import optionsConfigABI from '@/config/abi/optionsConfigABI';
import BigNumber from 'bignumber.js';
import useListShowLinesStore from '@/store/useListShowLinesStore';

interface PropsType {
  item: ITradingData;
}

export const useEarlyPnl = ({ trade, lockedAmmount }: { trade: ITradingData; lockedAmmount?: string }) => {
  const { price } = useTradeStore();
  const { data: iv } = useContractRead({
    address: appConfig.optionsConfigSC as Address,
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

const TradeBox = (props: PropsType) => {
  const { item } = props;
  const { price } = useTradeStore();
  const queryClient = useQueryClient();
  const toast = useToast();
  const { pnl: earlyPnl } = useEarlyPnl({
    trade: item,
  });
  const { earlycloseAmount, isWin, probability } = earlyPnl;
  const { setListLines } = useListShowLinesStore();

  const handleCloseTrade = async () => {
    try {
      await closeTrade(item._id);
      queryClient.invalidateQueries({ queryKey: ['getActiveTrades'] });
      toast({
        position: 'top',
        render: ({ onClose }) => <ToastLayout title="Close Successfully" status={Status.SUCCESSS} close={onClose} />,
      });
    } catch (error) {
      console.log(error);
      toast({
        position: 'top',
        render: ({ onClose }) => <ToastLayout title="Close Unsuccessfully" status={Status.ERROR} close={onClose} />,
      });
    }
  };

  const timeOutCallBack = () => {
    queryClient.invalidateQueries({ queryKey: ['getActiveTrades'] });
    setListLines(item);
  };

  return (
    <Box bg="#0c0c10" padding="20px" marginBottom={2} rounded={'10px'}>
      <Flex alignItems="center" justifyContent="space-between" display={{ base: 'flex', xl: 'block', '2xl': 'flex' }}>
        <Center>
          <Image alt="" src={`/images/icons/${item.pair}.png`} w="20px" h="20px" />
          <p className="px-2 text-sm font-normal text-[#fff]">{item.pair && item.pair.toUpperCase()}</p>
          {item.isAbove ? (
            <span className="h-6 rounded border border-[#1ED768] px-[6px] text-sm font-normal text-[#1ED768]">
              <TriangleUpIcon color={'#1ED768'} marginRight="4px" />
              Up
            </span>
          ) : (
            <span className="h-6 rounded border border-[#F03D3E] px-[6px] text-sm font-normal text-[#F03D3E]">
              <TriangleDownIcon color={'#F03D3E'} marginRight="4px" />
              Down
            </span>
          )}
        </Center>
        <Center>
          <span className="rounded bg-[#252528] px-2 text-[#9E9E9F]">Market</span>
        </Center>
      </Flex>
      <CountDown
        endTime={dayjs(item.openDate).utc().unix() + item.period}
        period={item.period}
        timeOutCallBack={timeOutCallBack}
      />
      <Box marginTop="2" marginBottom="3">
        <span className="rounded bg-[#252528] px-2 py-1 text-sm text-[#fff]">USDC</span>
      </Box>
      <Grid templateColumns="repeat(2, 1fr)" borderBottom="1px solid #242428" paddingBottom="3" marginBottom="3">
        <GridItem>
          <p className="mb-2 text-xs font-normal text-[#9E9E9F]">PnL|Probability</p>
          <p>
            <span className={`pr-1 text-sm font-normal ${+earlycloseAmount < 0 ? 'text-[#F03D3E]' : 'text-[#1ED768]'}`}>
              {(+earlycloseAmount).toFixed(2)}
            </span>
            <span className="text-xs font-normal text-[#38383A]">{probability.toFixed(2)}%</span>
          </p>
        </GridItem>
        <GridItem>
          <p className="mb-2 text-xs font-normal text-[#9E9E9F]">Current Price</p>
          <Tooltip
            hasArrow
            label={price}
            bg="#050506"
            color={'white'}
            placement="bottom-start"
            borderRadius={'4px'}
            fontSize={'12px'}
          >
            <p className="text-sm font-normal text-[#FFFFFF]">{addComma(price.toFixed(2), 2)}</p>
          </Tooltip>
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
          <p className="text-sm font-normal text-[#FFFFFF]">{item.payout} USDC</p>
        </GridItem>
      </Grid>
      <Button
        bg={+earlycloseAmount < 0 ? '#F03D3E' : '#1ED768'}
        color="#fff"
        w="full"
        _hover={{ bgColor: +earlycloseAmount < 0 ? '#F03D3E' : '#1ED768', textColor: '#fff' }}
        _active={{ bgColor: +earlycloseAmount < 0 ? '#F03D3E' : '#1ED768', textColor: '#fff' }}
        rounded="md"
        onClick={handleCloseTrade}
      >
        Close at {(+earlycloseAmount).toFixed(2)}
      </Button>
    </Box>
  );
};

export default TradeBox;
