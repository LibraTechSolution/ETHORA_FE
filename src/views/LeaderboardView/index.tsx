'use client';
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { Select } from 'antd';
import Image from 'next/image';
import { ArrowForwardIcon, CalendarIcon } from '@chakra-ui/icons';
import { useEffect, useState } from 'react';
import { getLeaderboardOffset, getLeaderboards } from '@/services/leaderboard';
import { useAccount, useNetwork } from 'wagmi';
import { ILeaderBoardParams } from '@/types/leaderboard.type';
import { useQuery } from '@tanstack/react-query';
import { addComma } from '@/utils/number';
import { divide } from '@/utils/operationBigNumber';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import TableLeaderBoard from './conponent/tableLeaderBoard';
import CustomConnectButton from '@/components/CustomConnectButton';
import CountDownWithDay from './conponent/CountDownWithDay';
dayjs.extend(utc);
// import { Flex } from "@chakra-ui/react";

// export default function LeaderboardLayout({ children }: { children: React.ReactNode }) {
//   return <Flex color="white" marginX={'-20px'} height={'100%'}>aaaa{children}</Flex>;
// }
export enum TableTabType {
  Winners = 'Winners',
  Losers = 'Losers',
  Rate = 'Rate',
}

const defaultParams: ILeaderBoardParams = {
  offset: 0,
  type: 'daily',
  network: 421613,
};

