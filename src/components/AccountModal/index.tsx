import { appConfig } from '@/config';
import { Status } from '@/types/faucet.type';
import { formatAddress } from '@/utils/address';
import { copyText } from '@/utils/copyText';
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
} from '@chakra-ui/react';
import { disconnect, readContract } from '@wagmi/core';
import { CopyIcon, ExternalLink, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useAccount, useNetwork, useSignTypedData } from 'wagmi';
import { ToastLayout } from '../ToastLayout';
import useUserStore from '@/store/useUserStore';
import { useEffect } from 'react';
import useModalStore from '@/store/useModalStore';
import registerABI from '@/config/abi/registerABI';
import { BaseError } from 'viem';

interface ModalProp {
  isOpen: boolean;
  onClose: () => void;
}

// The named list of all type definitions
const types = {
  DeregisterAccount: [
    { name: 'user', type: 'address' },
    { name: 'nonce', type: 'uint256' },
  ],
} as const;

export const AccountModal = ({ isOpen, onClose }: ModalProp) => {
  const { address, isDisconnected } = useAccount();
  const toast = useToast();
  const { tokens, deactiveAccount, user } = useUserStore();
  const { onOpen } = useModalStore();
  const { chain } = useNetwork();

  const domain = {
    name: 'Validator',
    version: '1',
    chain: chain ? chain.id : 1,
    verifyingContract: appConfig.registerSC as `0x${string}`,
  } as const;

  let messageV4 = {
    user: user?.address ? user.address : '0x0',
    nonce: BigInt(0),
  } as const;

  const { signTypedData } = useSignTypedData({
    domain,
    message: messageV4,
    primaryType: 'DeregisterAccount',
    types,
    onSuccess(data) {
      if (!chain) return;
      console.log('call API deactive');

      deactiveAccount();
      onClose();
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
            title="Deactive account Unsuccessfully"
            content={msgContent}
            status={Status.ERROR}
            close={onClose}
          />
        ),
      });
    },
  });

  useEffect(() => {
    if (isDisconnected) {
      onClose();
    }
  }, [isDisconnected, onClose]);

  const handleDisconnect = () => {
    disconnect();
    onClose();
  };

  const handleCopy = () => {
    if (!address) return;
    copyText(address);

    toast({
      position: 'top',
      render: ({ onClose }) => <ToastLayout title="Copy Successfully" status={Status.SUCCESSS} close={onClose} />,
    });
  };

  const handleActiveModal = () => {
    onClose();
    onOpen();
  };

  const handleDeactiveAcc = async () => {
    try {
      const data = await readContract({
        address: appConfig.registerSC as `0x${string}`,
        abi: registerABI,
        functionName: 'accountMapping',
        args: [user?.address as `0x${string}`],
      });
      messageV4 = {
        ...messageV4,
        nonce: BigInt(data[1]),
      };
      signTypedData();
    } catch (error) {
      console.log(error);
    }
    // refetch();
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
        <ModalHeader color="#fff" paddingX="32px" paddingTop="26px" fontSize="24px" fontWeight="600">
          Your wallet
        </ModalHeader>
        <ModalCloseButton color="#fff" top="26px" right="32px" />
        <ModalBody>
          <Flex direction={'column'}>
            <Center>
              <Image alt="avatar" src="/images/icons/avatar.svg" w="64px" h="64px" />
            </Center>
            <Center color="#6052FB" paddingTop="27px" fontSize="20px" fontWeight="600">
              {formatAddress(address?.toLocaleLowerCase(), 4, 9)}
            </Center>
          </Flex>
          <Grid templateColumns="repeat(3, 1fr)" paddingY="20px">
            <GridItem w="100%" paddingRight="2.5" cursor="pointer" onClick={handleCopy}>
              <Center>
                <CopyIcon color="#6052FB" />
              </Center>
              <Center color="#fff" fontWeight="600" paddingTop="8px">
                Copy address
              </Center>
            </GridItem>
            <GridItem w="100%" paddingX="2.5" borderX="1px solid #38383A" cursor="pointer">
              <Link href={`${appConfig.arbiscan}/address/${address}`} target="_blank">
                <Center>
                  <ExternalLink color="#6052FB" />
                </Center>
                <Center color="#fff" fontWeight="600" paddingTop="8px">
                  Visit wallet
                </Center>
              </Link>
            </GridItem>
            <GridItem w="100%" paddingLeft="2.5" cursor="pointer" onClick={handleDisconnect}>
              <Center>
                <LogOut color="#6052FB" />
              </Center>
              <Center color="#fff" fontWeight="600" paddingTop="8px">
                Disconnect
              </Center>
            </GridItem>
          </Grid>
        </ModalBody>

        <ModalFooter paddingTop="0px" paddingBottom="40px">
          {!user?.isRegistered ? (
            <Center width="100%">
              <Button
                onClick={handleActiveModal}
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
                Activate account
              </Button>
            </Center>
          ) : (
            <Flex direction="column" width="100%">
              <Center width="100%" paddingBottom="10px">
                <Button
                  onClick={handleDeactiveAcc}
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
                  Deactivate account
                </Button>
              </Center>
              <Center width="100%">
                <Button
                  onClick={() => console.log('====')}
                  type="button"
                  textColor="#6052FB"
                  bgColor="transparent"
                  _hover={{ textColor: '#7A72F6', bgColor: 'transparent' }}
                  _active={{ textColor: '#342BC3', bgColor: 'transparent' }}
                  fontSize="16px"
                  paddingX="12px"
                  paddingY="15px"
                  rounded="10px"
                >
                  Revoke approval
                </Button>
              </Center>
            </Flex>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
