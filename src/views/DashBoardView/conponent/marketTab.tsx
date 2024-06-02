import { Box, Heading, Text } from '@chakra-ui/react';
import TableMarket from './tableMarket';

const MarketTab = () => {
  return (
    <Box width={{ base: 'calc(100vw - 35px)', lg: 'calc(100vw - 202px)' }}>
      <Box display={'flex'} gap={'5px'} alignItems={'start'} marginBottom={'20px'} flexDirection={'column'}>
        <Heading as="h4" fontSize={24} lineHeight={'36px'} color={'white'} fontWeight={600}>
          Markets
        </Heading>
        <Text as="span" fontSize={'14px'} textColor={'#9E9E9F'}>
          Discover new Pairs available on Ethora
        </Text>
      </Box>
      <TableMarket />
    </Box>
  );
};

export default MarketTab;
