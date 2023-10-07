import {
  Modal,
  Button,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Center,
  Flex,
  Image,
  Grid,
  GridItem,
  useToast,
  Box,
} from '@chakra-ui/react';
import { useAccount, useSignMessage } from 'wagmi';
import { ToastLayout } from '../ToastLayout';
import useUserStore from '@/store/useUserStore';
import { useCallback, useEffect, useMemo, useState } from 'react';
import useModalStore from '@/store/useModalStore';
import { getNonce, login } from '@/services/auth';
import { Check } from 'lucide-react';

export const ActiveAccountModal = () => {
  const { address, isDisconnected } = useAccount();
  const toast = useToast();
  const { listWallets, setUserAndTokens } = useUserStore();
  const { isOpen, onClose } = useModalStore();
  const [nonce, setNonce] = useState<string>('');
  const isRegisterd = useMemo(() => {
    if (listWallets && address && listWallets[address.toLocaleLowerCase()]) {
      return true;
    }
    return false;
  }, [address, listWallets]);
  const msg = 'test ';
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
      const userInfo = await login(address, signMessageData, msg);
      setUserAndTokens(userInfo.data.data.user, userInfo.data.data.tokens);
    } catch (error) {
      console.log(error);
    }
  };

  const signMsg = () => {
    signMessage.signMessage();
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

            {!isRegisterd ? (
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
                Create
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

            {!isRegisterd ? (
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
