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
import { disconnect, readContract, signTypedData } from '@wagmi/core';
import { CopyIcon, ExternalLink, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useAccount, useNetwork, useSignTypedData } from 'wagmi';
import { ToastLayout } from '../ToastLayout';
import useUserStore from '@/store/useUserStore';
import { useCallback, useEffect, useState } from 'react';
import useModalStore from '@/store/useModalStore';
import registerABI from '@/config/abi/registerABI';
import { Address, BaseError } from 'viem';
import { register } from '@/services/auth';
import { useQueryClient } from '@tanstack/react-query';

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
  const { user, toggleRegisteredAccount } = useUserStore();
  const { onOpen } = useModalStore();
  const { chain } = useNetwork();
  const [isLoadingDeactive, setIsLoadingDeactive] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const domain = {
    name: 'Validator',
    version: '1',
    chainId: chain ? chain.id : 1,
    verifyingContract: appConfig.registerSC as `0x${string}`,
  } as const;

  // const { signTypedData, data: msgTypedData } = useSignTypedData({
  //   domain,
  //   message: {
  //     user: user?.address ? user.address : '0x0',
  //     nonce: oneCTNonce,
  //   },
  //   primaryType: 'DeregisterAccount',
  //   types,
  //   onError(error) {
  //     let msgContent = '';
  //     if (error instanceof BaseError) {
  //       if (error.shortMessage.includes('User rejected the request.')) {
  //         msgContent = 'User rejected the request!';
  //       } else if (error.shortMessage.includes('the balance of the account')) {
  //         msgContent = 'Your account balance is insufficient for gas * gas price + value!';
  //       } else {
  //         msgContent = 'Something went wrong. Please try again later.';
  //       }
  //     }
  //     toast({
  //       position: 'top',
  //       render: ({ onClose }) => (
  //         <ToastLayout
  //           title="Deactive account Unsuccessfully"
  //           content={msgContent}
  //           status={Status.ERROR}
  //           close={onClose}
  //         />
  //       ),
  //     });
  //   },
  // });

  const deRegisterAcc = async (signature: Address) => {
    if (!chain || !signature) {
      setIsLoadingDeactive(false);
      return;
    }
    try {
      await register(signature, chain.id, false);
      toggleRegisteredAccount(false);
      toast({
        position: 'top',
        render: ({ onClose }) => (
          <ToastLayout title="Deactive account successfully" status={Status.SUCCESSS} close={onClose} />
        ),
      });
      setIsLoadingDeactive(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        position: 'top',
        render: ({ onClose }) => (
          <ToastLayout
            title="Deactive account Unsuccessfully"
            content={error.response.data.message}
            status={Status.ERROR}
            close={onClose}
          />
        ),
      });
      setIsLoadingDeactive(false);
    }
  };

  useEffect(() => {
    if (isDisconnected) {
      onClose();
    }
  }, [isDisconnected, onClose]);

  const handleDisconnect = () => {
    disconnect();
    onClose();
    queryClient.clear();
  };

  const handleCopy = () => {
    if (!address) return;
    copyText(address);

    toast({
      position: 'top',
      render: ({ onClose }) => <ToastLayout title="Copied successfully" status={Status.SUCCESSS} close={onClose} />,
    });
  };

  const handleActiveModal = () => {
    onClose();
    onOpen();
  };

  const signTypedDataV4 = async (nonce: bigint) => {
    try {
      const signature = await signTypedData({
        domain,
        message: {
          user: user?.address ? user.address : '0x0',
          nonce: BigInt(nonce),
        },
        primaryType: 'DeregisterAccount',
        types,
      });
      deRegisterAcc(signature);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setIsLoadingDeactive(false);
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
    }
  };

  const handleDeactiveAcc = async () => {
    try {
      setIsLoadingDeactive(true);
      const data = await readContract({
        address: appConfig.registerSC as `0x${string}`,
        abi: registerABI,
        functionName: 'accountMapping',
        args: [user?.address as `0x${string}`],
      });
      signTypedDataV4(data[1]);
    } catch (error) {
      setIsLoadingDeactive(false);
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
            <Center color="#1E3EF0" paddingTop="27px" fontSize="20px" fontWeight="600">
              {formatAddress(address?.toLocaleLowerCase(), 4, 9)}
            </Center>
          </Flex>
          <Grid templateColumns="repeat(3, 1fr)" paddingY="20px">
            <GridItem w="100%" paddingRight="2.5" cursor="pointer" onClick={handleCopy}>
              <Center>
                <CopyIcon color="#1E3EF0" />
              </Center>
              <Center color="#fff" fontWeight="600" paddingTop="8px">
                Copy address
              </Center>
            </GridItem>
            <GridItem w="100%" paddingX="2.5" borderX="1px solid #38383A" cursor="pointer">
              <Link href={`${appConfig.arbiscan}/address/${address}`} target="_blank">
                <Center>
                  <ExternalLink color="#1E3EF0" />
                </Center>
                <Center color="#fff" fontWeight="600" paddingTop="8px">
                  Visit wallet
                </Center>
              </Link>
            </GridItem>
            <GridItem w="100%" paddingLeft="2.5" cursor="pointer" onClick={handleDisconnect}>
              <Center>
                <LogOut color="#1E3EF0" />
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
                bgColor="#1E3EF0"
                textColor="#ffffff"
                _hover={{ bgColor: '#4B65F3', textColor: '#ffffff' }}
                _active={{ bgColor: '#122590', textColor: '#ffffff' }}
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
                  bgColor="#1E3EF0"
                  textColor="#ffffff"
                  _hover={{ bgColor: '#4B65F3', textColor: '#ffffff' }}
                  _active={{ bgColor: '#122590', textColor: '#ffffff' }}
                  fontSize="16px"
                  paddingX="12px"
                  paddingY="15px"
                  rounded="10px"
                  isLoading={isLoadingDeactive}
                >
                  Deactivate account
                </Button>
              </Center>
              <Center width="100%">
                <Button
                  onClick={() => console.log('====')}
                  type="button"
                  textColor="#1E3EF0"
                  bgColor="transparent"
                  _hover={{ textColor: '#4B65F3', bgColor: 'transparent' }}
                  _active={{ textColor: '#122590', bgColor: 'transparent' }}
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
