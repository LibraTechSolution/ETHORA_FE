import { Box, Flex, Heading, Text, Tooltip } from '@chakra-ui/react';
import ItemCardTab from './ItemCardTab';
import { useEffect, useState } from 'react';
import { Address, readContract } from '@wagmi/core';
import { appConfig } from '@/config';
import ETR_ABI from '@/config/abi/ETR_ABI';
import { divide, subtract } from '@/utils/operationBigNumber';
import { addComma } from '@/utils/number';
import BLP_ABI from '@/config/abi/BLP_ABI';
import USDC_ABI from '@/config/abi/USDC_ABI';
import FSBLP_ABI from '@/config/abi/FSBLP_ABI';
import FBLP_ABI from '@/config/abi/FBLP_ABI';

const TokenTab = () => {
  const [totalSupplyMC, setTotalSupplyMc] = useState<string | number>(0);
  const [totalStake, setTotalStake] = useState<string | number>(0);
  const [exChangeRate, setExchangeRate] = useState<string | number>(0);
  const [totalUSDCAmount, setTotalUSDCAmount] = useState<string | number>(0);
  const [escrowedBFRAPR, setEscrowedBFRAPR] = useState<string | number>(0);
  const [usdcApr, setUsdcApr] = useState<string | number>(0);

  const getData = async () => {
    const totalSupply = await readContract({
      address: appConfig.ETR_SC as `0x${string}`,
      abi: ETR_ABI,
      functionName: 'totalSupply',
    });
    const balanceOf = await readContract({
      address: appConfig.ETR_SC as `0x${string}`,
      abi: ETR_ABI,
      functionName: 'balanceOf',
      args: ['0x000000000000000000000000000000000000dEaD'],
    });
    const totalStake = await readContract({
      address: appConfig.SETR_SC as `0x${string}`,
      abi: ETR_ABI,
      functionName: 'balanceOf',
      args: ['0x5B5cB70E334888A485BD410F1fb87Aa81D3ceE3e'],
    });
    const totalTokenXBalance = await readContract({
      address: appConfig.BLP_SC as `0x${string}`,
      abi: BLP_ABI,
      functionName: 'totalTokenXBalance',
    });
    const totalSupplyBLP = await readContract({
      address: appConfig.BLP_SC as `0x${string}`,
      abi: BLP_ABI,
      functionName: 'totalSupply',
    });
    const balanceOfBLP = await readContract({
      address: appConfig.USDC_SC as `0x${string}`,
      abi: USDC_ABI,
      functionName: 'balanceOf',
      args: [appConfig.BLP_SC as Address],
    });
    const tokensPerInternalFSBLP = await readContract({
      address: appConfig.FSBLP_SC as `0x${string}`,
      abi: FSBLP_ABI,
      functionName: 'tokensPerInterval',
    });
    const tokensPerInternalFBLP = await readContract({
      address: appConfig.FBLP_SC as `0x${string}`,
      abi: FBLP_ABI,
      functionName: 'tokensPerInterval',
    });
    setTotalSupplyMc(addComma(divide(subtract(totalSupply.toString(), balanceOf.toString()), 18), 2));
    setTotalStake(addComma(divide(totalStake.toString(), 18), 2));
    setExchangeRate(addComma(divide(totalTokenXBalance.toString(), totalSupplyBLP.toString()), 2));
    setTotalUSDCAmount(addComma(divide(balanceOfBLP.toString(), 6), 2));
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Box>
      <Box display={'flex'} gap={'5px'} alignItems={'start'} marginBottom={'20px'} flexDirection={'column'}>
        <Heading as="h4" fontSize={24} lineHeight={'36px'} color={'white'} fontWeight={600}>
          Tokens
        </Heading>
        <Text as="span" fontSize={'14px'} textColor={'#9E9E9F'}>
          Platform and ELP index tokens
        </Text>
      </Box>
      <Flex gap={'20px'} flexWrap={'wrap'}>
        <Box
          boxShadow="1px 0.5px 0px 0px #38383A inset"
          border={'1px solid #38383A'}
          paddingY={['20px', '20px', '40px', '40px']}
          paddingX={['10px', '10px', '32px', '32px']}
          rounded="20px"
          width={{ base: '100%', sm: '100%', md: '100%', lg: '600px' }}
          marginBottom={{ base: '0px', sm: '0px', md: '20px', lg: '20px' }}
          bgColor="rgba(28, 28, 30, 0.7)"
          display={'flex'}
          justifyContent={'space-around'}
          gap={'20px'}
          flexDirection={'column'}
        >
          <Text fontSize="20px" textColor={'white'} fontWeight={600}>
            ETR
          </Text>
          <Flex flexDirection={'column'} flex={['none', 'none', 1, 1]}>
            <ItemCardTab title={'Price'} value={'$TODO'} />
            <ItemCardTab title={'Circulating Supply / Circulating MC'} value={'TODO ETR / $TODO'} />
            <ItemCardTab title={'Total Supply / MC'} value={`${totalSupplyMC} ETR / $TODO`} />
            <ItemCardTab title={'Total Staked'} value={`${totalStake} ETR / $TODO`} />
            <ItemCardTab title={'Tokens In Liquidity Pool'} value={'TODO ETR'} />
          </Flex>
        </Box>
        <Box
          boxShadow="1px 0.5px 0px 0px #38383A inset"
          border={'1px solid #38383A'}
          paddingY={['20px', '20px', '40px', '40px']}
          paddingX={['10px', '10px', '32px', '32px']}
          rounded="20px"
          width={{ base: '100%', sm: '100%', md: '100%', lg: '600px' }}
          marginBottom={{ base: '0px', sm: '0px', md: '20px', lg: '20px' }}
          bgColor="rgba(28, 28, 30, 0.7)"
          display={'flex'}
          justifyContent={'space-around'}
          gap={'20px'}
          flexDirection={'column'}
        >
          <Text fontSize="20px" textColor={'white'} fontWeight={600}>
            ELP
          </Text>
          <Flex flexDirection={'column'} flex={['none', 'none', 1, 1]}>
            <ItemCardTab title={'Exchange Rate'} value={`${exChangeRate} USDC`} />
            <ItemCardTab title={'Total Supply'} value={`TODO ELP`} />
            <ItemCardTab title={'Total USDC Amount'} value={`${totalUSDCAmount} USDC`} />
            <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} gap={'20px'}>
              <Text as="span" fontSize={'xs'} textColor={'#9E9E9F'}>
                APR
              </Text>
              <Tooltip
                hasArrow
                label={
                  <Box w="100%" p={4} color="white">
                    <Flex margin={'0 -8px'} alignItems={'center'} justifyContent={'space-between'}>
                      <Box fontSize={'12px'} color={'#9E9E9F'} padding={'0 8px'}>
                        USDC APR
                      </Box>
                      <Box padding={'0 8px'}>1%</Box>
                    </Flex>
                    <Flex margin={'0 -8px'} alignItems={'center'} justifyContent={'space-between'}>
                      <Box fontSize={'12px'} color={'#9E9E9F'} padding={'0 8px'}>
                        esETR APR
                      </Box>
                      <Box padding={'0 8px'}>2%</Box>
                    </Flex>
                  </Box>
                }
                color="white"
                placement="top"
                bg="#050506"
                minWidth="215px"
              >
                <Text fontSize="xs" textColor={'white'} fontWeight={600} textAlign={'right'}>
                  3%
                </Text>
              </Tooltip>
            </Box>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default TokenTab;
