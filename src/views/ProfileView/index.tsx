'use client';
import { formatAddress } from '@/utils/address';
// import { useGetPosts } from '@/views/ProfileView/Profile.queries';
import { Box, Button, Flex, Grid, GridItem, Heading, Link, Text } from '@chakra-ui/react';

import Image from 'next/image';
import { useAccount } from 'wagmi';
import { ExternalLink } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useEffect, useState } from 'react';
// import HistoryTab from './conponents/historyTab';
// import ActiveTab from './conponents/activeTab';
// import LimitOrderTab from './conponents/limitOrderTab';
import { addComma } from '@/utils/number';
import { Select, Space, notification } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { useIsMounted } from '@/hooks/useIsMounted';
import { useQuery } from '@tanstack/react-query';
import { getProfile } from '@/services/profile';
import { IProfileParams, IProfileResponse } from '@/types/profile';
import { formatUnits } from 'viem';
import TradeTable from '../TradeView/components/TradeTable';
import LimitOrdersTable from '../TradeView/components/LimitOrdersTable';
import HistoryTable from '../TradeView/components/HistoryTable';
import Currency from '@/components/Currency';
import BigNumber from 'bignumber.js';
import CustomConnectButton from '@/components/CustomConnectButton';
import { appConfig } from '@/config';

export type Person = {
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  progress: number;
  status: 'relationship' | 'complicated' | 'single';
  subRows?: Person[];
};

export enum TradingTabType {
  ActiveTab = 'ActiveTab',
  LimitOrderTab = 'LimitOrderTab',
  HistoryTab = 'HistoryTab',
}

