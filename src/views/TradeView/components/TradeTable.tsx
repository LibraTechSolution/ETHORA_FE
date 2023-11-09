'use client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Empty, Table } from 'antd';
import { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { Box, Button, Flex, Image, useToast, Text } from '@chakra-ui/react';
import { addComma } from '@/utils/number';
import { useAccount, useNetwork } from 'wagmi';
import { ITradingData, ITradingParams, State } from '@/types/trade.type';
import { closeTrade, getTrades } from '@/services/trade';
import { divide } from '@/utils/operationBigNumber';
import dayjs from 'dayjs';
import CountDown from './CountDown';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import { useEarlyPnl } from './TradeBox';
import { ToastLayout } from '@/components/ToastLayout';
import { Status } from '@/types/faucet.type';
import useUserStore from '@/store/useUserStore';
import useListShowLinesStore from '@/store/useListShowLinesStore';
import { RotateCw } from 'lucide-react';
import { ShowPrice } from './ShowPrice';
import { useSearchParams } from 'next/navigation';

const PnLCell = ({ trade }: { trade: ITradingData }) => {
  const { pnl: earlyPnl } = useEarlyPnl({
    trade,
  });
  const { earlycloseAmount, probability } = earlyPnl;
  return (
    <Box>
      <p className={`pr-1 text-sm font-normal ${+earlycloseAmount < 0 ? 'text-[#F03D3E]' : 'text-[#1ED768]'}`}>
        {(+earlycloseAmount).toFixed(2)}
      </p>
      <p className="text-[ #9E9E9F] text-xs font-normal">{probability.toFixed(2)}%</p>
    </Box>
  );
};

const TradeTable = ({ isProfile }: { isProfile?: boolean }) => {
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
  const queryClient = useQueryClient();
  const toast = useToast();
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

  const reloadData = () => {
    queryClient.invalidateQueries({ queryKey: ['getActiveTrades'] });
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
      render: (value) => <span>{addComma(divide(value, 8), 2)}</span>,
    },
    {
      title: 'Current Price',
      dataIndex: 'currentPrice',
      key: 'currentPrice',
      render: (value, record) => <ShowPrice pair={record.pair.replace('-', '').toUpperCase()} />,
    },
    {
      title: 'Open Time',
      dataIndex: 'openDate',
      key: 'openDate',
      render: (value) => (
        <div>
          <p>{dayjs(value).format('HH:mm:ss')}</p>
          <p className="text-[#9E9E9F]">{dayjs(value).format('MM/DD/YYYY')}</p>
        </div>
      ),
    },
    {
      title: 'Time Left',
      render: (value: ITradingData) =>
        value.state === State.OPENED ? (
          <CountDown endTime={dayjs(value.openDate).utc().unix() + value.period} period={value.period} hideBar={true} />
        ) : (
          <span className="flex items-center text-xs font-normal text-[#9E9E9F]">
            <span className="mr-1">{value.state === State.QUEUED ? 'In queue' : 'Processing...'}</span>
            <RotateCw color="#1E3EF0" cursor="pointer" onClick={reloadData} />
          </span>
        ),
    },
    {
      title: 'Close Time',
      render: (value: ITradingData) => (
        <div>
          <p>{dayjs(value.openDate).add(value.period, 'second').format('HH:mm:ss')}</p>
          <p className="text-[#9E9E9F]">{dayjs(value.openDate).add(value.period, 'second').format('MM/DD/YYYY')}</p>
        </div>
      ),
    },
    {
      title: 'Trade Size',
      dataIndex: 'tradeSize',
      key: 'tradeSize',
      render: (value) => <span>{addComma(divide(value, 6), 2)}</span>,
    },
    {
      title: 'PnL | Probability',
      dataIndex: 'probability',
      render: (value: string, record: ITradingData) => <PnLCell trade={record} />,
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
                    handleCancelTrade(record);
                  }}
                >
                  Close
                </Button>
              </Flex>
            ),
          },
        ]
      : []),
  ];

  const handleCancelTrade = async (item: ITradingData) => {
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

  const { data: tradingData, isInitialLoading } = useQuery({
    queryKey: ['getActiveTrades', filter],
    queryFn: () => getTrades(filter),
    onError: (error: any) => {
      console.log(error);
    },
    // select: transformData,
    enabled: isProfile
      ? !!checkAddress
      : !!tokens?.access?.token && !!user?.isApproved && !!user.isRegistered && !!address,
    cacheTime: 0,
    refetchInterval: 15000,
    refetchOnWindowFocus: false,
  });

  const handleChangePage = (pagination: TablePaginationConfig) => {
    setFilter({ ...defaultParams, page: pagination.current ?? 1 });
  };

  return (
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
  );
};
export default TradeTable;
