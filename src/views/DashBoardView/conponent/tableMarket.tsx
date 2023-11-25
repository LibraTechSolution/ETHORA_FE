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
import { ShowPrice } from '@/views/TradeView/components/ShowPrice';
import { Box, Flex, Image, Stat, StatArrow, StatHelpText, Text, Tooltip } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { Address, readContract } from '@wagmi/core';
import { Badge, Progress, Table, notification } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import { appConfig } from '@/config';
import { useCheckForexClose } from '@/hooks/useCheckForexClose';
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
            marginLeft={'0'}
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
    render: (value, record) =>
      record?.pair && (
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
    render: (value) => (
      <Tooltip
        hasArrow
        label={
          <Box p={1} color="white">
            {addComma(value, 6)} USDC
          </Box>
        }
        color="white"
        placement="top"
        bg="#050506"
      >
        <span>{addComma(value, 2)} USDC</span>
      </Tooltip>
    ),
  },
  {
    title: '24h Volume',
    dataIndex: 'dailyVol',
    key: 'volume',
    sorter: (a, b) => +a.dailyVol - +b.dailyVol,
    render: (value) => (
      <Tooltip
        hasArrow
        label={
          <Box p={1} color="white">
            {addComma(divide(value, 6), 6)} USDC
          </Box>
        }
        color="white"
        placement="top"
        bg="#050506"
      >
        <span>{addComma(divide(value, 6), 2)} USDC</span>
      </Tooltip>
    ),
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
      return (
        <Tooltip
          hasArrow
          label={
            <Box p={1} color="white">
              {addComma(value, 6)} USDC
            </Box>
          }
          color="white"
          placement="top"
          bg="#050506"
        >
          <span>{addComma(value, 2)} USDC</span>
        </Tooltip>
      );
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
              Closed
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
  '0x9c4c031a88f3ddd9d29cd9c8e6513a3988964d9b': 'BTCUSD',
  '0xebacafbcb0ac27b67319827f6b09cc84b9017baa': 'ETHUSD',
  '0xd25b64ce363c03054591cad3d69b86e571e1acf6': 'LINKUSD',
  '0x65ceb3cd7241894d189f686a5603ce2ed08ce9b0': 'TONUSD',
  '0xaf88116f29eb365ce6519a5612f7c9a85a950210': 'ARBUSD',
  '0x69287935bea51cf4e6a50fcf51997343ddb6760f': 'XRPUSD',
  '0xf3d2691552a48e0fb1b601e1d9c4b68a17c228f7': 'SOLUSD',
  '0x0d2c4a4849b9445df604d9e24d01c906daaf360f': 'BNBUSD',
  '0x25ed2e9ec55522c19dcf46921dff4706c3e4ca82': 'EURUSD',
  '0x41167b680f71451c7592ca1e6ddbd4406eeaae08': 'XAUUSD',
  '0x19feffffc93ba557331136fbbec38b1c2a08557c': 'GBPUSD',
  '0x0df7811a8f1878f844dc4485cffad9dff1f8e10b': 'XAGUSD',
};

const TableMarket = () => {
  const { data: listChanged24h } = useQuery({
    queryKey: ['getChanged24h'],
    queryFn: () => getChanged24h(),
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });
  const isClosed = useCheckForexClose();
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

  const getMaxTradeSize = async (bufferBOSC: `0x${string}`) => {
    try {
      const maxOI = await readContract({
        address: bufferBOSC as `0x${string}`,
        abi: bufferBOABI,
        functionName: 'getMaxTradeSize',
      });
      return divide(maxOI.toString(), 6);
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
        tempListPairData[i].status = !isClosed;
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

      getMaxTradeSize(configPair[tempListPairData[i].pair.replace('/', '') as string].bufferBOSC as Address).then(
        (item) => (tempListPairData[i].maxTradeSize = item ? +item : 0),
      );
    }
    return tempListPairData;
  }, [dataDashboardMaret, isClosed, listChanged24h, listPairData, listPriceShow]);

  return (
    <Box className="tradingTableTab">
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
