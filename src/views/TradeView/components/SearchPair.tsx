import usePairStore from '@/store/usePairStore';
import { Changed24h, PairData, PairType } from '@/types/trade.type';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import {
  Flex,
  InputLeftElement,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Image,
  InputGroup,
  Box,
  Input,
  Button,
  Table,
} from '@chakra-ui/react';
import _ from 'lodash';
import { SearchIcon } from 'lucide-react';
import Link from 'next/link';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useGetTradeContract } from '@/hooks/useGetTradeContract';
import { readContract } from '@wagmi/core';
import { divide } from '@/utils/operationBigNumber';
import bufferBOABI from '@/config/abi/bufferBOABI';
import { IResponData } from '@/types/api.type';

interface Props {
  listChanged24h: IResponData<Changed24h> | undefined;
  isShow: boolean;
}

enum Tab {
  Favourites = 'favourites',
  All = 'all',
  Crypto = 'crypto',
  Forex = 'forex',
}

const MaxOICell = ({ pair }: { pair: string }) => {
  const { bufferBOSC } = useGetTradeContract(pair);
  const [maxOI, setMaxOI] = useState(1000);

  const getMaxOI = useCallback(async () => {
    try {
      const maxOI = await readContract({
        address: bufferBOSC as `0x${string}`,
        abi: bufferBOABI,
        functionName: 'getMaxOI',
      });
      setMaxOI(+divide(maxOI.toString(), 6));
    } catch (error) {}
  }, [bufferBOSC]);

  useEffect(() => {
    getMaxOI();
  }, [getMaxOI]);

  return <span>{maxOI}</span>;
};

const CurrentOICell = ({ pair }: { pair: string }) => {
  const { bufferBOSC } = useGetTradeContract(pair);
  const [currentOI, setCurrentOI] = useState(0);

  const getCurrentOI = useCallback(async () => {
    try {
      const currentOI = await readContract({
        address: bufferBOSC as `0x${string}`,
        abi: bufferBOABI,
        functionName: 'totalMarketOI',
      });
      setCurrentOI(+divide(currentOI.toString(), 6));
    } catch (error) {}
  }, [bufferBOSC]);

  useEffect(() => {
    const interval = setInterval(() => {
      getCurrentOI();
    }, 10000);

    return () => clearInterval(interval);
  }, [getCurrentOI]);

  return <span>{currentOI}</span>;
};

export const FEED_IDS = {
  // crypto
  BTCUSD: '0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43',
  ETHUSD: '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace',
  LINKUSD: '0x8ac0c70fff57e9aefdf5edf44b51d62c2d433653cbb2cf5cc06bb115af04d221',
  TONUSD: '0x8963217838ab4cf5cadc172203c1f0b763fbaa45f346d8ee50ba994bbcac3026',
  ARBUSD: '0x3fa4252848f9f0a1480be62745a4629d9eb1322aebab8a791e344b3b9c1adcf5',
  XRPUSD: '0xec5d399846a9209f3fe5881d70aae9268c94339ff9817e8d18ff19fa05eea1c8',
  SOLUSD: '0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d',
  BNBUSD: '0x2f95862b045670cd22bee3114c39763a4a08beeb663b145d283c31d7d1101c4f',
  // BOGEUSD: "",
  // forex
  XAUUSD: '0x765d2ba906dbc32ca17cc11f5310a89e9ee1f6420508c63861f2f8ba4ee34bb2',
  XAGUSD: '0xf2fb02c32b055c805e7238d628e5e9dadef274376114eb1f012337cabe93871e',
  EURUSD: '0xa995d00bb36a63cef7fd2c287dc105fc8f3d93779f062f09551b0af3e81ec30b',
  GBPUSD: '0x84c2dde9633d93d1bcad84e7dc41c9d56578b7ec52fabedc1f335d673df0a7c1',
};

