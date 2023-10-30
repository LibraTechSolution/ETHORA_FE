'use client';

import {
  Box,
  Flex,
  Grid,
  GridItem,
  Image,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import TradeViewHeader from './components/TradeViewHeader';
import TradeControl from './components/TradeControl';
import HistoryTable from './components/HistoryTable';
import TradeTable from './components/TradeTable';
import CancelTable from './components/CancelTable';
import LimitOrdersTable from './components/LimitOrdersTable';
import PlatformTradesTable from './components/PlatformTradesTable';
import PlatformHistoryTable from './components/PlatformHistoryTable';
import TradeLeftSide from './components/TradeLeftSide';

const TradingViewChart = dynamic(
  () => import('@/components/TradingView/TradingView').then((mod) => mod.TradingViewChart),
  { ssr: false },
);

const TradeView = () => {
  return (
    <Grid
      templateColumns={{ base: '', xl: 'repeat(24, 1fr)' }}
      gap={4}
      paddingTop="20px"
      bg="rgba(28, 28, 30, 0.50)"
      display={{ base: 'block', xl: 'grid' }}
      marginX={{ base: '-12px', lg: '-80px' }}
      paddingRight={{ base: '0px', lg: '26px' }}
    >
      <GridItem display={{ base: 'none', xl: 'block' }} colSpan={{ base: 24, xl: 5 }}>
        <TradeLeftSide />
      </GridItem>
      <GridItem colSpan={{ base: 24, xl: 19 }}>
        <>
          <TradeViewHeader />
          <TradingViewChart />
        </>
        <Box display={{ base: 'block', xl: 'none' }} marginTop={'12px'}>
          <TradeLeftSide />
        </Box>
        <Box marginTop="12px" display={{ base: 'none', xl: 'block' }}>
          <Tabs>
            <TabList borderBottom="1px solid #1C1C1E" bg="#0c0c10" roundedTop="10px">
              <Tab
                color="#6D6D70"
                fontSize={'sm'}
                fontWeight={'medium'}
                _selected={{ color: '#1E3EF0' }}
                _active={{ bgColor: 'transparent' }}
                paddingX="12px"
                paddingY="8px"
              >
                Trades
              </Tab>
              <Tab
                color="#6D6D70"
                fontSize={'sm'}
                fontWeight={'medium'}
                _selected={{ color: '#1E3EF0' }}
                _active={{ bgColor: 'transparent' }}
                paddingX="12px"
                paddingY="8px"
              >
                Limit Orders
              </Tab>
              <Tab
                color="#6D6D70"
                fontSize={'sm'}
                fontWeight={'medium'}
                _selected={{ color: '#1E3EF0' }}
                _active={{ bgColor: 'transparent' }}
                paddingX="12px"
                paddingY="8px"
              >
                History
              </Tab>
              <Tab
                color="#6D6D70"
                fontSize={'sm'}
                fontWeight={'medium'}
                _selected={{ color: '#1E3EF0' }}
                _active={{ bgColor: 'transparent' }}
                paddingX="12px"
                paddingY="8px"
              >
                Cancelled
              </Tab>
              <Tab
                color="#6D6D70"
                fontSize={'sm'}
                fontWeight={'medium'}
                _selected={{ color: '#1E3EF0' }}
                _active={{ bgColor: 'transparent' }}
                paddingX="12px"
                paddingY="8px"
              >
                Platform Trades
              </Tab>
              <Tab
                color="#6D6D70"
                fontSize={'sm'}
                fontWeight={'medium'}
                _selected={{ color: '#1E3EF0' }}
                _active={{ bgColor: 'transparent' }}
                paddingX="12px"
                paddingY="8px"
              >
                Platform History
              </Tab>
            </TabList>
            <TabIndicator mt="-1.5px" height="2px" bg="#1E3EF0" borderRadius="1px" />

            <TabPanels paddingTop={2} className="tradingTableTab">
              <TabPanel padding="0">
                <TradeTable />
              </TabPanel>
              <TabPanel padding="0">
                <LimitOrdersTable />
              </TabPanel>
              <TabPanel padding="0">
                <HistoryTable />
              </TabPanel>
              <TabPanel padding="0">
                <CancelTable />
              </TabPanel>
              <TabPanel padding="0">
                <PlatformTradesTable />
              </TabPanel>
              <TabPanel padding="0">
                <PlatformHistoryTable />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </GridItem>
    </Grid>
  );
};
export default TradeView;
