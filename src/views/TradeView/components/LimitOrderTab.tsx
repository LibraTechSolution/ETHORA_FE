'use client';
import { Flex, Image } from '@chakra-ui/react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getLimitOrders } from '@/services/trade';
import { useNetwork } from 'wagmi';
import { ITradingData } from '@/types/trade.type';
import LimitOrderBox from './LimitOrderBox';
import EditLimitOrderModal from './EditLimitOrderModal';

const LimitOrderTab = () => {
  const { chain } = useNetwork();
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<ITradingData | null>(null);
  const {
    data: dataLimitOrders,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['getLimitOrders'],
    queryFn: () => getLimitOrders(chain?.id ?? 5),
    onError: (error: any) => {
      console.log(error);
    },
    // enabled: !!networkID,
    cacheTime: 0,
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });

  const openEditModal = (item: ITradingData) => {
    if (item) {
      setSelectedItem(item);
      setIsOpenModal(true);
    }
  };

  return (
    <>
      {!isLoading &&
        dataLimitOrders &&
        dataLimitOrders?.data?.data?.docs.map((item: ITradingData) => (
          <LimitOrderBox item={item} key={item._id} openEditModal={openEditModal} />
        ))}
      {!isLoading &&
        (isError || !dataLimitOrders || (dataLimitOrders && dataLimitOrders?.data?.data?.docs.length === 0)) && (
          <Flex direction={'column'} alignItems={'center'} bg="#0c0c10" paddingY="60px">
            <Image alt="" src="/images/icons/pack.png" w="60px" h="50px" />
            <p className="text-sm font-normal text-[#6D6D70]">There are no placed trades</p>
          </Flex>
        )}
      {isOpenModal && (
        <EditLimitOrderModal item={selectedItem} isOpen={isOpenModal} onClose={() => setIsOpenModal(false)} />
      )}
    </>
  );
};

export default LimitOrderTab;
