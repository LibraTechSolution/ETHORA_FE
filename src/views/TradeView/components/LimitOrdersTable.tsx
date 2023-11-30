'use client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { SetStateAction, useContext, useEffect, useState } from 'react';
import { Table } from 'antd';
import { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { Box, Button, Flex, Image, useToast, Text, Tooltip, Spacer } from '@chakra-ui/react';
import { addComma } from '@/utils/number';
import { useAccount, useNetwork } from 'wagmi';
import { ITradingData, ITradingParams } from '@/types/trade.type';
import { cancelTrade, getLimitOrders } from '@/services/trade';
import { add, divide, multiply, subtract } from '@/utils/operationBigNumber';
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
import { convertDurationToHourAndMinutes, convertDurationToHourMinutesSeconds } from '@/utils/time';
import { TradeContext } from '..';
import { configDecimal } from './TradeTable';
import { appConfig } from '@/config';

const LimitOrdersTable = ({ isProfile }: { isProfile?: boolean }) => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const searchParams = useSearchParams();
  const addressURL = searchParams.get('address');
  const checkAddress = addressURL ? addressURL : address;

  const defaultParams: ITradingParams = {
    limit: 10,
    page: 1,
    network: Number(appConfig.chainId),
    ...(!!isProfile && { userAddress: checkAddress }),
  };

  const [filter, setFilter] = useState<ITradingParams>(defaultParams);
  const toast = useToast();
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<ITradingData | null>(null);
  const queryClient = useQueryClient();
  const { tokens, user } = useUserStore();
  const { updateLimitOrderSize } = useContext(TradeContext);
  const { setListLines, listLines } = useListShowLinesStore();
  const [refetchInterval, setRefetchInterval] = useState(5000);

  useEffect(() => {
    if (chain) {
      setFilter({ ...defaultParams, network: chain.id });
    }
  }, [chain]);

  useEffect(() => {
    isProfile && setFilter({ ...defaultParams, userAddress: addressURL ? addressURL : address });
  }, [address, addressURL, isProfile]);

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
            <span className="ml-2 mr-4">{value?.pair && value.pair.toUpperCase()}</span>
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
      title: 'Trigger Price',
      dataIndex: 'strike',
      key: 'strike',
      render: (value, record) => (
        <>
          <p>
            {record?.pair && (
              <Tooltip
                hasArrow
                label={
                  <Box p={1} color="white">
                    {addComma(divide(value, configDecimal[record?.pair.replace('-', '').toUpperCase()]), 2)}{' '}
                    {record.pair.split('-')[1].toUpperCase()}
                  </Box>
                }
                color="white"
                placement="top"
                bg="#050506"
              >
                <span>
                  {addComma(divide(value, configDecimal[record?.pair.replace('-', '').toUpperCase()]), 2)}{' '}
                  {record.pair.split('-')[1].toUpperCase()}
                </span>
              </Tooltip>
            )}
          </p>

          {record?.pair && (
            <Tooltip
              hasArrow
              label={
                <Box w="100%" p={1} color="white">
                  The strike price will vary from{' '}
                  {addComma(
                    divide(
                      subtract(
                        record.strike.toString(),
                        multiply(record.strike.toString(), ((record.slippage ?? 0) / 10000).toString()),
                      ),
                      configDecimal[record?.pair.replace('-', '').toUpperCase()],
                    ),
                    6,
                  )}{' '}
                  to{' '}
                  {addComma(
                    divide(
                      add(
                        record.strike.toString(),
                        multiply(record.strike.toString(), ((record.slippage ?? 0) / 10000).toString()),
                      ),
                      configDecimal[record?.pair.replace('-', '').toUpperCase()],
                    ),
                    6,
                  )}
                </Box>
              }
              color="white"
              placement="top"
              bg="#050506"
              minWidth="215px"
            >
              <Box className="inline-block text-[#9E9E9F]">
                <Flex className="items-center">
                  <Image alt="warning" src={`/images/icons/warning-grey.svg`} w="12px" h="12px" marginRight={'6px'} />
                  Slippage - {record.slippage / 100}%
                </Flex>
              </Box>
            </Tooltip>
          )}
        </>
      ),
    },
    {
      title: 'Current Price',
      dataIndex: 'currentPrice',
      key: 'currentPrice',
      render: (value, record) =>
        record?.pair && (
          <>
            <ShowPrice pair={record.pair.replace('-', '').toUpperCase()} /> {record.pair.split('-')[1].toUpperCase()}
          </>
        ),
    },
    {
      title: 'Duration',
      dataIndex: 'period',
      key: 'Duration',
      render: (value) => convertDurationToHourMinutesSeconds(value, true),
    },
    {
      title: 'Order Expiry',
      dataIndex: 'limitOrderExpirationDate',
      key: 'limitOrderExpirationDate',
      render: (value: string) => (
        <Tooltip
          hasArrow
          label={
            <Box p={1} color="white">
              {dayjs(value).utc().format('HH:mm:ss')} {dayjs(value).utc().format('MM/DD/YYYY')} UTC
            </Box>
          }
          color="white"
          placement="top"
          bg="#050506"
        >
          <div>
            <p>{dayjs(value).format('HH:mm:ss')}</p>
            <p className="text-[#9E9E9F]">{dayjs(value).format('MM/DD/YYYY')}</p>
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'Trade Size',
      dataIndex: 'tradeSize',
      key: 'tradeSize',
      render: (value) => (
        <Tooltip
          hasArrow
          label={
            <Box p={1} color="white">
              {addComma(divide(value, 6), 6)} USDC
            </Box>
          }
          color="white"
          placement="top"
          bg="#050506"
        >
          <span>{addComma(divide(value, 6), 2)} USDC</span>
        </Tooltip>
      ),
    },
    ...(!isProfile
      ? [
          {
            title: ' ',
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
        render: ({ onClose }) => (
          <ToastLayout status={Status.SUCCESSS} close={onClose}>
            <p className="font-semibold text-[#fff]">Order cancelled</p>
            <p className="text-[#9E9E9F]">
              <span className="text-[#fff]">{item.pair.toUpperCase()}</span> to go{' '}
              <span className="text-[#fff]">{item.isAbove ? 'Higher' : 'Lower'}</span>
            </p>
            <p className="text-[#9E9E9F]">
              Total amount: <span className="text-[#fff]">{addComma(divide(item.tradeSize, 6), 2)}</span> USDC
            </p>
          </ToastLayout>
        ),
      });
      const isRemove = listLines.some((line) => line._id === item._id);
      isRemove && setListLines(item);
    } catch (error) {
      toast({
        position: 'top',
        render: ({ onClose }) => <ToastLayout title="Cancel unsuccessfully" status={Status.ERROR} close={onClose} />,
      });
    }
  };

  const {
    data: tradingData,
    isInitialLoading,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ['getLimitOrders', filter],
    queryFn: () => getLimitOrders(filter),
    // select: transformData,
    enabled: isProfile
      ? !!checkAddress
      : !!tokens && !!user && !!tokens?.access?.token && !!user?.isApproved && !!user?.isRegistered && !!address,
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

  const handleChangePage = (pagination: TablePaginationConfig) => {
    setFilter({ ...defaultParams, page: pagination.current ?? 1 });
  };

  useEffect(() => {
    updateLimitOrderSize(tradingData?.meta?.totalDocs ?? 0);
  }, [tradingData, updateLimitOrderSize]);

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
                No active limit orders.
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
