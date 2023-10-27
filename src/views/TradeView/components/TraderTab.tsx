'use client';
import useTradeStore from '@/store/useTradeStore';
import { addComma } from '@/utils/number';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import { Flex, Center, GridItem, Button, Box, Grid, Image } from '@chakra-ui/react';
import CountDown from './CountDown';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTrades } from '@/services/trade';
import { useNetwork } from 'wagmi';
import { ITradingData, ITradingParams } from '@/types/trade.type';
import TradeBox from './TradeBox';

const defaultParams: ITradingParams = {
  limit: 30,
  page: 1,
  network: '421613',
};

const TraderTab = () => {
  const { chain } = useNetwork();
  const [filter, setFilter] = useState<ITradingParams>(defaultParams);

  useEffect(() => {
    if (chain) {
      setFilter({ ...defaultParams, network: chain.id.toString() });
    }
  }, [chain]);

  const {
    data: dataActiveTrades,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['getActiveTrades', filter],
    queryFn: () => getTrades(filter),
    onError: (error: any) => {
      console.log(error);
    },
    // enabled: !!networkID,
    cacheTime: 0,
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });

  return (
    <>
      {!isLoading &&
        dataActiveTrades &&
        dataActiveTrades?.docs.map((item: ITradingData) => <TradeBox item={item} key={item._id} />)}
      {!isLoading && (isError || !dataActiveTrades || (dataActiveTrades && dataActiveTrades?.docs.length === 0)) && (
        <Flex direction={'column'} alignItems={'center'} bg="#0c0c10" paddingY="60px">
          <Image alt="" src="/images/icons/pack.png" w="60px" h="50px" />
          <p className="text-sm font-normal text-[#6D6D70]">There are no placed trades</p>
        </Flex>
      )}
    </>
  );
};

export default TraderTab;
