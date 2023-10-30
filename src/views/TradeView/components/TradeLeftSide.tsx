'use client';

import { Box } from '@chakra-ui/react';
import LeftTab from './LeftTab';
import TradeControl from './TradeControl';

const TradeLeftSide = () => {
  return (
    <Box className="xl:pl-5">
      <TradeControl />
      <Box marginTop="12px">
        <LeftTab />
      </Box>
    </Box>
  );
};

export default TradeLeftSide;
