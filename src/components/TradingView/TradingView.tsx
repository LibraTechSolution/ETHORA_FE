'use client';

import {
  ChartingLibraryWidgetOptions,
  IChartingLibraryWidget,
  ResolutionString,
  widget,
} from 'public/static/charting_library';
import { UDFCompatibleDatafeed } from 'public/static/datafeeds/udf/src/udf-compatible-datafeed';
import { useEffect, useRef, useState } from 'react';
import { DataFeed } from './datafeed.js';

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

  useEffect(() => {
    const widgetOptions: ChartingLibraryWidgetOptions = {
      datafeed: DataFeed,
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
      symbol: 'Bitfinex:BTC/USD',
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
      <button onClick={addLine}>Add Line</button>
      <div ref={chartContainerRef} id="chart-element" className="h-96" />
    </div>
  );
};
