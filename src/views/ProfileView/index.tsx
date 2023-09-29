'use client';
import { CustomTable } from '@/components/CustomTable';
import { formatAddress } from '@/utils/address';
import { useGetPosts } from '@/views/ProfileView/Profile.queries';
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  Link,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';

import { createColumnHelper } from '@tanstack/react-table';
import Image from 'next/image';
import { useAccount } from 'wagmi';
import { ExternalLink } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export type Person = {
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  progress: number;
  status: 'relationship' | 'complicated' | 'single';
  subRows?: Person[];
};
const ProfileView = () => {
  const { data: dataRank, error, isLoading, isSuccess } = useGetPosts();
  const { address } = useAccount();

  const dailyRank = dataRank?.userStatsDaily.find((o: any) => o?.user === address);
  const weekRank = dataRank?.userStatsWeekly.find((o: any) => o?.user === address);
  console.log(dataRank);

  function winnerCounter(inputs: any[]) {
    let counter = 0;
    for (let i = 0; i < inputs?.length; i++) {
      if (inputs[i].payout) counter++;
    }
    return counter;
  }
  console.log(winnerCounter(dataRank?.userOptionDatas));
  // const FindWallet = (arr: []) => {
  //   arr.find((o) => o?.user === 'string 1');
  // };
  // type UnitConversion = {
  //   fromUnit: string;
  //   toUnit: string;
  //   factor: number;
  // };

  // const data: UnitConversion[] = [
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

  // const columnHelper = createColumnHelper<UnitConversion>();

  // const columns = [
  //   columnHelper.accessor('fromUnit', {
  //     cell: (info) => info.getValue(),
  //     header: 'To convert',
  //   }),
  //   columnHelper.accessor('toUnit', {
  //     cell: (info) => info.getValue(),
  //     header: 'Into',
  //   }),
  //   columnHelper.accessor('factor', {
  //     cell: (info) => info.getValue(),
  //     header: 'Multiply by',
  //     meta: {
  //       isNumeric: true,
  //     },
  //   }),
  // ];

  return (
    <Flex
      gap={10}
      direction={'column'}
      bgImage="url('/images/profile/bg-item.png')"
      bgRepeat="no-repeat"
      bgPosition="top -87px left 45px"
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
          {address ? (
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
                {formatAddress(address)}
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
            <Text fontSize={'sm'}>Chain</Text>
            <Box>Chain Selected</Box>
          </Flex>
        </GridItem>
        <GridItem textAlign={'center'} padding={3} borderRight={{ md: '1px solid #242428', lg: '1px solid #242428' }}>
          <Flex direction={'column'} w={'100%'} display={'flex'} alignItems={'center'}>
            <Text fontSize={'sm'}>Daily Rank</Text>
            <Text fontSize={'2xl'}>{dailyRank?.volume ? dailyRank.volume : '---'}</Text>
          </Flex>
        </GridItem>
        <GridItem
          textAlign={'center'}
          padding={3}
          borderRight={{ base: 'none', sm: '1px solid #242428', md: 'none', lg: '1px solid #242428' }}
        >
          <Flex direction={'column'} w={'100%'} display={'flex'} alignItems={'center'}>
            <Text fontSize={'sm'}>Weekly Rank</Text>
            <Text fontSize={'2xl'}>{weekRank?.volume ? weekRank.volume : '---'}</Text>
          </Flex>
        </GridItem>
        <GridItem textAlign={'center'} padding={3} borderRight={{ md: '1px solid #242428', lg: '1px solid #242428' }}>
          <Flex direction={'column'} w={'100%'} display={'flex'} alignItems={'center'}>
            <Text fontSize={'sm'}>Win Rate</Text>
            <Text fontSize={'2xl'}>
              {dataRank?.userOptionDatas && dataRank?.userOptionDatas.length
                ? (+winnerCounter(dataRank?.userOptionDatas) / +dataRank?.userOptionDatas.length) * 100
                : '00.0'}
              %
            </Text>
          </Flex>
        </GridItem>
        <GridItem textAlign={'center'} padding={3} borderRight={{ sm: '1px solid #242428' }}>
          <Flex direction={'column'} w={'100%'} display={'flex'} alignItems={'center'}>
            <Text fontSize={'sm'}>Won</Text>
            <Text fontSize={'2xl'}>
              {winnerCounter(dataRank?.userOptionDatas)}/{dataRank?.userOptionDatas.length} trades
            </Text>
          </Flex>
        </GridItem>
        <GridItem textAlign={'center'} padding={3}>
          <Flex direction={'column'} w={'100%'} display={'flex'} alignItems={'center'}>
            <Text fontSize={'sm'}>Most Traded Asset</Text>
            <Text fontSize={'2xl'}>--</Text>
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

        {address ? (
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
          // <p>aaa</p>
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
            <Text fontSize={'sm'} color={'white'} fontWeight={600} marginBottom={'40px'}>
              Referral Metrics
            </Text>
            {address ? (
              address
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
            <Text fontSize={'sm'} color={'white'} fontWeight={600} marginBottom={'40px'}>
              USDC Trading Metrics
            </Text>
            {address ? (
              address
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

        <Tabs>
          <TabList borderBottom={'none'}>
            <Tab>One</Tab>
            <Tab>Two</Tab>
            <Tab>Three</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <p>one!</p>
            </TabPanel>
            <TabPanel>
              <p>two!</p>
            </TabPanel>
            <TabPanel>
              <p>three!</p>
            </TabPanel>
          </TabPanels>
        </Tabs>

        {/* <CustomTable columns={columns} data={data} onPaginationChange={(data) => console.log(data)} /> */}
      </div>
    </Flex>
  );
};
export default ProfileView;
