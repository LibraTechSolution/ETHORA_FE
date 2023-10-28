'use client';

import { Box, Flex } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import { DashboardIcon } from 'public/images/icons/dashboardIcon';
import { AnalyticIcon } from 'public/images/icons/analyticIcon';
import { ChartIcon } from 'public/images/icons/chartIcon';
import { EventIcon } from 'public/images/icons/eventIcon';
import { ShortcutIcon } from 'public/images/icons/shortcutIcon';

const NavBar = () => {
  const currentRoute = usePathname();

  return (
    <Box position={'relative'}>
      <Flex
        w="full"
        color="white"
        direction={['row', 'row', 'column', 'column']}
        fontSize={14}
        fontStyle="italic"
        width={'80px'}
        minW={'80px'}
        maxW={'80px'}
        minH={['100', '100%', 'calc(100vh - 60px)', 'calc(100vh - 60px)']}
        borderRight={'2px solid rgba(28, 28, 30, 0.8)'}
        gap={'20px'}
        align={'center'}
        paddingTop={'30px'}
        display={['none', 'none', 'flex', 'flex']}
      >
        <Box
          borderRight={'2px solid'}
          borderColor={currentRoute === '/dashboard' ? '#1E3EF0' : 'transparent'}
          padding={'0px 20px'}
        >
          <DashboardIcon fill={currentRoute === '/dashboard' ? '#1E3EF0' : '#9E9E9F'} />
        </Box>
        <Box
          borderRight={'2px solid'}
          padding={'0px 20px'}
          borderColor={currentRoute === '/analytic' ? '#1E3EF0' : 'transparent'}
        >
          <AnalyticIcon fill={currentRoute === '/analytic' ? '#1E3EF0' : '#9E9E9F'} />
        </Box>
        <Box
          borderRight={'2px solid '}
          padding={'0px 20px'}
          borderColor={currentRoute === '/chart' ? '#1E3EF0' : 'transparent'}
        >
          <ChartIcon fill={currentRoute === '/chart' ? '#1E3EF0' : '#9E9E9F'} />
        </Box>
        <Box
          borderRight={'2px solid '}
          padding={'0px 20px'}
          borderColor={currentRoute === '/event' ? '#1E3EF0' : 'transparent'}
        >
          <EventIcon fill={currentRoute === '/event' ? '#1E3EF0' : '#9E9E9F'} />
        </Box>
        <Box
          borderRight={'2px solid '}
          padding={'0px 20px'}
          borderColor={currentRoute === '/shortcut' ? '#1E3EF0' : 'transparent'}
        >
          <ShortcutIcon fill={currentRoute === '/shortcut' ? '#1E3EF0' : '#9E9E9F'} />
        </Box>
      </Flex>
      <Box
        display={['block', 'block', 'none', 'none']}
        boxShadow={'0px 4px 20px 0px rgba(0, 0, 0, 0.30)'}
        borderTopLeftRadius={'20px'}
        borderTopRightRadius={'20px'}
        background={'#050506'}
        position={'fixed'}
        width={'100%'}
        bottom={'0'}
        padding={'0px 15px 10px'}
        zIndex={'999'}
      >
        <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
          <Box
            borderTop={'2px solid'}
            padding={'12px 5px'}
            borderColor={currentRoute === '/dashboard' ? '#1E3EF0' : 'transparent'}
          >
            <DashboardIcon fill={currentRoute === '/dashboard' ? '#1E3EF0' : '#9E9E9F'} />
          </Box>
          <Box
            borderTop={'2px solid'}
            padding={'12px 5px'}
            borderColor={currentRoute === '/analytic' ? '#1E3EF0' : 'transparent'}
          >
            <AnalyticIcon fill={currentRoute === '/analytic' ? '#1E3EF0' : '#9E9E9F'} />
          </Box>

          <Box
            borderTop={'2px solid'}
            padding={'12px 5px'}
            borderColor={currentRoute === '/chart' ? '#1E3EF0' : 'transparent'}
          >
            <ChartIcon fill={currentRoute === '/chart' ? '#1E3EF0' : '#9E9E9F'} />
          </Box>

          <Box
            borderTop={'2px solid'}
            padding={'12px 5px'}
            borderColor={currentRoute === '/event' ? '#1E3EF0' : 'transparent'}
          >
            <EventIcon fill={currentRoute === '/event' ? '#1E3EF0' : '#9E9E9F'} />
          </Box>

          <Box
            borderTop={'2px solid'}
            padding={'12px 5px'}
            borderColor={currentRoute === '/shortcut' ? '#1E3EF0' : 'transparent'}
          >
            <ShortcutIcon fill={currentRoute === '/shortcut' ? '#1E3EF0' : '#9E9E9F'} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default NavBar;
