import { Box, Flex, Stat, StatArrow, StatHelpText, Text } from '@chakra-ui/react';
import { Badge, Progress, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import Image from 'next/image';
const dataSource = [
  {
    key: '1',
    pair: 'BTC-USD',
    pool: 'UDSC',
    current: '26,581.00',
    openInterest: '0.00 USDC',
    volume: '0.00 USDC',
    utilization: '',
    max: '00:10 / 04:00',
    tradeSize: '200.00 USDC',
    payouts: '90.00%',
    status: 1,
  },
  {
    key: '2',
    pair: 'BTC-USD',
    pool: 'UDSC',
    current: '26,581.00',
    openInterest: '0.00 USDC',
    volume: '0.00 USDC',
    utilization: '',
    max: '00:10 / 04:00',
    tradeSize: '200.00 USDC',
    payouts: '90.00%',
    status: 1,
  },
  {
    key: '3',
    pair: 'BTC-USD',
    pool: 'UDSC',
    current: '26,581.00',
    openInterest: '0.00 USDC',
    volume: '0.00 USDC',
    utilization: '',
    max: '00:10 / 04:00',
    tradeSize: '200.00 USDC',
    payouts: '90.00%',
    status: 1,
  },
  {
    key: '4',
    pair: 'BTC-USD',
    pool: 'UDSC',
    current: '26,581.00',
    openInterest: '0.00 USDC',
    volume: '0.00 USDC',
    utilization: '',
    max: '00:10 / 04:00',
    tradeSize: '200.00 USDC',
    payouts: '90.00%',
    status: 1,
  },
];
const columns: ColumnsType<any> = [
  {
    title: 'Pair',
    dataIndex: 'pair',
    key: 'pair',
    render: (pair) => {
      return (
        <Box display={'flex'} alignItems={'center'}>
          <Image
            src="/images/dashBoard/bitcoin-icon.png"
            width={14}
            height={14}
            alt="Avata"
            className="h-[14px] w-[14px] mr-3"
          />
          {pair}
        </Box>
      );
    },
  },
  {
    title: 'Pool',
    dataIndex: 'pool',
    key: 'pool',
    sorter: (a, b) => a.name.length - b.name.length,
  },
  {
    title: 'Current Price',
    dataIndex: 'current',
    width: 150,
    key: 'current',
    sorter: (a, b) => a.name.length - b.name.length,
  },
  {
    title: 'Open Interest',
    dataIndex: 'openInterest',
    key: 'open',
    sorter: (a, b) => a.name.length - b.name.length,
  },
  {
    title: '24h Volume',
    dataIndex: 'volume',
    key: 'volume',
    sorter: (a, b) => a.name.length - b.name.length,
  },
  {
    title: 'Utilization',
    dataIndex: 'utilization',
    key: 'utilization',
    render: () => {
      return (
        <Flex flexDirection={'column'} align={'start'} justifyContent={'center'} gap={'2px'}>
          <Progress
            className="customProgress"
            percent={30}
            size="small"
            format={(percent) => (
              <Text as={'span'} color={'white'}>
                {`${percent}%`}
              </Text>
            )}
          />
          <Text color={'white'}>Max: 2,000.00 USDC</Text>
        </Flex>
      );
    },
  },
  {
    title: 'Minimum/Maximum',
    dataIndex: 'max',
    key: 'max',
  },
  {
    title: 'Max trade size',
    dataIndex: 'tradeSize',
    key: 'tradeSize',
  },
  {
    title: 'Payouts',
    dataIndex: 'payouts',
    key: 'payouts',
    render: () => {
      return (
        <Flex flexDirection={'column'} align={'center'} justifyContent={'center'} gap={'2px'}>
          <Stat bg={'rgba(21, 189, 89, 0.10)'} borderRadius={'5px'} padding={'0px 5px 2px'}>
            <StatHelpText mb={'0'}>
              <StatArrow type="increase" color={'#1ED768'} />
              <Text as={'span'} color={'#1ED768'}>
                23.36%
              </Text>
            </StatHelpText>
          </Stat>

          <Stat bg={'rgba(240, 61, 62, 0.10)'} borderRadius={'5px'} padding={'0px 5px 2px'}>
            <StatHelpText mb={'0'}>
              <StatArrow type="decrease" color={'#F03D3E'} />
              <Text as={'span'} color={'#F03D3E'}>
                23.36%
              </Text>
            </StatHelpText>
          </Stat>
        </Flex>
      );
    },
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status) =>
      status === 1 ? (
        <Badge
          status="success"
          text={
            <Text as={'span'} color={'white'}>
              Open
            </Text>
          }
        />
      ) : (
        <Badge
          status="error"
          text={
            <Text as={'span'} color={'white'}>
              OFF
            </Text>
          }
        />
      ),
  },
];

const TableMarket = () => {
  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      pagination={{
        pageSize: 10,
        current: 1,
        total: 50,
        hideOnSinglePage: true,
        showTotal: (total: number, range: [number, number]) => `Results: ${range[0]} - ${range[1]}  of ${total}`,
      }}
      // scroll={{ x: 'max-content' }}
      scroll={{ x: 1500 }}
      // loading={isLoading}
      className="customTable"
      // total={85}
      // rowKey={(record) => record.id}
    />
  );
};
export default TableMarket;
