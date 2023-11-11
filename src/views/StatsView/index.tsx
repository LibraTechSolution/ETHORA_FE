'use client';
import { getStats } from '@/services/stats';
import {
  IBurnStats,
  IELPPoolStatsChart,
  IFeeStats,
  IFeeStatsChart,
  IPoolStats,
  IRateStatsChart,
  IStatsParams,
  ITradersNetPnLChart,
  ITradersProfitChart,
  ItradingData,
  IuserStats,
  IvolumeStats,
  IvolumeStatsChart,
} from '@/types/stats.type';
import { addComma } from '@/utils/number';
import { Box, Button, Grid, GridItem, Heading, Text, useMediaQuery } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { DatePicker, TimeRangePickerProps, notification } from 'antd';
import { Download } from 'lucide-react';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

import {
  ComposedChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  Area,
  LineChart,
} from 'recharts';
import DateRangeStyle from './style';
import { DataTickDateFormater, DataTickFormater } from '@/utils/helper';
import DownloadCSV from './DownloadCSV';
import type { RangePickerProps } from 'antd/es/date-picker';

const dataLine = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

const CustomTooltip = (data: any) => {
  const { active, payload } = data;
  if (active && payload && payload.length) {
    return (
      // eslint-disable-next-line tailwindcss/no-custom-classname
      <div className="custom-tooltip min-w-[118px] rounded-lg bg-[#050506] p-[10px]">
        <p className=" text-sm font-medium text-white">
          {DataTickDateFormater(payload[0]?.payload?.timestamp)}
          {payload[0]?.payload?.total !== undefined && `, Total: ${payload[0]?.payload?.total}`}
        </p>
        {payload?.map((item: any, index: number) => {
          return (
            // eslint-disable-next-line tailwindcss/no-custom-classname
            <p className={`flex items-center text-sm`} key={index} style={{ color: item.color }}>
              {`${item.name}: ${item.unit && item.unit === '$' ? item.unit : ''}${
                item.payload[item.dataKey] ? addComma(item.payload[item.dataKey], 2) : 0
              }${item.unit && item.unit !== '$' ? item.unit : ''}`}
            </p>
          );
        })}
      </div>
    );
  }

  return null;
};

const rangePresets: TimeRangePickerProps['presets'] = [
  { label: 'Last 30 Days', value: [dayjs().add(-30, 'd'), dayjs()] },
  { label: 'Last 60 Days', value: [dayjs().add(-60, 'd'), dayjs()] },
  { label: 'Last 90 Days', value: [dayjs().add(-90, 'd'), dayjs()] },
];

const disabledDate: RangePickerProps['disabledDate'] = (current) => {
  // Can not select days before today and today
  return current && current > dayjs().endOf('day');
};

const defaultDay = {
  rangeDay: [dayjs().add(-30, 'd'), dayjs()],
  rangeDayTimeStem: [dayjs().add(-30, 'd').unix(), dayjs().unix()],
};

