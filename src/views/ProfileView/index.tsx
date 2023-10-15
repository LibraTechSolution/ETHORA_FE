'use client';
import { formatAddress } from '@/utils/address';
import { useGetPosts } from '@/views/ProfileView/Profile.queries';
import { Box, Button, Flex, Grid, GridItem, Heading, Link, Text } from '@chakra-ui/react';

import Image from 'next/image';
import { useAccount } from 'wagmi';
import { ExternalLink } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useEffect, useState } from 'react';
import HistoryTab from './conponents/historyTab';
import ActiveTab from './conponents/activeTab';
import LimitOrderTab from './conponents/limitOrderTab';
import { addComma } from '@/utils/number';
import { Select, Space } from 'antd';

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
  const { data: dataRank, error, isLoading, isSuccess } = useGetPosts();
  const { address } = useAccount();
  const [addrSSR, setAddrSSR] = useState<`0x${string}` | undefined>();
  const [defaultTabs, setDefaultTabs] = useState<TradingTabType>(TradingTabType.ActiveTab);
  // copy the value to state here
  useEffect(() => {
    setAddrSSR(address);
  }, [address]);

  const dailyRankIndex = dataRank?.userStatsDaily.findIndex((object: any) => {
    return object.user === address;
  });

  const weekRankIndex = dataRank?.userStatsWeekly.findIndex((object: any) => {
    return object.user === address;
  });

  //Most Traded Asset Đếm đồng nào nhiều hơn
  function winnerCounter(inputs: any[]) {
    let counter = 0;
    for (let i = 0; i < inputs?.length; i++) {
      if (inputs[i].payout) counter++;
    }
    return counter;
  }

  const shortAsset = () => {
    const countAsset = dataRank?.userOptionDatas.reduce((assets: any, item: any) => {
      const asset = item.optionContract.asset;
      if (assets[asset]) {
        assets[asset] += 1;
      } else {
        assets[asset] = 1;
      }
      return assets;
    }, {});

    const sort =
      countAsset &&
      Object.keys(countAsset).sort(function (a, b) {
        return countAsset[b] - countAsset[a];
      });
    return sort;
  };

  const getTradingMatric = (arr: any[], token: string) => {
    const allTradingWithToken = arr?.filter((item) => item?.optionContract.token === token);
    const totalPayout = allTradingWithToken?.reduce(function (acc, item) {
      return acc + +item.payout;
    }, 0); //totalPayouts
    const totalFee = allTradingWithToken?.reduce(function (acc, item) {
      return acc + +item.totalFee;
    }, 0); // volume
    const netPnl = totalPayout - totalFee; // net_pnl
    return {
      totalPayout,
      totalFee,
      netPnl,
    };
  };
  getTradingMatric(dataRank?.userOptionDatas, 'USDC');
  // const FindWallet = (arr: []) => {
  //   arr.find((o) => o?.user === 'string 1');
  // };

  // const data: TradingTable[] = [
  //   {
  //     fromUnit: 'inches',
  //     toUnit: 'millimetres (mm)',
  //     factor: 25.4,
  //   },
  //   {
  //     fromUnit: 'feet',
  //     toUnit: 'centimetres (cm)',
  //     factor: 30.48,
  //   },
  //   {
  //     fromUnit: 'yards',
  //     toUnit: 'metres (m)',
  //     factor: 0.91444,
  //   },
  // ];

  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  return (
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
        <Box w={'64px'} h={'64px'} borderRadius={'100%'} overflow={'hidden'} bg={'yellow'}>
          <Image src="/images/profile/avatar.png" width={64} height={64} alt="Avata" />
        </Box>
        <Box>
          {addrSSR ? (
            <Link
              href="https://chakra-ui.com"
              isExternal
              fontSize={'20px'}
              fontWeight={600}
              color={'#6052FB'}
              display={'flex'}
              alignItems={'center'}
            >
              <Box as={'span'} marginRight={2}>
                {formatAddress(addrSSR)}
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
        templateColumns={{ base: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(6, 1fr)' }}
        mx={'auto'}
        rowGap={3}
      >
        <GridItem textAlign={'center'} padding={3} borderRight={{ sm: '1px solid #242428' }}>
          <Flex direction={'column'} w={'100%'} display={'flex'} alignItems={'center'}>
            <Text fontSize={'sm'} marginBottom={'12px'}>Chain</Text>
            <Box>
              {addrSSR && (
                <Select defaultValue="china" style={{ width: 120 }} onChange={handleChange} className='customSelect'>
                  <Option value="china" label="China">
                    <div className="flex items-center">
                      <Image
                        src="/images/networks/base.png"
                        width={14}
                        height={14}
                        alt="Avata"
                        className="h-[14px] w-[14px] mr-3"
                      />
                      <span className='flex-1 text-left'>Base</span>
                    </div>
                  </Option>
                </Select>
              )}
            </Box>
          </Flex>
        </GridItem>
        <GridItem textAlign={'center'} padding={3} borderRight={{ md: '1px solid #242428', lg: '1px solid #242428' }}>
          <Flex direction={'column'} w={'100%'} display={'flex'} alignItems={'center'}>
            <Text fontSize={'sm'} marginBottom={'12px'}>
              Daily Rank
            </Text>
            <Text fontSize={'2xl'}>{dailyRankIndex >= 0 ? +dailyRankIndex + 1 : '---'}</Text>
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
            <Text fontSize={'2xl'}>{weekRankIndex >= 0 ? weekRankIndex + 1 : '---'}</Text>
          </Flex>
        </GridItem>
        <GridItem textAlign={'center'} padding={3} borderRight={{ md: '1px solid #242428', lg: '1px solid #242428' }}>
          <Flex direction={'column'} w={'100%'} display={'flex'} alignItems={'center'}>
            <Text fontSize={'sm'} marginBottom={'12px'}>
              Win Rate
            </Text>
            <Text fontSize={'2xl'}>
              {dataRank?.userOptionDatas && dataRank?.userOptionDatas.length
                ? ((+winnerCounter(dataRank?.userOptionDatas) / +dataRank?.userOptionDatas.length) * 100).toFixed(2)
                : '00.0'}
              %
            </Text>
          </Flex>
        </GridItem>
        <GridItem textAlign={'center'} padding={3} borderRight={{ sm: '1px solid #242428' }}>
          <Flex direction={'column'} w={'100%'} display={'flex'} alignItems={'center'}>
            <Text fontSize={'sm'} marginBottom={'12px'}>
              Won
            </Text>
            <Text fontSize={'2xl'}>
              {winnerCounter(dataRank?.userOptionDatas)}/{dataRank?.userOptionDatas.length} trades
            </Text>
          </Flex>
        </GridItem>
        <GridItem textAlign={'center'} padding={3}>
          <Flex direction={'column'} w={'100%'} display={'flex'} alignItems={'center'}>
            <Text fontSize={'sm'} marginBottom={'12px'}>
              Most Traded Asset
            </Text>
            <Text fontSize={'2xl'}>{shortAsset() ? shortAsset()[0] : '---'}</Text>
          </Flex>
        </GridItem>
      </Grid>

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
          bg={'#6052FB'}
          marginX={{ base: 'auto', sm: 'initial' }}
        />
        <Box>
          <Heading as="h4" fontSize={20} lineHeight={'30px'} color={'white'}>
            Invite your friends to join Ethora now!
          </Heading>
          <Text>Get fee discounts and rebates!</Text>
        </Box>

        {addrSSR ? (
          <Button
            colorScheme="primary"
            fontSize={'16px'}
            size="md"
            marginLeft={'auto'}
            flex={{ base: '1', sm: '1', md: 'none' }}
            flexBasis={{ base: '142px', sm: '142px', md: 'auto' }}
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
            <ConnectButton />
          </Box>
        )}
      </Flex>

      <div>
        <Heading as="h4" fontSize={24} lineHeight={'36px'} color={'white'} fontWeight={600} marginBottom={'20px'}>
          Metrics
        </Heading>
        <Grid
          templateColumns={{ base: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(2, 1fr)' }}
          gap="25px"
        >
          <GridItem padding={5} borderRadius={'20px'} backgroundColor={'#3D3D40'} minH={'200px'}>
            <Text fontSize={'sm'} color={'white'} fontWeight={600} marginBottom={'20px'}>
              Referral Metrics
            </Text>
            {addrSSR ? (
              <Box flexDirection={'column'}>
                <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} marginBottom={'8px'}>
                  <Text as="span" fontSize={'xs'}>
                    Total Referral Earnings
                  </Text>
                  <Text as="span" textColor={'white'}>
                    0.00 USDC
                  </Text>
                </Box>
                <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} marginBottom={'8px'}>
                  <Text as="span" fontSize={'xs'}>
                    Referral Trading Volume
                  </Text>
                  <Text as="span" textColor={'white'}>
                    0.00 USDC
                  </Text>
                </Box>
                <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} marginBottom={'8px'}>
                  <Text as="span" fontSize={'xs'}>
                    Referral # of Trades
                  </Text>
                  <Text as="span" textColor={'white'}>
                    0.00 USDC
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
                  <Image src="/images/profile/notConnectWallet.png" width={80} height={80} alt="Avata" />
                </Box>
                <Text size={'sm'}>Wallet not connected.</Text>
              </Flex>
            )}
          </GridItem>

          <GridItem padding={5} borderRadius={'20px'} backgroundColor={'#3D3D40'} minH={'200px'}>
            <Text fontSize={'sm'} color={'white'} fontWeight={600} marginBottom={'20px'}>
              USDC Trading Metrics
            </Text>
            {addrSSR ? (
              <Box flexDirection={'column'}>
                <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} marginBottom={'8px'}>
                  <Text as="span" fontSize={'xs'}>
                    Total Payout
                  </Text>
                  <Text as="span" textColor={'white'}>
                    {addComma(getTradingMatric(dataRank?.userOptionDatas, 'USDC').totalPayout)} USDC
                  </Text>
                </Box>
                <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} marginBottom={'8px'}>
                  <Text as="span" fontSize={'xs'}>
                    Net PnL
                  </Text>
                  <Text
                    as="span"
                    textColor={`${
                      getTradingMatric(dataRank?.userOptionDatas, 'USDC').netPnl >= 0 ? '#1ED768' : '#F03D3E'
                    } `}
                  >
                    {addComma(getTradingMatric(dataRank?.userOptionDatas, 'USDC').netPnl)} USDC
                  </Text>
                </Box>
                <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} marginBottom={'8px'}>
                  <Text as="span" fontSize={'xs'}>
                    Open Interest
                  </Text>
                  <Text as="span" textColor={'white'}>
                    00.0 USDC
                  </Text>
                </Box>
                <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} marginBottom={'8px'}>
                  <Text as="span" fontSize={'xs'}>
                    Volume
                  </Text>
                  <Text as="span" textColor={'white'}>
                    {addComma(getTradingMatric(dataRank?.userOptionDatas, 'USDC').totalFee)} USDC
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
                  <Image src="/images/profile/notConnectWallet.png" width={80} height={80} alt="Avata" />
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
                borderColor={defaultTabs === TradingTabType.ActiveTab ? '#6052FB' : 'transparent'}
                pointerEvents={defaultTabs === TradingTabType.ActiveTab ? 'none' : 'auto'}
                cursor={defaultTabs === TradingTabType.ActiveTab ? 'default' : 'pointer'}
                color={defaultTabs === TradingTabType.ActiveTab ? '#6052FB' : '#9E9E9F'}
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
                borderColor={defaultTabs === TradingTabType.LimitOrderTab ? '#6052FB' : 'transparent'}
                pointerEvents={defaultTabs === TradingTabType.LimitOrderTab ? 'none' : 'auto'}
                cursor={defaultTabs === TradingTabType.LimitOrderTab ? 'default' : 'pointer'}
                color={defaultTabs === TradingTabType.LimitOrderTab ? '#6052FB' : '#9E9E9F'}
              >
                Limit Order
              </Box>
              <Box
                className="mr-2"
                role="presentation"
                onClick={() => {
                  setDefaultTabs(TradingTabType.HistoryTab);
                }}
                borderBottom={'2px solid'}
                borderColor={defaultTabs === TradingTabType.HistoryTab ? '#6052FB' : 'transparent'}
                pointerEvents={defaultTabs === TradingTabType.HistoryTab ? 'none' : 'auto'}
                cursor={defaultTabs === TradingTabType.HistoryTab ? 'default' : 'pointer'}
                color={defaultTabs === TradingTabType.HistoryTab ? '#6052FB' : '#9E9E9F'}
              >
                HistoryTab
              </Box>
            </Flex>
          </Box>
          {addrSSR && (
            <div className="flex-1">
              {defaultTabs === TradingTabType.ActiveTab && <ActiveTab />}

              {defaultTabs === TradingTabType.LimitOrderTab && <LimitOrderTab />}

              {defaultTabs === TradingTabType.HistoryTab && <HistoryTab />}
            </div>
          )}
        </>
      </div>
    </Flex>
  );
};
export default ProfileView;
