'use client';
import { Flex, Image } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTrades } from '@/services/trade';
import { useAccount, useNetwork } from 'wagmi';
import { ITradingData, ITradingParams } from '@/types/trade.type';
import TradeBox from './TradeBox';
import useUserStore from '@/store/useUserStore';
import React from 'react';

const defaultParams: ITradingParams = {
  limit: 30,
  page: 1,
  network: '421613',
};

const TraderTab = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const [filter, setFilter] = useState<ITradingParams>(defaultParams);
  const { tokens, user } = useUserStore();

  useEffect(() => {
    if (chain) {
      setFilter({ ...defaultParams, network: chain.id.toString() });
    }
  }, [chain]);

  const {
    data: dataActiveTrades,
    isError,
    isInitialLoading,
  } = useQuery({
    queryKey: ['getActiveTrades'],
    queryFn: () => getTrades(filter),
    onError: (error: any) => {
      console.log(error);
    },
    enabled: !!tokens?.access?.token && !!user?.isApproved && !!user.isRegistered && !!address,
    cacheTime: 0,
    refetchInterval: 10000,
    refetchOnWindowFocus: false,
  });

  return (
    <>
      {!isInitialLoading &&
        dataActiveTrades &&
        dataActiveTrades?.docs.map((item: ITradingData) => <TradeBox item={item} key={item._id} />)}
      {!isInitialLoading &&
        (isError || !dataActiveTrades || (dataActiveTrades && dataActiveTrades?.docs.length === 0)) && (
          <Flex direction={'column'} alignItems={'center'} bg="#0c0c10" paddingY="60px">
            <Image alt="" src="/images/icons/pack.png" w="60px" h="50px" />
            <p className="text-sm font-normal text-[#6D6D70]">There are no placed trades</p>
          </Flex>
        )}
    </>
  );
};

export default React.memo(TraderTab);
