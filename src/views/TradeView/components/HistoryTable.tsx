'use client';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Table } from 'antd';
import { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { addComma } from '@/utils/number';
import { useAccount, useNetwork } from 'wagmi';
import { getTradeHistory } from '@/services/trade';
import { ITradingData, ITradingParams, TRADE_STATUS } from '@/types/trade.type';
import { Box, Flex, Image, Text, Tooltip } from '@chakra-ui/react';
import { divide } from '@/utils/operationBigNumber';
import { TriangleUpIcon, TriangleDownIcon } from '@chakra-ui/icons';
import dayjs from 'dayjs';
import { convertDurationToHourMinutesSeconds } from '@/utils/time';
import useUserStore from '@/store/useUserStore';
import ShareModal from './ShareModal';
import useAdvanceSetting from '@/store/useAdvanceSetting';
import { useSearchParams } from 'next/navigation';
import { configDecimal } from './TradeTable';
import { appConfig } from '@/config';

const HistoryTable = ({ isProfile }: { isProfile?: boolean }) => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const searchParams = useSearchParams();
  const addressURL = searchParams.get('address');
  const checkAddress = addressURL ? addressURL : address;

  const defaultParams: ITradingParams = {
    limit: 10,
    page: 1,
    network: Number(appConfig.chainId),
    ...(!!isProfile && { userAddress: checkAddress }),
  };

  const [filter, setFilter] = useState<ITradingParams>(defaultParams);
  const { tokens, user } = useUserStore();
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<ITradingData | null>(null);
  const { advanceSetting } = useAdvanceSetting();
  const [refetchInterval, setRefetchInterval] = useState(5000);

  useEffect(() => {
    if (chain) {
      setFilter({ ...defaultParams, network: chain.id });
    }
  }, [chain]);

  useEffect(() => {
    isProfile && setFilter({ ...defaultParams, userAddress: addressURL ? addressURL : address });
  }, [address, addressURL]);

  const columns: ColumnsType<ITradingData> = [
    {
      title: 'Asset',
      render: (value: ITradingData) => (
        <Flex justifyContent={'space-between'}>
          <Flex>
            <Image alt="" src={`/images/icons/${value.pair}.png`} w="20px" h="20px" />
            <span className="ml-2 mr-4">{value?.pair && value.pair.toUpperCase()}</span>
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
            label={`${addComma(
              divide(value, configDecimal[record?.pair.replace('-', '').toUpperCase()]),
              6,
            )} ${record.pair.split('-')[1].toUpperCase()}`}
            hasArrow
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
      title: 'Expiry Price',
      dataIndex: 'expiryPrice',
      key: 'expiryPrice',
      render: (value, record) =>
        record && record?.pair ? (
          <Tooltip
            label={`${addComma(
              divide(value, configDecimal[record?.pair.replace('-', '').toUpperCase()]),
              6,
            )} ${record.pair.split('-')[1].toUpperCase()}`}
            hasArrow
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
      title: 'Duration',
      render: (value: ITradingData) => {
        let duration = value.period;
        if (value.cancellationDate) {
          duration = dayjs(value.cancellationDate).unix() - dayjs(value.openDate).unix();
        } else if (value.userCloseDate) {
          duration = dayjs(value.userCloseDate).unix() - dayjs(value.openDate).unix();
        }
        return convertDurationToHourMinutesSeconds(duration);
      },
    },
    {
      title: 'Close Time',
      render: (value: ITradingData) => {
        let closeTime = dayjs(value.openDate).add(value.period, 'second').format();
        if (value.cancellationDate) {
          closeTime = value.cancellationDate;
        } else if (value.userCloseDate) {
          closeTime = value.userCloseDate;
        }
        return (
          <Tooltip
            hasArrow
            label={
              <Box p={1} color="white">
                {dayjs(closeTime).utc().format('HH:mm:ss')} {dayjs(closeTime).utc().format('MM/DD/YYYY')} UTC
              </Box>
            }
            color="white"
            placement="top"
            bg="#050506"
          >
            <div>
              <p>{dayjs(closeTime).format('HH:mm:ss')}</p>
              <p className="text-[#9E9E9F]">{dayjs(closeTime).format('MM/DD/YYYY')}</p>
            </div>
          </Tooltip>
        );
      },
    },
    {
      title: 'Trade Size',
      dataIndex: 'tradeSize',
      key: 'tradeSize',
      render: (value) => (
        <Tooltip label={`${addComma(divide(value, 6), 6)} USDC`} hasArrow color="white" placement="top" bg="#050506">
          <span>{addComma(divide(value, 6), 2)} USDC</span>
        </Tooltip>
      ),
    },
    {
      title: 'Payout',
      dataIndex: 'payout',
      key: 'payout',
      render: (value, record) => (
        <div>
          <Tooltip
            label={`${addComma(divide(record.profit, 6), 6)} USDC`}
            hasArrow
            color="white"
            placement="top"
            bg="#050506"
          >
            <span>{addComma(divide(record.profit, 6), 2)} USDC</span>
          </Tooltip>

          <Text textColor={record.status === TRADE_STATUS.WIN ? '#1ED768' : '#F03D3E'}>
            Net PnL:{' '}
            <Tooltip
              label={`${addComma(divide(record.pnl, 6), 6)} USDC`}
              hasArrow
              color="white"
              placement="top"
              bg="#050506"
            >
              <span>{addComma(divide(record.pnl, 6), 2)} USDC</span>
            </Tooltip>
          </Text>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (value, record) => (
        <Box display={'flex'}>
          <Box
            border={value === TRADE_STATUS.WIN ? '1px solid #1ED768' : '1px solid #F03D3E'}
            display="flex"
            px={2}
            rounded={4}
            py={'2px'}
            alignItems="center"
            backgroundColor={value === TRADE_STATUS.WIN ? 'rgba(21, 189, 89, 0.10)' : 'rgba(240, 61, 62, 0.10);'}
          >
            <Image
              alt=""
              src={value === TRADE_STATUS.WIN ? '/images/icons/check-circle.svg' : '/images/icons/x-circle-red.svg'}
              w="10px"
              h="10px"
            />
            <Text paddingLeft={'5px'} textColor={value === TRADE_STATUS.WIN ? '#1ED768' : '#F03D3E'}>
              {value}
            </Text>
          </Box>
          {!isProfile &&
            address &&
            advanceSetting &&
            advanceSetting[address] &&
            advanceSetting[address]?.isShowSharePopup && (
              <Text
                color={'#1677FF'}
                fontWeight={400}
                fontSize={'14px'}
                ml={'45px'}
                onClick={() => openShareModal(record)}
                cursor={'pointer'}
              >
                Share
              </Text>
            )}
        </Box>
      ),
    },
  ];

  const openShareModal = (item: ITradingData) => {
    setIsOpenModal(true);
    setSelectedItem(item);
  };

  const {
    data: tradingData,
    isError,
    isSuccess,
    isInitialLoading,
  } = useQuery({
    queryKey: ['getTradingHistory', filter],
    queryFn: () => getTradeHistory(filter),
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

  const handleChangePage = (pagination: TablePaginationConfig) => {
    setFilter({ ...defaultParams, page: pagination.current ?? 1, limit: pagination.pageSize ?? 10 });
  };

  return (
    <>
      <Table
        columns={columns}
        dataSource={tradingData?.docs}
        pagination={{
          pageSize: tradingData?.meta.limit,
          current: tradingData?.meta.page,
          total: tradingData?.meta.totalDocs,
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
                No trade history.
              </Text>
            </Box>
          ),
        }}
      />
      {isOpenModal && selectedItem && (
        <ShareModal item={selectedItem} isOpen={isOpenModal} onClose={() => setIsOpenModal(false)} />
      )}
    </>
  );
};
export default HistoryTable;
