'use client';

import { Box, Center, Flex, Link, Tooltip } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import { BarChartBig, LayoutGrid, Redo, TrendingUp, Trophy } from 'lucide-react';
import NextLink from 'next/link';

const NavBar = () => {
  const currentRoute = usePathname();
  return (
    <Box
      zIndex={1}
      width={{ base: '100%', lg: '70px' }}
      padding={{ base: '20px', lg: '20px 0' }}
      position={{ base: 'fixed', lg: 'static' }}
      bottom={{ base: '0px', lg: 'auto' }}
      borderRadius={{ base: '20px 20px 0px 0px', lg: '0px' }}
      boxShadow={{ base: '0px 4px 20px 0px rgba(0, 0, 0, 0.30)', lg: 'none' }}
      backdropFilter={{ base: 'blur(7px)', lg: 'none' }}
    >
      <Flex
        flexDirection={{ base: 'row', lg: 'column' }}
        alignItems={'center'}
        justifyContent={{ base: 'space-between', lg: 'center' }}
        gap={'20px'}
      >
        <Center
          width={{ base: 'auto', lg: '100%' }}
          borderRightWidth={{ base: '0', lg: '2px' }}
          borderRight={{ base: 'none', lg: currentRoute === '/dashboard' ? '2px solid #1E3EF0' : 'none' }}
        >
          <Tooltip fontSize={'12px'} hasArrow label="Dashboard" color="white" placement="top" bg="#050506">
            <Link
              as={NextLink}
              href="/dashboard"
              className={`${
                currentRoute === '/dashboard' ? 'border-[#1E3EF0] shadow-iconShadow' : 'border-[#252528]'
              } group flex h-8 w-8 items-center justify-center rounded-[10px] border hover:border-[#1E3EF0] hover:shadow-iconShadow`}
            >
              <LayoutGrid
                className={`${
                  currentRoute === '/dashboard' ? 'text-[#1E3EF0]' : 'text-[#9E9E9F]'
                } group-hover:text-[#1E3EF0]`}
                strokeWidth={1}
              />
            </Link>
          </Tooltip>
        </Center>
        <Center
          width={{ base: 'auto', lg: '100%' }}
          borderRightWidth={{ base: '0', lg: '2px' }}
          borderRight={{ base: 'none', lg: currentRoute.includes('trade') ? '2px solid #1E3EF0' : 'none' }}
        >
          <Tooltip fontSize={'12px'} hasArrow label="Trade" color="white" placement="top" bg="#050506">
            <Link
              as={NextLink}
              href="/trade/BTC-USD"
              className={`${
                currentRoute.includes('trade') ? 'border-[#1E3EF0] shadow-iconShadow' : 'border-[#252528]'
              } group flex h-8 w-8 items-center justify-center rounded-[10px] border hover:border-[#1E3EF0] hover:shadow-iconShadow`}
            >
              <BarChartBig
                className={`${
                  currentRoute.includes('trade') ? 'text-[#1E3EF0]' : 'text-[#9E9E9F]'
                } group-hover:text-[#1E3EF0]`}
                strokeWidth={1}
              />
            </Link>
          </Tooltip>
        </Center>
        <Center
          width={{ base: 'auto', lg: '100%' }}
          borderRightWidth={{ base: '0', lg: '2px' }}
          borderRight={{ base: 'none', lg: 'none' }}
        >
          <Tooltip fontSize={'12px'} hasArrow label="Pratice Trading" color="white" placement="top" bg="#050506">
            <Link
              as={NextLink}
              href="/trade/BTC-USD"
              className="group flex h-8 w-8 items-center justify-center rounded-[10px] border border-[#252528] hover:border-[#1E3EF0] hover:shadow-iconShadow"
            >
              <TrendingUp className="text-[#9E9E9F] group-hover:text-[#1E3EF0]" strokeWidth={1} />
            </Link>
          </Tooltip>
        </Center>
        <Center
          width={{ base: 'auto', lg: '100%' }}
          borderRightWidth={{ base: '0', lg: '2px' }}
          borderRight={{ base: 'none', lg: currentRoute.includes('leaderboard') ? '2px solid #1E3EF0' : 'none' }}
        >
          <Tooltip fontSize={'12px'} hasArrow label="Leaderboard" color="white" placement="top" bg="#050506">
            <Link
              as={NextLink}
              href="/leaderboard"
              className={`${
                currentRoute === '/leaderboard' ? 'border-[#1E3EF0] shadow-iconShadow' : 'border-[#252528]'
              } group flex h-8 w-8 items-center justify-center rounded-[10px] border hover:border-[#1E3EF0] hover:shadow-iconShadow`}
            >
              <Trophy
                className={`${
                  currentRoute === '/leaderboard' ? 'text-[#1E3EF0]' : 'text-[#9E9E9F]'
                } group-hover:text-[#1E3EF0]`}
                strokeWidth={1}
              />
            </Link>
          </Tooltip>
        </Center>
        <Center
          width={{ base: 'auto', lg: '100%' }}
          borderRightWidth={{ base: '0', lg: '2px' }}
          borderRight={{ base: 'none', lg: currentRoute === '/referral' ? '2px solid #1E3EF0' : 'none' }}
        >
          <Tooltip fontSize={'12px'} hasArrow label="Referral" color="white" placement="top" bg="#050506">
            <Link
              as={NextLink}
              href="/referral"
              className={`${
                currentRoute === '/referral' ? 'border-[#1E3EF0] shadow-iconShadow' : 'border-[#252528]'
              } group flex h-8 w-8 items-center justify-center rounded-[10px] border hover:border-[#1E3EF0] hover:shadow-iconShadow`}
            >
              <Redo
                className={`${
                  currentRoute === '/referral' ? 'text-[#1E3EF0]' : 'text-[#9E9E9F]'
                } group-hover:text-[#1E3EF0]`}
                strokeWidth={1}
              />
            </Link>
          </Tooltip>
        </Center>
      </Flex>
    </Box>
  );
};

export default NavBar;
