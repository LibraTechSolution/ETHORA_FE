'use client';

import {
  Modal,
  Button,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Center,
  Flex,
  Image,
  Grid,
  GridItem,
  useToast,
  Box,
} from '@chakra-ui/react';
import { useAccount, useSignMessage, useSignTypedData, useNetwork } from 'wagmi';
import { ToastLayout } from '../ToastLayout';
import useUserStore from '@/store/useUserStore';
import { useCallback, useEffect, useMemo, useState } from 'react';
import useModalStore from '@/store/useModalStore';
import { getNonce, login, register } from '@/services/auth';
import { Check } from 'lucide-react';
import { appConfig } from '@/config';
import registerABI from '@/config/abi/registerABI';
import { readContract } from '@wagmi/core';
import { Address, BaseError } from 'viem';
import { Status } from '@/types/faucet.type';

// The named list of all type definitions
const types = {
  RegisterAccount: [
    { name: 'oneCT', type: 'address' },
    { name: 'user', type: 'address' },
    { name: 'nonce', type: 'uint256' },
  ],
} as const;

export const ActiveAccountModal = () => {
  const { address, isDisconnected } = useAccount();
  const toast = useToast();
  const { listWallets, setUserAndTokens, user } = useUserStore();
  const { isOpen, onClose } = useModalStore();
  const [nonce, setNonce] = useState<string>('');
  const msg = 'test ';
  const { chain } = useNetwork();
  const domain = {
    name: 'Validator',
    version: '1',
    chain: chain ? chain?.id : 5,
    verifyingContract: appConfig.registerSC as Address,
  } as const;

  let messageV4 = {
    oneCT: user?.oneCT ? user.oneCT : '0x0',
    user: user?.address ? user.address : '0x0',
    nonce: BigInt(0),
  } as const;

  const { signTypedData } = useSignTypedData({
    domain,
    message: messageV4,
    primaryType: 'RegisterAccount',
    types,
    onSuccess(data) {
      console.log(data);
      if (!chain) return;
      register(data, chain.id);
    },
    onError(error) {
      let msgContent = '';
      if (error instanceof BaseError) {
        if (error.shortMessage.includes('User rejected the request.')) {
          msgContent = 'User rejected the request!';
        } else if (error.shortMessage.includes('the balance of the account')) {
          msgContent = 'Your account balance is insufficient for gas * gas price + value!';
        } else {
          msgContent = 'Something went wrong. Please try again later.';
        }
      }
      toast({
        position: 'top',
        render: ({ onClose }) => (
          <ToastLayout
            title="Register account Unsuccessfully"
            content={msgContent}
            status={Status.ERROR}
            close={onClose}
          />
        ),
      });
    },
  });

  const isCreated = useMemo(() => {
    if (listWallets && address && listWallets[address.toLocaleLowerCase()]) {
      return true;
    }
    return false;
  }, [address, listWallets]);

  const signMessage = useSignMessage({
    message: nonce,
    onSuccess(data) {
      signIn(data);
    },
  });

  const fetchNonce = useCallback(async () => {
    if (!address || (listWallets && listWallets[address.toLowerCase()])) return;
    try {
      const nonceRes = await getNonce(address);
      const msgContent = msg + nonceRes.data.data.nonce;
      setNonce(msgContent);
    } catch (error) {
      console.log(error);
    }
  }, [address, listWallets]);

  useEffect(() => {
    if (isOpen) {
      fetchNonce();
    }
  }, [fetchNonce, isOpen]);

  useEffect(() => {
    if (isDisconnected) {
      onClose();
    }
  }, [isDisconnected, onClose]);

  const signIn = async (signMessageData: `0x${string}`) => {
    try {
      if (!address || !signMessageData) return;
      const userInfo = await login(421613, address, signMessageData, msg);
      setUserAndTokens(userInfo.data.data.user, userInfo.data.data.tokens);
    } catch (error) {
      console.log(error);
    }
  };

  const signMsg = () => {
    signMessage.signMessage();
  };

  const registerAccount = async () => {
    try {
      const data = await readContract({
        address: appConfig.registerSC as `0x${string}`,
        abi: registerABI,
        functionName: 'accountMapping',
        args: [user?.address as `0x${string}`],
      });
      console.log(data);
      messageV4 = {
        ...messageV4,
        nonce: BigInt(data[1]),
      };
      console.log(messageV4);
      signTypedData();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        maxWidth="561px"
        background="linear-gradient(0deg, rgba(28, 28, 30, 0.5), rgba(28, 28, 30, 0.5)), linear-gradient(0deg, #242428, #242428)"
        border="1px solid #242428"
        rounded="20px"
      >
        <ModalHeader
          color="#fff"
          paddingX="32px"
          paddingTop="26px"
          paddingBottom="20px"
          fontSize="24px"
          fontWeight="600"
        >
          Activate your Trading account
        </ModalHeader>
        <ModalCloseButton color="#fff" top="26px" right="32px" />
        <ModalBody paddingBottom="20px">
          <Grid templateColumns="repeat(4, 1fr)" marginBottom="20px">
            <GridItem w="100%" paddingRight="2.5" borderRight="1px solid #38383A">
              <Center>
                <Image alt="avatar" src="/images/icons/gas-pump.svg" w="24px" h="24px" />
              </Center>
              <Center color="#fff" fontWeight="600" paddingTop="8px">
                Zero gas
              </Center>
            </GridItem>
            <GridItem w="100%" paddingX="2.5" borderRight="1px solid #38383A" cursor="pointer">
              <Center>
                <Image alt="avatar" src="/images/icons/thunder-line.svg" w="24px" h="24px" />
              </Center>
              <Center color="#fff" fontWeight="600" paddingTop="8px">
                Instant
              </Center>
            </GridItem>
            <GridItem w="100%" paddingX="2.5" borderRight="1px solid #38383A">
              <Center>
                <Image alt="avatar" src="/images/icons/pointer.svg" w="24px" h="24px" />
              </Center>
              <Center color="#fff" fontWeight="600" paddingTop="8px">
                1 Click
              </Center>
            </GridItem>
            <GridItem w="100%" paddingLeft="2.5">
              <Center>
                <Image alt="avatar" src="/images/icons/shield-check.svg" w="24px" h="24px" />
              </Center>
              <Center color="#fff" fontWeight="600" paddingTop="8px">
                Non Custodial
              </Center>
            </GridItem>
          </Grid>
          <Flex
            padding="20px"
            border="1px solid #252528"
            background="linear-gradient(0deg, #0C0C10, #0C0C10),linear-gradient(0deg, #252528, #252528)"
            rounded="10px"
            justifyContent="space-between"
          >
            <Box>
              <p className="pb-1 text-sm font-semibold text-[#fff]">Register your account</p>
              <p className="text-sm font-normal text-[#9E9E9F]">No gas required</p>
            </Box>

            {!isCreated ? (
              <Button
                onClick={signMsg}
                type="button"
                bgColor="#6052FB"
                textColor="#ffffff"
                _hover={{ bgColor: '#7A72F6', textColor: '#ffffff' }}
                _active={{ bgColor: '#342BC3', textColor: '#ffffff' }}
                fontSize="16px"
                paddingX="12px"
                paddingY="15px"
                rounded="10px"
              >
                Create
              </Button>
            ) : (
              <Button
                leftIcon={<Check color="#fff" />}
                type="button"
                bgColor="#1ED768"
                textColor="#ffffff"
                disabled={true}
                _hover={{ bgColor: '#1ED768', textColor: '#ffffff' }}
                _active={{ bgColor: '#1ED768', textColor: '#ffffff' }}
                fontSize="16px"
                paddingX="12px"
                paddingY="15px"
                rounded="10px"
              >
                Created
              </Button>
            )}
          </Flex>
          <Flex
            padding="20px"
            border="1px solid #252528"
            background="linear-gradient(0deg, #0C0C10, #0C0C10),linear-gradient(0deg, #252528, #252528)"
            rounded="10px"
            justifyContent="space-between"
          >
            <Box>
              <p className="pb-1 text-sm font-semibold text-[#fff]">Register your account</p>
              <p className="text-sm font-normal text-[#9E9E9F]">No gas required</p>
            </Box>

            {!user?.isRegistered ? (
              <Button
                onClick={registerAccount}
                type="button"
                bgColor="#6052FB"
                textColor="#ffffff"
                _hover={{ bgColor: '#7A72F6', textColor: '#ffffff' }}
                _active={{ bgColor: '#342BC3', textColor: '#ffffff' }}
                fontSize="16px"
                paddingX="12px"
                paddingY="15px"
                rounded="10px"
              >
                Register
              </Button>
            ) : (
              <Button
                leftIcon={<Check color="#fff" />}
                type="button"
                bgColor="#1ED768"
                textColor="#ffffff"
                disabled={true}
                _hover={{ bgColor: '#1ED768', textColor: '#ffffff' }}
                _active={{ bgColor: '#1ED768', textColor: '#ffffff' }}
                fontSize="16px"
                paddingX="12px"
                paddingY="15px"
                rounded="10px"
              >
                Registered
              </Button>
            )}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
