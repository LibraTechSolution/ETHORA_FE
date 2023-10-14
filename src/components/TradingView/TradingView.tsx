'use client';

import {
  ChartingLibraryWidgetOptions,
  IChartingLibraryWidget,
  ResolutionString,
  widget,
} from 'public/static/charting_library';
import { cloneElement, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Button, Flex } from '@chakra-ui/react';
import datafeed from './datafeed';
import { Dropdown, MenuProps } from 'antd';
import { useParams } from 'next/navigation';

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

const listResolutions = [
  {
    label: '1m',
    value: '1' as ResolutionString,
  },
  {
    label: '5m',
    value: '5' as ResolutionString,
  },
  {
    label: '15m',
    value: '15' as ResolutionString,
  },
  {
    label: '30m',
    value: '30' as ResolutionString,
  },
  {
    label: '1h',
    value: '1H' as ResolutionString,
  },
  {
    label: '2h',
    value: '2H' as ResolutionString,
  },
  {
    label: '4h',
    value: '4H' as ResolutionString,
  },
];

const items: MenuProps['items'] = [
  {
    key: 0,
    label: 'Bars',
  },
  {
    key: 1,
    label: 'Candles',
  },
  {
    key: 2,
    label: 'Line',
  },
  {
    key: 3,
    label: 'Area',
  },
  {
    key: 8,
    label: 'HeikenAshi',
  },
  {
    key: 9,
    label: 'HollowCandles',
  },
  {
    key: 10,
    label: 'Baseline',
  },
  {
    key: 12,
    label: 'HiLo',
  },
  {
    key: 4,
    label: 'Renko',
  },
  {
    key: 5,
    label: 'Kagi',
  },
  {
    key: 7,
    label: 'LineBreak',
  },
];

export const listPairs = [
  'EUR/USD',
  'GBP/USD',
  'AUD/USD',
  'USD/JPY',
  'EUR/JPY',
  'GBP/JPY',
  'NZD/USD',
  'USD/CHE',
  'USD/CAD',
  'BTC/USD',
  'ETH/USD',
  'ETH/BTC',
  'LINK/USD',
];

export const TradingViewChart = () => {
  const chartContainerRef = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;
  const widgetRef = useRef<IChartingLibraryWidget>();
  const [isChartReady, setIsChartReady] = useState<boolean>(false);
  const [resolution, setResolution] = useState<ResolutionString>('1' as ResolutionString);
  const params = useParams();
  const currentPair = useMemo<string>(() => {
    let tempCurrentPair = params?.pair as string;
    if (!tempCurrentPair || !listPairs.includes(tempCurrentPair.replace('-', '/').toLocaleUpperCase())) {
      tempCurrentPair = '';
    }
    return tempCurrentPair;
  }, [params.pair]);

  useEffect(() => {
    if (!currentPair) return;
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
        {
          text: '1H',
          resolution: '1H' as ResolutionString,
          description: '1 Hour look back',
          title: '1H',
        },
        {
          text: '30m',
          resolution: '30' as ResolutionString,
          description: '30 Minutes look back',
          title: '30m',
        },
      ],
      symbol: currentPair.replace('-', ''),
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
  }, [currentPair]);

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

  const handleIndicator = () => {
    if (isChartReady) {
      widgetRef.current?.activeChart?.().executeActionById('insertIndicator');
    }
  };

  const handleChartType: MenuProps['onClick'] = ({ key }) => {
    if (isChartReady) {
      widgetRef.current?.activeChart?.().setChartType(+key);
    }
  };

  const handleResolution = (time: ResolutionString) => {
    if (isChartReady) {
      widgetRef.current?.activeChart?.().setResolution(time);
      setResolution(time);
    }
  };

  return (
    <div>
      <Flex flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'}>
        <Box>
          <span className="px-1 text-xs font-normal text-white">Time</span>
          {listResolutions.map((item, index) => (
            <Button
              key={item.value}
              bgColor={'transparent'}
              textColor={resolution === item.value ? '#6052FB' : '#fff'}
              fontWeight={resolution === item.value ? '600' : '400'}
              fontSize={12}
              _hover={{ bgColor: 'transparent', textColor: '#fff' }}
              _active={{ bgColor: 'transparent', textColor: '#fff' }}
              paddingX="6px"
              minW={'10px'}
              onClick={() => handleResolution(item.value as ResolutionString)}
            >
              {item.label}
            </Button>
          ))}
        </Box>
        <Box>
          <Dropdown
            menu={{ items, onClick: handleChartType }}
            placement="bottomRight"
            dropdownRender={(menu) => <div className="custom-dropdown">{cloneElement(menu as React.ReactElement)}</div>}
          >
            <Button
              bgColor={'transparent'}
              textColor={'#fff'}
              fontWeight={400}
              fontSize={12}
              _hover={{ bgColor: 'transparent', textColor: '#fff' }}
              _active={{ bgColor: 'transparent', textColor: '#fff' }}
              paddingX="6px"
            >
              Chart Type
            </Button>
          </Dropdown>
          <Button
            bgColor={'transparent'}
            textColor={'#fff'}
            fontWeight={400}
            fontSize={12}
            _hover={{ bgColor: 'transparent', textColor: '#fff' }}
            _active={{ bgColor: 'transparent', textColor: '#fff' }}
            paddingX="6px"
            onClick={handleIndicator}
          >
            Indicators
          </Button>
        </Box>
      </Flex>
      <div ref={chartContainerRef} id="chart-element" className="h-[655px]" />
    </div>
  );
};
