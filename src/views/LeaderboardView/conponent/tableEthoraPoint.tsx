'use client';

import { ILeaderBoardDetail } from '@/types/leaderboard.type';
import { formatAddress } from '@/utils/address';
import { addComma } from '@/utils/number';
import { divide } from '@/utils/operationBigNumber';
import { Box, Flex, Image, Text, Tooltip } from '@chakra-ui/react';
import { Table, TablePaginationConfig } from 'antd';
import Link from 'next/link';
import { useState } from 'react';


interface Props {
  data: any;
  loading: boolean;
  isWinnderByRate: boolean;
  paginCallBack?: (page: number) => void;
}

const TableEthoraPoint = (props: Props) => {
  const { data, loading, paginCallBack } = props;
  const [currentPage, setCurrentPage] = useState<number>(1);

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
      title: 'Wallet address',
      dataIndex: 'id',
      key: 'id',
      render: (value: string) => (
        <Link href={`/profile?address=${value}`} target="_blank">
          {formatAddress(value, 7, 7)}
        </Link>
      ),
    },
    {
      title: 'No of Trades',
      dataIndex: 'totalTrades',
      key: 'totalTrades',
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
          <span>{addComma(value)}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Total Volume',
      dataIndex: 'volume',
      key: 'volume',
      render: (value: string, record: ILeaderBoardDetail) => (
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
          <span className={+value < 0 ? 'text-[#F03D3E]' : 'text-[#1ED768]'}>
          {addComma(divide(value as string, 6), 2)} USDC
          </span>
        </Tooltip>
      ),
    },
    {
      title: 'Total Referral Earnings',
      dataIndex: 'totalRebateEarned',
      key: 'totalRebateEarned',
      render: (value: string, record: ILeaderBoardDetail) => (
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
          <span className={+value < 0 ? 'text-[#F03D3E]' : 'text-[#1ED768]'}>
          {addComma(divide(value as string, 6), 2)} USDC
          </span>
        </Tooltip>
      ),
    },
    {
      title: 'Ethora points',
      dataIndex: 'point',
      key: 'point',
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
          <span className={+value < 0 ? 'text-[#F03D3E]' : 'text-[#1ED768]'}>{addComma(divide(value, 6), 2)} POINT</span>
        </Tooltip>
      ),
    },
  ];


  const columns = columnsNormal;

  const handleChangePage = (pagination: TablePaginationConfig) => {
    console.log('pagination', pagination);
    setCurrentPage(pagination.current ?? 1);
    if(paginCallBack){
      paginCallBack(pagination.current ?? 1);
    }
  };

  return (
    <Table
      columns={columns}
      dataSource={data?.docs}
      pagination={{
        pageSize: data?.meta.limit,
        current: data?.meta.page,
        total: data?.meta.totalDocs,
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
export default TableEthoraPoint;
