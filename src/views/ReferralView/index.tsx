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
  useToast,
  Grid,
} from '@chakra-ui/react';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { QuestionOutlineIcon } from '@chakra-ui/icons';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { DashboardIcon } from 'public/images/icons/dashboardIcon';
import NextLink from 'next/link';
import { BarChartBig, LayoutGrid, Redo, TrendingUp, Trophy } from 'lucide-react';
import CustomConnectButton from '@/components/CustomConnectButton';
import { Address, readContract, writeContract } from '@wagmi/core';
import { appConfig } from '@/config';
import referralABI from '@/config/abi/referralABI';
import { ToastLayout } from '@/components/ToastLayout';
import { Status } from '@/types/faucet.type';
import { BaseError } from 'viem';
import { useAccount, useContractRead } from 'wagmi';
import { copyText } from '@/utils/copyText';
export enum ReferralTabType {
  Tab1 = 'Tab1',
  Tab2 = 'Tab2',
}
const ReferralView = () => {
  const [defaultTabs, setDefaultTabs] = useState<ReferralTabType>(ReferralTabType.Tab1);
  const [userRefCode, setUserRefCode] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const toast = useToast();
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCreated, setIsCreated] = useState<boolean>(false);

  const getUserRefCode = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await readContract({
        address: appConfig.referralSC as Address,
        abi: referralABI,
        functionName: 'userCode',
        args: [address as Address],
      });
      console.log('data', data);
      setIsCreated(!!data);
      setUserRefCode(data ? data : '');
      setIsLoading(false);
    } catch (error) {
      setUserRefCode('');
      setIsLoading(false);
    }
  }, [address]);

  useEffect(() => {
    if (!address) {
      setUserRefCode('');
      return;
    }
    getUserRefCode();
  }, [address, getUserRefCode]);

  const handleUserRefCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (isCreated) return;
    setErrorMsg('');
    setUserRefCode(e.target.value.trim());
  };

  const createCode = async () => {
    setIsLoading(true);
    if (!userRefCode) {
      setErrorMsg('Referral code cannot be empty');
      return;
    }
    try {
      await writeContract({
        address: appConfig.referralSC as Address,
        abi: referralABI,
        functionName: 'registerCode',
        args: [userRefCode],
      });

      setIsCreated(true);

      toast({
        position: 'top',
        render: ({ onClose }) => (
          <ToastLayout title="Activate Referral Code successfully" status={Status.SUCCESSS} close={onClose} />
        ),
      });
      setIsLoading(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error instanceof BaseError && error.shortMessage);
      let msgContent = '';
      if (error instanceof BaseError) {
        setIsLoading(false);
        if (error.shortMessage.includes('User rejected the request.')) {
          toast({
            position: 'top',
            render: ({ onClose }) => (
              <ToastLayout
                title="Activate Referral Code Unsuccessfully"
                content={'User rejected the request!'}
                status={Status.ERROR}
                close={onClose}
              />
            ),
          });
          return;
        }
        if (error.shortMessage.includes('code already exists')) {
          msgContent = 'This code already exists. Please enter a different code.';
        } else {
          msgContent = 'Something went wrong. Please try again later.';
        }
      }

      setIsLoading(false);
      setErrorMsg(msgContent);
    }
  };

  const handleCopy = (text: string) => {
    if (!text) return;
    copyText(text);

    toast({
      position: 'top',
      render: ({ onClose }) => <ToastLayout title="Copy Successfully" status={Status.SUCCESSS} close={onClose} />,
    });
  };

  return (
    // <Flex
    //   color="white"
    //   marginX={'-20px'}
    //   height={'100%'}
    //   flex={1}
    //   bgImage="url('/images/profile/bg-item.png')"
    //   bgRepeat="no-repeat"
    //   bgPosition="top -50px left -120px"
    // >
    //   <Box width={'70px'} background={'rgba(28, 28, 30,.5)'} padding={'20px 0'}>
    //     <Flex flexDirection={'column'} alignItems={'center'} justifyContent={'center'} gap={'20px'}>
    //       <Link
    //         as={NextLink}
    //         href="/"
    //         className="group flex h-8 w-8 items-center justify-center rounded-[10px] border border-[#9E9E9F] hover:border-[#6052FB] hover:shadow-iconShadow"
    //       >
    //         <LayoutGrid className="text-[#9E9E9F] group-hover:text-[#6052FB]" strokeWidth={1} />
    //       </Link>
    //       <Link
    //         as={NextLink}
    //         href="/"
    //         className="group flex h-8 w-8 items-center justify-center rounded-[10px] border border-[#9E9E9F] hover:border-[#6052FB] hover:shadow-iconShadow"
    //       >
    //         <BarChartBig className="text-[#9E9E9F] group-hover:text-[#6052FB]" strokeWidth={1} />
    //       </Link>
    //       <Link
    //         as={NextLink}
    //         href="/"
    //         className="group flex h-8 w-8 items-center justify-center rounded-[10px] border border-[#9E9E9F] hover:border-[#6052FB] hover:shadow-iconShadow"
    //       >
    //         <TrendingUp className="text-[#9E9E9F] group-hover:text-[#6052FB]" strokeWidth={1} />
    //       </Link>
    //       <Link
    //         as={NextLink}
    //         href="/"
    //         className="group flex h-8 w-8 items-center justify-center rounded-[10px] border border-[#9E9E9F] hover:border-[#6052FB] hover:shadow-iconShadow"
    //       >
    //         <Trophy className="text-[#9E9E9F] group-hover:text-[#6052FB]" strokeWidth={1} />
    //       </Link>
    //       <Link
    //         as={NextLink}
    //         href="/"
    //         className="group flex h-8 w-8 items-center justify-center rounded-[10px] border border-[#9E9E9F] hover:border-[#6052FB] hover:shadow-iconShadow"
    //       >
    //         <Redo className="text-[#9E9E9F] group-hover:text-[#6052FB]" strokeWidth={1} />
    //       </Link>
    //     </Flex>
    //   </Box>

    //   <Box flex={1} paddingX={'80px'}>
    <Box maxW={'510px'} margin={'70px auto 20px auto'}>
      <Heading as="h3" fontWeight={600} fontSize={'32px'} textAlign={'center'} marginBottom={'20px'}>
        Referral
      </Heading>
      <Text fontSize={'20px'} fontWeight={600} textAlign={'center'} marginBottom={'20px'}>
        Get rewards by leveraging community network
      </Text>
      <div>
        <Box
          width={'100%'}
          overflow={'overflow-auto'}
          backgroundColor={'#0C0C10'}
          padding={'0 20px'}
          borderTopLeftRadius={10}
          borderTopRightRadius={10}
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Flex gap={'16px'}>
            <Box
              className="mr-2"
              role="presentation"
              onClick={() => {
                setDefaultTabs(ReferralTabType.Tab1);
              }}
              borderBottom={'2px solid'}
              borderColor={defaultTabs === ReferralTabType.Tab1 ? '#6052FB' : 'transparent'}
              pointerEvents={defaultTabs === ReferralTabType.Tab1 ? 'none' : 'auto'}
              cursor={defaultTabs === ReferralTabType.Tab1 ? 'default' : 'pointer'}
              color={defaultTabs === ReferralTabType.Tab1 ? '#6052FB' : '#9E9E9F'}
              padding={'13px 0'}
            >
              Use a Referral
            </Box>
            <Box
              className="mr-2"
              role="presentation"
              onClick={() => {
                setDefaultTabs(ReferralTabType.Tab2);
              }}
              borderBottom={'2px solid'}
              borderColor={defaultTabs === ReferralTabType.Tab2 ? '#6052FB' : 'transparent'}
              pointerEvents={defaultTabs === ReferralTabType.Tab2 ? 'none' : 'auto'}
              cursor={defaultTabs === ReferralTabType.Tab2 ? 'default' : 'pointer'}
              color={defaultTabs === ReferralTabType.Tab2 ? '#6052FB' : '#9E9E9F'}
              padding={'13px 0'}
            >
              Become a Referrer
            </Box>
          </Flex>
        </Box>

        {defaultTabs === ReferralTabType.Tab1 && (
          <Box padding={'20px'} backgroundColor={'rgba(28, 28, 30, 0.50)'} borderBottomRadius={'10px'}>
            <Text fontSize={'24px'} fontWeight={600} marginBottom={'20px'}>
              Access Referral Prizes
            </Text>
            <Text fontSize={'14px'} fontWeight={400} marginBottom={'20px'}>
              Enter the referral code you receive from your friend.
            </Text>

            <Box fontSize={'12px'}>
              <Box as="span" color={'red'} marginRight={'4px'}>
                *
              </Box>
              Referral code
            </Box>
            <InputGroup>
              <Input placeholder="Enter amount" />
              <InputRightElement>
                <Tooltip
                  hasArrow
                  label="Referral codes are case sensitive."
                  bg="#050506"
                  color={'white'}
                  placement="bottom-start"
                  borderRadius={'4px'}
                  fontSize={'12px'}
                >
                  <QuestionOutlineIcon />
                </Tooltip>
              </InputRightElement>
            </InputGroup>
            <CustomConnectButton isFullWidth={true}>
              <Button colorScheme="primary" fontSize={'16px'} size="md" width={'100%'} marginTop={'20px'}>
                Activate Referral Code
              </Button>
            </CustomConnectButton>
          </Box>
        )}

        {defaultTabs === ReferralTabType.Tab2 && (
          <Box padding={'20px'} backgroundColor={'rgba(28, 28, 30, 0.50)'} borderBottomRadius={'10px'}>
            <Text fontSize={'24px'} fontWeight={600} marginBottom={'20px'}>
              Invite with Referral Code
            </Text>
            <Text fontSize={'14px'} fontWeight={400} marginBottom={'20px'}>
              Create a Referral Code and start earning now.
            </Text>

            <Box fontSize={'12px'}>
              <Box as="span" color={'red'} marginRight={'4px'}>
                *
              </Box>
              Referral code
            </Box>
            <InputGroup>
              <Input
                placeholder=" Enter your code"
                value={userRefCode}
                onChange={handleUserRefCodeChange}
                bg={isCreated ? '#3D3D40' : 'transparent'}
                pointerEvents={isCreated ? 'none' : 'initial'}
                _hover={{ borderColor: '#6052FB' }}
                _focusVisible={{ borderColor: '#6052FB', borderWidth: '2px' }}
                border={isCreated ? 'none' : errorMsg ? '1px solid #F03D3E' : '1px solid #38383A'}
              />
              <InputRightElement>
                <Tooltip
                  hasArrow
                  label="Referral codes are case sensitive."
                  bg="#050506"
                  color={'white'}
                  placement="bottom-start"
                  borderRadius={'4px'}
                  fontSize={'12px'}
                >
                  <QuestionOutlineIcon />
                </Tooltip>
              </InputRightElement>
            </InputGroup>
            <p className="mt-1 text-xs font-normal text-[#F03D3E]">{errorMsg}</p>
            {!isLoading && isCreated ? (
              <Grid templateColumns="repeat(2, 1fr)" gap={2} marginTop={'20px'}>
                <Button
                  fontSize={'16px'}
                  size="md"
                  width={'100%'}
                  borderColor="#6052FB"
                  textColor="#6052FB"
                  paddingX="12px"
                  variant="outline"
                  _hover={{ borderColor: '#7A72F6', textColor: '#7A72F6' }}
                  _active={{ borderColor: '#342BC3', textColor: '#342BC3' }}
                  onClick={() => handleCopy(`${window.location.origin}/referral?code=${userRefCode}`)}
                >
                  Copy Your Referral Link
                </Button>
                <Button
                  colorScheme="primary"
                  fontSize={'16px'}
                  size="md"
                  width={'100%'}
                  onClick={() => handleCopy(userRefCode)}
                >
                  Copy Your Referral Code
                </Button>
              </Grid>
            ) : (
              <CustomConnectButton isFullWidth={true}>
                <Button
                  colorScheme="primary"
                  fontSize={'16px'}
                  size="md"
                  width={'100%'}
                  marginTop={'20px'}
                  onClick={createCode}
                  isLoading={isLoading}
                >
                  Create
                </Button>
              </CustomConnectButton>
            )}
          </Box>
        )}
      </div>
    </Box>
    //   </Box>
    // </Flex>
  );
};
export default ReferralView;
