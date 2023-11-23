'use client';
import { Flex, Image } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getTrades } from '@/services/trade';
import { useAccount, useNetwork } from 'wagmi';
import { ITradingData, ITradingParams } from '@/types/trade.type';
import TradeBox from './TradeBox';
import useUserStore from '@/store/useUserStore';
import React from 'react';
import { IPaginationResponse } from '@/types/api.type';
import useListShowLinesStore from '@/store/useListShowLinesStore';

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
  const queryClient = useQueryClient();
  const { updateListLine, listLines } = useListShowLinesStore();
  const [refetchInterval, setRefetchInterval] = useState(5000);

  useEffect(() => {
    if (chain) {
      setFilter({ ...defaultParams, network: chain.id.toString() });
    }
  }, [chain]);

  const {
    data: dataActiveTrades,
    isError,
    isInitialLoading,
    isSuccess,
  } = useQuery({
    queryKey: ['getActiveTrades'],
    queryFn: () => getTrades(filter),
    enabled: !!tokens && !!user && !!tokens?.access?.token && !!user?.isApproved && !!user?.isRegistered && !!address,
    cacheTime: 0,
    refetchInterval: refetchInterval,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (isError) {
      setRefetchInterval(0);
    }
    if (isSuccess) {
      setRefetchInterval(5000);
    }
  }, [isError, isSuccess]);

  useEffect(() => {
    const listActiceTrade: ITradingData[] = dataActiveTrades?.docs ? [...dataActiveTrades?.docs] : [];
    const listLimit: ITradingData[] =
      queryClient &&
      queryClient?.getQueryData(['getLimitOrders']) &&
      (queryClient.getQueryData(['getLimitOrders']) as IPaginationResponse<ITradingData>).docs
        ? [...(queryClient.getQueryData(['getLimitOrders']) as IPaginationResponse<ITradingData>).docs]
        : [];
    const listData: ITradingData[] = [...listActiceTrade, ...listLimit];
    const tempList = [];
    for (let i = 0; i < listLines.length; i++) {
      for (let j = 0; j < listData.length; j++) {
        if (listLines[i]._id === listData[j]._id) {
          tempList.push(listData[j]);
        }
      }
    }
    updateListLine(tempList);
  }, [dataActiveTrades, queryClient, updateListLine]);

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
