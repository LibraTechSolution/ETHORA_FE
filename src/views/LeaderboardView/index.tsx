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
  useMediaQuery,
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

enum StatusType {
  Coming = 'Coming soon',
  InProgress = 'In Progress',
  Ended = 'Ended',
}

interface StatusProp {
  start: string;
  end: string;
  isMobile?: boolean;
  setDisable: (isDisabled: boolean) => void;
}

const ShowStatus = (props: StatusProp) => {
  const { start, end, setDisable, isMobile } = props;
  const [text, setText] = useState('');

  useEffect(() => {
    if (!start || !end) {
      return;
    }
    setInterval(() => {
      if (dayjs(start).unix() > dayjs().unix()) {
        setDisable(true);
        setText(StatusType.Coming);
      }
      if (dayjs(start).unix() < dayjs().unix() && dayjs(end).unix() > dayjs().unix()) {
        setDisable(false);
        setText(StatusType.InProgress);
      }
      if (dayjs(end).unix() < dayjs().unix()) {
        setDisable(false);
        setText(StatusType.Ended);
      }
    }, 1000);
  }, [end, setDisable, start]);

  return (
    <>
      {!isMobile && text && (
        <Text
          className="ml-2 inline-block rounded border px-2 py-1 font-normal"
          background={
            text === StatusType.Coming
              ? 'rgba(255, 190, 0, 0.10) '
              : text === StatusType.InProgress
              ? 'rgba(46, 96, 255, 0.10)'
              : 'rgba(109, 109, 112, 0.10)'
          }
          borderColor={text === StatusType.Coming ? '#FFA500' : text === StatusType.InProgress ? '#2E60FF' : '#9E9E9F'}
          textColor={text === StatusType.Coming ? '#FFA500' : text === StatusType.InProgress ? '#2E60FF' : '#9E9E9F'}
        >
          {text}
        </Text>
      )}
    </>
  );
};

