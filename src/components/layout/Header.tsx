'use client';

import Link from 'next/link';

import { Center, Flex } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

// import { ConnectWallet } from '../ConnectWallet';

export const Header = () => {
  const { address, isConnected } = useAccount();
  console.log(address, isConnected);
  return (
    <Flex
      as="header"
      role="menu"
      px={{ base: 2.5, md: 10 }}
      pt={{ base: 2.5, md: 5 }}
      justifyContent="space-between"
      alignItems="center"
      fontSize={14}
      zIndex={10}
    >
      <Flex gap={10} alignItems="center">
        <Center gap={2.5}>
          <Link href="/">Home</Link>
        </Center>
        <Flex>
          {/* <ConnectWallet /> */}
          <ConnectButton />
        </Flex>
      </Flex>
      <Flex gap={6}></Flex>
    </Flex>
  );
};
