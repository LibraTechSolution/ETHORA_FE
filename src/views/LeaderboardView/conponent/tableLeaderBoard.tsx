'use client';

import { ILeaderBoardDetail } from '@/types/leaderboard.type';
import { formatAddress } from '@/utils/address';
import { addComma } from '@/utils/number';
import { divide } from '@/utils/operationBigNumber';
import { Flex, Image } from '@chakra-ui/react';
import { Table, TablePaginationConfig } from 'antd';
import { useEffect, useState } from 'react';

interface Props {
  data: ILeaderBoardDetail[] | undefined;
  loading: boolean;
  isWinnderByRate: boolean;
}

const TableLeaderBoard = (props: Props) => {
  const { data, loading, isWinnderByRate } = props;
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    if (data) {
      setCurrentPage(1);
    }
  }, [data]);

  const columnsNormal = [
    {
      title: 'Rank',
      render: (value: string, record: ILeaderBoardDetail, index: number) => {
        const no = (currentPage - 1) * 10 + index + 1;
        return (
          <Flex>
            {no <= 10 && <Image alt="tropy" src="/images/icons/trophy.png" w="20px" h="20px" />}
            <span className="pl-2">#{no}</span>
          </Flex>
        );
      },
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

  const columnsWinnerRate = [
    {
      title: 'Rank',
      render: (value: string, record: ILeaderBoardDetail, index: number) => {
        const no = (currentPage - 1) * 10 + index + 1;
        return (
          <Flex>
            {no <= 10 && <Image alt="tropy" src="/images/icons/trophy.png" w="20px" h="20px" />}
            <span className="pl-2">#{no}</span>
          </Flex>
        );
      },
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
      title: 'Total Trades',
      dataIndex: 'totalTrades',
      key: 'totalTrades',
    },
    {
      title: 'No. of Won trade',
      dataIndex: 'netPnL',
      key: 'netPnL',
      render: (value: string) => 'TODO',
    },
    {
      title: 'Win rate',
      dataIndex: 'winRate',
      key: 'winRate',
      render: (value: string) => <span>{value}%</span>,
    },
  ];

  const columns = isWinnderByRate ? columnsWinnerRate : columnsNormal;

  const handleChangePage = (pagination: TablePaginationConfig) => {
    console.log('pagination', pagination);
    setCurrentPage(pagination.current ?? 1);
  };

  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={{
        pageSize: 10,
        current: currentPage,
        total: data?.length,
        hideOnSinglePage: true,
        showTotal: (total: number, range: [number, number]) => `Results: ${range[0]} - ${range[1]}  of ${total}`,
      }}
      // scroll={{ y: 300 }}
      scroll={{ x: 'max-content' }}
      loading={loading}
      className="customTable no-radius"
      onChange={handleChangePage}
      // total={85}
      // rowKey={(record) => record.id}
    />
  );
};
export default TableLeaderBoard;