const LeaderboardView = () => {
  const { Option } = Select;
  const { isConnected } = useAccount();
  const [defaultTabs, setDefaultTabs] = useState<TableTabType>(TableTabType.Winners);
  const [mounted, setMounted] = useState<boolean>(false);
  const [isDaily, setIsDaily] = useState<boolean>(true);

  const { chain } = useNetwork();
  const [filter, setFilter] = useState<ILeaderBoardParams>(defaultParams);
  const [listOffet, setListOffset] = useState<Array<string | number>>([]);
  const [selectedOffset, setSelectedOffset] = useState<number>();

  const { data: leaderBoardOffset, isSuccess } = useQuery({
    queryKey: ['getLeaderBoardOffset'],
    queryFn: () => getLeaderboardOffset(chain?.id ?? 5),
    onError: (error: any) => {
      // notification.error({ message: error.message });
      console.log(error);
    },
    enabled: isConnected,
    cacheTime: 0,
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    console.log(leaderBoardOffset);
    if (leaderBoardOffset && chain) {
      const offset = isDaily ? leaderBoardOffset?.data?.data?.dailyOffset : leaderBoardOffset?.data?.data?.weeklyOffset;
      setFilter({ offset, network: chain.id, type: isDaily ? 'daily' : 'weekly' });
      const tempList = new Array(offset).fill('');
      setListOffset(tempList);
      setSelectedOffset(offset);
    }
  }, [chain, isDaily, leaderBoardOffset]);

  const selecOffet = (offset: number) => {
    setFilter({ ...filter, offset });
    setSelectedOffset(offset);
  };

  console.log('isSuccess', isSuccess);

  const {
    data: leaderBoardData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['getLeaderBoard', filter],
    queryFn: () => getLeaderboards(filter),
    onError: (error: any) => {
      // notification.error({ message: error.message });
      console.log(error);
    },
    enabled: !!filter.offset,
    cacheTime: 0,
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });

  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  useEffect(() => {
    console.log(leaderBoardData);
    console.log(leaderBoardData?.summary?.endDate);
    console.log(dayjs().utc().unix());
    console.log(dayjs(leaderBoardData?.summary?.endDate).unix());
  }, [leaderBoardData]);

  useEffect(() => {
    setMounted(isConnected);
  }, [isConnected]);

  return (
    <Flex
      color="white"
      marginX={'-20px'}
      height={'100%'}
      flex={1}
      bgImage="url('/images/profile/bg-item.png')"
      bgRepeat="no-repeat"
      bgPosition="top -50px left -188px"
    >
      <Box flex={1} paddingX={{ base: '12px', lg: '80px' }}>
        <Box
          maxWidth={'450px'}
          marginX={'auto'}
          padding={'8px 16px'}
          background={'rgba(28, 28, 30,.5)'}
          marginBottom={'28px'}
          display={'flex'}
          alignItems={'center'}
        >
          <Image alt="avatar" src="/images/icons/thunder.svg" width={24} height={24} className="mr-2" /> The competition
          ends on {dayjs(leaderBoardData?.summary?.endDate).format('MM/DD/YYYY - hh:mm')} UTC
        </Box>
        <Flex justifyContent={'start'} alignItems={'center'} marginBottom={'28px'}>
          <Heading as="h3" textAlign={'center'} fontSize={'24px'} lineHeight={'36px'} fontWeight={'400'}>
            Leaderboard
          </Heading>
          <Select defaultValue="china" style={{ width: 120 }} onChange={handleChange} className="customSelect ml-3">
            <Option value="china" label="China">
              <div className="flex items-center">
                <Image
                  src="/images/networks/base.png"
                  width={14}
                  height={14}
                  alt="Avata"
                  className="mr-3 h-[14px] w-[14px]"
                />
                <span className="flex-1 text-left">Base</span>
              </div>
            </Option>
          </Select>
        </Flex>
        <Box display={'flex'} alignItems={'center'} justifyContent={'start'} marginBottom={'28px'}>
          <Box display={'flex'} alignItems={'center'}>
            Read the competition rules here!
            <ArrowForwardIcon boxSize={5} marginLeft={'12px'} />
          </Box>
        </Box>

        <Stack direction="row" spacing={4} align="center" display="flex" justifyContent={'start'} marginBottom={'20px'}>
          <Button
            borderBottom={isDaily ? '2px solid #1E3EF0' : 'none'}
            bgColor="transparent"
            color={isDaily ? '#1E3EF0' : '#6D6D70'}
            fontWeight="400"
            paddingX="12px"
            paddingY={'14px'}
            rounded={0}
            onClick={() => setIsDaily(true)}
            type="button"
            height={'50px'}
            _hover={{
              borderBottom: isDaily ? '2px solid #1E3EF0' : 'none',
              bgColor: 'transparent',
            }}
            _active={{
              borderBottom: isDaily ? '2px solid #1E3EF0' : 'none',
              bgColor: 'transparent',
            }}
          >
            Daily{' '}
            <span className="ml-2 inline-block rounded border border-[#2E60FF] px-2 py-1 font-normal text-[#2E60FF]">
              In Progress
            </span>
          </Button>
          <Button
            borderBottom={!isDaily ? '2px solid #1E3EF0' : 'none'}
            bgColor="transparent"
            color={!isDaily ? '#1E3EF0' : '#6D6D70'}
            fontWeight="400"
            paddingX="12px"
            paddingY={'14px'}
            rounded={0}
            onClick={() => setIsDaily(false)}
            type="button"
            height={'50px'}
            _hover={{
              borderBottom: !isDaily ? '2px solid #1E3EF0' : 'none',
              bgColor: 'transparent',
            }}
            _active={{
              borderBottom: !isDaily ? '2px solid #1E3EF0' : 'none',
              bgColor: 'transparent',
            }}
          >
            Weekly
            <span className="ml-2 inline-block rounded border border-[#9E9E9F] px-2 py-1 font-normal text-[#9E9E9F]">
              Ended
            </span>
          </Button>
        </Stack>
        <Flex w={'100%'} maxW={'1104px'} mx={'auto'} rowGap={3} flexWrap={'wrap'} marginBottom={'28px'}>
          <Center
            textAlign={'center'}
            padding={3}
            borderRight={'1px solid #242428'}
            flexShrink={1}
            flexGrow={1}
            flexBasis={'200px'}
          >
            <Flex direction={'column'} w={'100%'} display={'flex'} alignItems={'center'}>
              <Text fontSize={'sm'} marginBottom={'12px'} color={'#9E9E9F'}>
                Reward pool
              </Text>
              <Tooltip
                hasArrow
                label={
                  <Box p={1} color="white">
                    {addComma(divide(leaderBoardData?.summary?.totalRewardPool ?? 0, 6), 6)} USDC
                  </Box>
                }
                color="white"
                placement="top"
                bg="#050506"
              >
                <Text fontSize={'2xl'}>
                  {addComma(divide(leaderBoardData?.summary?.totalRewardPool ?? 0, 6), 2)} USDC
                </Text>
              </Tooltip>
            </Flex>
          </Center>
          <Center
            textAlign={'center'}
            padding={3}
            borderRight={{ base: 'none', lg: '1px solid #242428' }}
            flexShrink={1}
            flexGrow={1}
            flexBasis={'200px'}
          >
            <Flex direction={'column'} w={'100%'} display={'flex'} alignItems={'center'}>
              <Text fontSize={'sm'} color={'#9E9E9F'} marginBottom={'12px'}>
                Time Left
              </Text>
              {leaderBoardData?.summary?.endDate ? (
                <CountDownWithDay endTime={dayjs(leaderBoardData?.summary?.endDate).unix()} />
              ) : (
                '---'
              )}
            </Flex>
          </Center>
          <Center
            textAlign={'center'}
            padding={3}
            borderRight={'1px solid #242428'}
            flexShrink={1}
            flexGrow={1}
            flexBasis={'200px'}
          >
            <Flex direction={'column'} w={'100%'} display={'flex'} alignItems={'center'}>
              <Text fontSize={'sm'} marginBottom={'12px'} color={'#9E9E9F'}>
                Participants
              </Text>
              <Text fontSize={'2xl'}>{leaderBoardData?.summary?.totalUserTrades ?? 0}</Text>
            </Flex>
          </Center>
          <Center
            textAlign={'center'}
            padding={3}
            borderRight={{ base: 'none', lg: '1px solid #242428' }}
            flexShrink={1}
            flexGrow={1}
            flexBasis={'200px'}
          >
            <Flex direction={'column'} w={'100%'} display={'flex'} alignItems={'center'}>
              <Text fontSize={'sm'} marginBottom={'12px'} color={'#9E9E9F'}>
                No. of trades
              </Text>
              <Text fontSize={'2xl'}>{addComma(leaderBoardData?.summary?.totalTrades ?? 0, 2)}</Text>
            </Flex>
          </Center>
          <Center textAlign={'center'} padding={3} flexShrink={1} flexGrow={1} flexBasis={'200px'}>
            <Flex direction={'column'} w={'100%'} display={'flex'} alignItems={'center'}>
              <Text fontSize={'sm'} marginBottom={'12px'} color={'#9E9E9F'}>
                Volume
              </Text>
              <Tooltip
                hasArrow
                label={
                  <Box p={1} color="white">
                    {addComma(divide(leaderBoardData?.summary?.totalVolume ?? 0, 6), 6)} USDC
                  </Box>
                }
                color="white"
                placement="top"
                bg="#050506"
              >
                <Text fontSize={'2xl'}>{addComma(divide(leaderBoardData?.summary?.totalVolume ?? 0, 6), 2)} USDC</Text>
              </Tooltip>
            </Flex>
          </Center>
        </Flex>
        <Box maxW={{ base: 'calc(100vw - 12px)', md: 'calc(100vw - 64px)' }} marginBottom="12px">
          <Box
            width={'100%'}
            overflow={'overflow-auto'}
            backgroundColor={'#0C0C10'}
            padding={'0 20px'}
            borderTopLeftRadius={10}
            borderTopRightRadius={10}
            display={'flex'}
            justifyContent={'space-between'}
            alignItems={'center'}
          >
            <Flex gap={'16px'}>
              <Box
                className="mr-2"
                role="presentation"
                onClick={() => {
                  setDefaultTabs(TableTabType.Winners);
                }}
                borderBottom={'2px solid'}
                borderColor={defaultTabs === TableTabType.Winners ? '#1E3EF0' : 'transparent'}
                pointerEvents={defaultTabs === TableTabType.Winners ? 'none' : 'auto'}
                cursor={defaultTabs === TableTabType.Winners ? 'default' : 'pointer'}
                color={defaultTabs === TableTabType.Winners ? '#1E3EF0' : '#9E9E9F'}
                padding={'20px 0'}
              >
                Winners (by PnL)
              </Box>
              <Box
                className="mr-2"
                role="presentation"
                onClick={() => {
                  setDefaultTabs(TableTabType.Losers);
                }}
                borderBottom={'2px solid'}
                borderColor={defaultTabs === TableTabType.Losers ? '#1E3EF0' : 'transparent'}
                pointerEvents={defaultTabs === TableTabType.Losers ? 'none' : 'auto'}
                cursor={defaultTabs === TableTabType.Losers ? 'default' : 'pointer'}
                color={defaultTabs === TableTabType.Losers ? '#1E3EF0' : '#9E9E9F'}
                padding={'20px 0'}
              >
                Losers (by PnL)
              </Box>
              {!isDaily && (
                <Box
                  className="mr-2"
                  role="presentation"
                  onClick={() => {
                    setDefaultTabs(TableTabType.Rate);
                  }}
                  borderBottom={'2px solid'}
                  borderColor={defaultTabs === TableTabType.Rate ? '#1E3EF0' : 'transparent'}
                  pointerEvents={defaultTabs === TableTabType.Rate ? 'none' : 'auto'}
                  cursor={defaultTabs === TableTabType.Rate ? 'default' : 'pointer'}
                  color={defaultTabs === TableTabType.Rate ? '#1E3EF0' : '#9E9E9F'}
                  padding={'20px 0'}
                >
                  Winners (by Win rate)
                </Box>
              )}
            </Flex>
            <Box>
              <Menu>
                <MenuButton
                  as={Button}
                  rightIcon={<CalendarIcon />}
                  border={'1px solid #1E3EF0'}
                  backgroundColor={'transparent'}
                  color={'#1E3EF0'}
                  _hover={{ bgColor: 'transparent', border: '1px solid #1E3EF0' }}
                  _active={{ bgColor: 'transparent', border: '1px solid #1E3EF0' }}
                >
                  #{selectedOffset}
                </MenuButton>
                <MenuList
                  backgroundColor={'#252528'}
                  boxShadow={'0px 3px 20px 0px rgba(0, 0, 0, 0.65)'}
                  border={'none'}
                  h="200px"
                  overflow="auto"
                >
                  {listOffet.map((item: string | number, index: number) => (
                    <MenuItem
                      key={`${index}-offset`}
                      backgroundColor={'#252528'}
                      onClick={() => selecOffet(listOffet.length - index)}
                    >
                      #{listOffet.length - index}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </Box>
          </Box>
          <Center>
            <CustomConnectButton>
              <></>
            </CustomConnectButton>
          </Center>
          {mounted && (
            <Box className="tradingTableTab">
              <TableLeaderBoard
                data={
                  defaultTabs === TableTabType.Winners
                    ? leaderBoardData?.winners
                    : defaultTabs === TableTabType.Losers
                    ? leaderBoardData?.losers
                    : leaderBoardData?.winnersWinrate
                }
                isWinnderByRate={defaultTabs === TableTabType.Rate}
                loading={isLoading}
              />
            </Box>
          )}
        </Box>
      </Box>
    </Flex>
  );
};

export default LeaderboardView;
