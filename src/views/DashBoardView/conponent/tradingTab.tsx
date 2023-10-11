import { Box, Flex, Text } from '@chakra-ui/react';
import ItemCardTab from './ItemCardTab';

const dataTrading = [
  {
    title: 'Fees / Volume',
    value: '900.15K USDC/6.92M USDC',
  },
  {
    title: 'Average Daily Volume',
    value: '1.06K USDC/9.17K USDC',
  },
  {
    title: 'Average Daily Volume',
    value: '28,269.85 USDC',
  },
  {
    title: 'Average Trade size',
    value: '75.28 USDC',
  },
  {
    title: 'Total Trades',
    value: '91998',
  },
  {
    title: 'Open Interest (USDC)',
    value: '0.00 USDC',
  },
  {
    title: 'Open Interest (ETR)',
    value: '0.00 ETR',
  },
  {
    title: 'Total Traders',
    value: '1642',
  },
];
const TradingTab = () => {
  return (
    <Box
      boxShadow="1px 0.5px 0px 0px #38383A inset"
      border={'1px solid #38383A'}
      paddingY={['20px', '20px', '40px', '40px']}
      paddingX={['10px', '10px', '32px', '32px']}
      rounded="20px"
      width={{ base: '100%', sm: '100%', md: '100%', lg: '693px' }}
      bgColor="rgba(28, 28, 30, 0.7)"
      display={'flex'}
      justifyContent={'space-around'}
      gap={'20px'}
      flexDirection={'column'}
    >
      <Text fontSize="20px" textColor={'white'} fontWeight={600}>
        Trading Overview
      </Text>
      <Flex flexDirection={'column'}>
        {dataTrading.map((item, idx) => (
          <ItemCardTab key={idx} title={item.title} value={item.value} />
        ))}
      </Flex>
    </Box>
  );
};

export default TradingTab;
