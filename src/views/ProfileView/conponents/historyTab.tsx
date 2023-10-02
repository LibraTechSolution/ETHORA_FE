'use client';
import { getTradingHistory } from '@/services/profile';
import { ITradingHistoryData, ITradingHistoryParams } from '@/types/profile';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { addComma } from '@/utils/number';

type TradingHistoryTable = {
  id: string;
  asset: string;
  strikePrice: string;
  expiryPrice: number;
  openTime: string;
  duration: string;
  closeTime: string;
  tradeSize: string;
  payout: string;
  result: string;
};

const defaultParams: ITradingHistoryParams = {
  limit: 1,
  page: 1,
  chain: '8453',
};

const columns: ColumnsType<TradingHistoryTable> = [
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
    title: 'Expiry Price',
    dataIndex: 'expiryPrice',
    key: 'expiryPrice',
    render: (value) => <span>{addComma(value)}</span>,
  },
  {
    title: 'Open Time',
    dataIndex: 'openTime',
    key: 'openTime',
  },
  {
    title: 'Duration',
    dataIndex: 'duration',
    key: 'duration',
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
    title: 'Payout',
    dataIndex: 'payout',
    key: 'payout',
  },
  {
    title: 'Result',
    dataIndex: 'result',
    key: 'result',
  },
];

const HistoryTab = () => {
  const [filter, setFilter] = useState<ITradingHistoryParams>(defaultParams);

  const transformDataTradingHistory = (data: ITradingHistoryData[]): any =>
    data?.map((item: ITradingHistoryData) => {
      // console.log(item);
      // const categoryNum = Number(item?.id) % 100;
      return {
        id: item._id,
        asset: 'N/A',
        strikePrice: item.strike,
        expiryPrice: item.expiryPrice,
        openTime: item.openDate,
        duration: item.limitOrderDuration,
        closeTime: item.closeDate,
        tradeSize: item.tradeSize,
        payout: item.payout,
        result: !item.payout ? 'Loss' : 'Win',
      };
    });

  const {
    fetchStatus: fetchTradingHistory,
    data: dataTradingHistory,
    isLoading,
  } = useQuery({
    queryKey: ['getTradingHistory', filter],
    queryFn: () => getTradingHistory(filter),
    onError: (error: any) => {
      // notification.error({ message: error.message });
      console.log(error);
    },
    select: transformDataTradingHistory,
    cacheTime: 0,
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });

  return (
    <Table
      columns={columns}
      dataSource={dataTradingHistory}
      // pagination={{ pageSize: 50 }}
      // scroll={{ y: 300 }}
      scroll={{ x: 'max-content' }}
      loading={isLoading}
      className="customTable"
      rowKey={(record) => record.id}
    />
  );
};
export default HistoryTab;
