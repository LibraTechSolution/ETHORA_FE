'use client';

import {
  ChartingLibraryWidgetOptions,
  IChartingLibraryWidget,
  IOrderLineAdapter,
  ResolutionString,
  widget,
} from 'public/static/charting_library';
import { cloneElement, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Button, Flex, useToast } from '@chakra-ui/react';
import datafeed from './datafeed';
import { Dropdown, MenuProps } from 'antd';
import { notFound, useParams } from 'next/navigation';
import useListShowLinesStore from '@/store/useListShowLinesStore';
import { EditTradeReq, ITradingData, State } from '@/types/trade.type';
import { divide } from '@/utils/operationBigNumber';
import { cancelTrade, closeTrade, editLimitOrder } from '@/services/trade';
import { Status } from '@/types/faucet.type';
import { ToastLayout } from '../ToastLayout';
import { useQueryClient } from '@tanstack/react-query';
import EditLimitOrderModal from '@/views/TradeView/components/EditLimitOrderModal';
import dayjs from 'dayjs';
import { addComma } from '@/utils/number';
import { ToastCloseTrade } from '@/views/TradeView/components/ToastCloseTrade';

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
  'BTC/USD',
  'ETH/USD',
  'LINK/USD',
  'TON/USD',
  'ARB/USD',
  'XRP/USD',
  'SOL/USD',
  'BNB/USD',
  'BOGE/USD',
  'XAU/USD',
  'XAG/USD',
];

