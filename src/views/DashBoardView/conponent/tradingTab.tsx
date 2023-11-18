import { Box, Flex, Text } from '@chakra-ui/react';
import ItemCardTab from './ItemCardTab';
import { useQuery } from '@tanstack/react-query';
import { getDashboardOverview } from '@/services/dashboard';
import { notification } from 'antd';
import { divide } from '@/utils/operationBigNumber';
import { addComma } from '@/utils/number';
import dayjs from 'dayjs';

const TradingTab = () => {
  const networkID = 421613;
  const { data: dataDashboardOverviews } = useQuery({
    queryKey: ['getDashboardOverview', networkID],
    queryFn: () => getDashboardOverview({ network: networkID }),
    onError: (error: any) => {
      notification.error({ message: error.message });
    },
    // enabled: !!networkID,
    cacheTime: 0,
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });

  return (
    <Box
      boxShadow="1px 0.5px 0px 0px #38383A inset"
      border={'1px solid #38383A'}
      paddingY={['20px', '20px', '40px', '40px']}
      paddingX={['10px', '10px', '32px', '32px']}
      rounded="20px"
      width={{ base: '100%', sm: '100%', md: '100%', lg: '693px' }}
      bgColor="rgba(28, 28, 30, 0.7)"
      display={'flex'}
      justifyContent={'space-around'}
      gap={'20px'}
      flexDirection={'column'}
    >
      <Text fontSize="20px" textColor={'white'} fontWeight={600}>
        Trading Overview
      </Text>
      <Flex flexDirection={'column'}>
        <ItemCardTab
          title={'Fees / Volume'}
          value={`${addComma(
            divide(dataDashboardOverviews?.totalStats?.totalSettlementFees ?? 0, 6),
            2,
          )} USDC / ${addComma(divide(dataDashboardOverviews?.totalStats.totalVolume ?? 0, 6), 2)} USDC`}
          tooltip={`${addComma(
            divide(dataDashboardOverviews?.totalStats?.totalSettlementFees ?? 0, 6),
            6,
          )} USDC / ${addComma(divide(dataDashboardOverviews?.totalStats.totalVolume ?? 0, 6), 6)} USDC`}
        />
        <ItemCardTab
          title={'Fees / Volume (24h)'}
          value={`${addComma(
            divide(dataDashboardOverviews?.total24stats?.reduce((acc, item) => acc + +item.settlementFee, 0) ?? 0, 6),
            2,
          )} USDC/ ${addComma(
            divide(dataDashboardOverviews?.total24stats?.reduce((acc, item) => acc + +item.amount, 0) ?? 0, 6),
            2,
          )} USDC`}
          tooltip={`${addComma(
            divide(dataDashboardOverviews?.total24stats?.reduce((acc, item) => acc + +item.settlementFee, 0) ?? 0, 6),
            6,
          )} USDC/ ${addComma(
            divide(dataDashboardOverviews?.total24stats?.reduce((acc, item) => acc + +item.amount, 0) ?? 0, 6),
            6,
          )} USDC`}
        />
        <ItemCardTab
          title={'Average Daily Volume'}
          value={`${
            dataDashboardOverviews
              ? addComma(
                  divide(
                    divide(
                      dataDashboardOverviews?.totalStats?.totalVolume ?? 0,
                      dayjs()
                        .diff(dataDashboardOverviews?.tradingStartDate, 'd')
                        .toString(),
                    ),
                    6,
                  ),
                  2,
                )
              : 0
          } USDC`}
          tooltip={`${
            dataDashboardOverviews
              ? addComma(
                  divide(
                    divide(
                      dataDashboardOverviews?.totalStats?.totalVolume ?? 0,
                      dayjs()
                        .diff(dataDashboardOverviews?.tradingStartDate, 'd')
                        .toString(),
                    ),
                    6,
                  ),
                  6,
                )
              : 0
          } USDC`}
        />
        <ItemCardTab
          title={'Average Trade size'}
          value={`${addComma(
            divide(
              divide(dataDashboardOverviews?.totalStats?.totalVolume ?? 0, 6),
              (dataDashboardOverviews?.totalStats?.totalTrades ?? 1).toString(),
            ),
            2,
          )} USDC`}
          tooltip={`${addComma(
            divide(
              divide(dataDashboardOverviews?.totalStats?.totalVolume ?? 0, 6),
              (dataDashboardOverviews?.totalStats?.totalTrades ?? 1).toString(),
            ),
            6,
          )} USDC`}
        />
        <ItemCardTab
          title={'Total Trades'}
          value={`${addComma(dataDashboardOverviews?.totalStats?.totalTrades ?? 0, 2)}`}
          tooltip={`${addComma(dataDashboardOverviews?.totalStats?.totalTrades ?? 0, 6)}`}
        />
        <ItemCardTab
          title={'Open Interest (USDC)'}
          value={`${addComma(divide(dataDashboardOverviews?.OIstats?.totalVolume ?? 0, 6), 2)} USDC`}
          tooltip={`${addComma(divide(dataDashboardOverviews?.OIstats?.totalVolume ?? 0, 6), 6)} USDC`}
        />
        <ItemCardTab
          title={'Total Traders'}
          value={`${addComma(dataDashboardOverviews?.totalTraders[0].uniqueCountCumulative ?? 0, 2)}`}
          tooltip={`${addComma(dataDashboardOverviews?.totalTraders[0].uniqueCountCumulative ?? 0, 6)}`}
        />
      </Flex>
    </Box>
  );
};

export default TradingTab;
