'use client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { SetStateAction, useEffect, useState } from 'react';
import { Table } from 'antd';
import { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { Box, Button, Flex, Image, useToast, Text } from '@chakra-ui/react';
import { addComma } from '@/utils/number';
import { useAccount, useNetwork } from 'wagmi';
import { ITradingData, ITradingParams } from '@/types/trade.type';
import { cancelTrade, getLimitOrders } from '@/services/trade';
import { divide } from '@/utils/operationBigNumber';
import dayjs from 'dayjs';
import CountDown from './CountDown';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import { ToastLayout } from '@/components/ToastLayout';
import { Status } from '@/types/faucet.type';
import EditLimitOrderModal from './EditLimitOrderModal';
import useUserStore from '@/store/useUserStore';
import useListShowLinesStore from '@/store/useListShowLinesStore';
import { ShowPrice } from './ShowPrice';
import { useSearchParams } from 'next/navigation';

const LimitOrdersTable = ({ isProfile }: { isProfile?: boolean }) => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const searchParams = useSearchParams();
  const addressURL = searchParams.get('address');
  const checkAddress = addressURL ? addressURL : address;

  const defaultParams: ITradingParams = {
    limit: 10,
    page: 1,
    network: '421613',
    ...(!!isProfile && { userAddress: checkAddress }),
  };

  const [filter, setFilter] = useState<ITradingParams>(defaultParams);
  const toast = useToast();
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<ITradingData | null>(null);
  const queryClient = useQueryClient();
  const { tokens, user } = useUserStore();
  const { setListLines, listLines } = useListShowLinesStore();

  useEffect(() => {
    if (chain) {
      setFilter({ ...defaultParams, network: chain.id.toString() });
    }
  }, [chain]);

  const showAndHideLine = (item: ITradingData) => {
    setListLines(item);
  };

  const columns: ColumnsType<ITradingData> = [
    {
      title: 'Asset',
      render: (value: ITradingData) => (
        <Flex justifyContent={'space-between'}>
          <Flex>
            <Image alt="" src={`/images/icons/${value.pair}.png`} w="20px" h="20px" />
            <span className="ml-2">{value?.pair && value.pair.toUpperCase()}</span>
          </Flex>
          {value.isAbove ? (
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
        </Flex>
      ),
    },
    {
      title: 'Strike Price',
      dataIndex: 'strike',
      key: 'strike',
      render: (value) => <span>{addComma(divide(value, 8), 2)} USDC</span>,
    },
    {
      title: 'Current Price',
      dataIndex: 'currentPrice',
      key: 'currentPrice',
      render: (value, record) => <ShowPrice pair={record.pair.replace('-', '').toUpperCase()} />,
    },
    {
      title: 'Time Left',
      dataIndex: 'limitOrderExpirationDate',
      key: 'limitOrderExpirationDate',
      render: (value: string) => <CountDown endTime={dayjs(value).unix()} period={0} hideBar={true} />,
    },
    {
      title: 'Order Expiry',
      dataIndex: 'limitOrderExpirationDate',
      key: 'limitOrderExpirationDate',
      render: (value: string) => (
        <div>
          <p>{dayjs(value).format('HH:mm:ss')}</p>
          <p className="text-[#9E9E9F]">{dayjs(value).format('MM/DD/YYYY')}</p>
        </div>
      ),
    },
    {
      title: 'Trade Size',
      dataIndex: 'tradeSize',
      key: 'tradeSize',
      render: (value) => <span>{addComma(divide(value, 6), 2)} USDC</span>,
    },
    ...(!isProfile
      ? [
          {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            width: '150px',
            render: (_: any, record: ITradingData) => (
              <Flex>
                <Button
                  colorScheme="blackAlpha"
                  size={'sm'}
                  onClick={() => {
                    showAndHideLine(record);
                  }}
                  marginRight={'12px'}
                >
                  {listLines.some((item) => item._id === record._id) ? 'Hide' : 'View'}
                </Button>
                <Button
                  colorScheme="blackAlpha"
                  size={'sm'}
                  onClick={() => {
                    setSelectedItem(record);
                    setIsOpenModal(true);
                  }}
                  marginRight={'12px'}
                >
                  Edit
                </Button>
                <Button
                  colorScheme="blackAlpha"
                  size={'sm'}
                  onClick={() => {
                    handleCancelTrade(record);
                  }}
                >
                  Cancel
                </Button>
              </Flex>
            ),
          },
        ]
      : []),
  ];

  const handleCancelTrade = async (item: ITradingData) => {
    try {
      await cancelTrade(item._id);
      queryClient.invalidateQueries({ queryKey: ['getLimitOrders'] });
      toast({
        position: 'top',
        render: ({ onClose }) => <ToastLayout title="Cancel Successfully" status={Status.SUCCESSS} close={onClose} />,
      });
      const isRemove = listLines.some((line) => line._id === item._id);
      isRemove && setListLines(item);
    } catch (error) {
      toast({
        position: 'top',
        render: ({ onClose }) => <ToastLayout title="Cancel Unsuccessfully" status={Status.ERROR} close={onClose} />,
      });
    }
  };

  const { data: tradingData, isInitialLoading } = useQuery({
    queryKey: ['getLimitOrders'],
    queryFn: () => getLimitOrders(filter),
    onError: (error: any) => {
      console.log(error);
    },
    // select: transformData,
    enabled: isProfile
      ? !!checkAddress
      : !!tokens?.access?.token && !!user?.isApproved && !!user.isRegistered && !!address,
    cacheTime: 0,
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });

  const handleChangePage = (pagination: TablePaginationConfig) => {
    setFilter({ ...defaultParams, page: pagination.current ?? 1 });
  };

  return (
    <>
      <Table
        columns={columns}
        dataSource={tradingData?.docs}
        pagination={{
          pageSize: tradingData?.meta.limit,
          current: tradingData?.meta.page,
          total: tradingData?.meta.totalDocs,
          hideOnSinglePage: true,
          showTotal: (total: number, range: [number, number]) => `Results: ${range[0]} - ${range[1]}  of ${total}`,
        }}
        // scroll={{ y: 300 }}
        scroll={{ x: 'max-content' }}
        loading={isInitialLoading}
        className="customTable"
        rowKey={(record) => record._id}
        onChange={handleChangePage}
        locale={{
          emptyText: (
            <Box
              background="#0C0C10"
              margin="-16px -16px"
              padding="20px"
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <Image src="/images/icons/empty.svg" width={'60px'} height={'50px'} alt="empty" />
              <Text color={'#6D6D70'} fontSize={'14px'}>
                No active trades at present.
              </Text>
            </Box>
          ),
        }}
      />
      {isOpenModal && (
        <EditLimitOrderModal
          item={selectedItem}
          isOpen={isOpenModal}
          onClose={() => {
            setSelectedItem(null);
            setIsOpenModal(false);
          }}
        />
      )}
    </>
  );
};
export default LimitOrdersTable;
