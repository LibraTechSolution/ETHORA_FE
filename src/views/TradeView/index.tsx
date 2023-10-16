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
    >
      <GridItem display={{ base: 'none', xl: 'block' }} colSpan={{ base: 24, xl: 6 }}>
        <TradeControl />
      </GridItem>
      <GridItem colSpan={{ base: 24, xl: 18 }}>
        <>
          <TradeViewHeader />
          <TradingViewChart />
        </>
        <Box display={{ base: 'block', xl: 'none' }} marginTop={'12px'}>
          <TradeControl />
        </Box>
        <Box marginTop="12px" display={{ base: 'none', xl: 'block' }}>
          <Tabs>
            <TabList borderBottom="1px solid #3d3d40" bg="#0c0c10" roundedTop="10px">
              <Tab
                color="#6D6D70"
                fontSize={'sm'}
                fontWeight={'medium'}
                _selected={{ color: '#6052FB' }}
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
                _selected={{ color: '#6052FB' }}
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
                _selected={{ color: '#6052FB' }}
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
                _selected={{ color: '#6052FB' }}
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
                _selected={{ color: '#6052FB' }}
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
                _selected={{ color: '#6052FB' }}
                _active={{ bgColor: 'transparent' }}
                paddingX="12px"
                paddingY="8px"
              >
                Platform History
              </Tab>
            </TabList>
            <TabIndicator mt="-1.5px" height="2px" bg="#6052FB" borderRadius="1px" />

            <TabPanels>
              <TabPanel padding="0">
                <Flex direction={'column'} alignItems={'center'} bg="#0c0c10" paddingY="60px">
                  <Image alt="" src="/images/icons/pack.png" w="60px" h="50px" />
                  <p className="text-sm font-normal text-[#6D6D70]">There are no placed trades</p>
                </Flex>
              </TabPanel>
              <TabPanel padding="0">
                <Flex direction={'column'} alignItems={'center'} bg="#0c0c10" paddingY="60px">
                  <Image alt="" src="/images/icons/pack.png" w="60px" h="50px" />
                  <p className="text-sm font-normal text-[#6D6D70]">There are no placed trades</p>
                </Flex>
              </TabPanel>
              <TabPanel padding="0">
                <Flex direction={'column'} alignItems={'center'} bg="#0c0c10" paddingY="60px">
                  <Image alt="" src="/images/icons/pack.png" w="60px" h="50px" />
                  <p className="text-sm font-normal text-[#6D6D70]">There are no placed trades</p>
                </Flex>
              </TabPanel>
              <TabPanel padding="0">
                <Flex direction={'column'} alignItems={'center'} bg="#0c0c10" paddingY="60px">
                  <Image alt="" src="/images/icons/pack.png" w="60px" h="50px" />
                  <p className="text-sm font-normal text-[#6D6D70]">There are no placed trades</p>
                </Flex>
              </TabPanel>
              <TabPanel padding="0">
                <Flex direction={'column'} alignItems={'center'} bg="#0c0c10" paddingY="60px">
                  <Image alt="" src="/images/icons/pack.png" w="60px" h="50px" />
                  <p className="text-sm font-normal text-[#6D6D70]">There are no placed trades</p>
                </Flex>
              </TabPanel>
              <TabPanel padding="0">
                <Flex direction={'column'} alignItems={'center'} bg="#0c0c10" paddingY="60px">
                  <Image alt="" src="/images/icons/pack.png" w="60px" h="50px" />
                  <p className="text-sm font-normal text-[#6D6D70]">There are no placed trades</p>
                </Flex>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </GridItem>
    </Grid>
  );
};
export default TradeView;
