import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import ItemCardTab from './ItemCardTab';

const TokenTab = () => {
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
            <ItemCardTab title={'Price'} value={'$0.0587'} />
            <ItemCardTab title={'Circulating Supply / Circulating MC'} value={'29.01M ETR / $1.70M'} />
            <ItemCardTab title={'Total Supply / MC'} value={'79.87M ETR / $4.69M'} />
            <ItemCardTab title={'Total Staked'} value={'20.39M ETR / $1.19M'} />
            <ItemCardTab title={'Tokens In Liquidity Pool'} value={'3,457,536.12 ETR'} />
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
            <ItemCardTab title={'Exchange Rate'} value={'0.7447 USDC'} />
            <ItemCardTab title={'Total Supply'} value={'742,291.67 ELP'} />
            <ItemCardTab title={'Total USDC Amount'} value={'552,800.00 USDC'} />
            <ItemCardTab title={'APR'} value={'26.87 %'} />
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default TokenTab;