const LeaderboardView = () => {
  const { Option } = Select;
  const [defaultTabs, setDefaultTabs] = useState<TableTabType>(TableTabType.Winners);
  const [isDaily, setIsDaily] = useState<boolean>(true);

  const [filter, setFilter] = useState<ILeaderBoardParams>(defaultParams);
  const [listOffet, setListOffset] = useState<Array<string | number>>([]);
  const [selectedOffset, setSelectedOffset] = useState<number>();
  const [isMobile] = useMediaQuery('(max-width: 768px)');
  const [startTime, setStartTime] = useState<string>();
  const [endTime, setEndTime] = useState<string>();
  const [isDisableDaily, setIsDisableDaily] = useState<boolean>(true);
  const [isDisableWeekly, setIsDisableWeekly] = useState<boolean>(true);

  const { data: leaderBoardOffset } = useQuery({
    queryKey: ['getLeaderBoardOffset'],
    queryFn: () => getLeaderboardOffset(421613),
    onError: (error: any) => {
      // notification.error({ message: error.message });
      console.log(error);
    },
    cacheTime: 0,
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (leaderBoardOffset) {
      const offset = isDaily ? leaderBoardOffset?.data?.data?.dailyOffset : leaderBoardOffset?.data?.data?.weeklyOffset;
      setFilter({ offset, network: 421613, type: isDaily ? 'daily' : 'weekly' });
      const tempList = new Array(offset).fill('');
      setListOffset(tempList);
      setSelectedOffset(offset);
    }
  }, [isDaily, leaderBoardOffset]);

  const selecOffet = (offset: number) => {
    setFilter({ ...filter, offset });
    setSelectedOffset(offset);
  };

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
    if (isDisableDaily && !isDisableWeekly) {
      setIsDaily(false);
    }
  }, [isDisableDaily, isDisableWeekly]);

  useEffect(() => {
    console.log(leaderBoardData);
    if (
      !leaderBoardData ||
      !leaderBoardData?.config ||
      !leaderBoardData?.config?.dailyStart ||
      !leaderBoardData?.config?.weeklyStart ||
      !leaderBoardData?.config?.dailyEnd ||
      !leaderBoardData?.config?.weeklyEnd
    ) {
      return;
    }
    setStartTime(isDaily ? leaderBoardData.config.dailyStart : leaderBoardData.config.weeklyStart);
    setEndTime(isDaily ? leaderBoardData.config.dailyEnd : leaderBoardData.config.weeklyEnd);
  }, [isDaily, leaderBoardData]);

  return (
    <Flex
      color="white"
      marginX={'-12px'}
      height={'100%'}
      flex={1}
      bgImage="url('/images/profile/bg-item.png')"
      bgRepeat="no-repeat"
      bgPosition="top -50px left -188px"
    >
      <Box flex={1} paddingX={{ base: '12px', lg: '80px' }}>
        {(!isDisableDaily || !isDisableWeekly) && (
          <Box
            maxWidth={'450px'}
            marginX={'auto'}
            padding={'8px 16px'}
            background={'rgba(28, 28, 30,.5)'}
            display={'flex'}
            alignItems={'center'}
          >
            <Image alt="avatar" src="/images/icons/thunder.svg" width={24} height={24} className="mr-2" /> The
            competition {dayjs(endTime).unix() < dayjs().unix() ? 'ended' : 'ends'} on{' '}
            {dayjs(endTime).utc().format('MM/DD/YYYY - HH:mm')} UTC
          </Box>
        )}
        {isMobile && (
          <Stack
            direction="row"
            spacing={0}
            align="center"
            display="flex"
            justifyContent={'start'}
            margin={'28px auto 0'}
            background={'#050506'}
            rounded={'10px'}
            width={'300px'}
          >
            <Button
              // borderBottom={isDaily ? '2px solid #1E3EF0' : 'none'}
              bgColor={isDaily ? '#1E3EF0' : 'transparent'}
              color={isDaily ? '#ffffff' : '#1E3EF0'}
              fontWeight="600"
              fontSize={'16px'}
              paddingX="7px"
              paddingY={'14px'}
              rounded={'10px'}
              onClick={() => setIsDaily(true)}
              type="button"
              height={'50px'}
              _hover={{
                bgColor: isDaily ? '#1E3EF0' : 'transparent',
                color: isDaily ? '#ffffff' : '#1E3EF0',
              }}
              // _active={{
              //   borderBottom: isDaily ? '2px solid #1E3EF0' : 'none',
              //   bgColor: 'transparent',
              // }}
              flex={1}
            >
              Daily{' '}
              <ShowStatus
                isMobile={true}
                start={leaderBoardData?.config?.dailyStart ?? ''}
                end={leaderBoardData?.config?.dailyEnd ?? ''}
                setDisable={(isDisable) => setIsDisableDaily(isDisable)}
              />
              {/* <span className="ml-2 inline-block rounded border border-[#2E60FF] px-2 py-1 font-normal text-[#2E60FF]">
              In Progress
            </span> */}
            </Button>
            <Button
              // borderBottom={!isDaily ? '2px solid #1E3EF0' : 'none'}
              bgColor={!isDaily ? '#1E3EF0' : 'transparent'}
              color={!isDaily ? '#ffffff' : '#1E3EF0'}
              fontWeight="600"
              fontSize={'16px'}
              paddingX="7px"
              paddingY={'14px'}
              rounded={'10px'}
              onClick={() => setIsDaily(false)}
              type="button"
              height={'50px'}
              _hover={{
                bgColor: !isDaily ? '#1E3EF0' : 'transparent',
                color: !isDaily ? '#ffffff' : '#1E3EF0',
              }}
              // _active={{
              //   borderBottom: !isDaily ? '2px solid #1E3EF0' : 'none',
              //   bgColor: 'transparent',
              // }}
              flex={1}
            >
              Weekly{' '}
              <ShowStatus
                isMobile={true}
                start={leaderBoardData?.config?.weeklyStart ?? ''}
                end={leaderBoardData?.config?.weeklyEnd ?? ''}
                setDisable={(isDisable) => setIsDisableDaily(isDisable)}
              />
              {/* <span className="ml-2 inline-block rounded border border-[#9E9E9F] px-2 py-1 font-normal text-[#9E9E9F]">
              Ended
            </span> */}
            </Button>
          </Stack>
        )}
        <Flex
          alignItems={'center'}
          marginBottom={'28px'}
          justifyContent={{ base: 'center', md: 'flex-start' }}
          marginTop={'28px'}
        >
          <Heading as="h3" textAlign={'center'} fontSize={'24px'} lineHeight={'36px'} fontWeight={'400'}>
            Leaderboard
          </Heading>
          <Select defaultValue="china" style={{ width: 120 }} onChange={handleChange} className="customSelect ml-3">
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
        </Flex>
        <Box
          display={'flex'}
          alignItems={'center'}
          justifyContent={{ base: 'center', md: 'flex-start' }}
          marginBottom={'28px'}
        >
          <Box display={'flex'} alignItems={'center'}>
            Read the competition rules here!
            <ArrowForwardIcon boxSize={5} marginLeft={'12px'} />
          </Box>
        </Box>

        {!isMobile && (
          <Stack
            direction="row"
            spacing={4}
            align="center"
            display="flex"
            justifyContent={'start'}
            marginBottom={'20px'}
          >
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
              isDisabled={isDisableDaily}
              _disabled={{
                bgColor: 'transparent',
                borderBottom: 'none',
                color: '#6D6D70',
              }}
            >
              Daily{' '}
              <ShowStatus
                start={leaderBoardData?.config?.dailyStart ?? ''}
                end={leaderBoardData?.config?.dailyEnd ?? ''}
                setDisable={(isDisable) => setIsDisableDaily(isDisable)}
              />
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
              _disabled={{
                bgColor: 'transparent',
                borderBottom: 'none',
                color: '#6D6D70',
              }}
              isDisabled={isDisableWeekly}
            >
              Weekly{' '}
              <ShowStatus
                start={leaderBoardData?.config?.weeklyStart ?? ''}
                end={leaderBoardData?.config?.weeklyEnd ?? ''}
                setDisable={(isDisable) => setIsDisableWeekly(isDisable)}
              />
            </Button>
          </Stack>
        )}
        {(!isDisableDaily || !isDisableWeekly) && (
          <>
            <Flex w={'100%'} maxW={'1104px'} mx={'auto'} rowGap={3} flexWrap={'wrap'} marginBottom={'28px'}>
              <Center
                textAlign={'center'}
                padding={3}
                borderRight={'1px solid #242428'}
                flexShrink={1}
                flexGrow={1}
                flexBasis={{ base: '50%', md: '25%', lg: '20%' }}
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
                flexBasis={{ base: '50%', md: '25%', lg: '20%' }}
              >
                <Flex direction={'column'} w={'100%'} display={'flex'} alignItems={'center'}>
                  <Text fontSize={'sm'} color={'#9E9E9F'} marginBottom={'12px'}>
                    Time Left
                  </Text>
                  {endTime ? <CountDownWithDay endTime={dayjs(endTime).unix()} /> : '---'}
                </Flex>
              </Center>
              <Center
                textAlign={'center'}
                padding={3}
                borderRight={'1px solid #242428'}
                flexShrink={1}
                flexGrow={1}
                flexBasis={{ base: '50%', md: '25%', lg: '20%' }}
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
                flexBasis={{ base: '50%', md: '25%', lg: '20%' }}
              >
                <Flex direction={'column'} w={'100%'} display={'flex'} alignItems={'center'}>
                  <Text fontSize={'sm'} marginBottom={'12px'} color={'#9E9E9F'}>
                    No. of trades
                  </Text>
                  <Text fontSize={'2xl'}>{addComma(leaderBoardData?.summary?.totalTrades ?? 0, 2)}</Text>
                </Flex>
              </Center>
              <Center
                textAlign={'center'}
                padding={3}
                flexShrink={1}
                flexGrow={1}
                flexBasis={{ base: '50%', md: '25%', lg: '20%' }}
              >
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
                    <Text fontSize={'2xl'}>
                      {addComma(divide(leaderBoardData?.summary?.totalVolume ?? 0, 6), 2)} USDC
                    </Text>
                  </Tooltip>
                </Flex>
              </Center>
            </Flex>
            <Box float={'right'} marginBottom={'8px'} display={{ base: 'block', sm: 'none' }}>
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
            <Box maxW={{ base: 'calc(100vw - 30px)', md: 'calc(100vw - 64px)' }} marginBottom="12px">
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
                <Box display={{ base: 'none', sm: 'block' }}>
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
            </Box>
          </>
        )}
      </Box>
    </Flex>
  );
};

export default LeaderboardView;
