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
  '0x90055e89fa3ed19a7855d86cdd39d4f688f83e48': 'BTCUSD',
  '0x5b5cb70e334888a485bd410f1fb87aa81d3cee3e': 'ETHUSD',
  '0x3207aa0b75d20b790196d1998066887c8bd97d63': 'LINKUSD',
  '0x07edec238b1cbfcce98669f0a7b61349162cc278': 'TONUSD',
  '0x89d2b1455b3a49dc0b19541745cc9080e3226b38': 'ARBUSD',
  '0x7d3c0d846907136281d486a667f41579c63a1aa2': 'XRPUSD',
  '0x01c059dca520ce23cd5635f699c2012a6e9d9b78': 'SOLUSD',
  '0x8edf4f76a8ae9f80cee8a10107927ba1997c2609': 'BNBUSD',
  '0xdc45cbc2e65306cde17cc4e7af2fe23611eb7e4e': 'EURUSD',
  '0x9b689852c790812d303e80b489009f8e5abbd01b': 'XAUUSD',
  '0x37ec5a0847331ecee6944827ea3ef7468d12c69e': 'GBPUSD',
  '0x2144a883db914540a9b6c50a4eccaeaad089c1d9': 'XAGUSD',
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
