'use client';

import { ILeaderBoardDetail } from '@/types/leaderboard.type';
import { formatAddress } from '@/utils/address';
import { addComma } from '@/utils/number';
import { divide } from '@/utils/operationBigNumber';
import { Table } from 'antd';

interface Props {
  data: ILeaderBoardDetail[];
  loading: boolean;
}

const TableLosers = (props: Props) => {
  const { data, loading } = props;

  const columns = [
    {
      title: 'Rank',
    },
    {
      title: 'User Address',
      dataIndex: 'user',
      key: 'user',
      render: (value: string) => formatAddress(value, 7, 7),
    },
    {
      title: 'Volume',
      dataIndex: 'volume',
      key: 'volume',
      render: (value: string) => <span>{addComma(divide(value as string, 6), 2)} USDC</span>,
    },
    {
      title: 'Trades',
      dataIndex: 'totalTrades',
      key: 'totalTrades',
    },
    {
      title: 'Net PnL (%)',
      dataIndex: 'netPnL',
      key: 'netPnL',
      render: (value: string) =>
        +value < 0 ? (
          <span className="text-[#F03D3E]">{value} %</span>
        ) : (
          <span className="text-[#1ED768]">{value} %</span>
        ),
    },
    {
      title: 'Total Payout',
      dataIndex: 'netPnL',
      key: 'netPnL',
      render: (value: string) =>
        +value < 0 ? (
          <span className="text-[#F03D3E]">{value} %</span>
        ) : (
          <span className="text-[#1ED768]">{value} %</span>
        ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={{
        pageSize: 10,
        total: data.length,
        hideOnSinglePage: true,
        showTotal: (total: number, range: [number, number]) => `Results: ${range[0]} - ${range[1]}  of ${total}`,
      }}
      // scroll={{ y: 300 }}
      scroll={{ x: 'max-content' }}
      loading={loading}
      className="customTable no-radius"
      // total={85}
      // rowKey={(record) => record.id}
    />
  );
};
export default TableLosers;
