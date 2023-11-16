'use client';

import { Box, Grid, GridItem, Tab, TabIndicator, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import TradeViewHeader from './components/TradeViewHeader';
import HistoryTable from './components/HistoryTable';
import TradeTable from './components/TradeTable';
import CancelTable from './components/CancelTable';
import LimitOrdersTable from './components/LimitOrdersTable';
import PlatformTradesTable from './components/PlatformTradesTable';
import PlatformHistoryTable from './components/PlatformHistoryTable';
import TradeLeftSide from './components/TradeLeftSide';
import { createContext, useCallback, useEffect, useRef, useState } from 'react';

const TradingViewChart = dynamic(
  () => import('@/components/TradingView/TradingView').then((mod) => mod.TradingViewChart),
  { ssr: false },
);

interface createContextType {
  updateTradeSize: (tradeSize: number) => void;
  updateLimitOrderSize: (tradeSize: number) => void;
  limitOrderSize: number;
  tradeSize: number;
}

export const TradeContext = createContext<createContextType>({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  updateTradeSize: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  updateLimitOrderSize: () => {},
  limitOrderSize: 0,
  tradeSize: 0,
});

const TradeView = () => {
  const [tradeSize, setTradeSize] = useState<number>(0);
  const [limitOrderSize, setLimitOrderSize] = useState<number>(0);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>();
  const [containerDim, setContainerDim] = useState<{
    height?: number;
    top?: number;
  }>({});
  const isFirstLoad = useRef<boolean>(true);
  const onInitialLoad: React.LegacyRef<HTMLDivElement> = useCallback(async (ele: any) => {
    containerRef.current = ele;
    const d = ele?.getBoundingClientRect();
    if (!d) return;
    setContainerDim({ top: d.top, height: window.innerHeight - 400 });
    isFirstLoad.current = false;
  }, []);

  useEffect(() => {
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('touchmove', onTouchMove);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  });

  const onMove = (clientY: number) => {
    if (!clientY) return;
    if (!containerDim?.height) return;
    if (!dragging) return;
    // y = 4
    setContainerDim((currentChartContainerDim) => {
      if (!currentChartContainerDim?.top) return {};

      const updatedChartContainerDim: Partial<{ height: number; top: number }> = {};
      const updatedHeight = clientY - currentChartContainerDim.top;
      const bound = window.innerHeight - (currentChartContainerDim.top + 50);
      updatedChartContainerDim.height = Math.min(updatedHeight, bound);
      updatedChartContainerDim.top = currentChartContainerDim.top;

      // since doccument.onmouseup doesn't get fired on TV area, we have to
      // take an offset value while scrolling up
      if (
        containerRef.current &&
        containerRef.current?.getBoundingClientRect().height - updatedChartContainerDim.height > 35
      ) {
        onMouseUp();
      }

      return updatedChartContainerDim;
    });
  };
  const onMouseMove = (e: MouseEvent) => {
    if (dragging) e.preventDefault();
    onMove(e.clientY);
  };

  const onTouchMove = (e: TouchEvent) => {
    onMove(e.touches[0].clientY);
  };

  const onMouseUp = () => {
    setDragging(false);
  };

  const onMouseDown = () => {
    setDragging(true);
  };
  return (
    <TradeContext.Provider
      value={{
        tradeSize,
        limitOrderSize,
        updateLimitOrderSize: (limitOrderSize: number) => setLimitOrderSize(limitOrderSize),
        updateTradeSize: (tradeSize: number) => setTradeSize(tradeSize),
      }}
    >
      <Grid
        templateColumns={{ base: '', xl: 'repeat(24, 1fr)' }}
        gap={4}
        paddingTop="20px"
        bg="rgba(28, 28, 30, 0.50)"
        display={{ base: 'block', xl: 'grid' }}
        marginX={{ base: '-0', lg: '-80px' }}
        paddingRight={{ base: '0px', lg: '26px' }}
      >
        <GridItem display={{ base: 'none', xl: 'block' }} colSpan={{ base: 24, xl: 5 }}>
          <TradeLeftSide />
        </GridItem>
        <GridItem colSpan={{ base: 24, xl: 19 }}>
          <Box
            marginBottom={{ base: 5, xl: 3 }}
            className="flex h-full  grow flex-col"
            style={containerDim?.height ? { height: containerDim.height } : {}}
            ref={onInitialLoad}
          >
            <TradeViewHeader />
            <TradingViewChart />
          </Box>
          <div
            onMouseDown={onMouseDown}
            onTouchStart={onMouseDown}
            onMouseUp={onMouseUp}
            onTouchEnd={onMouseUp}
            // onMouseLeave={onMouseUp}
            className={`h-[12px] w-full cursor-row-resize bg-[#252528]`}
            // onDragStart={onDragStart}
            // onDragEnd={onDragEnd}
          ></div>
          <Box display={{ base: 'block', xl: 'none' }} marginTop={'12px'}>
            <TradeLeftSide />
          </Box>
          <Box marginTop="12px" marginBottom="12px" maxW={'calc(100vw - 32px)'}>
            <Tabs>
              <TabList
                borderBottom="1px solid #1C1C1E"
                bg="rgba(28, 28, 30, 0.50)"
                roundedTop="10px"
                backdropFilter={'blur(7px)'}
                boxShadow={'0px 4px 20px 0px rgba(0, 0, 0, 0.30)'}
                maxW={'calc(100vw - 24px)'}
                overflow="auto hidden"
              >
                <Tab
                  color="#6D6D70"
                  fontSize={'sm'}
                  fontWeight={'normal'}
                  _selected={{ color: '#1E3EF0', fontWeight: 'medium' }}
                  _active={{ bgColor: 'transparent' }}
                  paddingX="12px"
                  paddingY="8px"
                >
                  Trades{' '}
                  {tradeSize > 0 && (
                    <span className="ml-2 rounded-3xl bg-[#0C0C10] px-2 font-normal text-white">{tradeSize}</span>
                  )}
                </Tab>
                <Tab
                  color="#6D6D70"
                  fontSize={'sm'}
                  fontWeight={'normal'}
                  _selected={{ color: '#1E3EF0', fontWeight: 'medium' }}
                  _active={{ bgColor: 'transparent' }}
                  paddingX="12px"
                  paddingY="8px"
                >
                  Limit Orders{' '}
                  {limitOrderSize > 0 && (
                    <span className="ml-2 rounded-3xl bg-[#0C0C10] px-2 font-normal text-white">{limitOrderSize}</span>
                  )}
                </Tab>
                <Tab
                  color="#6D6D70"
                  fontSize={'sm'}
                  fontWeight={'normal'}
                  _selected={{ color: '#1E3EF0', fontWeight: 'medium' }}
                  _active={{ bgColor: 'transparent' }}
                  paddingX="12px"
                  paddingY="8px"
                >
                  History
                </Tab>
                <Tab
                  color="#6D6D70"
                  fontSize={'sm'}
                  fontWeight={'normal'}
                  _selected={{ color: '#1E3EF0', fontWeight: 'medium' }}
                  _active={{ bgColor: 'transparent' }}
                  paddingX="12px"
                  paddingY="8px"
                >
                  Cancelled
                </Tab>
                <Tab
                  color="#6D6D70"
                  fontSize={'sm'}
                  fontWeight={'normal'}
                  _selected={{ color: '#1E3EF0', fontWeight: 'medium' }}
                  _active={{ bgColor: 'transparent' }}
                  paddingX="12px"
                  paddingY="8px"
                >
                  Platform Trades
                </Tab>
                <Tab
                  color="#6D6D70"
                  fontSize={'sm'}
                  fontWeight={'normal'}
                  _selected={{ color: '#1E3EF0', fontWeight: 'medium' }}
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
    </TradeContext.Provider>
  );
};
export default TradeView;
