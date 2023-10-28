'use client';

import { getChanged24h } from '@/services/trade';
import usePairStore from '@/store/usePairStore';
import useTradeStore from '@/store/useTradeStore';
import { PairData, PairType } from '@/types/trade.type';
import { addComma } from '@/utils/number';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import {
  Flex,
  InputLeftElement,
  TabList,
  Tab,
  TabIndicator,
  TabPanels,
  TabPanel,
  TableContainer,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Image,
  InputGroup,
  Center,
  Box,
  Input,
  Tabs,
  Button,
  Progress,
  Table,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import _ from 'lodash';
import { SearchIcon } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';

const TradeViewHeader = () => {
  const pairRef = useRef<HTMLDivElement>(null);
  const { price } = useTradeStore();
  const { listPairData, setListPairData } = usePairStore();
  const params = useParams();
  const [search, setSearch] = useState<string>('');
  const [isShow, setIsShow] = useState<boolean>(false);
  const { data: listChanged24h } = useQuery({
    queryKey: ['getChanged24h'],
    queryFn: () => getChanged24h(),
  });
  const currentPair = useMemo<PairData | null>(() => {
    if (!params?.pair) return null;
    return (
      listPairData.find(
        (item: PairData) => item.pair.replace('/', '-').toLowerCase() === (params?.pair as string).toLowerCase(),
      ) ?? null
    );
  }, [listPairData, params?.pair]);

  const listPairShow = useMemo<PairData[]>(() => {
    const tempList = [];
    const tempChanged24h = listChanged24h?.data?.data;

    for (let i = 0; i < listPairData.length; i++) {
      const changed24hPair = tempChanged24h && tempChanged24h[listPairData[i].pair.replace('/', '')];
      if (changed24hPair) {
        listPairData[i].changed24hPercent = +changed24hPair;
      } else {
        listPairData[i].changed24hPercent = -2;
      }
      if (listPairData[i].pair.replace('/', '-').includes(search.toUpperCase().replace('/', '-'))) {
        tempList.push(listPairData[i]);
      }
    }
    return tempList;
  }, [listPairData, search, listChanged24h]);

  const isEmptyFavorite = useMemo<boolean>(() => {
    return !listPairData.some((item: PairData) => item.isFavorite);
  }, [listPairData]);

  const currentChangedPercent = useMemo<number>(() => {
    return currentPair?.pair &&
      listChanged24h &&
      listChanged24h?.data?.data[currentPair?.pair.replace('/', '').toUpperCase()]
      ? +listChanged24h?.data?.data[currentPair?.pair.replace('/', '').toUpperCase()]
      : -2;
  }, [currentPair, listChanged24h]);

  const handleFavorite = (pair: string) => {
    const tempList = _.cloneDeep(listPairData);
    for (let i = 0; i < tempList.length; i++) {
      if (tempList[i].pair === pair) {
        tempList[i].isFavorite = !tempList[i].isFavorite;
      }
    }

    setListPairData(tempList);
  };

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const searchText = e.target.value;
    setSearch(searchText);
  };

  const handleOutSideClick = (e: Event) => {
    if (!pairRef.current?.contains(e.target as Node)) {
      setIsShow(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutSideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutSideClick);
    };
  }, [pairRef]);

  return (
    <Flex alignItems="center" justifyContent="space-between">
      <Flex justifyContent={{ base: 'space-between', xl: 'normal' }} width={{ base: '100%', xl: 'auto' }}>
        <Center cursor="pointer" position={'relative'} zIndex={1} ref={pairRef}>
          <Center onClick={() => setIsShow(!isShow)}>
            {currentPair?.pair && (
              <Image
                alt="bitcoin"
                src={`/images/icons/${currentPair?.pair.replace('/', '-').toLowerCase()}.png`}
                w="32px"
                h="32px"
              />
            )}
            <span className="px-3 text-xl font-semibold text-[#fff]">
              {currentPair && currentPair.pair.toLocaleUpperCase()}
            </span>
            {isShow ? <TriangleUpIcon color="#1E3EF0" /> : <TriangleDownIcon color="#1E3EF0" />}
          </Center>
          <Box
            position={'absolute'}
            top={'100%'}
            left={0}
            bgColor={'rgb(28, 28, 30)'}
            rounded={'20px'}
            padding={'20px'}
            w={{ base: 'calc(100vw - 20px)', xl: '1028px' }}
            display={isShow ? 'block' : 'none'}
          >
            <InputGroup size="md" marginBottom={'8px'}>
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="#fff" />
              </InputLeftElement>
              <Input
                bgColor={'#252528'}
                placeholder="Search"
                border="1px solid #38383A"
                rounded={'10px'}
                _hover={{ borderColor: '#1E3EF0' }}
                _focusVisible={{ borderColor: '#1E3EF0', borderWidth: '2px' }}
                value={search}
                onChange={handleOnChange}
              />
            </InputGroup>

            <Box marginTop="12px">
              <Tabs defaultIndex={1}>
                <TabList borderBottom="none" roundedTop="10px">
                  <Tab
                    color="#6D6D70"
                    fontSize={'sm'}
                    fontWeight={'medium'}
                    _selected={{ color: '#1E3EF0' }}
                    _active={{ bgColor: 'transparent' }}
                    paddingX="12px"
                    paddingY="8px"
                  >
                    Favourites
                  </Tab>
                  <Tab
                    color="#6D6D70"
                    fontSize={'sm'}
                    fontWeight={'medium'}
                    _selected={{ color: '#1E3EF0' }}
                    _active={{ bgColor: 'transparent' }}
                    paddingX="12px"
                    paddingY="8px"
                  >
                    All
                  </Tab>
                  <Tab
                    color="#6D6D70"
                    fontSize={'sm'}
                    fontWeight={'medium'}
                    _selected={{ color: '#1E3EF0' }}
                    _active={{ bgColor: 'transparent' }}
                    paddingX="12px"
                    paddingY="8px"
                  >
                    Crypto
                  </Tab>
                  <Tab
                    color="#6D6D70"
                    fontSize={'sm'}
                    fontWeight={'medium'}
                    _selected={{ color: '#1E3EF0' }}
                    _active={{ bgColor: 'transparent' }}
                    paddingX="12px"
                    paddingY="8px"
                  >
                    Forex
                  </Tab>
                </TabList>
                <TabIndicator mt="-1.5px" height="2px" bg="#1E3EF0" borderRadius="1px" />

                <TabPanels marginTop={'20px'}>
                  <TabPanel padding="0">
                    <TableContainer bgColor={'#252528'} roundedTop={'10px'}>
                      <Table variant="simple">
                        <Thead>
                          <Tr>
                            <Th color={'#9E9E9F'} fontSize={'12px'} border="none" fontWeight={'400'}>
                              Asset
                            </Th>
                            <Th color={'#9E9E9F'} fontSize={'12px'} border="none" fontWeight={'400'}>
                              Payout
                            </Th>
                            <Th color={'#9E9E9F'} fontSize={'12px'} border="none" fontWeight={'400'}>
                              24 Change
                            </Th>
                            <Th color={'#9E9E9F'} fontSize={'12px'} border="none" fontWeight={'400'}>
                              Max Trade Size
                            </Th>
                            <Th color={'#9E9E9F'} fontSize={'12px'} border="none" fontWeight={'400'}>
                              Current Ol
                            </Th>
                            <Th color={'#9E9E9F'} fontSize={'12px'} border="none" fontWeight={'400'}>
                              Max Ol
                            </Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {listPairShow.map(
                            (item: PairData) =>
                              item.isFavorite && (
                                <Tr key={item.pair}>
                                  <Td
                                    borderColor={'#38383A'}
                                    fontWeight={'400'}
                                    fontSize={'14px'}
                                    textColor={'#fff'}
                                    paddingY="8px"
                                  >
                                    <Box display="flex" alignItems={'center'}>
                                      <Button
                                        padding="0"
                                        height="20px"
                                        minW={'10px'}
                                        bgColor={'transparent'}
                                        _hover={{ bgColor: 'transparent', textColor: '#fff' }}
                                        _active={{ bgColor: 'transparent', textColor: '#fff' }}
                                        onClick={() => handleFavorite(item.pair)}
                                      >
                                        <Image alt="" src="/images/icons/star-solid.svg" w="20px" h="20px" />
                                      </Button>
                                      <Link href={`/trade/${item.pair.replace('/', '-')}`}>
                                        <Box display="flex" alignItems={'center'}>
                                          <Image
                                            alt=""
                                            src={`/images/icons/${item.pair.replace('/', '-').toLowerCase()}.png`}
                                            w="20px"
                                            h="20px"
                                            marginLeft={'12px'}
                                            marginRight={'8px'}
                                          />{' '}
                                          {item.pair}
                                        </Box>
                                      </Link>
                                    </Box>
                                  </Td>
                                  <Td
                                    borderColor={'#38383A'}
                                    fontWeight={'400'}
                                    fontSize={'14px'}
                                    textColor={'#fff'}
                                    paddingY="8px"
                                  >
                                    {item.payout}%
                                  </Td>
                                  <Td
                                    borderColor={'#38383A'}
                                    fontWeight={'400'}
                                    fontSize={'14px'}
                                    textColor={'#fff'}
                                    paddingY="8px"
                                  >
                                    <p className="pb-1">{item.changed24h}</p>
                                    <p
                                      className={`flex items-center ${
                                        item.changed24hPercent > 0 ? 'text-[#1ED768]' : 'text-[#F03D3E]'
                                      }`}
                                    >
                                      {item.changed24hPercent > 0 ? <TriangleUpIcon /> : <TriangleDownIcon />}{' '}
                                      <span className="pl-2">{item.changed24hPercent}%</span>
                                    </p>
                                  </Td>
                                  <Td
                                    borderColor={'#38383A'}
                                    fontWeight={'400'}
                                    fontSize={'14px'}
                                    textColor={'#fff'}
                                    paddingY="8px"
                                  >
                                    {item.maxTradeSize} USDC
                                  </Td>
                                  <Td
                                    borderColor={'#38383A'}
                                    fontWeight={'400'}
                                    fontSize={'14px'}
                                    textColor={'#fff'}
                                    paddingY="8px"
                                  >
                                    {item.currentOL} USDC
                                  </Td>
                                  <Td
                                    borderColor={'#38383A'}
                                    fontWeight={'400'}
                                    fontSize={'14px'}
                                    textColor={'#fff'}
                                    paddingY="8px"
                                  >
                                    {item.maxOL} USDC
                                  </Td>
                                </Tr>
                              ),
                          )}
                          {isEmptyFavorite && (
                            <Tr>
                              <Td
                                colSpan={6}
                                borderColor={'#38383A'}
                                fontWeight={'400'}
                                fontSize={'14px'}
                                textColor={'#fff'}
                                paddingY="8px"
                              >
                                <Flex direction={'column'} alignItems={'center'} paddingY="60px">
                                  <Image alt="" src="/images/icons/pack.png" w="60px" h="50px" />
                                  <p className="text-sm font-normal text-[#6D6D70]">There are no placed trades</p>
                                </Flex>
                              </Td>
                            </Tr>
                          )}
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </TabPanel>
                  <TabPanel padding="0">
                    {/* <Flex direction={'column'} alignItems={'center'} bg="#0c0c10" paddingY="60px">
                          <Image alt="" src="/images/icons/pack.png" w="60px" h="50px" />
                          <p className="text-sm font-normal text-[#6D6D70]">There are no placed trades</p>
                        </Flex> */}
                    <TableContainer bgColor={'#252528'} roundedTop={'10px'} height={'364px'} overflowY="auto">
                      <Table variant="simple">
                        <Thead>
                          <Tr>
                            <Th color={'#9E9E9F'} fontSize={'12px'} border="none" fontWeight={'400'}>
                              Asset
                            </Th>
                            <Th color={'#9E9E9F'} fontSize={'12px'} border="none" fontWeight={'400'}>
                              Payout
                            </Th>
                            <Th color={'#9E9E9F'} fontSize={'12px'} border="none" fontWeight={'400'}>
                              24 Change
                            </Th>
                            <Th color={'#9E9E9F'} fontSize={'12px'} border="none" fontWeight={'400'}>
                              Max Trade Size
                            </Th>
                            <Th color={'#9E9E9F'} fontSize={'12px'} border="none" fontWeight={'400'}>
                              Current Ol
                            </Th>
                            <Th color={'#9E9E9F'} fontSize={'12px'} border="none" fontWeight={'400'}>
                              Max Ol
                            </Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {listPairShow.map((item: PairData) => (
                            <Tr key={item.pair}>
                              <Td
                                borderColor={'#38383A'}
                                fontWeight={'400'}
                                fontSize={'14px'}
                                textColor={'#fff'}
                                paddingY="8px"
                              >
                                <Box display="flex" alignItems={'center'}>
                                  <Button
                                    padding="0"
                                    height="20px"
                                    minW={'10px'}
                                    bgColor={'transparent'}
                                    _hover={{ bgColor: 'transparent', textColor: '#fff' }}
                                    _active={{ bgColor: 'transparent', textColor: '#fff' }}
                                    onClick={() => handleFavorite(item.pair)}
                                  >
                                    <Image
                                      alt=""
                                      src={
                                        item.isFavorite ? '/images/icons/star-solid.svg' : '/images/icons/star-line.svg'
                                      }
                                      w="20px"
                                      h="20px"
                                    />
                                  </Button>
                                  <Link href={`/trade/${item.pair.replace('/', '-')}`}>
                                    <Box display="flex" alignItems={'center'}>
                                      <Image
                                        alt=""
                                        src={`/images/icons/${item.pair.replace('/', '-').toLowerCase()}.png`}
                                        w="20px"
                                        h="20px"
                                        marginLeft={'12px'}
                                        marginRight={'8px'}
                                      />{' '}
                                      {item.pair}
                                    </Box>
                                  </Link>
                                </Box>
                              </Td>
                              <Td
                                borderColor={'#38383A'}
                                fontWeight={'400'}
                                fontSize={'14px'}
                                textColor={'#fff'}
                                paddingY="8px"
                              >
                                {item.payout}%
                              </Td>
                              <Td
                                borderColor={'#38383A'}
                                fontWeight={'400'}
                                fontSize={'14px'}
                                textColor={'#fff'}
                                paddingY="8px"
                              >
                                <p className="pb-1">{item.changed24h}</p>
                                <p
                                  className={`flex items-center ${
                                    item.changed24hPercent > 0 ? 'text-[#1ED768]' : 'text-[#F03D3E]'
                                  }`}
                                >
                                  {item.changed24hPercent > 0 ? <TriangleUpIcon /> : <TriangleDownIcon />}{' '}
                                  <span className="pl-2">{item.changed24hPercent}%</span>
                                </p>
                              </Td>
                              <Td
                                borderColor={'#38383A'}
                                fontWeight={'400'}
                                fontSize={'14px'}
                                textColor={'#fff'}
                                paddingY="8px"
                              >
                                {item.maxTradeSize} USDC
                              </Td>
                              <Td
                                borderColor={'#38383A'}
                                fontWeight={'400'}
                                fontSize={'14px'}
                                textColor={'#fff'}
                                paddingY="8px"
                              >
                                {item.currentOL} USDC
                              </Td>
                              <Td
                                borderColor={'#38383A'}
                                fontWeight={'400'}
                                fontSize={'14px'}
                                textColor={'#fff'}
                                paddingY="8px"
                              >
                                {item.maxOL} USDC
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </TabPanel>
                  <TabPanel padding="0">
                    {/* <Flex direction={'column'} alignItems={'center'} bg="#0c0c10" paddingY="60px">
                          <Image alt="" src="/images/icons/pack.png" w="60px" h="50px" />
                          <p className="text-sm font-normal text-[#6D6D70]">There are no placed trades</p>
                        </Flex> */}

                    <TableContainer bgColor={'#252528'} roundedTop={'10px'} maxHeight={'364px'} overflowY="auto">
                      <Table variant="simple">
                        <Thead>
                          <Tr>
                            <Th color={'#9E9E9F'} fontSize={'12px'} border="none" fontWeight={'400'}>
                              Asset
                            </Th>
                            <Th color={'#9E9E9F'} fontSize={'12px'} border="none" fontWeight={'400'}>
                              Payout
                            </Th>
                            <Th color={'#9E9E9F'} fontSize={'12px'} border="none" fontWeight={'400'}>
                              24 Change
                            </Th>
                            <Th color={'#9E9E9F'} fontSize={'12px'} border="none" fontWeight={'400'}>
                              Max Trade Size
                            </Th>
                            <Th color={'#9E9E9F'} fontSize={'12px'} border="none" fontWeight={'400'}>
                              Current Ol
                            </Th>
                            <Th color={'#9E9E9F'} fontSize={'12px'} border="none" fontWeight={'400'}>
                              Max Ol
                            </Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {listPairShow.map(
                            (item: PairData) =>
                              item.type === PairType.CRYPTO && (
                                <Tr key={item.pair}>
                                  <Td
                                    borderColor={'#38383A'}
                                    fontWeight={'400'}
                                    fontSize={'14px'}
                                    textColor={'#fff'}
                                    paddingY="8px"
                                  >
                                    <Box display="flex" alignItems={'center'}>
                                      <Button
                                        padding="0"
                                        height="20px"
                                        minW={'10px'}
                                        bgColor={'transparent'}
                                        _hover={{ bgColor: 'transparent', textColor: '#fff' }}
                                        _active={{ bgColor: 'transparent', textColor: '#fff' }}
                                        onClick={() => handleFavorite(item.pair)}
                                      >
                                        <Image
                                          alt=""
                                          src={
                                            item.isFavorite
                                              ? '/images/icons/star-solid.svg'
                                              : '/images/icons/star-line.svg'
                                          }
                                          w="20px"
                                          h="20px"
                                        />
                                      </Button>
                                      <Link href={`/trade/${item.pair.replace('/', '-')}`}>
                                        <Box display="flex" alignItems={'center'}>
                                          <Image
                                            alt=""
                                            src={`/images/icons/${item.pair.replace('/', '-').toLowerCase()}.png`}
                                            w="20px"
                                            h="20px"
                                            marginLeft={'12px'}
                                            marginRight={'8px'}
                                          />{' '}
                                          {item.pair}
                                        </Box>
                                      </Link>
                                    </Box>
                                  </Td>
                                  <Td
                                    borderColor={'#38383A'}
                                    fontWeight={'400'}
                                    fontSize={'14px'}
                                    textColor={'#fff'}
                                    paddingY="8px"
                                  >
                                    {item.payout}%
                                  </Td>
                                  <Td
                                    borderColor={'#38383A'}
                                    fontWeight={'400'}
                                    fontSize={'14px'}
                                    textColor={'#fff'}
                                    paddingY="8px"
                                  >
                                    <p className="pb-1">{item.changed24h}</p>
                                    <p
                                      className={`flex items-center ${
                                        item.changed24hPercent > 0 ? 'text-[#1ED768]' : 'text-[#F03D3E]'
                                      }`}
                                    >
                                      {item.changed24hPercent > 0 ? <TriangleUpIcon /> : <TriangleDownIcon />}{' '}
                                      <span className="pl-2">{item.changed24hPercent}%</span>
                                    </p>
                                  </Td>
                                  <Td
                                    borderColor={'#38383A'}
                                    fontWeight={'400'}
                                    fontSize={'14px'}
                                    textColor={'#fff'}
                                    paddingY="8px"
                                  >
                                    {item.maxTradeSize} USDC
                                  </Td>
                                  <Td
                                    borderColor={'#38383A'}
                                    fontWeight={'400'}
                                    fontSize={'14px'}
                                    textColor={'#fff'}
                                    paddingY="8px"
                                  >
                                    {item.currentOL} USDC
                                  </Td>
                                  <Td
                                    borderColor={'#38383A'}
                                    fontWeight={'400'}
                                    fontSize={'14px'}
                                    textColor={'#fff'}
                                    paddingY="8px"
                                  >
                                    {item.maxOL} USDC
                                  </Td>
                                </Tr>
                              ),
                          )}
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </TabPanel>
                  <TabPanel padding="0">
                    {/* <Flex direction={'column'} alignItems={'center'} bg="#0c0c10" paddingY="60px">
                          <Image alt="" src="/images/icons/pack.png" w="60px" h="50px" />
                          <p className="text-sm font-normal text-[#6D6D70]">There are no placed trades</p>
                        </Flex> */}

                    <TableContainer bgColor={'#252528'} roundedTop={'10px'} maxHeight={'364px'} overflowY="auto">
                      <Table variant="simple">
                        <Thead>
                          <Tr>
                            <Th color={'#9E9E9F'} fontSize={'12px'} border="none" fontWeight={'400'}>
                              Asset
                            </Th>
                            <Th color={'#9E9E9F'} fontSize={'12px'} border="none" fontWeight={'400'}>
                              Payout
                            </Th>
                            <Th color={'#9E9E9F'} fontSize={'12px'} border="none" fontWeight={'400'}>
                              24 Change
                            </Th>
                            <Th color={'#9E9E9F'} fontSize={'12px'} border="none" fontWeight={'400'}>
                              Max Trade Size
                            </Th>
                            <Th color={'#9E9E9F'} fontSize={'12px'} border="none" fontWeight={'400'}>
                              Current Ol
                            </Th>
                            <Th color={'#9E9E9F'} fontSize={'12px'} border="none" fontWeight={'400'}>
                              Max Ol
                            </Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {listPairShow.map(
                            (item: PairData) =>
                              item.type === PairType.FOREX && (
                                <Tr key={item.pair}>
                                  <Td
                                    borderColor={'#38383A'}
                                    fontWeight={'400'}
                                    fontSize={'14px'}
                                    textColor={'#fff'}
                                    paddingY="8px"
                                  >
                                    <Box display="flex" alignItems={'center'}>
                                      <Button
                                        padding="0"
                                        height="20px"
                                        minW={'10px'}
                                        bgColor={'transparent'}
                                        _hover={{ bgColor: 'transparent', textColor: '#fff' }}
                                        _active={{ bgColor: 'transparent', textColor: '#fff' }}
                                        onClick={() => handleFavorite(item.pair)}
                                      >
                                        <Image
                                          alt=""
                                          src={
                                            item.isFavorite
                                              ? '/images/icons/star-solid.svg'
                                              : '/images/icons/star-line.svg'
                                          }
                                          w="20px"
                                          h="20px"
                                        />
                                      </Button>
                                      <Link href={`/trade/${item.pair.replace('/', '-')}`}>
                                        <Box display="flex" alignItems={'center'}>
                                          <Image
                                            alt=""
                                            src={`/images/icons/${item.pair.replace('/', '-').toLowerCase()}.png`}
                                            w="20px"
                                            h="20px"
                                            marginLeft={'12px'}
                                            marginRight={'8px'}
                                          />{' '}
                                          {item.pair}
                                        </Box>
                                      </Link>
                                    </Box>
                                  </Td>
                                  <Td
                                    borderColor={'#38383A'}
                                    fontWeight={'400'}
                                    fontSize={'14px'}
                                    textColor={'#fff'}
                                    paddingY="8px"
                                  >
                                    {item.payout}%
                                  </Td>
                                  <Td
                                    borderColor={'#38383A'}
                                    fontWeight={'400'}
                                    fontSize={'14px'}
                                    textColor={'#fff'}
                                    paddingY="8px"
                                  >
                                    <p className="pb-1">{item.changed24h}</p>
                                    <p
                                      className={`flex items-center ${
                                        item.changed24hPercent > 0 ? 'text-[#1ED768]' : 'text-[#F03D3E]'
                                      }`}
                                    >
                                      {item.changed24hPercent > 0 ? <TriangleUpIcon /> : <TriangleDownIcon />}{' '}
                                      <span className="pl-2">{item.changed24hPercent}%</span>
                                    </p>
                                  </Td>
                                  <Td
                                    borderColor={'#38383A'}
                                    fontWeight={'400'}
                                    fontSize={'14px'}
                                    textColor={'#fff'}
                                    paddingY="8px"
                                  >
                                    {item.maxTradeSize} USDC
                                  </Td>
                                  <Td
                                    borderColor={'#38383A'}
                                    fontWeight={'400'}
                                    fontSize={'14px'}
                                    textColor={'#fff'}
                                    paddingY="8px"
                                  >
                                    {item.currentOL} USDC
                                  </Td>
                                  <Td
                                    borderColor={'#38383A'}
                                    fontWeight={'400'}
                                    fontSize={'14px'}
                                    textColor={'#fff'}
                                    paddingY="8px"
                                  >
                                    {item.maxOL} USDC
                                  </Td>
                                </Tr>
                              ),
                          )}
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </TabPanel>
                  <TabPanel padding="0">
                    <Flex direction={'column'} alignItems={'center'} bg="#0c0c10" paddingY="60px">
                      <Image alt="" src="/images/icons/pack.png" w="60px" h="50px" />
                      <p className="text-sm font-normal text-[#6D6D70]">There are no placed trades</p>
                    </Flex>
                  </TabPanel>
                  <TabPanel padding="0">
                    <Flex direction={'column'} alignItems={'center'} bg="#0c0c10" paddingY="60px">
                      <Image alt="" src="/images/icons/pack.png" w="60px" h="50px" />
                      <p className="text-sm font-normal text-[#6D6D70]">There are no placed trades</p>
                    </Flex>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
          </Box>
        </Center>
        <Center paddingX={10} display={{ base: 'none', xl: 'flex' }}>
          <p className="text-2xl font-normal text-[#fff]">{addComma(price.toFixed(2), 2)}</p>
        </Center>
        <Center>
          <Box
            borderRight={{ base: 'none', xl: '1px solid #38383A' }}
            paddingRight={{ base: '0', xl: '20px' }}
            display={{ base: 'flex', xl: 'block' }}
            alignItems={{ base: 'center', xl: '' }}
          >
            <p className="mr-3 block text-sm font-semibold text-[#fff] xl:hidden">{addComma(price.toFixed(2), 2)}</p>
            <p className="hidden pb-2 text-xs font-normal text-[#9E9E9F] xl:block ">24h Change</p>
            <span
              className={`h-6 rounded border ${
                currentChangedPercent >= 0 ? 'border-[#1ED768] text-[#1ED768]' : 'border-[#F03D3E] text-[#F03D3E]'
              }  px-[6px] text-sm font-normal  `}
            >
              {currentChangedPercent >= 0 ? (
                <TriangleUpIcon marginRight="4px" />
              ) : (
                <TriangleDownIcon marginRight="4px" />
              )}
              {currentChangedPercent}%
            </span>
          </Box>
          <Box borderRight="1px solid #38383A" paddingX="20px" display={{ base: 'none', xl: 'block' }}>
            <p className="pb-2 text-xs font-normal text-[#9E9E9F]">Max Trade Size</p>
            <p className="text-sm font-normal leading-6 text-[#fff]">{currentPair?.maxTradeSize} USDC</p>
          </Box>
          <Box borderRight="1px solid #38383A" paddingX="20px" display={{ base: 'none', xl: 'block' }}>
            <p className="pb-2 text-xs font-normal text-[#9E9E9F]">Payout</p>
            <p className="text-sm font-normal leading-6 text-[#fff]">{currentPair?.payout}%</p>
          </Box>
          <Box paddingLeft="20px" display={{ base: 'none', xl: 'block' }}>
            <p className="pb-2 text-xs font-normal text-[#9E9E9F]">Max OI: 1,000 USDC</p>
            <p className="flex h-6 items-center text-sm font-normal text-[#fff]">
              <Progress value={20} size="xs" colorScheme="primary" bgColor="#303035" rounded="2xl" h="2" w="168px" />
              <span className="pl-3 text-sm font-normal text-[#fff]">20%</span>
            </p>
          </Box>
        </Center>
      </Flex>
      <Box display={{ base: 'none', xl: 'block' }}>
        <Image alt="bitcoin" src="/images/icons/apps.svg" w="20x" h="20x" />
      </Box>
    </Flex>
  );
};

export default TradeViewHeader;
