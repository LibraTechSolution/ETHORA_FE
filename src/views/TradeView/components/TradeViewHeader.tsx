'use client';

import { getChanged24h } from '@/services/trade';
import usePairStore from '@/store/usePairStore';
import { PairData } from '@/types/trade.type';
import { addComma } from '@/utils/number';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import { Flex, Image, Center, Box, Progress, Text } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ShowPrice } from './ShowPrice';
import { useGetMinMaxTradeSize, useGetTradeContract } from '@/hooks/useGetTradeContract';
import { readContract } from '@wagmi/core';
import { divide } from '@/utils/operationBigNumber';
import bufferBOABI from '@/config/abi/bufferBOABI';
import SearchPair from './SearchPair';

const ListFavoritePairs = () => {
  const { listPairData } = usePairStore();
  const isShow = listPairData.some((item) => item.isFavorite);

  return (
    isShow && (
      <Box borderBottom={'1px solid #38383A'} marginBottom={2} className="marquee">
        {listPairData.map(
          (item) =>
            item.isFavorite && (
              <Box
                display={'inline-block'}
                key={`${item.pair}`}
                _first={{ borderLeft: '1px solid #38383A' }}
                borderRight={'1px solid #38383A'}
              >
                <Flex px={3} py={2}>
                  <Image alt="" src={'/images/icons/star-solid.svg'} w="18px" h="18px" />
                  <Image
                    alt=""
                    src={`/images/icons/${item.pair.replace('/', '-').toLowerCase()}.png`}
                    w="20px"
                    h="20px"
                    marginLeft={'12px'}
                    marginRight={'8px'}
                  />
                  <Text fontSize={'14px'} fontWeight={400} marginRight={3}>
                    {item.pair.replace('/', '-')}
                  </Text>{' '}
                  <ShowPrice pair={item.pair.replace('/', '')} />
                </Flex>
              </Box>
            ),
        )}
      </Box>
    )
  );
};

const TradeViewHeader = () => {
  const pairRef = useRef<HTMLDivElement>(null);
  const { listPairData } = usePairStore();
  const params = useParams();
  const [isShow, setIsShow] = useState<boolean>(false);
  const { bufferBOSC } = useGetTradeContract();
  const [maxOI, setMaxOI] = useState(1000);
  const [currentOI, setCurrentOI] = useState(0);
  const { maxTradeSize } = useGetMinMaxTradeSize();

  const { data: listChanged24h } = useQuery({
    queryKey: ['getChanged24h'],
    queryFn: () => getChanged24h(),
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });
  const currentPair = useMemo<PairData | null>(() => {
    if (!params?.pair) return null;
    return (
      listPairData.find(
        (item: PairData) => item.pair.replace('/', '-').toLowerCase() === (params?.pair as string).toLowerCase(),
      ) ?? null
    );
  }, [listPairData, params?.pair]);

  const currentChangedPercent = useMemo<number>(() => {
    return currentPair?.pair &&
      listChanged24h &&
      listChanged24h?.data?.data[currentPair?.pair.replace('/', '').toUpperCase()]
      ? +listChanged24h?.data?.data[currentPair?.pair.replace('/', '').toUpperCase()]
      : -2;
  }, [currentPair, listChanged24h]);

  const handleOutSideClick = (e: Event) => {
    if (!pairRef.current?.contains(e.target as Node)) {
      setIsShow(false);
    }
  };

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
    getMaxOI();
    const interval = setInterval(() => {
      getCurrentOI();
    }, 10000);

    return () => clearInterval(interval);
  }, [getCurrentOI, getMaxOI]);

  useEffect(() => {
    document.addEventListener('mousedown', handleOutSideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutSideClick);
    };
  }, [pairRef]);

  return (
    <>
      {/* <ListFavoritePairs /> */}
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
            <SearchPair listChanged24h={listChanged24h?.data} isShow={isShow} />
          </Center>
          <Center paddingX={{ base: 5, '2xl': 10 }} display={{ base: 'none', xl: 'flex' }}>
            {currentPair?.pair && (
              <p className="min-w-[190px] text-2xl font-normal text-[#fff]">
                <ShowPrice /> {currentPair?.pair.split('/')[1].toUpperCase()}
              </p>
            )}
          </Center>
          <Center>
            <Box
              borderRight={{ base: 'none', xl: '1px solid #38383A' }}
              paddingRight={{ base: '0', xl: '20px' }}
              display={{ base: 'flex', xl: 'block' }}
              alignItems={{ base: 'center', xl: '' }}
            >
              {currentPair?.pair && (
                <p className="mr-3 block text-sm font-semibold text-[#fff] xl:hidden">
                  <ShowPrice /> {currentPair?.pair.split('/')[1].toUpperCase()}
                </p>
              )}
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
              <p className="text-sm font-normal leading-6 text-[#fff]">{addComma(maxTradeSize, 2)} USDC</p>
            </Box>
            <Box borderRight="1px solid #38383A" paddingX="20px" display={{ base: 'none', xl: 'block' }}>
              <p className="pb-2 text-xs font-normal text-[#9E9E9F]">Payout</p>
              <p className="text-sm font-normal leading-6 text-[#fff]">{currentPair?.payout}%</p>
            </Box>
            <Box paddingLeft="20px" display={{ base: 'none', xl: 'block' }}>
              <p className="pb-2 text-xs font-normal text-[#9E9E9F]">Max OI: {addComma(maxOI, 0)} USDC</p>
              <p className="flex h-6 items-center text-sm font-normal text-[#fff]">
                <Progress
                  value={Math.round((currentOI / maxOI) * 100)}
                  size="xs"
                  colorScheme="primary"
                  bgColor="#303035"
                  rounded="2xl"
                  h="2"
                  w="168px"
                />
                <span className="pl-3 text-sm font-normal text-[#fff]">{Math.round((currentOI / maxOI) * 100)}%</span>
              </p>
            </Box>
          </Center>
        </Flex>
        <Box display={{ base: 'none', xl: 'block' }}>
          <Image alt="bitcoin" src="/images/icons/apps.svg" w="20x" h="20x" />
        </Box>
      </Flex>
    </>
  );
};

export default TradeViewHeader;
