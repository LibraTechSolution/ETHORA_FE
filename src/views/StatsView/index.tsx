'use client';
import { addComma } from '@/utils/number';
import { Box, Button, Grid, GridItem, Heading, Text } from '@chakra-ui/react';
import { maxBy, minBy, sortBy } from 'lodash';
import { Download } from 'lucide-react';
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

const data = [
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
    amt: 5000,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 4356,
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

const data2 = {
  tradingStats: [
    {
      lossBFR: '0',
      profitBFR: '0',
      profitCumulativeBFR: '112214095114',
      timestamp: '1696779837',
      lossCumulativeBFR: '86393871073',
    },
    {
      lossBFR: '0',
      profitBFR: '0',
      profitCumulativeBFR: '112214095114',
      timestamp: '1696692914',
      lossCumulativeBFR: '86393871073',
    },
    {
      lossBFR: '0',
      profitBFR: '0',
      profitCumulativeBFR: '112214095114',
      timestamp: '1696606474',
      lossCumulativeBFR: '86393871073',
    },
    {
      lossBFR: '0',
      profitBFR: '0',
      profitCumulativeBFR: '112214095114',
      timestamp: '1696520946',
      lossCumulativeBFR: '86393871073',
    },
    {
      lossBFR: '0',
      profitBFR: '0',
      profitCumulativeBFR: '112214095114',
      timestamp: '1696424262',
      lossCumulativeBFR: '86393871073',
    },
    {
      lossBFR: '0',
      profitBFR: '0',
      profitCumulativeBFR: '112214095114',
      timestamp: '1696347467',
      lossCumulativeBFR: '86393871073',
    },
    {
      lossBFR: '0',
      profitBFR: '0',
      profitCumulativeBFR: '112214095114',
      timestamp: '1696261807',
      lossCumulativeBFR: '86393871073',
    },
    {
      lossBFR: '0',
      profitBFR: '0',
      profitCumulativeBFR: '112214095114',
      timestamp: '1696173898',
      lossCumulativeBFR: '86393871073',
    },
    {
      lossBFR: '9555876',
      profitBFR: '3310513',
      profitCumulativeBFR: '112214095114',
      timestamp: '1696087596',
      lossCumulativeBFR: '86393871073',
    },
    {
      lossBFR: '0',
      profitBFR: '9080185',
      profitCumulativeBFR: '112210784601',
      timestamp: '1696002583',
      lossCumulativeBFR: '86384315197',
    },
    {
      lossBFR: '4459995',
      profitBFR: '5351994',
      profitCumulativeBFR: '112201704416',
      timestamp: '1695916442',
      lossCumulativeBFR: '86384315197',
    },
    {
      lossBFR: '6726969',
      profitBFR: '0',
      profitCumulativeBFR: '112196352422',
      timestamp: '1695825200',
      lossCumulativeBFR: '86379855202',
    },
    {
      lossBFR: '15290564',
      profitBFR: '43927228',
      profitCumulativeBFR: '112196352422',
      timestamp: '1695740337',
      lossCumulativeBFR: '86373128233',
    },
    {
      lossBFR: '0',
      profitBFR: '0',
      profitCumulativeBFR: '112152425194',
      timestamp: '1695654235',
      lossCumulativeBFR: '86357837669',
    },
    {
      lossBFR: '899137',
      profitBFR: '1798274',
      profitCumulativeBFR: '112152425194',
      timestamp: '1695475052',
      lossCumulativeBFR: '86357837669',
    },
    {
      lossBFR: '1821318',
      profitBFR: '0',
      profitCumulativeBFR: '112150626920',
      timestamp: '1695385059',
      lossCumulativeBFR: '86356938532',
    },
    {
      lossBFR: '11955222',
      profitBFR: '9065237',
      profitCumulativeBFR: '112150626920',
      timestamp: '1695311872',
      lossCumulativeBFR: '86355117214',
    },
    {
      lossBFR: '411392131',
      profitBFR: '536897799',
      profitCumulativeBFR: '112141561683',
      timestamp: '1695225180',
      lossCumulativeBFR: '86343161992',
    },
    {
      lossBFR: '3968184',
      profitBFR: '1984092',
      profitCumulativeBFR: '111604663884',
      timestamp: '1695137268',
      lossCumulativeBFR: '85931769861',
    },
    {
      lossBFR: '16664201',
      profitBFR: '14663295',
      profitCumulativeBFR: '111602679792',
      timestamp: '1695051228',
      lossCumulativeBFR: '85927801677',
    },
    {
      lossBFR: '1955714',
      profitBFR: '3911428',
      profitCumulativeBFR: '111588016497',
      timestamp: '1694962423',
      lossCumulativeBFR: '85911137476',
    },
    {
      lossBFR: '27636763',
      profitBFR: '24485115',
      profitCumulativeBFR: '111584105069',
      timestamp: '1694864805',
      lossCumulativeBFR: '85909181762',
    },
    {
      lossBFR: '9998035',
      profitBFR: '9050671',
      profitCumulativeBFR: '111559619954',
      timestamp: '1694793434',
      lossCumulativeBFR: '85881544999',
    },
    {
      lossBFR: '84168822',
      profitBFR: '45650236',
      profitCumulativeBFR: '111550569283',
      timestamp: '1694706712',
      lossCumulativeBFR: '85871546964',
    },
    {
      lossBFR: '190092500',
      profitBFR: '109061113',
      profitCumulativeBFR: '111504919047',
      timestamp: '1694619266',
      lossCumulativeBFR: '85787378142',
    },
    {
      lossBFR: '10192627',
      profitBFR: '186321228',
      profitCumulativeBFR: '111395857934',
      timestamp: '1694532437',
      lossCumulativeBFR: '85597285642',
    },
    {
      lossBFR: '0',
      profitBFR: '0',
      profitCumulativeBFR: '111209536706',
      timestamp: '1694446145',
      lossCumulativeBFR: '85587093015',
    },
    {
      lossBFR: '1771580565',
      profitBFR: '1254916280',
      profitCumulativeBFR: '111209536706',
      timestamp: '1694358104',
      lossCumulativeBFR: '85587093015',
    },
    {
      lossBFR: '315054109',
      profitBFR: '425440263',
      profitCumulativeBFR: '109954620426',
      timestamp: '1694274584',
      lossCumulativeBFR: '83815512450',
    },
    {
      lossBFR: '136886986',
      profitBFR: '358678561',
      profitCumulativeBFR: '109529180163',
      timestamp: '1694187344',
      lossCumulativeBFR: '83500458341',
    },
    {
      lossBFR: '780347553',
      profitBFR: '335133588',
      profitCumulativeBFR: '109170501602',
      timestamp: '1694100549',
      lossCumulativeBFR: '83363571355',
    },
    {
      lossBFR: '313525218',
      profitBFR: '191621395',
      profitCumulativeBFR: '108835368014',
      timestamp: '1694012458',
      lossCumulativeBFR: '82583223802',
    },
    {
      lossBFR: '14881236',
      profitBFR: '0',
      profitCumulativeBFR: '108643746619',
      timestamp: '1693928964',
      lossCumulativeBFR: '82269698584',
    },
    {
      lossBFR: '128630957',
      profitBFR: '65028963',
      profitCumulativeBFR: '108643746619',
      timestamp: '1693843039',
      lossCumulativeBFR: '82254817348',
    },
    {
      lossBFR: '30068251',
      profitBFR: '0',
      profitCumulativeBFR: '108578717656',
      timestamp: '1693751902',
      lossCumulativeBFR: '82126186391',
    },
    {
      lossBFR: '87656596',
      profitBFR: '36183826',
      profitCumulativeBFR: '108578717656',
      timestamp: '1693669675',
      lossCumulativeBFR: '82096118140',
    },
    {
      lossBFR: '60544207',
      profitBFR: '30577882',
      profitCumulativeBFR: '108542533830',
      timestamp: '1693583964',
      lossCumulativeBFR: '82008461544',
    },
    {
      lossBFR: '338117244',
      profitBFR: '246970444',
      profitCumulativeBFR: '108511955948',
      timestamp: '1693497502',
      lossCumulativeBFR: '81947917337',
    },
    {
      lossBFR: '30577882',
      profitBFR: '40158952',
      profitCumulativeBFR: '108264985504',
      timestamp: '1693410985',
      lossCumulativeBFR: '81609800093',
    },
    {
      lossBFR: '0',
      profitBFR: '5389737',
      profitCumulativeBFR: '108224826552',
      timestamp: '1693320563',
      lossCumulativeBFR: '81579222211',
    },
    {
      lossBFR: '15288939',
      profitBFR: '0',
      profitCumulativeBFR: '108219436815',
      timestamp: '1693237168',
      lossCumulativeBFR: '81579222211',
    },
    {
      lossBFR: '10192626',
      profitBFR: '0',
      profitCumulativeBFR: '108219436815',
      timestamp: '1693150848',
      lossCumulativeBFR: '81563933272',
    },
    {
      lossBFR: '20385252',
      profitBFR: '15288939',
      profitCumulativeBFR: '108219436815',
      timestamp: '1693062608',
      lossCumulativeBFR: '81553740646',
    },
    {
      lossBFR: '73081138',
      profitBFR: '5096313',
      profitCumulativeBFR: '108204147876',
      timestamp: '1692978882',
      lossCumulativeBFR: '81533355394',
    },
    {
      lossBFR: '5096313',
      profitBFR: '15288939',
      profitCumulativeBFR: '108199051563',
      timestamp: '1692891319',
      lossCumulativeBFR: '81460274256',
    },
    {
      lossBFR: '62378880',
      profitBFR: '280399180',
      profitCumulativeBFR: '108183762624',
      timestamp: '1692799877',
      lossCumulativeBFR: '81455177943',
    },
    {
      lossBFR: '21404517',
      profitBFR: '0',
      profitCumulativeBFR: '107903363444',
      timestamp: '1692701769',
      lossCumulativeBFR: '81392799063',
    },
    {
      lossBFR: '0',
      profitBFR: '0',
      profitCumulativeBFR: '107903363444',
      timestamp: '1692632847',
      lossCumulativeBFR: '81371394546',
    },
    {
      lossBFR: '761651802',
      profitBFR: '64213552',
      profitCumulativeBFR: '107903363444',
      timestamp: '1692544023',
      lossCumulativeBFR: '81371394546',
    },
    {
      lossBFR: '288553281',
      profitBFR: '104397214',
      profitCumulativeBFR: '107839149892',
      timestamp: '1692460510',
      lossCumulativeBFR: '80609742744',
    },
    {
      lossBFR: '1176278620',
      profitBFR: '791627394',
      profitCumulativeBFR: '107734752678',
      timestamp: '1692360463',
      lossCumulativeBFR: '80321189463',
    },
    {
      lossBFR: '170436173',
      profitBFR: '164610932',
      profitCumulativeBFR: '106943125284',
      timestamp: '1692287585',
      lossCumulativeBFR: '79144910843',
    },
    {
      lossBFR: '26630554',
      profitBFR: '125170403',
      profitCumulativeBFR: '106778514352',
      timestamp: '1692201527',
      lossCumulativeBFR: '78974474670',
    },
    {
      lossBFR: '0',
      profitBFR: '8252938',
      profitCumulativeBFR: '106653343949',
      timestamp: '1692108245',
      lossCumulativeBFR: '78947844116',
    },
    {
      lossBFR: '556313601',
      profitBFR: '9784922',
      profitCumulativeBFR: '106645091011',
      timestamp: '1692027011',
      lossCumulativeBFR: '78947844116',
    },
    {
      lossBFR: '0',
      profitBFR: '0',
      profitCumulativeBFR: '106635306089',
      timestamp: '1691938351',
      lossCumulativeBFR: '78391530515',
    },
    {
      lossBFR: '26099303',
      profitBFR: '0',
      profitCumulativeBFR: '106635306089',
      timestamp: '1691855746',
      lossCumulativeBFR: '78391530515',
    },
    {
      lossBFR: '52507474',
      profitBFR: '0',
      profitCumulativeBFR: '106635306089',
      timestamp: '1691766793',
      lossCumulativeBFR: '78365431212',
    },
    {
      lossBFR: '86853540',
      profitBFR: '37805382',
      profitCumulativeBFR: '106635306089',
      timestamp: '1691675708',
      lossCumulativeBFR: '78312923738',
    },
    {
      lossBFR: '50963137',
      profitBFR: '61155764',
      profitCumulativeBFR: '106597500707',
      timestamp: '1691582932',
      lossCumulativeBFR: '78226070198',
    },
    {
      lossBFR: '0',
      profitBFR: '50963137',
      profitCumulativeBFR: '106536344943',
      timestamp: '1691510339',
      lossCumulativeBFR: '78175107061',
    },
  ],
};

const StatsView = () => {
  // let ret = null;
  let currentPnlCumulative = 0;
  let currentProfitCumulative = 0;
  let currentLossCumulative = 0;
  const dataMap =
    data2 && data2.tradingStats.length
      ? sortBy(data2.tradingStats, (i) => i.timestamp).map((dataItem) => {
          const profit = +dataItem.profitBFR / 1e6;
          const loss = +dataItem.lossBFR / 1e6;
          const profitCumulative = +dataItem.profitCumulativeBFR / 1e6;
          const lossCumulative = +dataItem.lossCumulativeBFR / 1e6;
          const pnlCumulative = profitCumulative - lossCumulative;
          const pnl = profit - loss;
          currentProfitCumulative += profit;
          currentLossCumulative -= loss;
          currentPnlCumulative += pnl;
          return {
            profit,
            loss: -loss,
            profitCumulative,
            lossCumulative: -lossCumulative,
            pnl,
            pnlCumulative,
            timestamp: dataItem.timestamp,
            currentPnlCumulative,
            currentLossCumulative,
            currentProfitCumulative,
          };
        })
      : null;

  console.log('dataMap', dataMap);
  //   if (dataMap) {
  //     // console.log(data,'data')
  //     const maxProfit = maxBy(dataMap, (item) => item.profit).profit;
  //     const maxLoss = minBy(dataMap, (item) => item.loss).loss;
  //     const maxProfitLoss = Math.max(maxProfit, -maxLoss);

  //     const maxPnl = maxBy(dataMap, (item) => item.pnl).pnl;
  //     const minPnl = minBy(dataMap, (item) => item.pnl).pnl;
  //     const maxCurrentCumulativePnl = maxBy(
  //       dataMap,
  //       (item) => item.currentPnlCumulative
  //     ).currentPnlCumulative;
  //     const minCurrentCumulativePnl = minBy(
  //       dataMap,
  //       (item) => item.currentPnlCumulative
  //     ).currentPnlCumulative;

  //     const currentProfitCumulative =
  //     dataMap[dataMap.length - 1].currentProfitCumulative;
  //     const currentLossCumulative = dataMap[dataMap.length - 1].currentLossCumulative;
  //     const stats = {
  //       maxProfit,
  //       maxLoss,
  //       maxProfitLoss,
  //       currentProfitCumulative,
  //       currentLossCumulative,
  //       maxCurrentCumulativeProfitLoss: Math.max(
  //         currentProfitCumulative,
  //         -currentLossCumulative
  //       ),

  //       maxAbsPnl: Math.max(Math.abs(maxPnl), Math.abs(minPnl)),
  //       maxAbsCumulativePnl: Math.max(
  //         Math.abs(maxCurrentCumulativePnl),
  //         Math.abs(minCurrentCumulativePnl)
  //       ),
  //     };

  //     ret = {
  //       dataMap,
  //       stats,
  //     };
  //   }

  //   return [ret];
  // }

  const CustomTooltip = (data: any) => {
    const { active, payload } = data;
    if (active && payload && payload.length) {
      console.log(data);
      return (
        // eslint-disable-next-line tailwindcss/no-custom-classname
        <div className="custom-tooltip min-w-[118px] rounded-lg bg-[#050506] p-[10px]">
          <p className=" text-sm font-medium text-white">{payload[0]?.payload?.name}</p>
          {payload.map((item: any, index: number) => {
            console.log(item.color);

            return (
              // eslint-disable-next-line tailwindcss/no-custom-classname
              <p className={`flex items-center text-sm`} key={index} style={{ color: item.color }}>
                {`${item.name}: ${item.payload[item.dataKey] ? addComma(item.payload[item.dataKey]) : 0}`}
              </p>
            );
          })}
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <Heading as="h3" marginY={'20px'} fontSize={'24px'} fontWeight={600}>
        Stats
      </Heading>

      <Grid templateColumns="repeat(5, 1fr)" gap={6} marginBottom={'20px'}>
        <GridItem>
          <Box>
            <Box marginBottom={'20px'} display={'flex'} alignItems={'flex-start'} justifyContent={'space-between'}>
              <Text fontSize={'14px'} fontWeight={400} color={'#9E9E9F'}>
                Total Volume
              </Text>
              <Box>
                <LineChart width={70} height={22} data={data}>
                  <Line type="monotone" dataKey="pv" stroke="#8884d8" strokeWidth={2} dot={false}/>
                </LineChart>
              </Box>
            </Box>
            <Text fontSize={'24px'} fontWeight={600} color={'white'}>
              $6,893,187
            </Text>
            <Box as="span">+$19.6K</Box>
          </Box>
        </GridItem>
      </Grid>

      <Grid templateColumns="repeat(2, 1fr)" gap={6} marginBottom={'20px'}>
        <GridItem colSpan={{ md: 2, lg: 1 }}>
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
                Download CSV
              </Button>
            </Box>
            <ResponsiveContainer width="100%" height="100%" aspect={2}>
              <ComposedChart
                // width={500}
                // height={300}
                data={data}
                // margin={{
                //   top: 5,
                //   right: 10,
                //   left: 10,
                //   bottom: 5,
                // }}
                barGap={0}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#23252E" />
                <Tooltip content={CustomTooltip} />
                <XAxis
                  dataKey="name"
                  stroke="#6D6D70"
                  style={{
                    fontSize: '12px',
                  }}
                  tickLine={false}
                />
                {/* <YAxis /> */}
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  stroke="#6D6D70"
                  style={{
                    fontSize: '12px',
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#6D6D70"
                  style={{
                    fontSize: '12px',
                  }}
                />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="pv" name="pv Name" fill="#FFCE57" barSize={16} />
                <Line type="monotone" dataKey="amt" name="amt Name" stroke="#FE1A67" connectNulls yAxisId="right" />
              </ComposedChart>
            </ResponsiveContainer>
          </Box>
        </GridItem>
        <GridItem colSpan={{ md: 2, lg: 1 }}>
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
                Download CSV
              </Button>
            </Box>
            <ResponsiveContainer width="100%" height="100%" aspect={2}>
              <ComposedChart
                // width={500}
                // height={300}
                data={data}
                // margin={{
                //   top: 5,
                //   right: 10,
                //   left: 10,
                //   bottom: 5,
                // }}
                barGap={0}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#23252E" />
                <Tooltip content={CustomTooltip} />
                <XAxis
                  dataKey="name"
                  stroke="#6D6D70"
                  style={{
                    fontSize: '12px',
                  }}
                  tickLine={false}
                />
                {/* <YAxis /> */}
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  stroke="#6D6D70"
                  style={{
                    fontSize: '12px',
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#6D6D70"
                  style={{
                    fontSize: '12px',
                  }}
                />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="pv" name="pv Name" fill="#8042FF" barSize={16} />
                <Line type="monotone" dataKey="amt" name="amt Name" stroke="#FE1A67" connectNulls yAxisId="right" />
              </ComposedChart>
            </ResponsiveContainer>
          </Box>
        </GridItem>
      </Grid>
      <Grid templateColumns="repeat(2, 1fr)" gap={6} marginBottom={'20px'}>
        <GridItem colSpan={{ md: 2, lg: 1 }}>
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
                Download CSV
              </Button>
            </Box>
            <ResponsiveContainer width="100%" height="100%" aspect={2}>
              <ComposedChart
                // width={500}
                // height={300}
                data={data}
                margin={{
                  right: 60,
                }}
                barGap={0}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#23252E" />
                <Tooltip content={CustomTooltip} />
                <XAxis
                  dataKey="name"
                  stroke="#6D6D70"
                  style={{
                    fontSize: '12px',
                  }}
                  tickLine={false}
                />
                {/* <YAxis /> */}
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  stroke="#6D6D70"
                  style={{
                    fontSize: '12px',
                  }}
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
                <Line type="monotone" dataKey="amt" name="amt Name" stroke="#DD6FB5" connectNulls yAxisId="left" />
              </ComposedChart>
            </ResponsiveContainer>
          </Box>
        </GridItem>
        <GridItem colSpan={{ md: 2, lg: 1 }}>
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
                Download CSV
              </Button>
            </Box>
            <ResponsiveContainer width="100%" height="100%" aspect={2}>
              <ComposedChart
                // width={500}
                // height={300}
                data={data}
                margin={{
                  right: 60,
                }}
                barGap={0}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#23252E" />
                <Tooltip content={CustomTooltip} />
                <XAxis
                  dataKey="name"
                  stroke="#6D6D70"
                  style={{
                    fontSize: '12px',
                  }}
                  tickLine={false}
                />
                {/* <YAxis /> */}
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  stroke="#6D6D70"
                  style={{
                    fontSize: '12px',
                  }}
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
                <Line type="monotone" dataKey="amt" name="amt Name" stroke="#7A72F6" connectNulls yAxisId="left" />
              </ComposedChart>
            </ResponsiveContainer>
          </Box>
        </GridItem>
      </Grid>
      <Grid templateColumns="repeat(2, 1fr)" gap={6} marginBottom={'20px'}>
        <GridItem colSpan={{ md: 2, lg: 1 }}>
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
                Download CSV
              </Button>
            </Box>
            <ResponsiveContainer width="100%" height="100%" aspect={2}>
              <ComposedChart
                // width={500}
                // height={300}
                data={data}
                // margin={{
                //   top: 5,
                //   right: 10,
                //   left: 10,
                //   bottom: 5,
                // }}
                barGap={0}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#23252E" />
                <Tooltip content={CustomTooltip} />
                <XAxis
                  dataKey="name"
                  stroke="#6D6D70"
                  style={{
                    fontSize: '12px',
                  }}
                  tickLine={false}
                />
                {/* <YAxis /> */}
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  stroke="#6D6D70"
                  style={{
                    fontSize: '12px',
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#6D6D70"
                  style={{
                    fontSize: '12px',
                  }}
                />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="pv" name="pv Name" fill="#FFCE57" barSize={16} />
                <Bar yAxisId="left" dataKey="uv" name="uv Name" fill="#8042FF" barSize={16} />
                <Line type="monotone" dataKey="amt" name="amt Name" stroke="#4CC0C0" connectNulls yAxisId="right" />
              </ComposedChart>
            </ResponsiveContainer>
          </Box>
        </GridItem>
        <GridItem colSpan={{ md: 2, lg: 1 }}>
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
                Download CSV
              </Button>
            </Box>
            <ResponsiveContainer width="100%" height="100%" aspect={2}>
              <ComposedChart
                // width={500}
                // height={300}
                data={data}
                // margin={{
                //   top: 5,
                //   right: 10,
                //   left: 10,
                //   bottom: 5,
                // }}
                barGap={0}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#23252E" />
                <Tooltip content={CustomTooltip} />
                <XAxis
                  dataKey="name"
                  stroke="#6D6D70"
                  style={{
                    fontSize: '12px',
                  }}
                  tickLine={false}
                />
                {/* <YAxis /> */}
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  stroke="#6D6D70"
                  style={{
                    fontSize: '12px',
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#6D6D70"
                  style={{
                    fontSize: '12px',
                  }}
                />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="pv" name="pv Name" fill="#DEDCFD" barSize={16} />
                <Line type="monotone" dataKey="amt" name="amt Name" stroke="#4CC0C0" connectNulls yAxisId="right" />
              </ComposedChart>
            </ResponsiveContainer>
          </Box>
        </GridItem>
      </Grid>
    </>
  );
};

export default StatsView;
