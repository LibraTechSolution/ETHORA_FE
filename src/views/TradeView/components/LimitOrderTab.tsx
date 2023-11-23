'use client';
import { Flex, Image } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getLimitOrders } from '@/services/trade';
import { useAccount, useNetwork } from 'wagmi';
import { ITradingData, ITradingParams } from '@/types/trade.type';
import LimitOrderBox from './LimitOrderBox';
import EditLimitOrderModal from './EditLimitOrderModal';
import useUserStore from '@/store/useUserStore';

const defaultParams: ITradingParams = {
  limit: 30,
  page: 1,
  network: '421613',
};

const LimitOrderTab = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const [filter, setFilter] = useState<ITradingParams>(defaultParams);
  const { tokens, user } = useUserStore();
  const [refetchInterval, setRefetchInterval] = useState(5000);

  useEffect(() => {
    if (chain) {
      setFilter({ ...defaultParams, network: chain.id.toString() });
    }
  }, [chain]);

  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<ITradingData | null>(null);
  const {
    data: dataLimitOrders,
    isError,
    isSuccess,
    isInitialLoading,
  } = useQuery({
    queryKey: ['getLimitOrders'],
    queryFn: () => getLimitOrders(filter),
    enabled: !!tokens?.access?.token && !!user?.isApproved && !!user.isRegistered && !!address,
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

  const openEditModal = (item: ITradingData) => {
    if (item) {
      setSelectedItem(item);
      setIsOpenModal(true);
    }
  };

  return (
    <>
      {!isInitialLoading &&
        dataLimitOrders &&
        dataLimitOrders?.docs.map((item: ITradingData) => (
          <LimitOrderBox item={item} key={item._id} openEditModal={openEditModal} />
        ))}
      {!isInitialLoading &&
        (isError || !dataLimitOrders || (dataLimitOrders && dataLimitOrders?.docs.length === 0)) && (
          <Flex direction={'column'} alignItems={'center'} bg="#0c0c10" paddingY="60px">
            <Image alt="" src="/images/icons/pack.png" w="60px" h="50px" />
            <p className="text-sm font-normal text-[#6D6D70]">There are no pending orders.</p>
          </Flex>
        )}
      {isOpenModal && (
        <EditLimitOrderModal item={selectedItem} isOpen={isOpenModal} onClose={() => setIsOpenModal(false)} />
      )}
    </>
  );
};

export default LimitOrderTab;
