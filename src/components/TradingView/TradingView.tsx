import {
  ChartingLibraryWidgetOptions,
  IChartingLibraryWidget,
  ResolutionString,
  widget,
} from 'public/static/charting_library';
import { UDFCompatibleDatafeed } from 'public/static/datafeeds/udf/src/udf-compatible-datafeed';
import { useEffect, useRef, useState } from 'react';

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

const TradingViewChart = () => {
  const chartContainerRef = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;
  const widgetRef = useRef<IChartingLibraryWidget>();
  const [isChartReady, setIsChartReady] = useState<boolean>(false);

  useEffect(() => {
    const widgetOptions: ChartingLibraryWidgetOptions = {
      datafeed: new UDFCompatibleDatafeed('https://demo_feed.tradingview.com'),
      timeframe: '200',
      symbol: 'AAPL',
      interval: '1D' as ResolutionString,
      timezone: 'Etc/UTC',
      theme: 'Light',
      container: chartContainerRef.current,
      library_path: '/static/charting_library/',
      locale: 'en',
      charts_storage_url: 'https://saveload.tradingview.com',
      charts_storage_api_version: '1.1',
      client_id: 'tradingview.com',
      fullscreen: false,
      autosize: true,
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

export default TradingViewChart;
