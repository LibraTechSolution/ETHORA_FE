'use client';

import Link from 'next/link';

import { Button, Center, Flex } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useSignMessage } from 'wagmi';
import { useCallback, useEffect, useState } from 'react';
import { getNonce, login, test } from '@/services/auth';
import useUserStore from '@/store/useUserStore';

// import { ConnectWallet } from '../ConnectWallet';

export const Header = () => {
  const { address } = useAccount();
  const [nonce, setNonce] = useState<string>('');
  const { setUserAndTokens, listWallets, setUser, setToken } = useUserStore();
  const msg = 'test';
  const signMessage = useSignMessage({
    message: nonce,
    onSuccess(data) {
      console.log('Success', data);
      signIn(data);
    },
    onMutate(data) {
      console.log('Mutate', data);
    },
    onError(data) {
      console.log('Error', data);
    },
  });

  const fetchNonce = useCallback(async () => {
    if (!address || (listWallets && listWallets[address.toLowerCase()])) return;
    try {
      const nonceRes = await getNonce(address);
      console.log(nonceRes.data.nonce);
      const msgContent = msg + nonceRes.data.nonce;
      setNonce(msgContent);
    } catch (error) {
      console.log(error);
    }
  }, [address, listWallets]);

  useEffect(() => {
    if (address) {
      console.log(address);
      console.log(listWallets);
      if (listWallets && listWallets[address.toLowerCase()]) {
        console.log(listWallets[address.toLowerCase()]);
        setUser(listWallets[address.toLowerCase()].user);
        setToken(listWallets[address.toLowerCase()].tokens);
      } else {
        fetchNonce();
      }
    }
  }, [address, fetchNonce, listWallets, setToken, setUser]);

  const signMsg = () => {
    signMessage.signMessage();
  };

  const signIn = async (signMessageData: `0x${string}`) => {
    try {
      const userInfo = await login(address, signMessageData, msg);
      setUserAndTokens(userInfo.data.user, userInfo.data.tokens);
    } catch (error) {
      console.log(error);
    }
  };

  const testAPI = () => {
    test();
  };

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
          {nonce && <Button onClick={signMsg}>Sign msg</Button>}
          <Button onClick={testAPI}>Test API</Button>
        </Flex>
      </Flex>
      <Flex gap={6}></Flex>
    </Flex>
  );
};
