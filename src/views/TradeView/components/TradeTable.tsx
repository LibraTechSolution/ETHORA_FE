'use client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useContext, useEffect, useState } from 'react';
import { Table } from 'antd';
import { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { Box, Button, Flex, Image, useToast, Text, Tooltip } from '@chakra-ui/react';
import { addComma } from '@/utils/number';
import { useAccount, useNetwork } from 'wagmi';
import { ITradingData, ITradingParams, State } from '@/types/trade.type';
import { closeTrade, getTrades } from '@/services/trade';
import { divide } from '@/utils/operationBigNumber';
import dayjs from 'dayjs';
import CountDown from './CountDown';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import { useEarlyPnl } from './TradeBox';
import { ToastLayout } from '@/components/ToastLayout';
import { Status } from '@/types/faucet.type';
import useUserStore from '@/store/useUserStore';
import useListShowLinesStore from '@/store/useListShowLinesStore';
import { RotateCw } from 'lucide-react';
import { ShowPrice } from './ShowPrice';
import { ToastCloseTrade } from './ToastCloseTrade';
import { useSearchParams } from 'next/navigation';
import { TradeContext } from '..';

export const configDecimal: { [key: string]: number } = {
  BTCUSD: 8,
  ETHUSD: 8,
  LINKUSD: 8,
  TONUSD: 8,
  ARBUSD: 8,
  XRPUSD: 8,
  SOLUSD: 8,
  BNBUSD: 8,
  XAUUSD: 3,
  XAGUSD: 5,
  EURUSD: 5,
  GBPUSD: 5,
};

const PnLCell = ({ trade }: { trade: ITradingData }) => {
  const { pnl: earlyPnl } = useEarlyPnl({
    trade,
  });
  const [isTimeOut, setIsTimeOut] = useState<boolean>(false);
  const { earlycloseAmount, probability } = earlyPnl;
  const timeOutCallBack = () => {
    setIsTimeOut(true);
  };
  return (
    <>
      {!isTimeOut ? (
        <Box>
          <Box>
            <Tooltip
              hasArrow
              label={
                <Box p={1} color="white">
                  {addComma(+earlycloseAmount, 6)} USDC
                </Box>
              }
              color="white"
              placement="top"
              bg="#050506"
            >
              <span
                className={`pr-1 text-sm font-normal ${+earlycloseAmount < 0 ? 'text-[#F03D3E]' : 'text-[#1ED768]'}`}
              >
                {addComma(earlycloseAmount, 2)} USDC
              </span>
            </Tooltip>
          </Box>
          <Box>
            <Tooltip
              hasArrow
              label={
                <Box p={1} color="white">
                  {addComma(probability, 6)}%
                </Box>
              }
              color="white"
              placement="top"
              bg="#050506"
            >
              <span className="text-[ #9E9E9F] text-xs font-normal">{addComma(probability, 2)}%</span>
            </Tooltip>
          </Box>
        </Box>
      ) : (
        <Box display="inline-block">
          <Text
            className="inline-block rounded border px-2 font-normal"
            background={'rgba(46, 96, 255, 0.10)'}
            borderColor={'#2E60FF'}
            textColor={'#2E60FF'}
            display="flex"
            alignItems={'center'}
          >
            <RotateCw color="#1E3EF0" size={12} className="mr-1" /> Processing
          </Text>
        </Box>
      )}
      <CountDown
        endTime={
          trade?.userCloseDate
            ? dayjs(trade.userCloseDate).utc().unix()
            : dayjs(trade.openDate).utc().unix() + trade.period
        }
        period={trade.period}
        hideBar={true}
        timeOutCallBack={timeOutCallBack}
        hideCount={true}
      />
    </>
  );
};

interface CloseBtnPropsType {
  item: ITradingData;
  handleCloseTrade: (item: ITradingData) => void;
}

const CloseButton = (props: CloseBtnPropsType) => {
  const { item, handleCloseTrade } = props;
  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  useEffect(() => {
    if (item.state === State.OPENED) {
      const time =
        dayjs().utc().unix() > dayjs(item.openDate).add(1, 'minutes').utc().unix()
          ? 0
          : (dayjs(item.openDate).add(1, 'minutes').utc().unix() - dayjs().utc().unix()) * 1000;
      setTimeout(() => {
        setIsDisabled(false);
      }, time);
    }
  }, [item.openDate, item.state]);

  return (
    <Button
      colorScheme="blackAlpha"
      size={'sm'}
      onClick={() => {
        handleCloseTrade(item);
      }}
      isDisabled={isDisabled}
    >
      Close
    </Button>
  );
};

const ActionCell = ({
  item,
  handleCloseTrade,
}: {
  item: ITradingData;
  handleCloseTrade: (item: ITradingData) => void;
}) => {
  const { setListLines, listLines } = useListShowLinesStore();
  const [isTimeOut, setIsTimeOut] = useState<boolean>(false);

  const timeOutCallBack = () => {
    setIsTimeOut(true);
  };

  const showAndHideLine = (item: ITradingData) => {
    setListLines(item);
  };

  return (
    <>
      {!isTimeOut ? (
        <Flex>
          <Button
            colorScheme="blackAlpha"
            size={'sm'}
            onClick={() => {
              showAndHideLine(item);
            }}
            marginRight={'12px'}
          >
            {listLines.some((line) => line._id === item._id) ? 'Hide' : 'View'}
          </Button>
          <CloseButton item={item} handleCloseTrade={handleCloseTrade} />
        </Flex>
      ) : (
        <Box display="inline-block">
          <Text
            className="inline-block rounded border px-2 font-normal"
            background={'rgba(46, 96, 255, 0.10)'}
            borderColor={'#2E60FF'}
            textColor={'#2E60FF'}
            display="flex"
            alignItems={'center'}
          >
            <RotateCw color="#1E3EF0" size={12} className="mr-1" /> Processing
          </Text>
        </Box>
      )}
      <CountDown
        endTime={
          item?.userCloseDate ? dayjs(item.userCloseDate).utc().unix() : dayjs(item.openDate).utc().unix() + item.period
        }
        period={item.period}
        hideBar={true}
        timeOutCallBack={timeOutCallBack}
        hideCount={true}
      />
    </>
  );
};

const TradeTable = ({ isProfile }: { isProfile?: boolean }) => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const searchParams = useSearchParams();
  const { updateTradeSize } = useContext(TradeContext);
  const addressURL = searchParams.get('address');
  const checkAddress = addressURL ? addressURL : address;
  const [refetchInterval, setRefetchInterval] = useState(5000);

  const defaultParams: ITradingParams = {
    limit: 10,
    page: 1,
    network: '421613',
    ...(!!isProfile && { userAddress: checkAddress }),
  };

  const [filter, setFilter] = useState<ITradingParams>(defaultParams);
  const queryClient = useQueryClient();
  const toast = useToast();
  const { tokens, user } = useUserStore();
  const { setListLines, listLines } = useListShowLinesStore();

  useEffect(() => {
    if (chain) {
      setFilter({ ...defaultParams, network: chain.id.toString() });
    }
  }, [chain]);

  const reloadData = () => {
    queryClient.invalidateQueries({ queryKey: ['getActiveTrades'] });
  };

  const columns: ColumnsType<ITradingData> = [
    {
      title: 'Asset',
      render: (value: ITradingData) => (
        <Flex justifyContent={'space-between'}>
          <Flex>
            <Image alt="" src={`/images/icons/${value.pair}.png`} w="20px" h="20px" />
            <span className="ml-2">{value?.pair && value.pair.toUpperCase()}</span>
          </Flex>
          {value.isAbove ? (
            <span className="h-6 rounded border border-[#1ED768] px-[6px] text-sm font-normal text-[#1ED768]">
              <TriangleUpIcon color={'#1ED768'} marginRight="4px" />
              Up
            </span>
          ) : (
            <span className="h-6 rounded border border-[#F03D3E] px-[6px] text-sm font-normal text-[#F03D3E]">
              <TriangleDownIcon color={'#F03D3E'} marginRight="4px" />
              Down
            </span>
          )}
        </Flex>
      ),
    },
    {
      title: 'Strike Price',
      dataIndex: 'strike',
      key: 'strike',
      render: (value, record) =>
        record && record?.pair ? (
          <Tooltip
            hasArrow
            label={
              <Box p={1} color="white">
                {addComma(divide(value, configDecimal[record?.pair.replace('-', '').toUpperCase()]), 6)}{' '}
                {record.pair.split('-')[1].toUpperCase()}
              </Box>
            }
            color="white"
            placement="top"
            bg="#050506"
          >
            <span>
              {addComma(divide(value, configDecimal[record?.pair.replace('-', '').toUpperCase()]), 2)}{' '}
              {record.pair.split('-')[1].toUpperCase()}
            </span>
          </Tooltip>
        ) : (
          <></>
        ),
    },
    {
      title: 'Current Price',
      dataIndex: 'currentPrice',
      key: 'currentPrice',
      render: (value, record) =>
        record?.pair && (
          <>
            <ShowPrice pair={record.pair.replace('-', '').toUpperCase()} /> {record.pair.split('-')[1].toUpperCase()}
          </>
        ),
    },
    {
      title: 'Open Time',
      dataIndex: 'openDate',
      key: 'openDate',
      render: (value) => (
        <Tooltip
          hasArrow
          label={
            <Box p={1} color="white">
              {dayjs(value).utc().format('HH:mm:ss')} {dayjs(value).utc().format('MM/DD/YYYY')} UTC
            </Box>
          }
          color="white"
          placement="top"
          bg="#050506"
        >
          <div>
            <p>{dayjs(value).format('HH:mm:ss')}</p>
            <p className="text-[#9E9E9F]">{dayjs(value).format('MM/DD/YYYY')}</p>
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'Time Left',
      render: (value: ITradingData) =>
        value.state === State.OPENED ? (
          <CountDown
            endTime={
              value.userCloseDate
                ? dayjs(value.userCloseDate).utc().unix()
                : dayjs(value.openDate).utc().unix() + value.period
            }
            period={value.period}
            hideBar={true}
          />
        ) : (
          <span className="flex items-center text-xs font-normal text-[#9E9E9F]">
            <span className="mr-1">{value.state === State.QUEUED ? 'In queue' : 'Processing...'}</span>
            <RotateCw color="#1E3EF0" cursor="pointer" onClick={reloadData} />
          </span>
        ),
    },
    {
      title: 'Close Time',
      render: (value: ITradingData) => (
        <Tooltip
          hasArrow
          label={
            <Box p={1} color="white">
              {dayjs(value.openDate).add(value.period, 'second').utc().format('HH:mm:ss')}{' '}
              {dayjs(value.openDate).add(value.period, 'second').utc().format('MM/DD/YYYY')} UTC
            </Box>
          }
          color="white"
          placement="top"
          bg="#050506"
        >
          <div>
            <p>{dayjs(value.openDate).add(value.period, 'second').format('HH:mm:ss')}</p>
            <p className="text-[#9E9E9F]">{dayjs(value.openDate).add(value.period, 'second').format('MM/DD/YYYY')}</p>
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'Trade Size',
      dataIndex: 'tradeSize',
      key: 'tradeSize',
      render: (value) => (
        <Tooltip
          hasArrow
          label={
            <Box p={1} color="white">
              {addComma(divide(value, 6), 6)} USDC
            </Box>
          }
          color="white"
          placement="top"
          bg="#050506"
        >
          <span>{addComma(divide(value, 6), 2)} USDC</span>
        </Tooltip>
      ),
    },
    {
      title: 'PnL | Probability',
      dataIndex: 'probability',
      render: (value: string, record: ITradingData) => <PnLCell trade={record} />,
    },
    ...(!isProfile
      ? [
          {
            title: ' ',
            dataIndex: 'action',
            key: 'action',
            width: '150px',
            render: (_: any, record: ITradingData) => <ActionCell item={record} handleCloseTrade={handleCloseTrade} />,
          },
        ]
      : []),
  ];

  const handleCloseTrade = async (item: ITradingData) => {
    try {
      const closingTime = dayjs().utc().unix();
      await closeTrade(item._id);
      queryClient.invalidateQueries({ queryKey: ['getActiveTrades'] });
      toast({
        position: 'top',
        render: ({ onClose }) => <ToastCloseTrade item={item} onClose={onClose} closeTime={closingTime} />,
      });
      const isRemove = listLines.some((line) => line._id === item._id);
      isRemove && setListLines(item);
    } catch (error) {
      console.log(error);
      toast({
        position: 'top',
        render: ({ onClose }) => <ToastLayout title="Close unsuccessfully" status={Status.ERROR} close={onClose} />,
      });
    }
  };

  const {
    data: tradingData,
    isError,
    isSuccess,
    isInitialLoading,
  } = useQuery({
    queryKey: ['getActiveTrades', filter],
    queryFn: () => getTrades(filter),
    // select: transformData,
    enabled: isProfile
      ? !!checkAddress
      : !!tokens && !!user && !!tokens?.access?.token && !!user?.isApproved && !!user?.isRegistered && !!address,
    cacheTime: 0,
    refetchInterval: refetchInterval,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (isError) {
      setRefetchInterval(0);
    }
    if (isSuccess) {
      setRefetchInterval(5000);
    }
  }, [isError, isSuccess]);

  useEffect(() => {
    if (!isProfile) return;
    setFilter({ ...defaultParams, userAddress: addressURL ? addressURL : address });
  }, [address, addressURL, isProfile]);

  const handleChangePage = (pagination: TablePaginationConfig) => {
    setFilter({ ...defaultParams, page: pagination.current ?? 1 });
  };

  useEffect(() => {
    updateTradeSize(tradingData?.meta?.totalDocs ?? 0);
  }, [tradingData, updateTradeSize]);

  return (
    <Table
      columns={columns}
      dataSource={tradingData?.docs}
      pagination={{
        pageSize: tradingData?.meta.limit,
        current: tradingData?.meta.page,
        total: tradingData?.meta.totalDocs,
        hideOnSinglePage: !isProfile,
        showTotal: (total: number, range: [number, number]) => `Results: ${range[0]} - ${range[1]}  of ${total}`,
      }}
      // scroll={{ y: 300 }}
      scroll={{ x: 'max-content' }}
      loading={isInitialLoading}
      className="customTable"
      rowKey={(record) => record._id}
      onChange={handleChangePage}
      locale={{
        emptyText: (
          <Box
            background="#0C0C10"
            margin="-16px -16px"
            padding="20px"
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <Image src="/images/icons/empty.svg" width={'60px'} height={'50px'} alt="empty" />
            <Text color={'#6D6D70'} fontSize={'14px'}>
              No active trades at present.
            </Text>
          </Box>
        ),
      }}
    />
  );
};
export default TradeTable;
