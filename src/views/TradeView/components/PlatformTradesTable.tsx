'use client';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Table } from 'antd';
import { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { Box, Flex, Image, Text } from '@chakra-ui/react';
import { addComma } from '@/utils/number';
import { useAccount, useNetwork } from 'wagmi';
import { ITradingData, ITradingParams } from '@/types/trade.type';
import { getPlatformsTrades } from '@/services/trade';
import useTradeStore from '@/store/useTradeStore';
import { divide } from '@/utils/operationBigNumber';
import dayjs from 'dayjs';
import CountDown from './CountDown';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import useUserStore from '@/store/useUserStore';
import { ShowPrice } from './ShowPrice';

const defaultParams: ITradingParams = {
  limit: 10,
  page: 1,
  network: '421613',
};

const PlatformTradesTable = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const [filter, setFilter] = useState<ITradingParams>(defaultParams);
  const { tokens, user } = useUserStore();

  useEffect(() => {
    if (chain) {
      setFilter({ ...defaultParams, network: chain.id.toString() });
    }
  }, [chain]);

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
      render: (value, record: ITradingData) => (
        <span>
          {addComma(divide(value, 8), 2)} {record.pair.split('-')[1].toUpperCase()}
        </span>
      ),
    },
    {
      title: 'Current Price',
      render: (value: ITradingData) => (
        <>
          <ShowPrice pair={value.pair.replace('-', '').toUpperCase()} /> {value.pair.split('-')[1].toUpperCase()}
        </>
      ),
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
      render: (value: ITradingData) => (
        <CountDown endTime={dayjs(value.openDate).utc().unix() + value.period} period={value.period} hideBar={true} />
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
      render: (value) => <span>{addComma(divide(value, 6), 2)} USDC</span>,
    },
  ];

  const {
    data: tradingData,
    isInitialLoading,
    isError,
  } = useQuery({
    queryKey: ['getPlatformTrades', filter],
    queryFn: () => getPlatformsTrades(filter),
    onError: (error: any) => {
      console.log(error);
    },
    // select: transformData,
    enabled: !!tokens?.access?.token && !!user?.isApproved && !!user.isRegistered && !!address,
    cacheTime: 0,
    refetchInterval: 10000,
    refetchOnWindowFocus: false,
  });

  const handleChangePage = (pagination: TablePaginationConfig) => {
    setFilter({ ...defaultParams, page: pagination.current ?? 1, limit: pagination.pageSize ?? 10 });
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
              No active platform trades at present.
            </Text>
          </Box>
        ),
      }}
    />
  );
};
export default PlatformTradesTable;
