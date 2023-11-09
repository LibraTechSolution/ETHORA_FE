'use client';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Table } from 'antd';
import { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { addComma } from '@/utils/number';
import { useAccount, useNetwork } from 'wagmi';
import { getTradeCancel } from '@/services/trade';
import { ITradingData, ITradingParams, TRADE_STATUS } from '@/types/trade.type';
import { Box, Flex, Image, Text } from '@chakra-ui/react';
import { divide } from '@/utils/operationBigNumber';
import { TriangleUpIcon, TriangleDownIcon } from '@chakra-ui/icons';
import useUserStore from '@/store/useUserStore';
import dayjs from 'dayjs';

const defaultParams: ITradingParams = {
  limit: 10,
  page: 1,
  network: '421613',
};

const CancelTable = () => {
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
      render: (value) => <span>{addComma(divide(value, 8), 2)} USDC</span>,
    },
    {
      title: 'Trade Size',
      dataIndex: 'tradeSize',
      key: 'tradeSize',
      render: (value) => <span>{addComma(divide(value, 6), 2)} USDC</span>,
    },
    {
      title: 'Queue',
      dataIndex: 'queuedDate',
      key: 'queuedDate',
      render: (value) => (
        <div>
          <p>{dayjs(value).format('HH:mm:ss')}</p>
          <p className="text-[#9E9E9F]">{dayjs(value).format('MM/DD/YYYY')}</p>
        </div>
      ),
    },
    {
      title: 'Cancellation',
      dataIndex: 'cancellationDate',
      key: 'cancellationDate',
      render: (value) =>
        value ? (
          <div>
            <p>{dayjs(value).format('HH:mm:ss')}</p>
            <p className="text-[#9E9E9F]">{dayjs(value).format('MM/DD/YYYY')}</p>
          </div>
        ) : (
          <span>---</span>
        ),
    },
    {
      title: 'Reason',
      dataIndex: 'cancellationReason',
      key: 'cancellationReason',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: () => (
        <Box display={'inline-block'}>
          <Box
            border={'1px solid #F03D3E'}
            display="flex"
            px={2}
            rounded={4}
            py={'2px'}
            alignItems="center"
            backgroundColor="#39272A"
          >
            <Image alt="" src={'/images/icons/x-circle-red.svg'} w="10px" h="10px" />
            <Text paddingLeft={'5px'} textColor={'#F03D3E'}>
              Cancelled
            </Text>
          </Box>
        </Box>
      ),
    },
  ];

  const { data: tradingData, isInitialLoading } = useQuery({
    queryKey: ['getTradeCancel', filter],
    queryFn: () => getTradeCancel(filter),
    onError: (error: any) => {
      // notification.error({ message: error.message });
      console.log(error);
    },
    enabled: !!tokens?.access?.token && !!user?.isApproved && !!user.isRegistered && !!address,
    cacheTime: 0,
    refetchInterval: 5000,
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
    />
  );
};
export default CancelTable;