const SearchPair = (props: Props) => {
  const { listChanged24h, isShow } = props;
  const { listPairData, setListPairData } = usePairStore();
  const [search, setSearch] = useState<string>('');
  const [tab, setTab] = useState<Tab>(Tab.All);

  // useEffect(() => {
  //   const socket = new WebSocket('wss://hermes.pyth.network/ws');

  //   socket.onopen = () => {
  //     console.log('Connected to WSS server');

  //     const request = {
  //       type: 'subscribe',
  //       ids: Object.values(FEED_IDS),
  //     };
  //     socket.send(JSON.stringify(request));
  //   };

  //   socket.onmessage = (data) => {
  //     try {
  //       const json = JSON.parse(data.toString());
  //       console.log(data);
  //       if (json.type === 'price_update') {
  //         updatePairPriceToMem(json);
  //       }
  //     } catch (e) {}
  //     // console.log('Received:', data);
  //   };
  // }, []);

  // const [pairPrice, setPairPrice] = useState();

  // const updatePairPriceToMem = (json: any) => {
  //   const {
  //     id,
  //     price: { price, publish_time },
  //   } = json.price_feed;

  //   if (!pairPrice[id]) {
  //     pairPrice[id] = [];
  //   }

  //   pairPrice[id].unshift({ price, publish_time });
  //   pairPrice[id].splice(10);

  //   setPairPrice(pairPrice);
  //   console.log(pairPrice);
  // };

  // useEffect(() => {
  //   console.log(pairPrice);
  // }, [pairPrice]);

  const listPairShow = useMemo<PairData[]>(() => {
    const tempList = [];
    const tempChanged24h = listChanged24h?.data;
    if (!listChanged24h) {
      return listPairData;
    }
    let tempListPairData = [];
    switch (tab) {
      case Tab.Favourites:
        tempListPairData = listPairData.filter((item) => item.isFavorite);
        break;
      case Tab.Forex:
        tempListPairData = listPairData.filter((item) => item.type === PairType.FOREX);
        break;
      case Tab.Crypto:
        tempListPairData = listPairData.filter((item) => item.type === PairType.CRYPTO);
        break;
      default:
        tempListPairData = [...listPairData];
    }
    for (let i = 0; i < tempListPairData.length; i++) {
      const changed24hPair = tempChanged24h && tempChanged24h[tempListPairData[i].pair.replace('/', '')];
      if (changed24hPair) {
        tempListPairData[i].changed24hPercent = +changed24hPair;
      } else {
        tempListPairData[i].changed24hPercent = -2;
      }
      if (tempListPairData[i].pair.replace('/', '-').includes(search.toUpperCase().replace('/', '-'))) {
        tempList.push(tempListPairData[i]);
      }
    }
    return tempList;
  }, [listChanged24h, tab, listPairData, search]);

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

  return (
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
        <Flex>
          <Button
            bgColor={'transparent'}
            textColor={tab === Tab.Favourites ? '#1E3EF0' : '#6D6D70'}
            borderBottom={tab === Tab.Favourites ? '2px solid #1E3EF0' : '2px solid transparent'}
            fontWeight={'400'}
            fontSize={14}
            paddingX={3}
            rounded={0}
            _hover={{ bgColor: 'transparent' }}
            _active={{ bgColor: 'transparent' }}
            onClick={() => setTab(Tab.Favourites)}
          >
            Favourites
          </Button>
          <Button
            bgColor={'transparent'}
            textColor={tab === Tab.All ? '#1E3EF0' : '#6D6D70'}
            borderBottom={tab === Tab.All ? '2px solid #1E3EF0' : '2px solid transparent'}
            fontWeight={'400'}
            fontSize={14}
            paddingX={3}
            rounded={0}
            _hover={{ bgColor: 'transparent' }}
            _active={{ bgColor: 'transparent' }}
            onClick={() => setTab(Tab.All)}
          >
            All
          </Button>
          <Button
            bgColor={'transparent'}
            textColor={tab === Tab.Crypto ? '#1E3EF0' : '#6D6D70'}
            borderBottom={tab === Tab.Crypto ? '2px solid #1E3EF0' : '2px solid transparent'}
            fontWeight={'400'}
            fontSize={14}
            paddingX={3}
            rounded={0}
            _hover={{ bgColor: 'transparent' }}
            _active={{ bgColor: 'transparent' }}
            onClick={() => setTab(Tab.Crypto)}
          >
            Crypto
          </Button>
          <Button
            bgColor={'transparent'}
            textColor={tab === Tab.Forex ? '#1E3EF0' : '#6D6D70'}
            borderBottom={tab === Tab.Forex ? '2px solid #1E3EF0' : '2px solid transparent'}
            fontWeight={'400'}
            fontSize={14}
            paddingX={3}
            rounded={0}
            _hover={{ bgColor: 'transparent' }}
            _active={{ bgColor: 'transparent' }}
            onClick={() => setTab(Tab.Forex)}
          >
            Forex
          </Button>
        </Flex>
        <Box h={'345px'} bgColor={'#252528'} overflow="auto" rounded={'10px'}>
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
                  <Td borderColor={'#38383A'} fontWeight={'400'} fontSize={'14px'} textColor={'#fff'} paddingY="8px">
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
                          src={item.isFavorite ? '/images/icons/star-solid.svg' : '/images/icons/star-line.svg'}
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
                  <Td borderColor={'#38383A'} fontWeight={'400'} fontSize={'14px'} textColor={'#fff'} paddingY="8px">
                    {item.payout}%
                  </Td>
                  <Td borderColor={'#38383A'} fontWeight={'400'} fontSize={'14px'} textColor={'#fff'} paddingY="8px">
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
                  <Td borderColor={'#38383A'} fontWeight={'400'} fontSize={'14px'} textColor={'#fff'} paddingY="8px">
                    {item.maxTradeSize} USDC
                  </Td>
                  <Td borderColor={'#38383A'} fontWeight={'400'} fontSize={'14px'} textColor={'#fff'} paddingY="8px">
                    <CurrentOICell pair={item.pair.replace('/', '').toUpperCase()} /> USDC
                  </Td>
                  <Td borderColor={'#38383A'} fontWeight={'400'} fontSize={'14px'} textColor={'#fff'} paddingY="8px">
                    <MaxOICell pair={item.pair.replace('/', '').toUpperCase()} /> USDC
                  </Td>
                </Tr>
              ))}
              {listPairShow.length === 0 && (
                <Tr>
                  <Td
                    colSpan={6}
                    border={'none'}
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
        </Box>
      </Box>
    </Box>
  );
};

export default SearchPair;
