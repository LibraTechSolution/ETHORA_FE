'use client';

import { Box, Center, Flex, Link } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import { BarChartBig, LayoutGrid, Redo, TrendingUp, Trophy } from 'lucide-react';
import NextLink from 'next/link';

const NavBar = () => {
  const currentRoute = usePathname();
  return (
    <Box
      zIndex={1}
      width={{ base: '100%', lg: '70px' }}
      background={{ base: '#050506', lg: 'rgba(28, 28, 30,.5)' }}
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
          <Link
            as={NextLink}
            href="/dashboard"
            className={`${
              currentRoute === '/dashboard' ? 'border-[#1E3EF0]' : 'border-[#9E9E9F]'
            } group flex h-8 w-8 items-center justify-center rounded-[10px] border hover:border-[#1E3EF0] hover:shadow-iconShadow`}
          >
            <LayoutGrid
              className={`${
                currentRoute === '/dashboard' ? 'text-[#1E3EF0]' : 'text-[#9E9E9F]'
              } group-hover:text-[#1E3EF0]`}
              strokeWidth={1}
            />
          </Link>
        </Center>
        <Center
          width={{ base: 'auto', lg: '100%' }}
          borderRightWidth={{ base: '0', lg: '2px' }}
          borderRight={{ base: 'none', lg: currentRoute.includes('trade') ? '2px solid #1E3EF0' : 'none' }}
        >
          <Link
            as={NextLink}
            href="/trade/BTC-USD"
            className={`${
              currentRoute.includes('trade') ? 'border-[#1E3EF0]' : 'border-[#9E9E9F]'
            } group flex h-8 w-8 items-center justify-center rounded-[10px] border hover:border-[#1E3EF0] hover:shadow-iconShadow`}
          >
            <BarChartBig
              className={`${
                currentRoute.includes('trade') ? 'text-[#1E3EF0]' : 'text-[#9E9E9F]'
              } group-hover:text-[#1E3EF0]`}
              strokeWidth={1}
            />
          </Link>
        </Center>
        <Link
          as={NextLink}
          href="/"
          className="group flex h-8 w-8 items-center justify-center rounded-[10px] border border-[#9E9E9F] hover:border-[#1E3EF0] hover:shadow-iconShadow"
        >
          <TrendingUp className="text-[#9E9E9F] group-hover:text-[#1E3EF0]" strokeWidth={1} />
        </Link>
        <Link
          as={NextLink}
          href="/"
          className="group flex h-8 w-8 items-center justify-center rounded-[10px] border border-[#9E9E9F] hover:border-[#1E3EF0] hover:shadow-iconShadow"
        >
          <Trophy className="text-[#9E9E9F] group-hover:text-[#1E3EF0]" strokeWidth={1} />
        </Link>
        <Center
          width={{ base: 'auto', lg: '100%' }}
          borderRightWidth={{ base: '0', lg: '2px' }}
          borderRight={{ base: 'none', lg: currentRoute === '/referral' ? '2px solid #1E3EF0' : 'none' }}
        >
          <Link
            as={NextLink}
            href="/referral"
            className={`${
              currentRoute === '/referral' ? 'border-[#1E3EF0]' : 'border-[#9E9E9F]'
            } group flex h-8 w-8 items-center justify-center rounded-[10px] border hover:border-[#1E3EF0] hover:shadow-iconShadow`}
          >
            <Redo
              className={`${
                currentRoute === '/referral' ? 'text-[#1E3EF0]' : 'text-[#9E9E9F]'
              } group-hover:text-[#1E3EF0]`}
              strokeWidth={1}
            />
          </Link>
        </Center>
      </Flex>
    </Box>
  );
};

export default NavBar;
