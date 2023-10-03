'use client';
import { getTradingLimitOrder } from '@/services/profile';
import { ITradingLimitOrderData, ITradingLimitOrderParams } from '@/types/profile';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Space, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Button, Flex } from '@chakra-ui/react';
import { addComma } from '@/utils/number';

type TradingLimitOrderTable = {
  id: string;
  asset: string;
  triggerPrice: string;
  currentPrice: number;
  duration: string;
  orderExpiry: string;
  tradeSize: string;
  action?: any;
};

const defaultParams: ITradingLimitOrderParams = {
  limit: 1,
  page: 1,
  chain: '8453',
};

const columns: ColumnsType<TradingLimitOrderTable> = [
  {
    title: 'Asset',
    dataIndex: 'asset',
    key: 'asset',
  },
  {
    title: 'TriggerPrice',
    dataIndex: 'triggerPrice',
    key: 'triggerPrice',
    render: (value) => <span>{addComma(value)}</span>,
  },
  {
    title: 'Current Price',
    dataIndex: 'currentPrice',
    key: 'currentPrice',
    render: (value) => <span>{addComma(value)}</span>,
  },
  {
    title: 'Duration',
    dataIndex: 'duration',
    key: 'duration',
  },
  {
    title: 'Order Expiry',
    dataIndex: 'orderExpiry',
    key: 'orderExpiry',
  },
  {
    title: 'Trade Size',
    dataIndex: 'tradeSize',
    key: 'tradeSize',
    render: (value) => <span>{addComma(value)}</span>,
  },
  {
    title: 'Action',
    dataIndex: 'action',
    key: 'action',
    width: '200px',
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
            console.log('recordEdit', record);
          }}
          marginRight={'12px'}
        >
          Edit
        </Button>
        <Button
          colorScheme="blackAlpha"
          size={'sm'}
          onClick={() => {
            console.log('recordCancel', record);
          }}
        >
          Cancel
        </Button>
      </Flex>
    ),
  },
];

const LimitOrderTab = () => {
  const [filter, setFilter] = useState<ITradingLimitOrderParams>(defaultParams);

  const transformDataTradingLimitOrder = (data: ITradingLimitOrderData[]): any =>
    data?.map((item: ITradingLimitOrderData) => {
      // console.log(item);
      // const categoryNum = Number(item?.id) % 100;
      return {
        id: item._id,
        asset: 'N/A',
        triggerPrice: 'N/A',
        currentPrice: 'N/A',
        duration: item.limitOrderDuration,
        orderExpiry: 'N/A',
        tradeSize: item.tradeSize,
      };
    });

  const {
    fetchStatus: fetchTradingLimitOrder,
    data: dataTradingLimitOrder,
    isLoading,
  } = useQuery({
    queryKey: ['getTradingLimitOrder', filter],
    queryFn: () => getTradingLimitOrder(filter),
    onError: (error: any) => {
      // notification.error({ message: error.message });
      console.log(error);
    },
    select: transformDataTradingLimitOrder,
    cacheTime: 0,
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });

  return (
    <Table
      tableLayout="fixed"
      columns={columns}
      dataSource={dataTradingLimitOrder}
      pagination={{
        pageSize: 10,
        current: 1,
        total: 50,
        hideOnSinglePage: true,
        showTotal: (total: number, range: [number, number]) => `Results: ${range[0]} - ${range[1]}  of ${total}`,
      }}
      // scroll={{ y: 300 }}
      scroll={{ x: 'max-content' }}
      loading={isLoading}
      className="customTable"
      rowKey={(record) => record.id}
    />
  );
};
export default LimitOrderTab;
