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
  useToast,
  Grid,
} from '@chakra-ui/react';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { InfoIcon } from '@chakra-ui/icons';
import CustomConnectButton from '@/components/CustomConnectButton';
import { Address, readContract, writeContract } from '@wagmi/core';
import { appConfig } from '@/config';
import referralABI from '@/config/abi/referralABI';
import { ToastLayout } from '@/components/ToastLayout';
import { Status } from '@/types/faucet.type';
import { BaseError } from 'viem';
import { useAccount } from 'wagmi';
import { copyText } from '@/utils/copyText';
import { useSearchParams } from 'next/navigation';
export enum ReferralTabType {
  Tab1 = 'Tab1',
  Tab2 = 'Tab2',
}
const ReferralView = () => {
  const [defaultTabs, setDefaultTabs] = useState<ReferralTabType>(ReferralTabType.Tab1);
  const params = useSearchParams();
  const [userRefCode, setUserRefCode] = useState<string>('');
  const [traderRefCode, setTraderRefCode] = useState<string>('');
  const [errorMsgUserRefCode, setErrorMsgUserRefCode] = useState<string>('');
  const [errorMsgTraderRefCode, setErrorMsgTraderRefCode] = useState<string>('');
  const toast = useToast();
  const { address } = useAccount();
  const [isLoadingUserRef, setIsLoadingUserRef] = useState<boolean>(false);
  const [isLoadingTraderRef, setIsLoadingTraderRef] = useState<boolean>(false);
  const [isCreatedUserRefCode, setIsCreatedUserRefCode] = useState<boolean>(false);
  const [isCreatedTraderRefCode, setIsCreatedTraderRefCode] = useState<boolean>(false);
  const [isOpenRefCodeToolTip, setIsOpenRefCodeToolTip] = useState<boolean>(false);
  const [isOpenAddCodeToolTip, setIsOpenAddCodeToolTip] = useState<boolean>(false);

  const getUserRefCode = useCallback(async () => {
    setIsLoadingUserRef(true);
    try {
      const data = await readContract({
        address: appConfig.referralSC as Address,
        abi: referralABI,
        functionName: 'userCode',
        args: [address as Address],
      });
      setIsCreatedUserRefCode(!!data);
      setUserRefCode(data ? data : '');
      setIsLoadingUserRef(false);
    } catch (error) {
      setUserRefCode('');
      setIsLoadingUserRef(false);
    }
  }, [address]);

  const getTraderRefCode = useCallback(async () => {
    setIsLoadingTraderRef(true);
    try {
      const data = await readContract({
        address: appConfig.referralSC as Address,
        abi: referralABI,
        functionName: 'traderReferralCodes',
        args: [address as Address],
      });
      const tempCode = params.get('code') ?? '';
      setTraderRefCode(tempCode ? tempCode : data ? data : '');
      setIsCreatedTraderRefCode(!!data);
      setIsLoadingTraderRef(false);
    } catch (error) {
      setTraderRefCode('');
      setIsLoadingTraderRef(false);
    }
  }, [address, params]);

  useEffect(() => {
    if (!address) {
      setUserRefCode('');
      setTraderRefCode('');
      setErrorMsgTraderRefCode('');
      setErrorMsgUserRefCode('');
      return;
    }
    getUserRefCode();
    getTraderRefCode();
  }, [address, getTraderRefCode, getUserRefCode]);

  const handleUserRefCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (isCreatedUserRefCode) return;
    setErrorMsgUserRefCode('');
    setUserRefCode(e.target.value.trim());
  };

  const handleTraderRefCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setErrorMsgTraderRefCode('');
    setTraderRefCode(e.target.value.trim());
  };

  const addCode = async () => {
    if (!traderRefCode) {
      setErrorMsgTraderRefCode('Referral code cannot be empty');
      return;
    }
    if (traderRefCode === userRefCode) {
      setErrorMsgTraderRefCode('You cannot use your own referral code');
      return;
    }
    setIsLoadingTraderRef(true);
    try {
      await writeContract({
        address: appConfig.referralSC as Address,
        abi: referralABI,
        functionName: 'setTraderReferralCodeByUser',
        args: [traderRefCode],
      });

      toast({
        position: 'top',
        render: ({ onClose }) => (
          <ToastLayout title="Add Referral Code successfully" status={Status.SUCCESSS} close={onClose} />
        ),
      });
      setIsCreatedTraderRefCode(true);
      setIsLoadingTraderRef(false);
    } catch (error) {
      let msgContent = '';
      if (error instanceof BaseError) {
        setIsLoadingUserRef(false);
        if (error.shortMessage.includes('User rejected the request.')) {
          toast({
            position: 'top',
            render: ({ onClose }) => (
              <ToastLayout
                title="Add Referral Code Unsuccessfully"
                content={'User rejected the request!'}
                status={Status.ERROR}
                close={onClose}
              />
            ),
          });
          return;
        }
        if (error.shortMessage.includes('code not exist')) {
          msgContent = 'Please enter a valid referral code.';
        } else if (error.shortMessage.includes('traded')) {
          msgContent = 'You cannot change referral code after opening your first trade.';
        } else {
          msgContent = 'Something went wrong. Please try again later.';
        }
      }

      setIsLoadingTraderRef(false);
      setErrorMsgTraderRefCode(msgContent);
    }
  };

  const createCode = async () => {
    if (!userRefCode) {
      setErrorMsgUserRefCode('Referral code cannot be empty');
      return;
    }
    setIsLoadingUserRef(true);
    try {
      await writeContract({
        address: appConfig.referralSC as Address,
        abi: referralABI,
        functionName: 'registerCode',
        args: [userRefCode],
      });

      setIsCreatedUserRefCode(true);

      toast({
        position: 'top',
        render: ({ onClose }) => (
          <ToastLayout title="Activate Referral Code successfully" status={Status.SUCCESSS} close={onClose} />
        ),
      });
      setIsLoadingUserRef(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      let msgContent = '';
      console.log(error.shortMessage);
      if (error instanceof BaseError) {
        setIsLoadingUserRef(false);
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

      setIsLoadingUserRef(false);
      setErrorMsgUserRefCode(msgContent);
    }
  };

  const handleCopy = (text: string) => {
    if (!text) return;
    copyText(text);

    toast({
      position: 'top',
      render: ({ onClose }) => <ToastLayout title="Copied successfully" status={Status.SUCCESSS} close={onClose} />,
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
    //         className="group flex h-8 w-8 items-center justify-center rounded-[10px] border border-[#9E9E9F] hover:border-[#1E3EF0] hover:shadow-iconShadow"
    //       >
    //         <LayoutGrid className="text-[#9E9E9F] group-hover:text-[#1E3EF0]" strokeWidth={1} />
    //       </Link>
    //       <Link
    //         as={NextLink}
    //         href="/"
    //         className="group flex h-8 w-8 items-center justify-center rounded-[10px] border border-[#9E9E9F] hover:border-[#1E3EF0] hover:shadow-iconShadow"
    //       >
    //         <BarChartBig className="text-[#9E9E9F] group-hover:text-[#1E3EF0]" strokeWidth={1} />
    //       </Link>
    //       <Link
    //         as={NextLink}
    //         href="/"
    //         className="group flex h-8 w-8 items-center justify-center rounded-[10px] border border-[#9E9E9F] hover:border-[#1E3EF0] hover:shadow-iconShadow"
    //       >
    //         <TrendingUp className="text-[#9E9E9F] group-hover:text-[#1E3EF0]" strokeWidth={1} />
    //       </Link>
    //       <Link
    //         as={NextLink}
    //         href="/"
    //         className="group flex h-8 w-8 items-center justify-center rounded-[10px] border border-[#9E9E9F] hover:border-[#1E3EF0] hover:shadow-iconShadow"
    //       >
    //         <Trophy className="text-[#9E9E9F] group-hover:text-[#1E3EF0]" strokeWidth={1} />
    //       </Link>
    //       <Link
    //         as={NextLink}
    //         href="/"
    //         className="group flex h-8 w-8 items-center justify-center rounded-[10px] border border-[#9E9E9F] hover:border-[#1E3EF0] hover:shadow-iconShadow"
    //       >
    //         <Redo className="text-[#9E9E9F] group-hover:text-[#1E3EF0]" strokeWidth={1} />
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
              borderColor={defaultTabs === ReferralTabType.Tab1 ? '#1E3EF0' : 'transparent'}
              pointerEvents={defaultTabs === ReferralTabType.Tab1 ? 'none' : 'auto'}
              cursor={defaultTabs === ReferralTabType.Tab1 ? 'default' : 'pointer'}
              color={defaultTabs === ReferralTabType.Tab1 ? '#1E3EF0' : '#6D6D70'}
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
              borderColor={defaultTabs === ReferralTabType.Tab2 ? '#1E3EF0' : 'transparent'}
              pointerEvents={defaultTabs === ReferralTabType.Tab2 ? 'none' : 'auto'}
              cursor={defaultTabs === ReferralTabType.Tab2 ? 'default' : 'pointer'}
              color={defaultTabs === ReferralTabType.Tab2 ? '#1E3EF0' : '#9E9E9F'}
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
            <Text fontSize={'14px'} fontWeight={400} marginBottom={'20px'} color={'#D0D0D2'}>
              Enter the referral code you receive from your friend.
            </Text>

            <Box fontSize={'12px'}>
              <Box as="span" color={'red'} marginRight={'4px'}>
                *
              </Box>
              Referral code
            </Box>
            <InputGroup>
              <Input
                placeholder="Enter your code"
                value={traderRefCode}
                onChange={handleTraderRefCodeChange}
                bg={'transparent'}
                _hover={{ borderColor: '#1E3EF0' }}
                _focusVisible={{ borderColor: '#1E3EF0', borderWidth: '2px' }}
                border={errorMsgTraderRefCode ? '1px solid #F03D3E' : '1px solid #38383A'}
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
                  isOpen={isOpenRefCodeToolTip}
                >
                  <InfoIcon
                    onClick={() => setIsOpenRefCodeToolTip(!isOpenRefCodeToolTip)}
                    onMouseEnter={() => setIsOpenRefCodeToolTip(true)}
                    onMouseLeave={() => setIsOpenRefCodeToolTip(false)}
                  />
                </Tooltip>
              </InputRightElement>
            </InputGroup>
            <p className="mt-1 text-xs font-normal text-[#F03D3E]">{errorMsgTraderRefCode}</p>
            <CustomConnectButton isFullWidth={true}>
              <Button
                colorScheme="primary"
                fontSize={'16px'}
                size="md"
                width={'100%'}
                marginTop={'20px'}
                onClick={addCode}
                isLoading={isLoadingTraderRef}
              >
                {isCreatedTraderRefCode ? 'Change referral code' : 'Activate Referral Code'}
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
                placeholder="Enter your code"
                value={userRefCode}
                onChange={handleUserRefCodeChange}
                bg={isCreatedUserRefCode ? '#3D3D40' : 'transparent'}
                pointerEvents={isCreatedUserRefCode ? 'none' : 'initial'}
                _hover={{ borderColor: '#1E3EF0' }}
                _focusVisible={{ borderColor: '#1E3EF0', borderWidth: '2px' }}
                border={isCreatedUserRefCode ? 'none' : errorMsgUserRefCode ? '1px solid #F03D3E' : '1px solid #38383A'}
              />
              <InputRightElement>
                <Tooltip
                  hasArrow
                  label="Your code must be unique and cannot be edited later."
                  bg="#050506"
                  color={'white'}
                  placement="bottom-start"
                  borderRadius={'4px'}
                  fontSize={'12px'}
                  isOpen={isOpenAddCodeToolTip}
                >
                  <InfoIcon
                    onClick={() => setIsOpenAddCodeToolTip(!isOpenAddCodeToolTip)}
                    onMouseEnter={() => setIsOpenAddCodeToolTip(true)}
                    onMouseLeave={() => setIsOpenAddCodeToolTip(false)}
                  />
                </Tooltip>
              </InputRightElement>
            </InputGroup>
            <p className="mt-1 text-xs font-normal text-[#F03D3E]">{errorMsgUserRefCode}</p>
            <CustomConnectButton isFullWidth={true}>
              {!isLoadingUserRef && isCreatedUserRefCode ? (
                <Grid templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }} gap={2} marginTop={'20px'}>
                  <Button
                    fontSize={'16px'}
                    size="md"
                    width={'100%'}
                    borderColor="#1E3EF0"
                    textColor="#1E3EF0"
                    paddingX="12px"
                    variant="outline"
                    _hover={{ borderColor: '#4B65F3', textColor: '#4B65F3' }}
                    _active={{ borderColor: '#122590', textColor: '#122590' }}
                    onClick={() => handleCopy(`${window.location.origin}/referral?code=${userRefCode}`)}
                    wordBreak={'break-word'}
                    whiteSpace={'inherit'}
                  >
                    Copy Your Referral Link
                  </Button>
                  <Button
                    colorScheme="primary"
                    fontSize={'16px'}
                    size="md"
                    width={'100%'}
                    onClick={() => handleCopy(userRefCode)}
                    wordBreak={'break-word'}
                    whiteSpace={'inherit'}
                    paddingX="12px"
                  >
                    Copy Your Referral Code
                  </Button>
                </Grid>
              ) : (
                <Button
                  colorScheme="primary"
                  fontSize={'16px'}
                  size="md"
                  width={'100%'}
                  marginTop={'20px'}
                  onClick={createCode}
                  isLoading={isLoadingUserRef}
                >
                  Create
                </Button>
              )}
            </CustomConnectButton>
          </Box>
        )}
      </div>
    </Box>
    //   </Box>
    // </Flex>
  );
};
export default ReferralView;