export const TradingViewChart = () => {
  const chartContainerRef = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;
  const widgetRef = useRef<IChartingLibraryWidget>();
  const [isChartReady, setIsChartReady] = useState<boolean>(false);
  const [resolution, setResolution] = useState<ResolutionString>('1' as ResolutionString);
  const toast = useToast();
  const queryClient = useQueryClient();
  const params = useParams();
  const currentPair = useMemo<string>(() => {
    let tempCurrentPair = params?.pair as string;
    if (!tempCurrentPair || !listPairs.includes(tempCurrentPair.replace('-', '/').toLocaleUpperCase())) {
      tempCurrentPair = '';
      return notFound();
    }
    return tempCurrentPair;
  }, [params.pair]);
  const listLinesRef = useRef<{ line: IOrderLineAdapter; tradeData: ITradingData }[]>([]);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<ITradingData | null>(null);
  const { setListLines, listLines } = useListShowLinesStore();
  const isDisabledLimit = useRef(false);
  const isDisabledTrade = useRef(false);

  const handleClose = useCallback(
    async (item: ITradingData) => {
      try {
        if (isDisabledTrade.current) return;
        isDisabledTrade.current = true;
        const closingTime = dayjs().utc().unix();
        await closeTrade(item._id);
        queryClient.invalidateQueries({ queryKey: ['getActiveTrades'] });
        queryClient.invalidateQueries({ queryKey: ['getTradingHistory'] });
        queryClient.invalidateQueries({ queryKey: ['getTradeCancel'] });
        toast({
          position: 'top',
          render: ({ onClose }) => <ToastCloseTrade item={item} onClose={onClose} closeTime={closingTime} />,
        });
        const isRemove = listLines.some((line) => line._id === item._id);
        isRemove && setListLines(item);
        isDisabledTrade.current = false;
      } catch (error) {
        isDisabledTrade.current = false;
        toast({
          position: 'top',
          render: ({ onClose }) => <ToastLayout title="Close Unsuccessfully" status={Status.ERROR} close={onClose} />,
        });
      }
    },
    [listLines, queryClient, setListLines, toast],
  );

  const handleCancelTrade = useCallback(
    async (item: ITradingData) => {
      try {
        if (isDisabledLimit.current) return;
        isDisabledLimit.current = true;
        const res = await cancelTrade(item._id);

        toast({
          position: 'top',
          render: ({ onClose }) => (
            <ToastLayout status={Status.SUCCESSS} close={onClose}>
              <p className="font-semibold text-[#fff]">Order cancelled</p>
              <p className="text-[#9E9E9F]">
                <span className="text-[#fff]">{res.data.data.pair.toUpperCase()}</span> to go{' '}
                <span className="text-[#fff]">{res.data.data.isAbove ? 'Higher' : 'Lower'}</span>
              </p>
              <p className="text-[#9E9E9F]">
                Total amount: <span className="text-[#fff]">{addComma(divide(res.data.data.tradeSize, 6), 2)}</span>{' '}
                USDC
              </p>
            </ToastLayout>
          ),
        });
        queryClient.invalidateQueries({ queryKey: ['getLimitOrders'] });
        queryClient.invalidateQueries({ queryKey: ['getTradingHistory'] });
        queryClient.invalidateQueries({ queryKey: ['getTradeCancel'] });
        const isRemove = listLines.some((line) => line._id === item._id);
        isRemove && setListLines(item);

        isDisabledLimit.current = false;
      } catch (error) {
        isDisabledLimit.current = false;
        toast({
          position: 'top',
          render: ({ onClose }) => <ToastLayout title="Cancel Unsuccessfully" status={Status.ERROR} close={onClose} />,
        });
      }
    },
    [listLines, queryClient, setListLines, toast],
  );

  const handleEditStrikePrice = async (item: ITradingData) => {
    const tradeDataLine = listLinesRef.current.find((trade) => trade.tradeData._id === item._id);
    tradeDataLine?.line.setText('Processing Edit');
    console.log(tradeDataLine);
    try {
      if (!tradeDataLine) return;
      const data: EditTradeReq = {
        network: tradeDataLine?.tradeData?.network,
        _id: tradeDataLine?.tradeData?._id,
        strike: tradeDataLine?.line.getPrice() * 100000000,
        period: tradeDataLine?.tradeData.period,
        slippage: tradeDataLine?.tradeData?.slippage,
        isAbove: tradeDataLine?.tradeData.isAbove,
        limitOrderDuration: dayjs(item.limitOrderExpirationDate).utc().unix() - dayjs().utc().unix(),
      };
      console.log(data);
      await editLimitOrder(data);
      setListLines(
        {
          ...item,
          strike: data.strike,
        },
        true,
      );
      queryClient.invalidateQueries({ queryKey: ['getLimitOrders'] });
      queryClient.invalidateQueries({ queryKey: ['getActiveTrades'] });
      toast({
        position: 'top',
        render: ({ onClose }) => (
          <ToastLayout title="Changed strike price successfully" status={Status.SUCCESSS} close={onClose} />
        ),
      });
    } catch (error) {
      toast({
        position: 'top',
        render: ({ onClose }) => (
          <ToastLayout title="Changed strike price unsuccessfully" status={Status.ERROR} close={onClose} />
        ),
      });
      tradeDataLine?.line.setText(divide(tradeDataLine.tradeData.strike, 8).toString());
      tradeDataLine?.line.setPrice(+divide(tradeDataLine.tradeData.strike, 8));
    }
  };

  const addLine = useCallback(
    (item: ITradingData) => {
      if (item.isLimitOrder) {
        return widgetRef.current
          ?.activeChart?.()
          .createOrderLine()
          .setText(`Limit | ${(+divide(item.strike, 8)).toFixed(2)} ${item.isAbove ? '▲' : '▼'}`)
          .setTooltip('Drag to change strike')
          .setQuantity('↕')
          .setLineColor(item.isAbove ? '#1ED768' : '#F03D3E')
          .setBodyBackgroundColor('rgb(48, 48, 68)')
          .setQuantityBorderColor('rgb(48, 48, 68)')
          .setQuantityBackgroundColor(item.isAbove ? '#1ED768' : '#F03D3E')
          .setCancelButtonBorderColor('rgb(48, 48, 68)')
          .setCancelButtonIconColor('rgb(255,255,255)')
          .setCancelButtonBackgroundColor('rgb(48, 48, 68)')
          .setBodyFont('semibold 17pt Arial')
          .setQuantityFont('bold 17pt Arial')
          .setBodyTextColor('rgb(195,194,212)')
          .setCancelTooltip('Click to cancel this limit order')
          .setBodyBorderColor('rgb(48, 48, 68)')
          .setLineColor(item.isAbove ? '#1ED768' : '#F03D3E')
          .onCancel('modify', function () {
            handleCancelTrade(item);
          })
          .onMove(function () {
            handleEditStrikePrice(item);
          })
          .onModify('modify', function () {
            setSelectedItem(item);
            setIsOpenModal(true);
          })
          .setPrice(+divide(item.strike, 8)) as IOrderLineAdapter;
      }
      return widgetRef.current
        ?.activeChart?.()
        .createOrderLine()
        .setText(`Trade | ${(+divide(item.strike, 8)).toFixed(2)}`)
        .setTooltip(
          `${dayjs(item.openDate).format('MM/DD/YYYY, HH:mm:ss')} - ${dayjs(item.openDate)
            .add(item.period, 'second')
            .format('MM/DD/YYYY, HH:mm:ss')}`,
        )
        .setQuantity(item.isAbove ? '▲' : '▼')
        .setLineColor(item.isAbove ? '#1ED768' : '#F03D3E')
        .setBodyBackgroundColor('rgb(48, 48, 68)')
        .setQuantityBorderColor('rgb(48, 48, 68)')
        .setQuantityBackgroundColor(item.isAbove ? '#1ED768' : '#F03D3E')
        .setCancelButtonBorderColor('rgb(48, 48, 68)')
        .setCancelButtonIconColor('rgb(255,255,255)')
        .setCancelButtonBackgroundColor('rgb(48, 48, 68)')
        .setBodyFont('semibold 17pt Arial')
        .setQuantityFont('bold 17pt Arial')
        .setBodyTextColor('rgb(195,194,212)')
        .setCancelTooltip('Click to close this order')
        .setBodyBorderColor('rgb(48, 48, 68)')
        .setLineColor(item.isAbove ? '#1ED768' : '#F03D3E')
        .onCancel('modify', function () {
          handleClose(item);
        })
        .setPrice(+divide(item.strike, 8)) as IOrderLineAdapter;
    },
    [handleCancelTrade, handleClose],
  );

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
      disabled_features:
        window.innerWidth < 600
          ? [
              'header_compare',
              'header_symbol_search',
              'header_widget',
              'go_to_date',
              'display_market_status',
              'left_toolbar',
            ]
          : ['header_compare', 'header_symbol_search', 'header_widget', 'go_to_date', 'display_market_status'],
    };
    widgetRef.current = new widget(widgetOptions);

    widgetRef.current.onChartReady(() => {
      setIsChartReady(true);
    });
  }, [currentPair]);

  useEffect(() => {
    removeLine();
    listLinesRef.current = [];
    if (listLines.length === 0 || !isChartReady) return;
    listLines.forEach((item) => {
      listLinesRef.current?.push({ line: addLine(item), tradeData: item });
    });
    if (listLinesRef.current.length > 0) {
      listLinesRef.current.forEach((item) => {
        item.line.setPrice(+divide(item.tradeData.strike, 8));
      });
    }
  }, [addLine, isChartReady, listLines]);

  const removeLine = () => {
    if (listLinesRef.current.length === 0) return;
    listLinesRef.current.forEach((item) => {
      item.line.remove();
    });
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
    <div className="h-[calc(100%-100px)]">
      <Flex
        display={{ base: 'block', xl: 'flex' }}
        flexDirection={'row'}
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        <Box>
          <span className="px-1 text-xs font-normal text-white">Time</span>
          {listResolutions.map((item, index) => (
            <Button
              key={item.value}
              bgColor={'transparent'}
              textColor={resolution === item.value ? '#1E3EF0' : '#fff'}
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
      <div ref={chartContainerRef} id="chart-element" className="h-[100%]" />
      {isOpenModal && (
        <EditLimitOrderModal
          item={selectedItem}
          isOpen={isOpenModal}
          onClose={() => {
            setSelectedItem(null);
            setIsOpenModal(false);
          }}
        />
      )}
    </div>
  );
};