const ProfileView = () => {
  const { Option } = Select;
  // const { data: dataRank, error, isLoading, isSuccess } = useGetPosts();
  const { address } = useAccount();
  const isMounted = useIsMounted();
  // const [addrSSR, setAddrSSR] = useState<`0x${string}` | undefined>();
  const [defaultTabs, setDefaultTabs] = useState<TradingTabType>(TradingTabType.ActiveTab);
  const router = useRouter();
  const searchParams = useSearchParams();
  const addressURL = searchParams.get('address');
  const [profileInfoFilter, setProfileInfoFilter] = useState<IProfileParams>();

  console.log('profileInfoFilter', profileInfoFilter);

  const { data: dataProfileInfo } = useQuery({
    queryKey: ['getStats', profileInfoFilter],
    queryFn: () => getProfile(profileInfoFilter as IProfileParams),
    onError: (error: any) => {
      notification.error({ message: error.message });
    },
    enabled: !!profileInfoFilter?.userAddress,
    cacheTime: 0,
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });

  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  useEffect(() => {
    setProfileInfoFilter({
      network: Number(appConfig.chainId),
      ...((addressURL ? addressURL : address ? address : undefined) && {
        userAddress: addressURL ? addressURL : address ? address : undefined,
      }),
    });
  }, [addressURL, address]);

  return (
    <>
      {isMounted && (
        <Flex
          marginX={'-20px'}
          gap={10}
          direction={'column'}
          bgImage="url('/images/profile/bg-item.png')"
          bgRepeat="no-repeat"
          bgPosition="top -87px left 45px"
          padding={'20px'}
        >
          <Flex
            direction={'column'}
            w={'100%'}
            maxW={'300px'}
            p={4}
            color="white"
            marginX={'auto'}
            display={'flex'}
            alignItems={'center'}
            gap={'27px'}
          >
            <Box w={'64px'} h={'64px'} borderRadius={'100%'} overflow={'hidden'}>
              <Image src="/images/profile/avatar.svg" width={64} height={64} alt="Avata" />
            </Box>
            <Box>
              {address ? (
                <Link
                  href={`${appConfig.scan}/address/${addressURL ?? address}`}
                  isExternal
                  fontSize={'20px'}
                  fontWeight={600}
                  color={'#1E3EF0'}
                  display={'flex'}
                  alignItems={'center'}
                >
                  <Box as={'span'} marginRight={2}>
                    {formatAddress(addressURL ?? address, 6, 6)}
                  </Box>
                  <ExternalLink />
                </Link>
              ) : (
                <Text fontSize={20} color={'#F03D3E'}>
                  Wallet Not Connected.
                </Text>
              )}
            </Box>
          </Flex>

          <Grid
            w={'100%'}
            maxW={'1104px'}
            templateColumns={{
              base: 'repeat(2, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(6, 1fr)',
            }}
            mx={'auto'}
            rowGap={3}
          >
            <GridItem textAlign={'center'} padding={3} borderRight={{ sm: '1px solid #242428' }}>
              <Flex direction={'column'} w={'100%'} display={'flex'} alignItems={'center'}>
                <Text fontSize={'sm'} marginBottom={'12px'}>
                  Chain
                </Text>
                <Box>
                  <Select defaultValue="china" style={{ width: 120 }} onChange={handleChange} className="customSelect">
                    <Option value="china" label="China">
                      <div className="flex items-center">
                        <Image
                          src="/images/networks/base.svg"
                          width={14}
                          height={14}
                          alt="Avata"
                          className="mr-3 h-[14px] w-[14px]"
                        />
                        <span className="flex-1 text-left">Base</span>
                      </div>
                    </Option>
                  </Select>
                </Box>
              </Flex>
            </GridItem>
            <GridItem
              textAlign={'center'}
              padding={3}
              borderRight={{ md: '1px solid #242428', lg: '1px solid #242428' }}
            >
              <Flex direction={'column'} w={'100%'} display={'flex'} alignItems={'center'}>
                <Text fontSize={'sm'} marginBottom={'12px'}>
                  Daily Rank
                </Text>
                {profileInfoFilter?.userAddress ? (
                  <Text fontSize={'2xl'}>
                    {dataProfileInfo && dataProfileInfo?.stats?.daily >= 0 ? `#${dataProfileInfo?.stats?.daily}` : '--'}
                  </Text>
                ) : (
                  <Text fontSize={'2xl'}>--</Text>
                )}
              </Flex>
            </GridItem>
            <GridItem
              textAlign={'center'}
              padding={3}
              borderRight={{ base: 'none', sm: '1px solid #242428', md: 'none', lg: '1px solid #242428' }}
            >
              <Flex direction={'column'} w={'100%'} display={'flex'} alignItems={'center'}>
                <Text fontSize={'sm'} marginBottom={'12px'}>
                  Weekly Rank
                </Text>
                {profileInfoFilter?.userAddress ? (
                  <Text fontSize={'2xl'} fontWeight={600}>
                    {dataProfileInfo && dataProfileInfo?.stats?.weekly >= 0
                      ? `#${dataProfileInfo?.stats?.weekly}`
                      : '--'}
                  </Text>
                ) : (
                  <Text fontSize={'2xl'}>--</Text>
                )}
              </Flex>
            </GridItem>
            <GridItem
              textAlign={'center'}
              padding={3}
              borderRight={{ md: '1px solid #242428', lg: '1px solid #242428' }}
            >
              <Flex direction={'column'} w={'100%'} display={'flex'} alignItems={'center'}>
                <Text fontSize={'sm'} marginBottom={'12px'}>
                  Win Rate
                </Text>
                {profileInfoFilter?.userAddress ? (
                  <Text fontSize={'2xl'} fontWeight={600}>
                    {dataProfileInfo && dataProfileInfo?.stats?.winTrade && dataProfileInfo?.stats?.totalTrade
                      ? ((dataProfileInfo?.stats?.winTrade / dataProfileInfo?.stats?.totalTrade) * 100).toFixed(2)
                      : '0.00'}
                    %
                  </Text>
                ) : (
                  <Text fontSize={'2xl'}>--</Text>
                )}
              </Flex>
            </GridItem>
            <GridItem textAlign={'center'} padding={3} borderRight={{ sm: '1px solid #242428' }}>
              <Flex direction={'column'} w={'100%'} display={'flex'} alignItems={'center'}>
                <Text fontSize={'sm'} marginBottom={'12px'}>
                  Won
                </Text>
                {profileInfoFilter?.userAddress ? (
                  <Text fontSize={'2xl'}>
                    {dataProfileInfo?.stats?.winTrade}/{dataProfileInfo?.stats?.totalTrade} trades
                  </Text>
                ) : (
                  <Text fontSize={'2xl'}>--</Text>
                )}
              </Flex>
            </GridItem>
            <GridItem textAlign={'center'} padding={3}>
              <Flex direction={'column'} w={'100%'} display={'flex'} alignItems={'center'}>
                <Text fontSize={'sm'} marginBottom={'12px'}>
                  Most Traded Asset
                </Text>
                {profileInfoFilter?.userAddress ? (
                  <Text fontSize={'2xl'}>
                    {dataProfileInfo?.stats?.mostTradedContract ? dataProfileInfo?.stats?.mostTradedContract : '--'}
                  </Text>
                ) : (
                  <Text fontSize={'2xl'}>--</Text>
                )}
              </Flex>
            </GridItem>
          </Grid>

          {!addressURL && (
            <Flex
              w={'100%'}
              maxW={'763px'}
              marginX={'auto'}
              padding={5}
              gap={5}
              flexWrap={'wrap'}
              backgroundColor={'#252528'}
              borderRadius={'20px'}
              alignItems={'center'}
            >
              <Box
                w={'55px'}
                h={'55px'}
                borderRadius={'100%'}
                overflow={'hidden'}
                // bg={'#1E3EF0'}
                marginX={{ base: 'auto', sm: 'initial' }}
              >
                <Image src="/images/icons/ethora-cicle.svg" width={55} height={55} alt="Avata" />
              </Box>
              <Box>
                <Heading as="h4" fontSize={20} lineHeight={'30px'} color={'white'}>
                  Invite your friends to join Ethora now!
                </Heading>
                <Text>Get rewards by leveraging community network.</Text>
              </Box>

              {address ? (
                <Button
                  colorScheme="primary"
                  fontSize={'16px'}
                  size="md"
                  marginLeft={'auto'}
                  flex={{ base: '1', sm: '1', md: 'none' }}
                  flexBasis={{ base: '142px', sm: '142px', md: 'auto' }}
                  onClick={() => router.push('/referral')}
                >
                  Invite your friends now
                </Button>
              ) : (
                <Box
                  margin={{ base: '0 auto', sm: '0 auto', md: '0 0 0 auto' }}
                  flex={{ base: 'initial', sm: '1', md: 'none' }}
                  flexBasis={{ base: '142px', sm: '142px', md: 'auto' }}
                  justifyContent={{ base: 'center' }}
                >
                  <CustomConnectButton />
                </Box>
              )}
            </Flex>
          )}

          <div>
            <Heading as="h4" fontSize={24} lineHeight={'36px'} color={'white'} fontWeight={600} marginBottom={'20px'}>
              Metrics
            </Heading>
            <Grid
              templateColumns={{
                base: 'repeat(1, 1fr)',
                sm: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(2, 1fr)',
              }}
              gap="25px"
            >
              <GridItem padding={5} borderRadius={'20px'} backgroundColor={'#242428'} minH={'200px'}>
                <Text fontSize={'20px'} color={'white'} fontWeight={600} marginBottom={'20px'}>
                  Referral Metrics
                </Text>
                {profileInfoFilter?.userAddress ? (
                  <Box flexDirection={'column'}>
                    <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} marginBottom={'8px'}>
                      <Text as="span" fontSize={'xs'}>
                        Total Referral Earnings
                      </Text>
                      <Text as="span" textColor={'white'}>
                        <Currency
                          value={
                            dataProfileInfo?.metrics?.referral?.totalRebateEarned
                              ? BigNumber(
                                  formatUnits(dataProfileInfo?.metrics?.referral?.totalRebateEarned as bigint, 6),
                                ).toFixed()
                              : 0
                          }
                          decimal={2}
                          unit="USDC"
                        />{' '}
                        USDC
                      </Text>
                    </Box>
                    <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} marginBottom={'8px'}>
                      <Text as="span" fontSize={'xs'}>
                        Referral Trading Volume / week
                      </Text>
                      <Text as="span" textColor={'white'}>
                        <Currency
                          value={
                            dataProfileInfo?.metrics?.referral?.totalVolumeTrades
                              ? BigNumber(
                                  formatUnits(dataProfileInfo?.metrics?.referral?.totalVolumeTrades as bigint, 6),
                                ).toFixed()
                              : 0
                          }
                          decimal={2}
                          unit="USDC"
                        />{' '}
                        USDC
                      </Text>
                    </Box>
                    <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} marginBottom={'8px'}>
                      <Text as="span" fontSize={'xs'}>
                        No. of Active Referred Traders / week
                      </Text>
                      <Text as="span" textColor={'white'}>
                        {dataProfileInfo?.metrics?.referral?.totalTrades
                          ? dataProfileInfo?.metrics?.referral?.totalTrades
                          : 0}{' '}
                        referees
                      </Text>
                    </Box>
                    <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} marginBottom={'8px'}>
                      <Text as="span" fontSize={'xs'}>
                        Referral Tier
                      </Text>
                      <Text as="span" textColor={'white'}>
                        Tier {dataProfileInfo?.metrics?.referral?.tier ? dataProfileInfo?.metrics?.referral?.tier : 0}
                      </Text>
                    </Box>
                  </Box>
                ) : (
                  <Flex direction={'column'} w={'100%'} display={'flex'} alignItems={'center'}>
                    <Box
                      w={'80px'}
                      h={'80px'}
                      borderRadius={'100%'}
                      overflow={'hidden'}
                      marginX={{ base: 'auto', sm: 'initial' }}
                      marginBottom={'8px'}
                    >
                      <Image src="/images/profile/notConnectWallet.svg" width={80} height={80} alt="Avata" />
                    </Box>
                    <Text size={'sm'}>Wallet not connected.</Text>
                  </Flex>
                )}
              </GridItem>

              <GridItem padding={5} borderRadius={'20px'} backgroundColor={'#242428'} minH={'200px'}>
                <Text fontSize={'20px'} color={'white'} fontWeight={600} marginBottom={'20px'}>
                  USDC Trading Metrics
                </Text>
                {profileInfoFilter?.userAddress ? (
                  <Box flexDirection={'column'}>
                    <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} marginBottom={'8px'}>
                      <Text as="span" fontSize={'xs'}>
                        Total Payout
                      </Text>
                      <Text as="span" textColor={'white'}>
                        <Currency
                          value={
                            dataProfileInfo?.metrics?.USDC?.totalPayout
                              ? BigNumber(
                                  formatUnits(dataProfileInfo?.metrics?.USDC?.totalPayout as bigint, 6),
                                ).toFixed()
                              : 0
                          }
                          decimal={2}
                          unit="USDC"
                        />{' '}
                        USDC
                      </Text>
                    </Box>
                    <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} marginBottom={'8px'}>
                      <Text as="span" fontSize={'xs'}>
                        Net PnL
                      </Text>
                      <Text
                        as="span"
                        textColor={`${
                          dataProfileInfo && dataProfileInfo?.metrics?.USDC?.netPnl >= 0 ? '#1ED768' : '#F03D3E'
                        } `}
                      >
                        <Currency
                          value={
                            dataProfileInfo?.metrics?.USDC?.netPnl
                              ? BigNumber(formatUnits(dataProfileInfo?.metrics?.USDC?.netPnl as bigint, 6)).toFixed()
                              : 0
                          }
                          decimal={2}
                          unit="USDC"
                        />{' '}
                        USDC
                      </Text>
                    </Box>
                    <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} marginBottom={'8px'}>
                      <Text as="span" fontSize={'xs'}>
                        Open Interest
                      </Text>
                      <Text as="span" textColor={'white'}>
                        <Currency
                          value={
                            dataProfileInfo?.metrics?.USDC?.openInterest
                              ? BigNumber(
                                  formatUnits(dataProfileInfo?.metrics?.USDC?.openInterest as bigint, 6),
                                ).toFixed()
                              : 0
                          }
                          decimal={2}
                          unit="USDC"
                        />{' '}
                        USDC
                      </Text>
                    </Box>
                    <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} marginBottom={'8px'}>
                      <Text as="span" fontSize={'xs'}>
                        Volume
                      </Text>
                      <Text as="span" textColor={'white'}>
                        <Currency
                          value={
                            dataProfileInfo?.metrics?.USDC?.volume
                              ? BigNumber(formatUnits(dataProfileInfo?.metrics?.USDC?.volume as bigint, 6)).toFixed()
                              : 0
                          }
                          decimal={2}
                          unit="USDC"
                        />{' '}
                        USDC
                      </Text>
                    </Box>
                  </Box>
                ) : (
                  <Flex direction={'column'} w={'100%'} display={'flex'} alignItems={'center'}>
                    <Box
                      w={'80px'}
                      h={'80px'}
                      borderRadius={'100%'}
                      overflow={'hidden'}
                      marginX={{ base: 'auto', sm: 'initial' }}
                      marginBottom={'8px'}
                    >
                      <Image src="/images/profile/notConnectWallet.svg" width={80} height={80} alt="Avata" />
                    </Box>
                    <Text size={'sm'}>Wallet not connected.</Text>
                  </Flex>
                )}
              </GridItem>
            </Grid>
          </div>

          <div>
            <Heading as="h4" fontSize={24} lineHeight={'36px'} color={'white'} fontWeight={600} marginBottom={'20px'}>
              My trades
            </Heading>
            <>
              <Box width={'100%'} marginBottom={'16px'} overflow={'overflow-auto'}>
                <Flex gap={'16px'}>
                  <Box
                    className="mr-2"
                    role="presentation"
                    onClick={() => {
                      setDefaultTabs(TradingTabType.ActiveTab);
                    }}
                    borderBottom={'2px solid'}
                    borderColor={defaultTabs === TradingTabType.ActiveTab ? '#1E3EF0' : 'transparent'}
                    pointerEvents={defaultTabs === TradingTabType.ActiveTab ? 'none' : 'auto'}
                    cursor={defaultTabs === TradingTabType.ActiveTab ? 'default' : 'pointer'}
                    color={defaultTabs === TradingTabType.ActiveTab ? '#1E3EF0' : '#9E9E9F'}
                  >
                    Active
                  </Box>
                  <Box
                    className="mr-2"
                    role="presentation"
                    onClick={() => {
                      setDefaultTabs(TradingTabType.LimitOrderTab);
                    }}
                    borderBottom={'2px solid'}
                    borderColor={defaultTabs === TradingTabType.LimitOrderTab ? '#1E3EF0' : 'transparent'}
                    pointerEvents={defaultTabs === TradingTabType.LimitOrderTab ? 'none' : 'auto'}
                    cursor={defaultTabs === TradingTabType.LimitOrderTab ? 'default' : 'pointer'}
                    color={defaultTabs === TradingTabType.LimitOrderTab ? '#1E3EF0' : '#9E9E9F'}
                  >
                    Limit Orders
                  </Box>
                  <Box
                    className="mr-2"
                    role="presentation"
                    onClick={() => {
                      setDefaultTabs(TradingTabType.HistoryTab);
                    }}
                    borderBottom={'2px solid'}
                    borderColor={defaultTabs === TradingTabType.HistoryTab ? '#1E3EF0' : 'transparent'}
                    pointerEvents={defaultTabs === TradingTabType.HistoryTab ? 'none' : 'auto'}
                    cursor={defaultTabs === TradingTabType.HistoryTab ? 'default' : 'pointer'}
                    color={defaultTabs === TradingTabType.HistoryTab ? '#1E3EF0' : '#9E9E9F'}
                  >
                    History
                  </Box>
                </Flex>
              </Box>
              {/* {addrSSR && ( */}
              <div className="tradingTableTab flex-1">
                {defaultTabs === TradingTabType.ActiveTab && <TradeTable isProfile={true} />}

                {defaultTabs === TradingTabType.LimitOrderTab && <LimitOrdersTable isProfile={true} />}

                {defaultTabs === TradingTabType.HistoryTab && <HistoryTable isProfile={true} />}
              </div>
              {/* )} */}
            </>
          </div>
        </Flex>
      )}
    </>
  );
};
export default ProfileView;
