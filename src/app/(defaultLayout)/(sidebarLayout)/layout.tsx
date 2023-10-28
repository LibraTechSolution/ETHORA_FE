'use client';
import {
  Flex,
  Box,
  Heading,
  Text,
  InputGroup,
  Input,
  Tooltip,
  InputRightElement,
  Button,
  Link,
  useMediaQuery,
} from '@chakra-ui/react';
import { useState } from 'react';
import { QuestionOutlineIcon } from '@chakra-ui/icons';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { DashboardIcon } from 'public/images/icons/dashboardIcon';
import NextLink from 'next/link';
import { BarChartBig, LayoutGrid, Redo, TrendingUp, Trophy } from 'lucide-react';

export default function SidebarLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  // const [isMobile] = useMediaQuery('(max-width: 992px)');
  return (
    <Flex
      color="white"
      marginX={'-20px'}
      height={'100%'}
      flex={1}
      bgImage="url('/images/profile/bg-item.png')"
      bgRepeat="no-repeat"
      bgPosition="top -50px left -120px"
      paddingBottom={{ base: '70px', lg: '0' }}
      // position={isMobile ? 'relative' : 'static'}
    >
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
          <Link
            as={NextLink}
            href="/"
            className="group flex h-8 w-8 items-center justify-center rounded-[10px] border border-[#9E9E9F] hover:border-[#1E3EF0] hover:shadow-iconShadow"
          >
            <LayoutGrid className="text-[#9E9E9F] group-hover:text-[#1E3EF0]" strokeWidth={1} />
          </Link>
          <Link
            as={NextLink}
            href="/"
            className="group flex h-8 w-8 items-center justify-center rounded-[10px] border border-[#9E9E9F] hover:border-[#1E3EF0] hover:shadow-iconShadow"
          >
            <BarChartBig className="text-[#9E9E9F] group-hover:text-[#1E3EF0]" strokeWidth={1} />
          </Link>
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
          <Link
            as={NextLink}
            href="/referral"
            className="group flex h-8 w-8 items-center justify-center rounded-[10px] border border-[#9E9E9F] hover:border-[#1E3EF0] hover:shadow-iconShadow"
          >
            <Redo className="text-[#9E9E9F] group-hover:text-[#1E3EF0]" strokeWidth={1} />
          </Link>
        </Flex>
      </Box>

      <Box flex={1} paddingX={{ base: '12px', lg: '80px' }}>
        {children}
      </Box>
    </Flex>
  );
}
