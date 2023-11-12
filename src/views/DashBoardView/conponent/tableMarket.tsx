import bufferBOABI from '@/config/abi/bufferBOABI';
import { configPair, useGetTradeContract } from '@/hooks/useGetTradeContract';
import { getDashboardMarket } from '@/services/dashboard';
import { getChanged24h } from '@/services/trade';
import useListPairPriceSlow from '@/store/useListPairPriceSlow';
import usePairStore from '@/store/usePairStore';
import { IDashboardMarketData } from '@/types/dashboard.type';
import { PairData, PairType } from '@/types/trade.type';
import { addComma } from '@/utils/number';
import { add, divide } from '@/utils/operationBigNumber';
import { CallSocket } from '@/views/TradeView/components/SearchPair';
import { ShowPrice } from '@/views/TradeView/components/ShowPrice';
import { Box, Flex, Image, Stat, StatArrow, StatHelpText, Text } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { Address, readContract } from '@wagmi/core';
import { Badge, Progress, Table, notification } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import { appConfig } from '@/config';
dayjs.extend(utc);

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
    dataIndex: 'currentPrice',
    key: 'Current Price',
    sorter: (a, b) => a.currentPrice - b.currentPrice,
    render: (value, record) => (
      <>
        <ShowPrice pair={record.pair.replace('/', '')} /> {record.pair.split('/')[1].toUpperCase()}
      </>
    ),
  },
  {
    title: 'Open Interest',
    dataIndex: 'currentOL',
    key: 'Open Interest',
    sorter: (a, b) => a.currentOL - b.currentOL,
    render: (value) => `${addComma(value, 2)} USDC`,
  },
  {
    title: '24h Volume',
    dataIndex: 'dailyVol',
    key: 'volume',
    sorter: (a, b) => +a.dailyVol - +b.dailyVol,
    render: (value) => `${addComma(divide(value, 6), 2)} USDC`,
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
      status ? (
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

const ContractWithPair: Record<string, string> = {
  '0xbf41098cd4a6a405e6e33647b983d1a63334bc1b': 'BTCUSD',
  '0x8edf4f76a8ae9f80cee8a10107927ba1997c2609': 'ETHUSD',
  '0xdc45cbc2e65306cde17cc4e7af2fe23611eb7e4e': 'LINKUSD',
  '0x25ffe1a6bb755c9a4bda91ac2b0adb98a85f85d2': 'TONUSD',
  '0xd6cdd8e8b2b8e3947912275c55284b88a30f839f': 'ARBUSD',
  '0x1a01e687278fbd5c3d86134062c1c241b9a199ec': 'XRPUSD',
  '0x3365eea63b05c38885c6b6b0e1bbd151cf92c15d': 'SOLUSD',
  '0x1d389065da6a3d8f6e713909c8fe28c77c750ccc': 'BNBUSD',
  '0x17b5df926f47905650b121a3988e0af2ee4419a1': 'EURUSD',
  '0x6bbc6820023eb35a324601b16a5b42607b9f9e1e': 'XAUUSD',
  '0xcb77e309c0f0854c13f0b3d64e2dca94e64fbc6b': 'GBPUSD',
  '0x0992adedd90a0d0a37b298f317fe324eda2bad62': 'XAGUSD',
};

const TableMarket = () => {
  const { data: listChanged24h } = useQuery({
    queryKey: ['getChanged24h'],
    queryFn: () => getChanged24h(),
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });
  const [listPriceShow, setListPriceShow] = useState<{ [key: string]: number }>();
  const { listPairData } = usePairStore();
  const { listPairPriceSlow } = useListPairPriceSlow();
  const networkID = appConfig.includeTestnet ? 421613 : 8453;

  const transferData = (data: IDashboardMarketData) => {
    if (!data?.volumePerContracts) return;
    const tempObj: Record<string, string> = {};
    for (let i = 0; i < data.volumePerContracts.length; i++) {
      tempObj[ContractWithPair[data.volumePerContracts[i].optionContract.address]] = add(
        tempObj[ContractWithPair[data.volumePerContracts[i].optionContract.address]] ?? '0',
        data.volumePerContracts[i].amount,
      );
    }
    return tempObj;
  };
  const { data: dataDashboardMaret, isInitialLoading } = useQuery({
    queryKey: ['getDashboardMarket', networkID],
    queryFn: () => getDashboardMarket({ network: networkID }),
    onError: (error: any) => {
      notification.error({ message: error.message });
    },
    // enabled: !!networkID,
    select: transferData,
    cacheTime: 0,
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    setListPriceShow(listPairPriceSlow);
  }, [listPairPriceSlow]);

  const isClose = useMemo(() => {
    if (dayjs().utc().day() === 0 || dayjs().utc().day() === 6) {
      return true;
    } else {
      if (dayjs().utc().hour() < 6 || dayjs().utc().hour() >= 16) {
        return true;
      }
    }
    return false;
  }, []);

  const getCurrentOI = async (bufferBOSC: `0x${string}`) => {
    try {
      const currentOI = await readContract({
        address: bufferBOSC as `0x${string}`,
        abi: bufferBOABI,
        functionName: 'totalMarketOI',
      });
      return divide(currentOI.toString(), 6);
    } catch (error) {}
  };

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
      if (listPriceShow) {
        tempListPairData[i].currentPrice = listPriceShow[tempListPairData[i].pair.replace('/', '') as string];
      }
      if (tempListPairData[i].type === PairType.FOREX) {
        tempListPairData[i].status = !isClose;
      }
      if (tempListPairData[i].type === PairType.CRYPTO) {
        tempListPairData[i].status = true;
      }
      if (dataDashboardMaret) {
        tempListPairData[i].dailyVol = dataDashboardMaret[tempListPairData[i].pair.replace('/', '') as string] ?? 0;
      }
      getCurrentOI(configPair[tempListPairData[i].pair.replace('/', '') as string].bufferBOSC as Address).then(
        (item) => (tempListPairData[i].currentOL = item ? +item : 0),
      );
    }
    return tempListPairData;
  }, [dataDashboardMaret, isClose, listChanged24h, listPairData, listPriceShow]);

  return (
    <Box>
      <CallSocket />
      <Table
        columns={columns}
        dataSource={listPairShow}
        pagination={{
          pageSize: 100,
          current: 1,
          total: 12,
          hideOnSinglePage: true,
          showTotal: (total: number, range: [number, number]) => `Results: ${range[0]} - ${range[1]}  of ${total}`,
        }}
        // scroll={{ y: 300 }}
        scroll={{ x: 'max-content' }}
        loading={isInitialLoading}
        className="customTable"
        rowKey={(record) => record.pair}
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
                No pair at present.
              </Text>
            </Box>
          ),
        }}
      />
    </Box>
  );
};
export default TableMarket;
