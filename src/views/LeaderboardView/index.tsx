'use client';
import { Box, Button, Center, Flex, Heading, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react';
import { Select } from 'antd';
import Image from 'next/image';
import { ArrowForwardIcon, CalendarIcon } from '@chakra-ui/icons';
import { useEffect, useState } from 'react';
import TableLosers from './conponent/tableLosers';
import TableWinners from './conponent/tableWinners';
import { CalendaDayIcon } from 'public/images/icons/calendaDayIcon';
import { CalendaWeekIcon } from 'public/images/icons/calendaWeekIcon';
// import { Flex } from "@chakra-ui/react";

// export default function LeaderboardLayout({ children }: { children: React.ReactNode }) {
//   return <Flex color="white" marginX={'-20px'} height={'100%'}>aaaa{children}</Flex>;
// }
export enum TableTabType {
  Winners = 'Winners',
  Losers = 'Losers',
}

const LeaderboardView = () => {
  const { Option } = Select;
  const [defaultTabs, setDefaultTabs] = useState<TableTabType>(TableTabType.Winners);
  const [mounted, SetMounted] = useState<boolean>(false);

  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  useEffect(() => {
    SetMounted(true);
  }, []);

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
      <Box width={'234px'} background={'rgba(28, 28, 30,.5)'} padding={'20px 0'}>
        <Flex alignItems={'center'} padding={'0 8px 0 20px'} justifyContent={'space-between'} marginBottom={'20px'}>
          <Box display={'flex'} alignItems={'center'}>
            <CalendaDayIcon fill="#9E9E9F" />
            <Text marginLeft={'8px'} color={'#9E9E9F'}>
              Daily
            </Text>
          </Box>
          <Box backgroundColor={'#252528'} color={'#9E9E9F'} fontSize={'12px'} padding={'2px 8px'} borderRadius={'4px'}>
            Ended
          </Box>
        </Flex>
        <Flex alignItems={'center'} padding={'0 8px 0 20px'} justifyContent={'space-between'} marginBottom={'20px'}>
          <Box display={'flex'} alignItems={'center'}>
            <CalendaWeekIcon fill="#9E9E9F" />
            <Text marginLeft={'8px'} color={'#9E9E9F'}>
              Weekly
            </Text>
          </Box>
          <Box backgroundColor={'#252528'} color={'#9E9E9F'} fontSize={'12px'} padding={'2px 8px'} borderRadius={'4px'}>
            Ended
          </Box>
        </Flex>
      </Box>

      <Box flex={1} paddingX={'80px'}>
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
          ends on MM/DD/YYYY - hh:mm UTC
        </Box>
        <Heading
          as="h3"
          textAlign={'center'}
          fontSize={'24px'}
          lineHeight={'36px'}
          fontWeight={'400'}
          marginBottom={'28px'}
        >
          Leaderboard
        </Heading>
        <Box display={'flex'} alignItems={'center'} justifyContent={'center'} marginBottom={'28px'}>
          {mounted && (
            <Select defaultValue="china" style={{ width: 120 }} onChange={handleChange} className="customSelect">
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
          )}
          <Box display={'flex'} alignItems={'center'} marginLeft={'18px'}>
            Read the competition rules here!
            <ArrowForwardIcon boxSize={5} marginLeft={'12px'} />
          </Box>
        </Box>
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
              <Text fontSize={'2xl'}>1000 USDC</Text>
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
                Time Left
              </Text>
              <Text fontSize={'2xl'}>00:20:33</Text>
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
              <Text fontSize={'2xl'}>344</Text>
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
                No. of trades
              </Text>
              <Text fontSize={'2xl'}>100000</Text>
            </Flex>
          </Center>
          <Center textAlign={'center'} padding={3} flexShrink={1} flexGrow={1} flexBasis={'200px'}>
            <Flex direction={'column'} w={'100%'} display={'flex'} alignItems={'center'}>
              <Text fontSize={'sm'} marginBottom={'12px'} color={'#9E9E9F'}>
                Volume
              </Text>
              <Text fontSize={'2xl'}>3000 USDC</Text>
            </Flex>
          </Center>
        </Flex>
        <div>
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
                borderColor={defaultTabs === TableTabType.Winners ? '#6052FB' : 'transparent'}
                pointerEvents={defaultTabs === TableTabType.Winners ? 'none' : 'auto'}
                cursor={defaultTabs === TableTabType.Winners ? 'default' : 'pointer'}
                color={defaultTabs === TableTabType.Winners ? '#6052FB' : '#9E9E9F'}
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
                borderColor={defaultTabs === TableTabType.Losers ? '#6052FB' : 'transparent'}
                pointerEvents={defaultTabs === TableTabType.Losers ? 'none' : 'auto'}
                cursor={defaultTabs === TableTabType.Losers ? 'default' : 'pointer'}
                color={defaultTabs === TableTabType.Losers ? '#6052FB' : '#9E9E9F'}
                padding={'20px 0'}
              >
                Losers (by PnL)
              </Box>
            </Flex>
            <Box>
              <Menu>
                <MenuButton as={Button} rightIcon={<CalendarIcon />} backgroundColor={'#252528'} color={"#7A72F6"}>
                  Actions
                </MenuButton>
                <MenuList
                  backgroundColor={'#252528'}
                  boxShadow={'0px 3px 20px 0px rgba(0, 0, 0, 0.65)'}
                  border={'none'}
                >
                  <MenuItem backgroundColor={'#252528'}>Download</MenuItem>
                  <MenuItem backgroundColor={'#252528'}>Create a Copy</MenuItem>
                  <MenuItem backgroundColor={'#252528'}>Mark as Draft</MenuItem>
                  <MenuItem backgroundColor={'#252528'}>Delete</MenuItem>
                  <MenuItem backgroundColor={'#252528'}>Attend a Workshop</MenuItem>
                </MenuList>
              </Menu>
            </Box>
          </Box>

          {defaultTabs === TableTabType.Winners && mounted && <TableLosers />}

          {defaultTabs === TableTabType.Losers && mounted && <TableWinners />}
        </div>
      </Box>
    </Flex>
  );
};

export default LeaderboardView;
