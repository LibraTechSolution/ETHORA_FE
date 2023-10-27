'use client';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Table } from 'antd';
import { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { addComma } from '@/utils/number';
import { useNetwork } from 'wagmi';
import { getTradeHistory } from '@/services/trade';
import { ITradingData, ITradingParams } from '@/types/trade.type';
import { Flex, Image } from '@chakra-ui/react';
import { divide } from '@/utils/operationBigNumber';
import { TriangleUpIcon, TriangleDownIcon } from '@chakra-ui/icons';
import dayjs from 'dayjs';
import { convertDurationToHourMinutesSeconds } from '@/utils/time';

const defaultParams: ITradingParams = {
  limit: 10,
  page: 1,
  network: '421613',
};

const HistoryTable = () => {
  const { chain } = useNetwork();
  const [filter, setFilter] = useState<ITradingParams>(defaultParams);

  useEffect(() => {
    if (chain) {
      setFilter({ ...defaultParams, network: chain.id.toString() });
    }
  }, [chain]);

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
      render: (value) => <span>{addComma(divide(value, 8), 2)}</span>,
    },
    {
      title: 'Expiry Price',
      dataIndex: 'expiryPrice',
      key: 'expiryPrice',
      render: (value) => <span>{addComma(value, 2)}</span>,
    },
    {
      title: 'Open Time',
      dataIndex: 'openDate',
      key: 'openDate',
      render: (value) => (
        <div>
          <p>{dayjs(value).format('HH:mm:ss')}</p>
          <p className="text-[#9E9E9F]">{dayjs(value).format('MM/DD/YYYY')}</p>
        </div>
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
          <div>
            <p>{dayjs(closeTime).format('HH:mm:ss')}</p>
            <p className="text-[#9E9E9F]">{dayjs(closeTime).format('MM/DD/YYYY')}</p>
          </div>
        );
      },
    },
    {
      title: 'Trade Size',
      dataIndex: 'tradeSize',
      key: 'tradeSize',
      render: (value) => <span>{addComma(divide(value, 6), 2)}</span>,
    },
    {
      title: 'Payout',
      dataIndex: 'payout',
      key: 'payout',
    },
    {
      title: 'Status',
      render: (value: ITradingData) => 'TODO',
    },
  ];

  const { data: tradingData, isLoading } = useQuery({
    queryKey: ['getTradingHistory', filter],
    queryFn: () => getTradeHistory(filter),
    onError: (error: any) => {
      // notification.error({ message: error.message });
      console.log(error);
    },
    cacheTime: 0,
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });

  const handleChangePage = (pagination: TablePaginationConfig) => {
    setFilter({ ...defaultParams, page: pagination.current ?? 1 });
  };

  return (
    <Table
      columns={columns}
      dataSource={tradingData?.docs}
      pagination={{
        pageSize: tradingData?.meta.limit,
        current: tradingData?.meta.page,
        total: tradingData?.meta.totalDocs,
        hideOnSinglePage: true,
        showTotal: (total: number, range: [number, number]) => `Results: ${range[0]} - ${range[1]}  of ${total}`,
      }}
      // scroll={{ y: 300 }}
      scroll={{ x: 'max-content' }}
      loading={isLoading}
      className="customTable"
      rowKey={(record) => record._id}
      onChange={handleChangePage}
    />
  );
};
export default HistoryTable;
