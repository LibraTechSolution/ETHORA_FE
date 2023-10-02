'use client';
import { getTradingActive } from '@/services/profile';
import { ITradingActiveData, ITradingActiveParams } from '@/types/profile';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Space, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Button, Flex } from '@chakra-ui/react';
import { addComma } from '@/utils/number';

type TradingActiveTable = {
  id: string;
  asset: string;
  strikePrice: string;
  currentPrice: number;
  openTime: string;
  timeLeft: string;
  closeTime: string;
  tradeSize: string;
  pnL: string;
  action?: any;
};

const defaultParams: ITradingActiveParams = {
  limit: 1,
  page: 1,
  chain: '8453',
};

const columns: ColumnsType<TradingActiveTable> = [
  {
    title: 'Asset',
    dataIndex: 'asset',
    key: 'asset',
  },
  {
    title: 'Strike Price',
    dataIndex: 'strikePrice',
    key: 'strikePrice',
    render: (value) => <span>{addComma(value)}</span>,
  },
  {
    title: 'Current Price',
    dataIndex: 'currentPrice',
    key: 'currentPrice',
    render: (value) => <span>{addComma(value)}</span>,
  },
  {
    title: 'Open Time',
    dataIndex: 'openTime',
    key: 'openTime',
  },
  {
    title: 'Time Left',
    dataIndex: 'timeLeft',
    key: 'timeLeft',
  },
  {
    title: 'Close Time',
    dataIndex: 'closeTime',
    key: 'closeTime',
  },
  {
    title: 'Trade Size',
    dataIndex: 'tradeSize',
    key: 'tradeSize',
    render: (value) => <span>{addComma(value)}</span>,
  },
  {
    title: 'PnL | Probability',
    dataIndex: 'pnL',
    key: 'pnL',
  },
  {
    title: 'Action',
    dataIndex: 'action',
    key: 'action',
    width: '150px',
    render: (_, record) => (
      <Flex>
        <Button
          colorScheme="blackAlpha"
          size={'sm'}
          onClick={() => {
            console.log('recordView', record);
          }}
          marginRight={'12px'}
        >
          View
        </Button>
        <Button
          colorScheme="blackAlpha"
          size={'sm'}
          onClick={() => {
            console.log('recordClose', record);
          }}
        >
          Close
        </Button>
      </Flex>
    ),
  },
];

const ActiveTab = () => {
  const [filter, setFilter] = useState<ITradingActiveParams>(defaultParams);

  const transformDataTradingActive = (data: ITradingActiveData[]): any =>
    data?.map((item: ITradingActiveData) => {
      console.log(item);
      // const categoryNum = Number(item?.id) % 100;
      return {
        id: item._id,
        asset: 'N/a',
        strikePrice: item.strike,
        currentPrice: 'N/a',
        openTime: item.openDate,
        timeLeft: 'N/a',
        closeTime: item.closeDate,
        tradeSize: item.tradeSize,
        pnL: 'N/a',
      };
    });

  const {
    fetchStatus: fetchTradingActive,
    data: dataTradingActive,
    isLoading,
  } = useQuery({
    queryKey: ['getTradingActive', filter],
    queryFn: () => getTradingActive(filter),
    onError: (error: any) => {
      // notification.error({ message: error.message });
      console.log(error);
    },
    select: transformDataTradingActive,
    cacheTime: 0,
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });

  return (
    <Table
      columns={columns}
      dataSource={dataTradingActive}
      // pagination={{ pageSize: 50 }}
      // scroll={{ y: 300 }}
      scroll={{ x: 'max-content' }}
      loading={isLoading}
      className="customTable"
      rowKey={(record) => record.id}
    />
  );
};
export default ActiveTab;
