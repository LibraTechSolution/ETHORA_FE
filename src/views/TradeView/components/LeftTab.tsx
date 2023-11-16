import { Tabs, TabList, Tab, TabIndicator, TabPanels, TabPanel } from '@chakra-ui/react';
import LimitOrderTab from './LimitOrderTab';
import TraderTab from './TraderTab';

const LeftTab = () => {
  return (
    <Tabs>
      <TabList borderBottom="1px solid #3d3d40" bg="#0c0c10" roundedTop="10px">
        <Tab
          color="#6D6D70"
          fontSize={'sm'}
          fontWeight={'medium'}
          _selected={{ color: '#1E3EF0' }}
          _active={{ bgColor: 'transparent' }}
          paddingX="12px"
          paddingY="8px"
        >
          Trades
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
          Limit Orders
        </Tab>
      </TabList>
      <TabIndicator mt="-1.5px" height="2px" bg="#1E3EF0" borderRadius="1px" />

      <TabPanels>
        <TabPanel padding="0" height={{ base: '300px', xl: '600px' }} overflow="auto">
          <TraderTab />
        </TabPanel>
        <TabPanel padding="0" height={{ base: '300px', xl: '600px' }} overflow="auto">
          <LimitOrderTab />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default LeftTab;
