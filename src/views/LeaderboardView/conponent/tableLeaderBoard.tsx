'use client';

import { ILeaderBoardDetail } from '@/types/leaderboard.type';
import { formatAddress } from '@/utils/address';
import { addComma } from '@/utils/number';
import { divide } from '@/utils/operationBigNumber';
import { Box, Flex, Image, Text, Tooltip } from '@chakra-ui/react';
import { Table, TablePaginationConfig } from 'antd';
import Link from 'next/link';
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
      render: (value: string) => (
        <Link href={`/profile?address=${value}`} target="_blank">
          {formatAddress(value, 7, 7)}
        </Link>
      ),
    },
    {
      title: 'Volume',
      dataIndex: 'volume',
      key: 'volume',
      render: (value: string) => (
        <Tooltip
          hasArrow
          label={
            <Box p={1} color="white">
              {addComma(divide(value as string, 6), 6)} USDC
            </Box>
          }
          color="white"
          placement="top"
          bg="#050506"
        >
          <span>{addComma(divide(value as string, 6), 2)} USDC</span>
        </Tooltip>
      ),
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
      render: (value: string, record: ILeaderBoardDetail) => (
        <Tooltip
          hasArrow
          label={
            <Box p={1} color="white">
              {addComma((+record.netPnL / +record.volume) * 100, 6)} %
            </Box>
          }
          color="white"
          placement="top"
          bg="#050506"
        >
          <span className={+value < 0 ? 'text-[#F03D3E]' : 'text-[#1ED768]'}>
            {addComma((+record.netPnL / +record.volume) * 100, 2)} %
          </span>
        </Tooltip>
      ),
    },
    {
      title: 'Total Payout',
      dataIndex: 'netPnL',
      key: 'netPnL',
      render: (value: string) => (
        <Tooltip
          hasArrow
          label={
            <Box p={1} color="white">
              {addComma(divide(value as string, 6), 6)} USDC
            </Box>
          }
          color="white"
          placement="top"
          bg="#050506"
        >
          <span className={+value < 0 ? 'text-[#F03D3E]' : 'text-[#1ED768]'}>{addComma(divide(value, 6), 2)} USDC</span>
        </Tooltip>
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
      render: (value: string) => (
        <Link href={`/profile?address=${value}`} target="_blank">
          {formatAddress(value, 7, 7)}
        </Link>
      ),
    },
    {
      title: 'Volume',
      dataIndex: 'volume',
      key: 'volume',
      render: (value: string) => (
        <Tooltip
          hasArrow
          label={
            <Box p={1} color="white">
              {addComma(divide(value as string, 6), 6)} USDC
            </Box>
          }
          color="white"
          placement="top"
          bg="#050506"
        >
          <span>{addComma(divide(value as string, 6), 2)} USDC</span>
        </Tooltip>
      ),
    },
    {
      title: 'Total Trades',
      dataIndex: 'totalTrades',
      key: 'totalTrades',
    },
    {
      title: 'No. of Won trade',
      dataIndex: 'tradesWon',
      key: 'tradesWon',
      render: (value: string) => value,
    },
    {
      title: 'Win rate',
      dataIndex: 'winRate',
      key: 'winRate',
      render: (value: string) => (
        <Tooltip
          hasArrow
          label={
            <Box p={1} color="white">
              {addComma(+value / 1000, 6)}%
            </Box>
          }
          color="white"
          placement="top"
          bg="#050506"
        >
          <span>{addComma(+value / 1000, 2)}%</span>
        </Tooltip>
      ),
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
      rowKey={(record) => record.user}
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
              No data at present.
            </Text>
          </Box>
        ),
      }}
    />
  );
};
export default TableLeaderBoard;
