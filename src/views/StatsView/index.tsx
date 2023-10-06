'use client';
import { Grid, GridItem } from '@chakra-ui/react';
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
} from 'recharts';
const StatsView = () => {
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
  return (
    <Grid templateColumns="repeat(2, 1fr)" gap={6}>
      <GridItem>
        <ResponsiveContainer width="100%" height="100%" aspect={2}>
          <ComposedChart
            width={500}
            height={300}
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
            <Bar yAxisId="left" dataKey="pv" fill="#4CC0C0" />
            <Bar yAxisId="left" dataKey="uv" fill="#8042FF" />
            <Line type="monotone" dataKey="amt" stroke="#FE1A67" connectNulls yAxisId="right" />
          </ComposedChart>
        </ResponsiveContainer>
      </GridItem>
      <GridItem />
    </Grid>
  );
};

export default StatsView;