const StatsView = () => {
  const [isMobile] = useMediaQuery('(max-width: 768px)');
  const { RangePicker } = DatePicker;
  const [dateRange, setDateRange] = useState<Dayjs[]>(defaultDay.rangeDay);
  const [filter, setFilter] = useState<IStatsParams | undefined>({
    network: 421613,
    start: defaultDay.rangeDayTimeStem[0],
    end: defaultDay.rangeDayTimeStem[1],
  });

  const [dataVolume, setDataVolume] = useState<IvolumeStatsChart[]>([]);
  const [dataFees, setDataFees] = useState<IFeeStatsChart[]>([]);
  const [dataRate, setDataRate] = useState<IRateStatsChart[]>([]);
  const [dataELPPool, setELPPool] = useState<IELPPoolStatsChart[]>([]);
  const [dataBurnStats, setBurnStats] = useState<IBurnStats[]>([]);
  const [dataUserStats, setUserStats] = useState<IuserStats[]>([]);
  const [dataTradersNetPnL, setTradersNetPnL] = useState<ITradersNetPnLChart[]>([]);
  const [maxTradersNetPnL, setMaxTradersNetPnL] = useState<number>(0);
  const [dataTradersProfit, setTradersProfit] = useState<ITradersProfitChart[]>([]);
  const [maxTradersProfit, setMaxTradersProfit] = useState<number>(0);

  const { data: dataStats } = useQuery({
    queryKey: ['getStats', filter],
    queryFn: () => getStats(filter as IStatsParams),
    onError: (error: any) => {
      notification.error({ message: error.message });
    },
    enabled: !!filter,
    cacheTime: 0,
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!dataStats) return;
    const dataVolumeStats = dataStats?.volumeStats?.map((item: IvolumeStats) => {
      return { cumulative: item.cumulative, VolumeUSDC: item.VolumeUSDC, timestamp: item.timestamp };
    });

    const dataFeeStats = dataStats?.feeStats?.map((item: IFeeStats) => {
      return { cumulative: item.cumulative, fee: item.fee, timestamp: item.timestamp };
    });

    const dataRateStats = dataStats?.poolStats?.data?.map((item: IPoolStats) => {
      return { rate: item.rate, timestamp: item.timestamp };
    });

    const dataELPPoolStats = dataStats?.poolStats?.data?.map((item: IPoolStats) => {
      return { timestamp: item.timestamp, glpSupply: item.glpSupply };
    });

    const dataUserStats = dataStats?.userStats?.map((item: IuserStats) => {
      return {
        ...item,
        total: item?.existingCount + item?.uniqueCount,
        new: item?.uniqueCount,
        existing: item?.existingCount,
        percentage: (item?.uniqueCount / (item?.existingCount + item?.uniqueCount)) * 100,
      };
    });

    const dataTradersNetPnL = dataStats?.tradingStats?.data?.map((item: ItradingData) => {
      return { timestamp: item.timestamp, pnl: item.pnl, pnlCumulative: item.currentPnlCumulative };
    });

    const dataTradersProfit = dataStats?.tradingStats?.data?.map((item: ItradingData) => {
      return {
        timestamp: item.timestamp,
        profit: item.profit,
        loss: item.loss,
        profitCumulative: item.currentProfitCumulative,
        lossCumulative: item.currentLossCumulative,
      };
    });
    const dataMaxTradersNetPnL = dataStats?.tradingStats?.stats?.maxAbsCumulativePnl * 1.1;

    const dataMaxTradersProfit = dataStats?.tradingStats?.stats?.maxCurrentCumulativeProfitLoss * 1.1;

    setDataVolume(dataVolumeStats);
    setDataFees(dataFeeStats);
    setDataRate(dataRateStats);
    setELPPool(dataELPPoolStats);
    setUserStats(dataUserStats);
    setBurnStats(dataStats?.burnedETRs);
    setTradersNetPnL(dataTradersNetPnL);
    setTradersProfit(dataTradersProfit);
    setMaxTradersProfit(dataMaxTradersProfit);
    setMaxTradersNetPnL(dataMaxTradersNetPnL);
  }, [dataStats]);

  const onRangeChange = (dates: null | (Dayjs | null)[], dateStrings: string[]) => {
    if (dates) {
      setDateRange(dates as Dayjs[]);
      setFilter({
        ...filter,
        start: dates[0]?.unix() as number,
        end: dates[1]?.unix() as number,
      } as IStatsParams);
    } else {
      console.log('Clear');
    }
  };

  return (
    <Box marginX={{ base: '0', lg: '-60px' }}>
      <Box
        display={'flex'}
        alignItems={{ base: 'flex-start', md: 'center' }}
        justifyContent={'space-between'}
        flexDirection={{ base: 'column', md: 'row' }}
        marginY={'20px'}
      >
        <Heading as="h3" fontSize={'24px'} fontWeight={600}>
          Stats
        </Heading>
        <DateRangeStyle>
          <RangePicker
            presets={rangePresets}
            disabledDate={disabledDate}
            showTime={isMobile ? true : false}
            format="YYYY/MM/DD"
            onChange={onRangeChange}
            value={dateRange as any}
            popupClassName="customRangePicker"
            size="large"
          />
        </DateRangeStyle>
      </Box>
      <Grid
        templateColumns={{ base: 'repeat(4, 1fr)', md: 'repeat(4, 1fr)', xl: 'repeat(5, 1fr)' }}
        gap={6}
        marginBottom={'20px'}
      >
        <GridItem colSpan={{ base: 4, md: 2, xl: 1 }}>
          <Box
            backgroundColor={'rgba(28, 28, 30, 0.50)'}
            boxShadow={'0px 4px 20px 0px rgba(0, 0, 0, 0.30)'}
            backdropFilter={'blur(7px)'}
            borderRadius={'20px'}
            border={'1px solid #242428'}
            padding={'20px'}
          >
            <Box marginBottom={'20px'} display={'flex'} alignItems={'flex-start'} justifyContent={'space-between'}>
              <Text fontSize={'14px'} fontWeight={400} color={'#9E9E9F'}>
                Total Volume
              </Text>
              <Box>
                <LineChart data={dataVolume} width={70} height={22}>
                  <Line type="monotone" dataKey="VolumeUSDC" stroke="#1ED768" strokeWidth={2} dot={false} />
                </LineChart>
              </Box>
            </Box>
            <Text fontSize={'24px'} fontWeight={600} color={'white'} marginBottom={'10px'}>
              ${addComma(dataStats?.overviewStats?.totalVolume as number, 2)}
            </Text>
            <Box
              as="span"
              border={`${
                dataStats && +dataStats?.overviewStats?.totalVolumeDelta >= 0
                  ? '1px solid #1ED768'
                  : '1px solid #F03D3E'
              }`}
              backgroundColor={'rgba(21, 189, 89, 0.10)'}
              borderRadius={'4px'}
              padding={'2px 6px'}
              fontSize={'14px'}
              color={`${dataStats && +dataStats?.overviewStats?.totalVolumeDelta >= 0 ? '#1ED768' : '#F03D3E'}`}
            >
              {dataStats && +dataStats?.overviewStats?.totalVolumeDelta > 0 ? '+' : ''}
              {dataStats && addComma(dataStats?.overviewStats?.totalVolumeDelta, 2)}
            </Box>
          </Box>
        </GridItem>
        <GridItem colSpan={{ base: 4, md: 2, xl: 1 }}>
          <Box
            backgroundColor={'rgba(28, 28, 30, 0.50)'}
            boxShadow={'0px 4px 20px 0px rgba(0, 0, 0, 0.30)'}
            backdropFilter={'blur(7px)'}
            borderRadius={'20px'}
            border={'1px solid #242428'}
            padding={'20px'}
          >
            <Box marginBottom={'20px'} display={'flex'} alignItems={'flex-start'} justifyContent={'space-between'}>
              <Text fontSize={'14px'} fontWeight={400} color={'#9E9E9F'}>
                Total Fees
              </Text>
              <Box>
                <LineChart width={70} height={22} data={dataLine}>
                  <Line type="monotone" dataKey="pv" stroke="#1ED768" strokeWidth={2} dot={false} />
                </LineChart>
              </Box>
            </Box>
            <Text fontSize={'24px'} fontWeight={600} color={'white'} marginBottom={'10px'}>
              ${addComma(dataStats?.overviewStats?.totalFees as number, 2)}
            </Text>
            <Box
              as="span"
              border={`${
                dataStats && +dataStats?.overviewStats?.totalFeesDelta >= 0 ? '1px solid #1ED768' : '1px solid #F03D3E'
              }`}
              backgroundColor={'rgba(21, 189, 89, 0.10)'}
              borderRadius={'4px'}
              padding={'2px 6px'}
              fontSize={'14px'}
              color={`${dataStats && +dataStats?.overviewStats?.totalFeesDelta >= 0 ? '#1ED768' : '#F03D3E'}`}
            >
              {dataStats && +dataStats?.overviewStats?.totalFeesDelta > 0 ? '+' : ''}
              {dataStats && addComma(dataStats?.overviewStats?.totalFeesDelta, 2)}
            </Box>
          </Box>
        </GridItem>
        <GridItem colSpan={{ base: 4, md: 2, xl: 1 }}>
          <Box
            backgroundColor={'rgba(28, 28, 30, 0.50)'}
            boxShadow={'0px 4px 20px 0px rgba(0, 0, 0, 0.30)'}
            backdropFilter={'blur(7px)'}
            borderRadius={'20px'}
            border={'1px solid #242428'}
            padding={'20px'}
          >
            <Box marginBottom={'20px'} display={'flex'} alignItems={'flex-start'} justifyContent={'space-between'}>
              <Text fontSize={'14px'} fontWeight={400} color={'#9E9E9F'}>
                ELP Pool
              </Text>
              <Box>
                <LineChart width={70} height={22} data={dataLine}>
                  <Line type="monotone" dataKey="pv" stroke="#F03D3E" strokeWidth={2} dot={false} />
                </LineChart>
              </Box>
            </Box>
            <Text fontSize={'24px'} fontWeight={600} color={'white'} marginBottom={'10px'}>
              ${addComma(dataStats?.overviewStats?.totalPool as number, 2)}
            </Text>
            <Box
              as="span"
              border={`${
                dataStats && +dataStats?.overviewStats?.totalPoolDelta >= 0 ? '1px solid #1ED768' : '1px solid #F03D3E'
              }`}
              backgroundColor={'rgba(21, 189, 89, 0.10)'}
              borderRadius={'4px'}
              padding={'2px 6px'}
              fontSize={'14px'}
              color={`${dataStats && +dataStats?.overviewStats?.totalPoolDelta >= 0 ? '#1ED768' : '#F03D3E'}`}
            >
              {dataStats && +dataStats?.overviewStats?.totalPoolDelta > 0 ? '+' : ''}
              {dataStats && addComma(dataStats?.overviewStats?.totalPoolDelta, 2)}
            </Box>
          </Box>
        </GridItem>
        <GridItem colSpan={{ base: 4, md: 2, xl: 1 }}>
          <Box
            backgroundColor={'rgba(28, 28, 30, 0.50)'}
            boxShadow={'0px 4px 20px 0px rgba(0, 0, 0, 0.30)'}
            backdropFilter={'blur(7px)'}
            borderRadius={'20px'}
            border={'1px solid #242428'}
            padding={'20px'}
          >
            <Box marginBottom={'20px'} display={'flex'} alignItems={'flex-start'} justifyContent={'space-between'}>
              <Text fontSize={'14px'} fontWeight={400} color={'#9E9E9F'}>
                Total Users
              </Text>
              <Box>
                <LineChart width={70} height={22} data={dataLine}>
                  <Line type="monotone" dataKey="pv" stroke="#1ED768" strokeWidth={2} dot={false} />
                </LineChart>
              </Box>
            </Box>
            <Text fontSize={'24px'} fontWeight={600} color={'white'} marginBottom={'10px'}>
              {addComma(dataStats?.overviewStats?.totalUsers as number, 2)}
            </Text>
            <Box
              as="span"
              border={`${
                dataStats && +dataStats?.overviewStats?.totalUsersDelta >= 0 ? '1px solid #1ED768' : '1px solid #F03D3E'
              }`}
              backgroundColor={'rgba(21, 189, 89, 0.10)'}
              borderRadius={'4px'}
              padding={'2px 6px'}
              fontSize={'14px'}
              color={`${dataStats && +dataStats?.overviewStats?.totalUsersDelta >= 0 ? '#1ED768' : '#F03D3E'}`}
            >
              {dataStats && +dataStats?.overviewStats?.totalUsersDelta > 0 ? '+' : ''}
              {dataStats && addComma(dataStats?.overviewStats?.totalUsersDelta, 2)}
            </Box>
          </Box>
        </GridItem>
        <GridItem colSpan={{ base: 4, xl: 1 }}>
          <Box
            backgroundColor={'rgba(28, 28, 30, 0.50)'}
            boxShadow={'0px 4px 20px 0px rgba(0, 0, 0, 0.30)'}
            backdropFilter={'blur(7px)'}
            borderRadius={'20px'}
            border={'1px solid #242428'}
            padding={'20px'}
          >
            <Box marginBottom={'20px'} display={'flex'} alignItems={'flex-start'} justifyContent={'space-between'}>
              <Text fontSize={'14px'} fontWeight={400} color={'#9E9E9F'}>
                Net Payout
              </Text>
              <Box>
                <LineChart width={70} height={22} data={dataLine}>
                  <Line type="monotone" dataKey="pv" stroke="#1ED768" strokeWidth={2} dot={false} />
                </LineChart>
              </Box>
            </Box>
            <Text fontSize={'24px'} fontWeight={600} color={'white'} marginBottom={'10px'}>
              ${addComma(dataStats?.overviewStats?.payout as number, 2)}
            </Text>
            <Box
              as="span"
              border={`${
                dataStats && +dataStats?.overviewStats?.payoutDelta >= 0 ? '1px solid #1ED768' : '1px solid #F03D3E'
              }`}
              backgroundColor={'rgba(21, 189, 89, 0.10)'}
              borderRadius={'4px'}
              padding={'2px 6px'}
              fontSize={'14px'}
              color={`${dataStats && +dataStats?.overviewStats?.payoutDelta >= 0 ? '#1ED768' : '#F03D3E'}`}
            >
              {dataStats && +dataStats?.overviewStats?.payoutDelta > 0 ? '+' : ''}
              {dataStats && addComma(dataStats?.overviewStats?.payoutDelta, 2)}
            </Box>
          </Box>
        </GridItem>
      </Grid>
      <Grid templateColumns="repeat(2, 1fr)" gap={6} marginBottom={'20px'}>
        <GridItem colSpan={{ base: 2, md: 2, lg: 1 }}>
          <Box
            backgroundColor={'rgba(28, 28, 30, 0.50)'}
            boxShadow={'0px 4px 20px 0px rgba(0, 0, 0, 0.30)'}
            backdropFilter={'blur(7px)'}
            borderRadius={'20px'}
            border={'1px solid #242428'}
          >
            <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} padding={'20px'}>
              <Text>Volume</Text>

              <Button
                leftIcon={<Download size={14} />}
                colorScheme="primary"
                variant="outline"
                size={'xs'}
                background={'#050506'}
              >
                <DownloadCSV
                  data={dataVolume ? dataVolume : []}
                  filename={`VolumeCSV_${dateRange[0].format('YYYY-MM-DD')}_${dateRange[1].format('YYYY-MM-DD')}`}
                  headers={[
                    { label: 'Cumulative', key: 'cumulative' },
                    { label: 'Volume USDC', key: 'VolumeUSDC' },
                    { label: 'Timestamp', key: 'timestamp' },
                  ]}
                />
              </Button>
            </Box>
            <ResponsiveContainer width="99%" height="100%" aspect={2}>
              <ComposedChart data={dataVolume} barGap={0}>
                <CartesianGrid strokeDasharray="3 3" stroke="#23252E" />
                <Tooltip content={CustomTooltip} />
                <XAxis
                  dataKey="timestamp"
                  stroke="#6D6D70"
                  style={{
                    fontSize: '12px',
                  }}
                  tickLine={false}
                  tickFormatter={DataTickDateFormater}
                />
                {/* <YAxis /> */}
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  stroke="#6D6D70"
                  style={{
                    fontSize: '12px',
                  }}
                  tickFormatter={DataTickFormater}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#6D6D70"
                  style={{
                    fontSize: '12px',
                  }}
                  tickFormatter={DataTickFormater}
                />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="VolumeUSDC" name="USDC Volume" fill="#FFCE57" barSize={16} unit="$" />
                <Line
                  type="monotone"
                  dataKey="cumulative"
                  name="Cumulative"
                  stroke="#FE1A67"
                  connectNulls
                  yAxisId="right"
                  dot={false}
                  unit="$"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </Box>
        </GridItem>
        <GridItem colSpan={{ base: 2, md: 2, lg: 1 }}>
          <Box
            backgroundColor={'rgba(28, 28, 30, 0.50)'}
            boxShadow={'0px 4px 20px 0px rgba(0, 0, 0, 0.30)'}
            backdropFilter={'blur(7px)'}
            borderRadius={'20px'}
            border={'1px solid #242428'}
          >
            <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} padding={'20px'}>
              <Text>Fees</Text>
              <Button
                leftIcon={<Download size={14} />}
                colorScheme="primary"
                variant="outline"
                size={'xs'}
                background={'#050506'}
              >
                <DownloadCSV
                  data={dataFees ? dataFees : []}
                  headers={[
                    { label: 'Cumulative', key: 'cumulative' },
                    { label: 'Fees', key: 'fee' },
                    { label: 'Timestamp', key: 'timestamp' },
                  ]}
                  filename={`FeesCSV_${dateRange[0].format('YYYY-MM-DD')}_${dateRange[1].format('YYYY-MM-DD')}`}
                />
              </Button>
            </Box>
            <ResponsiveContainer width="99%" height="100%" aspect={2}>
              <ComposedChart data={dataFees} barGap={0}>
                <CartesianGrid strokeDasharray="3 3" stroke="#23252E" />
                <Tooltip content={CustomTooltip} />
                <XAxis
                  dataKey="timestamp"
                  stroke="#6D6D70"
                  style={{
                    fontSize: '12px',
                  }}
                  tickLine={false}
                  tickFormatter={DataTickDateFormater}
                />
                {/* <YAxis /> */}
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  stroke="#6D6D70"
                  style={{
                    fontSize: '12px',
                  }}
                  tickFormatter={DataTickFormater}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#6D6D70"
                  style={{
                    fontSize: '12px',
                  }}
                  tickFormatter={DataTickFormater}
                />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="fee" name="USDC Fees" fill="#8042FF" barSize={16} unit="$" />
                <Line
                  type="monotone"
                  dataKey="cumulative"
                  name="Cumulative"
                  stroke="#FE1A67"
                  connectNulls
                  yAxisId="right"
                  dot={false}
                  unit="$"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </Box>
        </GridItem>

        <GridItem colSpan={{ base: 2, md: 2, lg: 1 }}>
          <Box
            backgroundColor={'rgba(28, 28, 30, 0.50)'}
            boxShadow={'0px 4px 20px 0px rgba(0, 0, 0, 0.30)'}
            backdropFilter={'blur(7px)'}
            borderRadius={'20px'}
            border={'1px solid #242428'}
          >
            <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} padding={'20px'}>
              <Text>Burned ETR</Text>
              <Button
                leftIcon={<Download size={14} />}
                colorScheme="primary"
                variant="outline"
                size={'xs'}
                background={'#050506'}
              >
                <DownloadCSV
                  data={dataBurnStats ? dataBurnStats : []}
                  headers={[
                    { label: 'Cumulative', key: 'cumulative' },
                    { label: 'Amount', key: 'amount' },
                    { label: 'Timestamp', key: 'timestamp' },
                  ]}
                  filename={`BurnedETR_${dateRange[0].format('YYYY-MM-DD')}_${dateRange[1].format('YYYY-MM-DD')}`}
                />
              </Button>
            </Box>
            <ResponsiveContainer width="99%" height="100%" aspect={2}>
              <ComposedChart data={dataBurnStats} barGap={0}>
                <CartesianGrid strokeDasharray="3 3" stroke="#23252E" />
                <Tooltip content={CustomTooltip} />
                <XAxis
                  dataKey="timestamp"
                  stroke="#6D6D70"
                  style={{
                    fontSize: '12px',
                  }}
                  tickLine={false}
                  tickFormatter={DataTickDateFormater}
                />
                {/* <YAxis /> */}
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  stroke="#6D6D70"
                  style={{
                    fontSize: '12px',
                  }}
                  tickFormatter={DataTickFormater}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#6D6D70"
                  style={{
                    fontSize: '12px',
                  }}
                  tickFormatter={DataTickFormater}
                />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="amount" name="Burned ETR" fill="#FFCE57" barSize={16} unit={'ETR'} />
                <Line
                  type="monotone"
                  dataKey="cumulative"
                  name="Cumulative"
                  stroke="#FE1A67"
                  connectNulls
                  yAxisId="right"
                  dot={false}
                  unit={'ETR'}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </Box>
        </GridItem>

        <GridItem colSpan={{ base: 2, md: 2, lg: 1 }}>
          <Box
            backgroundColor={'rgba(28, 28, 30, 0.50)'}
            boxShadow={'0px 4px 20px 0px rgba(0, 0, 0, 0.30)'}
            backdropFilter={'blur(7px)'}
            borderRadius={'20px'}
            border={'1px solid #242428'}
          >
            <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} padding={'20px'}>
              <Text>USD/ELP rate</Text>
              <Button
                leftIcon={<Download size={14} />}
                colorScheme="primary"
                variant="outline"
                size={'xs'}
                background={'#050506'}
              >
                <DownloadCSV
                  data={dataRate ? dataRate : []}
                  headers={[
                    { label: 'Exchange Rate', key: 'rate' },
                    { label: 'Timestamp', key: 'timestamp' },
                  ]}
                  filename={`USD/ELP-rate_${dateRange[0].format('YYYY-MM-DD')}_${dateRange[1].format('YYYY-MM-DD')}`}
                />
              </Button>
            </Box>
            <ResponsiveContainer width="99%" height="100%" aspect={2}>
              <ComposedChart
                data={dataRate}
                margin={{
                  right: 60,
                }}
                barGap={0}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#23252E" />
                <Tooltip content={CustomTooltip} />
                <XAxis
                  dataKey="timestamp"
                  stroke="#6D6D70"
                  style={{
                    fontSize: '12px',
                  }}
                  tickLine={false}
                  tickFormatter={DataTickDateFormater}
                />
                {/* <YAxis /> */}
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  stroke="#6D6D70"
                  style={{
                    fontSize: '12px',
                  }}
                  tickFormatter={DataTickFormater}
                />
                {/* <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#6D6D70"
                  style={{
                    fontSize: '12px',
                  }}
                /> */}
                <Tooltip />
                <Legend />
                {/* <Bar yAxisId="left" dataKey="pv" fill="#8042FF" barSize={16} /> */}
                <Line
                  type="monotone"
                  dataKey="rate"
                  name="Exchange Rate"
                  stroke="#DD6FB5"
                  connectNulls
                  yAxisId="left"
                  dot={false}
                  unit="$"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </Box>
        </GridItem>

        <GridItem colSpan={{ base: 2, md: 2, lg: 1 }}>
          <Box
            backgroundColor={'rgba(28, 28, 30, 0.50)'}
            boxShadow={'0px 4px 20px 0px rgba(0, 0, 0, 0.30)'}
            backdropFilter={'blur(7px)'}
            borderRadius={'20px'}
            border={'1px solid #242428'}
          >
            <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} padding={'20px'}>
              <Text>ELP Pool</Text>
              <Button
                leftIcon={<Download size={14} />}
                colorScheme="primary"
                variant="outline"
                size={'xs'}
                background={'#050506'}
              >
                <DownloadCSV
                  data={dataELPPool ? dataELPPool : []}
                  headers={[
                    { label: 'Current USDC Balance', key: 'glpSupply' },
                    { label: 'Timestamp', key: 'timestamp' },
                  ]}
                  filename={`ELPPool_${dateRange[0].format('YYYY-MM-DD')}_${dateRange[1].format('YYYY-MM-DD')}`}
                />
              </Button>
            </Box>
            <ResponsiveContainer width="99%" height="100%" aspect={2}>
              <ComposedChart
                data={dataELPPool}
                margin={{
                  right: 60,
                }}
                barGap={0}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#23252E" />
                <Tooltip content={CustomTooltip} />
                <XAxis
                  dataKey="timestamp"
                  stroke="#6D6D70"
                  style={{
                    fontSize: '12px',
                  }}
                  tickLine={false}
                  tickFormatter={DataTickDateFormater}
                />
                {/* <YAxis /> */}
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  stroke="#6D6D70"
                  style={{
                    fontSize: '12px',
                  }}
                  tickFormatter={DataTickFormater}
                />
                {/* <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#6D6D70"
                  style={{
                    fontSize: '12px',
                  }}
                /> */}
                <Tooltip />
                <Legend />
                {/* <Bar yAxisId="left" dataKey="pv" fill="#8042FF" barSize={16} /> */}
                <Line
                  type="monotone"
                  dataKey="glpSupply"
                  name="Current USDC Balance"
                  stroke="#4B65F3"
                  connectNulls
                  yAxisId="left"
                  dot={false}
                  unit="$"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </Box>
        </GridItem>

        <GridItem colSpan={{ base: 2, md: 2, lg: 1 }}>
          <Box
            backgroundColor={'rgba(28, 28, 30, 0.50)'}
            boxShadow={'0px 4px 20px 0px rgba(0, 0, 0, 0.30)'}
            backdropFilter={'blur(7px)'}
            borderRadius={'20px'}
            border={'1px solid #242428'}
          >
            <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} padding={'20px'}>
              <Text>New vs. Existing Users</Text>
              <Button
                leftIcon={<Download size={14} />}
                colorScheme="primary"
                variant="outline"
                size={'xs'}
                background={'#050506'}
              >
                <DownloadCSV
                  data={dataUserStats ? dataUserStats : []}
                  headers={[
                    { label: 'Existing Count', key: 'existingCount' },
                    { label: 'Unique Count', key: 'uniqueCount' },
                    { label: 'unique Count Cumulative', key: 'uniqueCountCumulative' },
                    { label: 'Timestamp', key: 'timestamp' },
                  ]}
                  filename={`NewvsExistingUsers_${dateRange[0].format('YYYY-MM-DD')}_${dateRange[1].format(
                    'YYYY-MM-DD',
                  )}`}
                />
              </Button>
            </Box>
            <ResponsiveContainer width="99%" height="100%" aspect={2}>
              <ComposedChart data={dataUserStats} barGap={0}>
                <CartesianGrid strokeDasharray="3 3" stroke="#23252E" />
                <Tooltip content={CustomTooltip} />
                <XAxis
                  dataKey="timestamp"
                  stroke="#6D6D70"
                  style={{
                    fontSize: '12px',
                  }}
                  tickLine={false}
                  tickFormatter={DataTickDateFormater}
                />
                {/* <YAxis /> */}
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  stroke="#6D6D70"
                  style={{
                    fontSize: '12px',
                  }}
                  tickFormatter={DataTickFormater}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#6D6D70"
                  style={{
                    fontSize: '12px',
                  }}
                  tickFormatter={DataTickFormater}
                />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="new" name="New" fill="#FFCE57" barSize={16} />
                <Bar yAxisId="left" dataKey="existing" name="Existing" fill="#8042FF" barSize={16} />
                <Line
                  type="monotone"
                  dataKey="percentage"
                  name="Existing %"
                  stroke="#4CC0C0"
                  connectNulls
                  yAxisId="right"
                  dot={false}
                  unit="%"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </Box>
        </GridItem>
        <GridItem colSpan={{ base: 2, md: 2, lg: 1 }}>
          <Box
            backgroundColor={'rgba(28, 28, 30, 0.50)'}
            boxShadow={'0px 4px 20px 0px rgba(0, 0, 0, 0.30)'}
            backdropFilter={'blur(7px)'}
            borderRadius={'20px'}
            border={'1px solid #242428'}
          >
            <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} padding={'20px'}>
              <Text>Traders Net PnL (USDC)</Text>
              <Button
                leftIcon={<Download size={14} />}
                colorScheme="primary"
                variant="outline"
                size={'xs'}
                background={'#050506'}
              >
                <DownloadCSV
                  data={dataTradersNetPnL ? dataTradersNetPnL : []}
                  headers={[
                    { label: 'PNL', key: 'pnl' },
                    { label: 'PNL Cumulative', key: 'pnlCumulative' },
                    { label: 'Timestamp', key: 'timestamp' },
                  ]}
                  filename={`TradersNetPnL(USDC)_${dateRange[0].format('YYYY-MM-DD')}_${dateRange[1].format(
                    'YYYY-MM-DD',
                  )}`}
                />
              </Button>
            </Box>
            <ResponsiveContainer width="99%" height="100%" aspect={2}>
              <ComposedChart width={500} height={300} data={dataTradersNetPnL} barGap={0}>
                <CartesianGrid strokeDasharray="3 3" stroke="#23252E" />
                <Tooltip content={CustomTooltip} />
                <XAxis
                  dataKey="timestamp"
                  stroke="#6D6D70"
                  style={{
                    fontSize: '12px',
                  }}
                  tickLine={false}
                  tickFormatter={DataTickDateFormater}
                />
                {/* <YAxis /> */}
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  stroke="#6D6D70"
                  style={{
                    fontSize: '12px',
                  }}
                  tickFormatter={DataTickFormater}
                  domain={[-maxTradersNetPnL, maxTradersNetPnL]}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#6D6D70"
                  style={{
                    fontSize: '12px',
                  }}
                  tickFormatter={DataTickFormater}
                  domain={[-maxTradersNetPnL, maxTradersNetPnL]}
                />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="pnl" barSize={16} fill="white" name="Net PnL" unit="$">
                  {dataTradersNetPnL?.map((entry, index) => {
                    return <Cell key={`cell-${index}`} fill={`${entry.pnl > 0 ? '#82ca9d' : '#F03D3E'}`} />;
                  })}
                </Bar>
                <Line
                  type="monotone"
                  dataKey="pnlCumulative"
                  name="Cumulative PnL"
                  stroke="#4CC0C0"
                  connectNulls
                  yAxisId="right"
                  dot={false}
                  unit="$"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </Box>
        </GridItem>
        <GridItem colSpan={{ base: 2, md: 2, lg: 1 }}>
          <Box
            backgroundColor={'rgba(28, 28, 30, 0.50)'}
            boxShadow={'0px 4px 20px 0px rgba(0, 0, 0, 0.30)'}
            backdropFilter={'blur(7px)'}
            borderRadius={'20px'}
            border={'1px solid #242428'}
          >
            <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} padding={'20px'}>
              <Text>Traders Profit vs Loss (USDC)</Text>
              <Button
                leftIcon={<Download size={14} />}
                colorScheme="primary"
                variant="outline"
                size={'xs'}
                background={'#050506'}
              >
                <DownloadCSV
                  data={dataTradersProfit ? dataTradersProfit : []}
                  headers={[
                    { label: 'Profit', key: 'profit' },
                    { label: 'Loss', key: 'loss' },
                    { label: 'Profit Cumulative', key: 'profitCumulative' },
                    { label: 'Loss Cumulative', key: 'lossCumulative' },
                    { label: 'Timestamp', key: 'timestamp' },
                  ]}
                  filename={`TradersProfitvsLoss(USDC)_${dateRange[0].format('YYYY-MM-DD')}_${dateRange[1].format(
                    'YYYY-MM-DD',
                  )}`}
                />
              </Button>
            </Box>
            <ResponsiveContainer width="99%" height="100%" aspect={2}>
              <ComposedChart width={500} height={300} data={dataTradersProfit} barGap={0}>
                <CartesianGrid strokeDasharray="3 3" stroke="#23252E" />
                <Tooltip content={CustomTooltip} />
                <XAxis
                  dataKey="timestamp"
                  stroke="#6D6D70"
                  style={{
                    fontSize: '12px',
                  }}
                  tickLine={false}
                  tickFormatter={DataTickDateFormater}
                />
                {/* <YAxis /> */}
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  stroke="#6D6D70"
                  style={{
                    fontSize: '12px',
                  }}
                  domain={[-maxTradersProfit, maxTradersProfit]}
                  tickFormatter={DataTickFormater}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#6D6D70"
                  style={{
                    fontSize: '12px',
                  }}
                  domain={[-maxTradersProfit, maxTradersProfit]}
                  tickFormatter={DataTickFormater}
                />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="profit" fill="#22c761" name='Profit'/>
                <Bar yAxisId="left" dataKey="loss" fill="#f93333" name='Loss'/>
                <Area yAxisId="right" type="monotone" dataKey="profitCumulative" fill="#22c761" stroke="#22c761" name='Cumulative Profit'/>
                <Area yAxisId="right" type="monotone" dataKey="lossCumulative" fill="#f93333" stroke="#f93333" name='Cumulative Loss'/>
              </ComposedChart>
            </ResponsiveContainer>
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default StatsView;
