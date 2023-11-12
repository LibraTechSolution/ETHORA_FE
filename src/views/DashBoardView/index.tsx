'use client';
import { Box, Flex, Heading } from '@chakra-ui/react';
import { Select } from 'antd';

import Image from 'next/image';
import { useState } from 'react';
import TradingTab from './conponent/tradingTab';
import TokenTab from './conponent/tokenTab';
import MarketTab from './conponent/marketTab';

export enum TradingTabType {
  Trading = 'Trading',
  Tokens = 'Tokens',
  Markets = 'Markets',
}
const DashBoardView = () => {
  const [defaultTabs, setDefaultTabs] = useState<TradingTabType>(TradingTabType.Trading);
  return (
    <Box>
      <Box display={'flex'} gap={'20px'} alignItems={'center'} marginBottom={'20px'}>
        <Heading as="h4" fontSize={24} lineHeight={'36px'} color={'white'} fontWeight={600}>
          Dashboard
        </Heading>
        {/* <Box>
            <Select
              size="large"
              defaultValue="china"
              style={{ width: 166 }}
              onChange={handleChange}
              className="customSelect"
            >
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
          </Box> */}
      </Box>
      <Box marginBottom={'16px'}>
        <Flex gap={'32px'} marginBottom={'20px'}>
          <Box
            className="mr-2"
            role="presentation"
            onClick={() => {
              setDefaultTabs(TradingTabType.Trading);
            }}
            borderBottom={'2px solid'}
            borderColor={defaultTabs === TradingTabType.Trading ? '#1E3EF0' : 'transparent'}
            pointerEvents={defaultTabs === TradingTabType.Trading ? 'none' : 'auto'}
            cursor={defaultTabs === TradingTabType.Trading ? 'default' : 'pointer'}
            color={defaultTabs === TradingTabType.Trading ? '#1E3EF0' : '#9E9E9F'}
          >
            Trading
          </Box>
          <Box
            className="mr-2"
            role="presentation"
            onClick={() => {
              setDefaultTabs(TradingTabType.Tokens);
            }}
            borderBottom={'2px solid'}
            borderColor={defaultTabs === TradingTabType.Tokens ? '#1E3EF0' : 'transparent'}
            pointerEvents={defaultTabs === TradingTabType.Tokens ? 'none' : 'auto'}
            cursor={defaultTabs === TradingTabType.Tokens ? 'default' : 'pointer'}
            color={defaultTabs === TradingTabType.Tokens ? '#1E3EF0' : '#9E9E9F'}
          >
            Tokens
          </Box>
          <Box
            className="mr-2"
            role="presentation"
            onClick={() => {
              setDefaultTabs(TradingTabType.Markets);
            }}
            borderBottom={'2px solid'}
            borderColor={defaultTabs === TradingTabType.Markets ? '#1E3EF0' : 'transparent'}
            pointerEvents={defaultTabs === TradingTabType.Markets ? 'none' : 'auto'}
            cursor={defaultTabs === TradingTabType.Markets ? 'default' : 'pointer'}
            color={defaultTabs === TradingTabType.Markets ? '#1E3EF0' : '#9E9E9F'}
          >
            Markets Tab
          </Box>
        </Flex>
        <>
          {defaultTabs === TradingTabType.Trading && <TradingTab />}

          {defaultTabs === TradingTabType.Tokens && <TokenTab />}

          {defaultTabs === TradingTabType.Markets && <MarketTab />}
        </>
      </Box>
    </Box>
  );
};
export default DashBoardView;
