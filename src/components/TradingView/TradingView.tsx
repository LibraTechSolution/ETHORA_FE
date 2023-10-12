'use client';

import {
  ChartingLibraryWidgetOptions,
  IChartingLibraryWidget,
  ResolutionString,
  widget,
} from 'public/static/charting_library';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import { useEffect, useRef, useState } from 'react';
import { Box, Center, Flex, Image, Progress } from '@chakra-ui/react';
import datafeed from './datafeed';
import useTradeStore from '@/store/useTradeStore';
import { addComma } from '@/utils/number';

export const supported_resolutions = [
  // '1S' as ResolutionString,
  // '10S' as ResolutionString,
  '1' as ResolutionString,
  // '3' as ResolutionString,
  '5' as ResolutionString,
  // '10' as ResolutionString,
  '15' as ResolutionString,
  '30' as ResolutionString,
  '1H' as ResolutionString,
  '2H' as ResolutionString,
  '4H' as ResolutionString,
  // "1D",
];

export const TradingViewChart = () => {
  const chartContainerRef = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;
  const widgetRef = useRef<IChartingLibraryWidget>();
  const [isChartReady, setIsChartReady] = useState<boolean>(false);
  const { price } = useTradeStore();

  useEffect(() => {
    const widgetOptions: ChartingLibraryWidgetOptions = {
      datafeed: datafeed,
      //   datafeed: new UDFCompatibleDatafeed('https://demo_feed.tradingview.com'),
      timeframe: '200',
      time_frames: [
        {
          text: '1D',
          resolution: '1D' as ResolutionString,
          description: '1 Day look back',
          title: '1D',
        },
        {
          text: '4H',
          resolution: '4H' as ResolutionString,
          description: '4 Hours look back',
          title: '4H',
        },
      ],
      symbol: 'BTCUSD',
      interval: '1' as ResolutionString,
      timezone: 'Etc/UTC',
      theme: 'Dark',
      container: chartContainerRef.current,
      enabled_features: ['header_saveload', 'hide_left_toolbar_by_default'],
      library_path: '/static/charting_library/',
      locale: 'en',
      client_id: 'tradingview.com',
      fullscreen: false,
      autosize: true,
      load_last_chart: true,
      disabled_features: [
        'header_compare',
        'header_symbol_search',
        'header_widget',
        'go_to_date',
        'display_market_status',
      ],
    };
    widgetRef.current = new widget(widgetOptions);

    widgetRef.current.onChartReady(() => {
      setIsChartReady(true);
    });
  }, []);

  const addLine = () => {
    if (isChartReady) {
      widgetRef.current
        ?.activeChart?.()
        .createOrderLine()
        .setText('2222')
        .setTooltip('eeee')
        .setQuantity('▲')
        .onCancel('modify', function () {
          console.log('===');
        })
        .setPrice(175);
    }
  };

  return (
    <div>
      <Flex alignItems="center" justifyContent="space-between">
        <Flex>
          <Center>
            <Image alt="bitcoin" src="/images/icons/bitcoin.png" w="32px" h="32px" />
            <p className="pl-3 text-xl font-semibold text-[#fff]">BTC/USD</p>
          </Center>
          <Center paddingX={10}>
            <p className="text-2xl font-normal text-[#fff]">{addComma(price, 2)}</p>
          </Center>
          <Center>
            <Box borderRight="1px solid #38383A" paddingRight="20px">
              <p className="pb-2 text-xs font-normal text-[#9E9E9F]">24h Change</p>
              <span className="h-6 rounded border border-[#1ED768] px-[6px] text-sm font-normal text-[#1ED768]">
                <TriangleUpIcon color={'#1ED768'} marginRight="4px" />
                20%
              </span>
            </Box>
            <Box borderRight="1px solid #38383A" paddingX="20px">
              <p className="pb-2 text-xs font-normal text-[#9E9E9F]">Max Trade Size</p>
              <p className="text-sm font-normal leading-6 text-[#fff]">100 USDC</p>
            </Box>
            <Box borderRight="1px solid #38383A" paddingX="20px">
              <p className="pb-2 text-xs font-normal text-[#9E9E9F]">Payout</p>
              <p className="text-sm font-normal leading-6 text-[#fff]">6%</p>
            </Box>
            <Box paddingLeft="20px">
              <p className="pb-2 text-xs font-normal text-[#9E9E9F]">Max OI: 1,000 USDC</p>
              <p className="flex h-6 items-center text-sm font-normal text-[#fff]">
                <Progress value={20} size="xs" colorScheme="purple" bgColor="#303035" rounded="2xl" h="2" w="168px" />
                <span className="pl-3 text-sm font-normal text-[#fff]">20%</span>
              </p>
            </Box>
          </Center>
        </Flex>
        <Box>
          <Image alt="bitcoin" src="/images/icons/apps.svg" w="20x" h="20x" />
        </Box>
      </Flex>
      <div ref={chartContainerRef} id="chart-element" className="h-[655px]" />
    </div>
  );
};
