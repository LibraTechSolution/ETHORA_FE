import bufferBOABI from '@/config/abi/bufferBOABI';
import { useGetTradeContract } from '@/hooks/useGetTradeContract';
import { getChanged24h } from '@/services/trade';
import usePairStore from '@/store/usePairStore';
import { PairData } from '@/types/trade.type';
import { addComma } from '@/utils/number';
import { divide } from '@/utils/operationBigNumber';
import { CallSocket } from '@/views/TradeView/components/SearchPair';
import { ShowPrice } from '@/views/TradeView/components/ShowPrice';
import { Box, Flex, Image, Stat, StatArrow, StatHelpText, Text } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { readContract } from '@wagmi/core';
import { Badge, Progress, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useCallback, useEffect, useMemo, useState } from 'react';

const columns: ColumnsType<PairData> = [
  {
    title: 'Pair',
    dataIndex: 'pair',
    key: 'pair',
    render: (pair) => {
      return (
        <Box display={'flex'} alignItems={'center'}>
          <Image
            alt=""
            src={`/images/icons/${pair.replace('/', '-').toLowerCase()}.png`}
            w="20px"
            h="20px"
            marginLeft={'12px'}
            marginRight={'8px'}
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
    render: () => 'USDC',
  },
  {
    title: 'Current Price',
    dataIndex: 'pair',
    key: 'Current Price',
    render: (value) => <ShowPrice pair={value.replace('/', '')} />,
  },
  {
    title: 'Open Interest',
    dataIndex: 'pair',
    key: 'Open Interest',
    render: (value) => <CurrentOICell pair={value.replace('/', '').toUpperCase()} />,
  },
  {
    title: '24h Volume',
    dataIndex: 'volume',
    key: 'volume',
    // sorter: (a, b) => a.name.length - b.name.length,
  },
  {
    title: 'Utilization',
    dataIndex: 'pair',
    key: 'Utilization',
    render: (value) => {
      return <Utilization pair={value.replace('/', '').toUpperCase()} />;
    },
  },
  {
    title: 'Minimum/Maximum',
    render: () => {
      return <Text>00:03 / 04:00</Text>;
    },
  },
  {
    title: 'Max trade size',
    dataIndex: 'maxTradeSize',
    key: 'maxTradeSize',
    render: (value) => {
      return <Text>{value} USDC</Text>;
    },
  },
  {
    title: 'Payouts',
    dataIndex: 'payout',
    key: 'payout',
    render: (value) => {
      return (
        <Flex flexDirection={'column'} align={'center'} justifyContent={'center'} gap={'2px'}>
          <Stat bg={'rgba(21, 189, 89, 0.10)'} borderRadius={'5px'} padding={'0px 5px 2px'}>
            <StatHelpText mb={'0'}>
              <StatArrow type="increase" color={'#1ED768'} />
              <Text as={'span'} color={'#1ED768'}>
                {value}%
              </Text>
            </StatHelpText>
          </Stat>

          <Stat bg={'rgba(240, 61, 62, 0.10)'} borderRadius={'5px'} padding={'0px 5px 2px'}>
            <StatHelpText mb={'0'}>
              <StatArrow type="decrease" color={'#F03D3E'} />
              <Text as={'span'} color={'#F03D3E'}>
                {value}%
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

const CurrentOICell = ({ pair }: { pair: string }) => {
  const { bufferBOSC } = useGetTradeContract(pair);
  const [currentOI, setCurrentOI] = useState(0);

  const getCurrentOI = useCallback(async () => {
    try {
      const currentOI = await readContract({
        address: bufferBOSC as `0x${string}`,
        abi: bufferBOABI,
        functionName: 'totalMarketOI',
      });
      setCurrentOI(+divide(currentOI.toString(), 6));
    } catch (error) {}
  }, [bufferBOSC]);

  useEffect(() => {
    getCurrentOI();
    const interval = setInterval(() => {
      getCurrentOI();
    }, 10000);

    return () => clearInterval(interval);
  }, [getCurrentOI]);

  return <span>{addComma(currentOI, 2)} USDC</span>;
};

const Utilization = ({ pair }: { pair: string }) => {
  const { bufferBOSC } = useGetTradeContract(pair);
  const [currentOI, setCurrentOI] = useState(0);
  const [maxOI, setMaxOI] = useState(1000);

  const getCurrentOI = useCallback(async () => {
    try {
      const currentOI = await readContract({
        address: bufferBOSC as `0x${string}`,
        abi: bufferBOABI,
        functionName: 'totalMarketOI',
      });
      setCurrentOI(+divide(currentOI.toString(), 6));
    } catch (error) {}
  }, [bufferBOSC]);

  const getMaxOI = useCallback(async () => {
    try {
      const maxOI = await readContract({
        address: bufferBOSC as `0x${string}`,
        abi: bufferBOABI,
        functionName: 'getMaxOI',
      });
      setMaxOI(+divide(maxOI.toString(), 6));
    } catch (error) {}
  }, [bufferBOSC]);

  useEffect(() => {
    getMaxOI();
    getCurrentOI();
    const interval = setInterval(() => {
      getCurrentOI();
    }, 10000);

    return () => clearInterval(interval);
  }, [getCurrentOI, getMaxOI]);

  return (
    <Flex flexDirection={'column'} align={'start'} justifyContent={'center'} gap={'2px'}>
      <Progress
        className="customProgress"
        percent={(currentOI / maxOI) * 100}
        size="small"
        format={(percent) => (
          <Text as={'span'} color={'white'}>
            {`${Math.ceil((currentOI / maxOI) * 100)}%`}
          </Text>
        )}
      />
      <Text color={'white'}>Max: {addComma(maxOI, 2)} USDC</Text>
    </Flex>
  );
};

const TableMarket = () => {
  const { data: listChanged24h } = useQuery({
    queryKey: ['getChanged24h'],
    queryFn: () => getChanged24h(),
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });
  const { listPairData } = usePairStore();

  const listPairShow = useMemo<PairData[]>(() => {
    const tempChanged24h = listChanged24h?.data?.data;
    if (!listChanged24h) {
      return listPairData;
    }
    const tempListPairData = [...listPairData];
    for (let i = 0; i < tempListPairData.length; i++) {
      const changed24hPair = tempChanged24h && tempChanged24h[tempListPairData[i].pair.replace('/', '') as string];
      if (changed24hPair) {
        tempListPairData[i].changed24hPercent = +changed24hPair;
      } else {
        tempListPairData[i].changed24hPercent = -2;
      }
    }
    return tempListPairData;
  }, [listChanged24h, listPairData]);

  return (
    <>
      <CallSocket />
      <Table
        columns={columns}
        dataSource={listPairShow}
        // scroll={{ x: 'max-content' }}
        // loading={isLoading}
        className="customTable"
        // total={85}
        // rowKey={(record) => record.id}
      />
    </>
  );
};
export default TableMarket;
