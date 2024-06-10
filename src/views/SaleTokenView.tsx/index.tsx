'use client';
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  FormControl,
  FormLabel,
  Input,
  VStack,
  InputGroup,
  InputRightElement,
  Box,
  Flex,
  useMediaQuery,
  Image,
  Heading,
  Grid,
  Accordion,
  useToast,
  Link,
  Center,
} from '@chakra-ui/react';
import React, { useRef, useState, useEffect, useMemo } from 'react';
import ItemCardSale from './conponent/itemCardSale';
import ItemCardPublicSale from './conponent/itemCardPublicSale';
import AccordionCustoms from './conponent/accordionCustom';
import FooterLadingPage from '@/components/layout/FooterLandingPage';
import saleABI from '@/config/abi/saleABI';
import { appConfig } from '@/config';
import { useContractRead, useAccount, useNetwork } from 'wagmi';
import { prepareWriteContract, waitForTransaction, writeContract } from '@wagmi/core';
import { addComma } from '@/utils/number';
import { divide, multiply, subtract } from '@/utils/operationBigNumber';
import Currency from '@/components/Currency';
import { useBalanceOf } from '@/hooks/useContractRead';
import BigNumber from 'bignumber.js';
import { BaseError, formatUnits, parseEther } from 'viem';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import USDC_ABI from '@/config/abi/USDC_ABI';
import { ToastLayout } from '@/components/ToastLayout';
import { Status } from '@/types/faucet.type';
import dayjs from 'dayjs';
import CustomConnectSaleTokenButton from '@/components/CustomConnectButton/CustomConnectSaleTokenButton';

const dataFAQ = [
  {
    title: 'What’s the difference between a Public Sale and a Private Sale?',
    desc: 'In a Private Sale, you need to meet certain requirements listed on the IDO card to join. You can commit any amount of tokens, up to a maximum limit, if you are eligible. In a Public Sale, anyone can join and make a commitment.',
  },
  {
    title: 'Which sale should I participate in? Can I participate in both?',
    desc: 'You have the option to choose one or participate in both simultaneously! We suggest checking your eligibility for the Private Sale first. In the Public Sale, if the amount you commit is too small, you might not receive a significant number of IDO tokens.',
  },
  {
    title: 'How much is the participation fee?',
    desc: 'There is a participation fee only for the Public Sale; there is no participation fee for the Private Sale.',
  },
  {
    title: 'Where does the participation fee go?',
    desc: 'After the IDO concludes, the participation fee will be transferred to the team’s treasury. These funds can then be utilized for purchasing and removing ETR tokens from circulation in the future.',
  },
];

export const SaleTokenView = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const [isMobile] = useMediaQuery('(max-width: 768px)');
  const faqRef = useRef<HTMLDivElement>(null);
  const balance = useBalanceOf(appConfig.USDC_SC as `0x${string}`);
  const [isOpen, setOpenModal] = useState<boolean>(false);
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [loadingApproved, setLoadingApproved] = useState<boolean>(false);
  const [loadingBuy, setLoadingBuy] = useState<boolean>(false);
  const [loadingClaim, setLoadingClaim] = useState<boolean>(false);
  const toast = useToast();
  const { data: poolInfor, isLoading } = useContractRead({
    watch: true,
    abi: saleABI,
    address: appConfig.TOKEN_SALE_SC as `0x${string}`,
    functionName: 'viewPoolInformation',
    enabled: !!appConfig.TOKEN_SALE_SC,
    chainId: +(appConfig.TOKEN_SALE_CHAIN_ID || 0),
  });

  const { data: startTime } = useContractRead({
    watch: true,
    abi: saleABI,
    address: appConfig.TOKEN_SALE_SC as `0x${string}`,
    functionName: 'startTime',
    enabled: !!appConfig.TOKEN_SALE_SC,
    chainId: +(appConfig.TOKEN_SALE_CHAIN_ID || 0),
  });

  const { data: publicTime } = useContractRead({
    watch: true,
    abi: saleABI,
    address: appConfig.TOKEN_SALE_SC as `0x${string}`,
    functionName: 'publicTime',
    enabled: !!appConfig.TOKEN_SALE_SC,
    chainId: +(appConfig.TOKEN_SALE_CHAIN_ID || 0),
  });

  const { data: endTime } = useContractRead({
    watch: true,
    abi: saleABI,
    address: appConfig.TOKEN_SALE_SC as `0x${string}`,
    functionName: 'endTime',
    enabled: !!appConfig.TOKEN_SALE_SC,
    chainId: +(appConfig.TOKEN_SALE_CHAIN_ID || 0),
  });

  const { data: isWhitelisted } = useContractRead({
    watch: true,
    abi: saleABI,
    address: appConfig.TOKEN_SALE_SC as `0x${string}`,
    functionName: 'isWhitelisted',
    args: [address as `0x${string}`],
    enabled: !!(address && appConfig.TOKEN_SALE_SC),
    chainId: +(appConfig.TOKEN_SALE_CHAIN_ID || 0),
  });

  const { data: userInfo } = useContractRead({
    watch: true,
    abi: saleABI,
    address: appConfig.TOKEN_SALE_SC as `0x${string}`,
    functionName: 'viewUserInfo',
    args: [address as `0x${string}`],
    enabled: !!(address && appConfig.TOKEN_SALE_SC),
    chainId: +(appConfig.TOKEN_SALE_CHAIN_ID || 0),
  });

  const { data: offeringAndRefundingAmounts } = useContractRead({
    watch: true,
    abi: saleABI,
    address: appConfig.TOKEN_SALE_SC as `0x${string}`,
    functionName: 'viewUserOfferingAndRefundingAmountsForPools',
    args: [address as `0x${string}`],
    enabled: !!(address && appConfig.TOKEN_SALE_SC),
    chainId: +(appConfig.TOKEN_SALE_CHAIN_ID || 0),
  });

  const { data: getAllowance } = useContractRead({
    watch: true,
    address: appConfig.USDC_SC as `0x${string}`,
    abi: USDC_ABI,
    functionName: 'allowance',
    args: [address as `0x${string}`, appConfig.TOKEN_SALE_SC as `0x${string}`],
    enabled: !!(address && appConfig.USDC_SC),
    chainId: +(appConfig.TOKEN_SALE_CHAIN_ID || 0),
  });

  const isBuy = useMemo(() => {
    if (isWhitelisted) {
      return dayjs().unix() >= Number(startTime as bigint) && dayjs().unix() <= Number(endTime as bigint);
    } else {
      return dayjs().unix() >= Number(publicTime as bigint) && dayjs().unix() <= Number(endTime as bigint);
    }
  }, [startTime, endTime, isWhitelisted, publicTime]);

  const startAt = useMemo(() => {
    if (address) {
      if (isWhitelisted) {
        return Number(startTime as bigint);
      } else {
        return Number(publicTime as bigint);
      }
    } else {
      return Number(publicTime as bigint);
    }
  }, [startTime, endTime, isWhitelisted, publicTime, address]);

  const isClaimable = useMemo(() => {
    return (
      dayjs().unix() >= Number(endTime as bigint) &&
      BigNumber(((offeringAndRefundingAmounts as Array<bigint>)?.[0] || 0).toString()).isGreaterThan(BigNumber(0)) &&
      !(userInfo as Array<boolean>)?.[2]
    );
  }, [offeringAndRefundingAmounts, endTime, userInfo]);

  const tokenPrice = poolInfor
    ? divide(
        divide((poolInfor as Array<bigint>)[0].toString(), 6),
        divide((poolInfor as Array<bigint>)[1].toString(), 18),
      )
    : 0;

  const max = divide(poolInfor ? (poolInfor as Array<bigint>)[2].toString() : 0, 6);

  const validNumber = new RegExp(/^\d*\.?\d{0,6}$/);

  const validationSchema = Yup.object({
    amount: Yup.string()
      .required('Amount is required')
      .test('Is positive?', 'Entered amount must be greater than 0', (value) => +value > 0)
      .test('Greater amount?', 'Not enough funds!', (value) => +value <= +formatUnits(balance as bigint, 6))
      .test('Greater amount?', `Max is ${max} USDC!`, (value) => +value <= +max),
  });

  const formik = useFormik({
    initialValues: {
      amount: '',
    },
    onSubmit: async (values) => {
      onBuy(values.amount);
    },
    validationSchema: validationSchema,
  });

  const onBuy = async (amount: string) => {
    try {
      setLoadingBuy(true);
      const configStake = await prepareWriteContract({
        address: appConfig.TOKEN_SALE_SC as `0x${string}`,
        abi: saleABI,
        functionName: 'depositPool',
        args: [multiply(amount, 6)],
        chainId: +(appConfig.TOKEN_SALE_CHAIN_ID || 0),
      });

      const { hash } = await writeContract(configStake);
      const data = await waitForTransaction({
        hash,
      });
      setLoadingBuy(false);
      setOpenModal(false);
      toast({
        position: 'top',
        render: ({ onClose }) => (
          <ToastLayout title="Successful transaction" status={Status.SUCCESSS} close={onClose}>
            <p className="text-[14px] font-medium text-white">{'Successful transaction'}</p>
            <Link href={`${appConfig.scan}/tx/${hash}`} isExternal color="#3396FF" fontSize={'12px'}>
              View on explorer
            </Link>
          </ToastLayout>
        ),
      });
    } catch (error: any) {
      console.log(error);
      let msgContent = '';
      if (error instanceof BaseError) {
        if (error.shortMessage.includes('User rejected the request.')) {
          msgContent = 'User rejected the request!';
        } else if (error.shortMessage.includes('the balance of the account')) {
          msgContent = 'Your account balance is insufficient for gas * gas price + value!';
        } else {
          msgContent = 'Something went wrong. Please try again later.';
        }
        toast({
          position: 'top',
          render: ({ onClose }) => (
            <ToastLayout
              // title="Approve account Unsuccessfully"
              content={msgContent}
              status={Status.ERROR}
              close={onClose}
            />
          ),
        });
      } else {
        toast({
          position: 'top',
          render: ({ onClose }) => (
            <ToastLayout
              // title="Approve account Unsuccessfully"
              content={'Something went wrong. Please try again later.'}
              status={Status.ERROR}
              close={onClose}
            />
          ),
        });
      }
      setLoadingBuy(false);
    }
  };

  const onApprove = async () => {
    // if (!isApproved) {
    try {
      setLoadingApproved(true);

      const config = await prepareWriteContract({
        address: appConfig.USDC_SC as `0x${string}`,
        abi: USDC_ABI,
        functionName: 'approve',
        args: [appConfig.TOKEN_SALE_SC as `0x${string}`, BigInt(2 ** 256 / 1.1)],
        chainId: +(appConfig.TOKEN_SALE_CHAIN_ID || 0),
      });

      const { hash } = await writeContract(config);
      const data = await waitForTransaction({
        hash,
      });
      setLoadingApproved(false);
      setIsApproved(true);
      toast({
        position: 'top',
        render: ({ onClose }) => (
          <ToastLayout title="Successful transaction" status={Status.SUCCESSS} close={onClose}>
            <p className="text-[14px] font-medium text-white">{'Successful transaction'}</p>
            <Link href={`${appConfig.scan}/tx/${hash}`} isExternal color="#3396FF" fontSize={'12px'}>
              View on explorer
            </Link>
          </ToastLayout>
        ),
      });
    } catch (error: any) {
      console.log(error);
      setLoadingApproved(false);
      setIsApproved(false);
      let msgContent = '';
      if (error instanceof BaseError) {
        if (error.shortMessage.includes('User rejected the request.')) {
          msgContent = 'User rejected the request!';
        } else if (error.shortMessage.includes('the balance of the account')) {
          msgContent = 'Your account balance is insufficient for gas * gas price + value!';
        } else {
          msgContent = 'Something went wrong. Please try again later.';
        }
        toast({
          position: 'top',
          render: ({ onClose }) => (
            <ToastLayout
              // title="Approve account Unsuccessfully"
              content={msgContent}
              status={Status.ERROR}
              close={onClose}
            />
          ),
        });
      } else {
        toast({
          position: 'top',
          render: ({ onClose }) => (
            <ToastLayout
              // title="Approve account Unsuccessfully"
              content={'Something went wrong. Please try again later.'}
              status={Status.ERROR}
              close={onClose}
            />
          ),
        });
      }
    }
    // }
  };

  const onClaim = async () => {
    try {
      setLoadingClaim(true);
      const configStake = await prepareWriteContract({
        address: appConfig.TOKEN_SALE_SC as `0x${string}`,
        abi: saleABI,
        functionName: 'harvest',
        chainId: +(appConfig.TOKEN_SALE_CHAIN_ID || 0),
      });

      const { hash } = await writeContract(configStake);
      const data = await waitForTransaction({
        hash,
      });
      setLoadingClaim(false);
      setOpenModal(false);
      toast({
        position: 'top',
        render: ({ onClose }) => (
          <ToastLayout title="Successful transaction" status={Status.SUCCESSS} close={onClose}>
            <p className="text-[14px] font-medium text-white">{'Successful transaction'}</p>
            <Link href={`${appConfig.scan}/tx/${hash}`} isExternal color="#3396FF" fontSize={'12px'}>
              View on explorer
            </Link>
          </ToastLayout>
        ),
      });
    } catch (error: any) {
      console.log(error);
      let msgContent = '';
      if (error instanceof BaseError) {
        if (error.shortMessage.includes('User rejected the request.')) {
          msgContent = 'User rejected the request!';
        } else if (error.shortMessage.includes('the balance of the account')) {
          msgContent = 'Your account balance is insufficient for gas * gas price + value!';
        } else {
          msgContent = 'Something went wrong. Please try again later.';
        }
        toast({
          position: 'top',
          render: ({ onClose }) => (
            <ToastLayout
              // title="Approve account Unsuccessfully"
              content={msgContent}
              status={Status.ERROR}
              close={onClose}
            />
          ),
        });
      } else {
        toast({
          position: 'top',
          render: ({ onClose }) => (
            <ToastLayout
              // title="Approve account Unsuccessfully"
              content={'Something went wrong. Please try again later.'}
              status={Status.ERROR}
              close={onClose}
            />
          ),
        });
      }
      setLoadingClaim(false);
    }
  };

  useEffect(() => {
    setIsApproved(getAllowance !== undefined && BigNumber(getAllowance.toString()).isGreaterThan(BigNumber(0)));
  }, [getAllowance]);

  useEffect(() => {
    formik.resetForm();
  }, [isOpen]);

  const setMaxValue = () => {
    if (balance !== undefined) {
      let maxTemp = subtract(max.toString(), divide(((userInfo as Array<bigint>)?.[0] || 0).toString(), 6).toString());
      if (BigNumber(Number(balance) / 10 ** 6).isLessThanOrEqualTo(BigNumber(maxTemp))) {
        maxTemp = divide(balance.toString(), 6).toString();
      }
      formik.setFieldValue('amount', maxTemp); //formatUnits(balance as bigint, 18)
    }
  };

  return (
    <Flex flexDirection={'column'} height="100%" w={'100%'}>
      <Box
        backgroundRepeat={'no-repeat'}
        backgroundSize={'100% 70%'}
        bgImage={{
          base: 'linear-gradient(to bottom, #1f1b46bd, #0c0c10),url(/images/saleToken/bg-top.png)',
          md: 'linear-gradient(to bottom, #1f1b46bd, #0c0c10),url(/images/saleToken/bg-top.png)',
        }}
        marginBottom={{ base: '100px', lg: '112px' }}
      >
        <Box maxW={'1242px'} margin={'auto'}>
          <Box
            bgImage={{
              base: 'none',
              md: "url('/images/saleToken/bg-header.png')",
              lg: "url('/images/saleToken/bg-header.png')",
            }}
            backgroundSize={'100% 100%'}
            backgroundRepeat={'no-repeat'}
            display={'flex'}
            alignItems={['flex-start', 'flex-start', 'center', 'center']}
            maxH={'695px'}
            // padding={'5px 76px'}
            flexDirection={['column-reverse', 'column-reverse', 'row', 'row']}
            padding={{ base: 'none', sm: 'none', md: '5px 76px', lg: '5px 76px' }}
            flexWrap={'wrap'}
          >
            <Box flex={1} w={{ base: '100%', sm: '100', md: 'auto', lg: 'auto' }} px={{ base: '12px', lg: 0 }}>
              <Heading
                as="h1"
                textColor={'white'}
                fontSize={{ base: '3xl', md: '30px', lg: '60px' }}
                lineHeight={{ base: '45px', md: '40px', lg: '70px' }}
                marginBottom={{ base: '20px', md: '30px' }}
                textAlign={'start'}
              >
                Ethora (ETR){' '}
                <Box as="br" display={{ base: 'none', sm: 'none', md: 'inline-block', lg: 'inline-block' }} />
                IDO
              </Heading>
              <Text as="p" fontSize={'xs'} color={'#9E9E9F'} marginBottom={'30px'} textAlign={'start'}>
                Access to the future of decentralized options trading
              </Text>
              <Button
                borderColor="#0052FF"
                bgColor={'#0052FF'}
                borderRadius={'10px'}
                textColor="white"
                variant="outline"
                _hover={{ bg: 'transparent' }}
                padding={'8px 16px'}
                w={{ base: '100%', sm: '100', md: 'auto', lg: 'auto' }}
                onClick={() => faqRef?.current && faqRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })}
              >
                How does it work
              </Button>
            </Box>
            <Box flex={{ base: 'none', sm: 'none', md: '1', lg: '1' }} maxH={'565px'} maxWidth={'565px'}>
              <Image alt="base" src="/images/saleToken/logo-token.png" w="full" h="full" />
            </Box>
          </Box>
        </Box>
      </Box>
      <Grid
        maxW={'1242px'}
        margin={'auto'}
        templateColumns={{ base: 'repeat(1, 1fr)', lg: 'repeat(2, 1fr)' }}
        gap={'52px'}
        px={'12px'}
      >
        {BigNumber(((offeringAndRefundingAmounts as Array<bigint>)?.[0] || 0).toString()).isGreaterThan(
          BigNumber(0),
        ) ? (
          <Box>
            <Image alt="base" src="/images/saleToken/logo-token.png" w="87.74" h="87.74" />
            <Text
              as="h3"
              fontSize={{ base: 'xl', sm: 'xl', md: '2xl', lg: '2xl' }}
              textColor={'white'}
              lineHeight={1.3}
              marginTop={{ base: '20px', sm: '20px', md: '20px', lg: '20px' }}
              marginBottom={{ base: '20px', sm: '20px', md: '20px', lg: '20px' }}
            >
              Claim your token{' '}
              {dayjs().unix() >= Number(endTime as bigint)
                ? 'now'
                : ` after ${dayjs(Number(endTime as bigint) * 1000)
                    .utc()
                    .format('DD MMM YYYY(hh:mm a)')} UTC`}
            </Text>
            <Flex
              background="#1C1C1E80"
              p="20px 12px"
              alignItems={'center'}
              justifyContent={'space-between'}
              borderRadius={'10px'}
            >
              <Text fontSize="16px" fontWeight={400} color={'#9E9E9F'}>
                Claimable
              </Text>
              <Text fontSize="18px" fontWeight={600} color={'#fff'}>
                {BigNumber(((offeringAndRefundingAmounts as Array<bigint>)?.[0] || 0).toString()).isGreaterThan(
                  BigNumber(0),
                ) && !(userInfo as Array<boolean>)?.[2]
                  ? addComma(divide((offeringAndRefundingAmounts as Array<bigint>)?.[0].toString() || '0', 18), 6)
                  : 0}{' '}
                ETR
              </Text>
            </Flex>
            <Flex justifyContent="flex-end" mr={'12px'} mt={'10px'}>
              Refund:{' '}
              <Text ml="4px" color={'#fff'}>
                {BigNumber(((offeringAndRefundingAmounts as Array<bigint>)?.[0] || 0).toString()).isGreaterThan(
                  BigNumber(0),
                ) && !(userInfo as Array<boolean>)?.[2]
                  ? addComma(divide((offeringAndRefundingAmounts as Array<bigint>)?.[1].toString() || '0', 6), 2)
                  : 0}{' '}
                USDC
              </Text>
            </Flex>
            <Center>
              <Button
                borderColor="#0052FF"
                bgColor={'#0052FF'}
                borderRadius={'10px'}
                textColor="white"
                variant="outline"
                _hover={{ bg: 'transparent' }}
                padding={'8px 16px'}
                mt="20px"
                minW="251px"
                _disabled={{ bg: '#0052FF', opacity: 0.5 }}
                isDisabled={!isClaimable}
                isLoading={loadingClaim}
                onClick={onClaim}
              >
                Claim
              </Button>
            </Center>
          </Box>
        ) : (
          <Box>
            <Image alt="base" src="/images/saleToken/logo-token.png" w="87.74" h="87.74" />
            <Text
              as="h3"
              fontSize={{ base: 'xl', sm: 'xl', md: '2xl', lg: '2xl' }}
              textColor={'white'}
              lineHeight={1.3}
              marginTop={{ base: '20px', sm: '20px', md: '20px', lg: '20px' }}
              marginBottom={{ base: '20px', sm: '20px', md: '20px', lg: '20px' }}
            >
              You have no tokens available for claiming
            </Text>
            <Text as="p" fontSize={'xs'} color={'#9E9E9F'} marginBottom={'30px'} textAlign={'start'}>
              Participate in our next IDO. Follow us on our social networks for more information!
            </Text>
          </Box>
        )}
        <Box
          display={{ base: 'none', sm: 'none', md: 'block', lg: 'block' }}
          flex={{ base: 'none', sm: 'none', md: '1', lg: '1' }}
        >
          <Image alt="base" src="/images/saleToken/ethora-twitter.png" w="627px" h="full" />
        </Box>
        <Box display={{ base: 'block', sm: 'block', md: 'none', lg: 'none' }}>
          <Image alt="base" src="/images/saleToken/ethora-twitter-mobile.png" w="627px" h="full" />
        </Box>
      </Grid>
      <Box
        display={'flex'}
        alignItems={'center'}
        justifyContent={'center'}
        bgImage={"url('/images/landingpage/bg-ethora.png')"}
        bgRepeat="no-repeat"
        bgPosition={'center'}
        bgSize={{ base: '400% 370%', sm: '400% 370%', md: '195% 295%', lg: '125% 250%' }}
        paddingTop={{ base: '50px', md: '251px' }}
        position={'relative'}
        flexDirection={'column'}
      >
        <Box maxWidth={'1150px'} margin={'0 auto'}>
          {dayjs().unix() < startAt && (
            <Text
              fontSize={{ base: '32px', md: '56px' }}
              textColor={'white'}
              lineHeight={{ base: '38px', md: '67px' }}
              fontWeight={600}
              textAlign={'center'}
              marginBottom={{ base: '40px', md: '80px' }}
            >
              Sale starts at{' '}
              {dayjs(startAt * 1000)
                .utc()
                .format('HH:mm A')}{' '}
              on{' '}
              {dayjs(startAt * 1000)
                .utc()
                .format('DD MMM YYYY')}{' '}
              UTC
            </Text>
          )}
          {dayjs().unix() >= Number(endTime as bigint) && (
            <Text
              fontSize={{ base: '32px', md: '56px' }}
              textColor={'white'}
              lineHeight={{ base: '38px', md: '67px' }}
              fontWeight={600}
              textAlign={'center'}
              marginBottom={{ base: '40px', md: '80px' }}
            >
              Sale Finished!
            </Text>
          )}
          {dayjs().unix() >= startAt && dayjs().unix() <= Number(endTime as bigint) && (
            <Text
              fontSize={{ base: '32px', md: '56px' }}
              textColor={'white'}
              lineHeight={{ base: '38px', md: '67px' }}
              fontWeight={600}
              textAlign={'center'}
              marginBottom={{ base: '40px', md: '80px' }}
            >
              Participate in our sale now!
            </Text>
          )}
        </Box>
        <Grid
          templateColumns={{
            base: 'repeat(1, 1fr)',
            sm: 'repeat(1, 1fr)',
            md: 'repeat(1, 1fr)',
            lg: 'repeat(1, 1fr)',
          }}
          gap="25px"
          zIndex={'2'}
          alignItems={'stretch'}
          marginLeft={{ base: '12px', sm: '12px', md: '12px', lg: '0px' }}
          marginRight={{ base: '12px', sm: '12px', md: '12px', lg: '0px' }}
        >
          <Box
            boxShadow="1px 0.5px 0px 0px #38383A inset"
            border={'1px solid #38383A'}
            paddingY="32px"
            paddingX="32px"
            rounded="20px"
            width={{ base: 'auto', sm: 'auto', md: 'auto', lg: '506px' }}
            marginBottom={{ base: '0px', sm: '0px', md: '20px', lg: '20px' }}
            bgColor="rgba(28, 28, 30, 0.7)"
            justifyContent={'space-around'}
            gap={'20px'}
            display={'flex'}
            flexDirection={'column'}
          >
            <Box flex={'1'} gap={'20px'} display={'flex'} flexDirection={'column'}>
              <Text fontSize="20px" textColor={'white'} fontWeight={600}>
                Public Sale
              </Text>
              <Text fontSize="32px" textColor={'white'} fontWeight={600}>
                {!isLoading && (poolInfor as Array<bigint>)?.length > 0
                  ? addComma(divide((poolInfor as Array<bigint>)[1].toString(), 18))
                  : '--'}{' '}
                ETR
              </Text>
              <CustomConnectSaleTokenButton isFullWidth={true}>
                <Button
                  flex={1}
                  borderColor="#0052FF"
                  bgColor={'#0052FF'}
                  borderRadius={'10px'}
                  textColor="white"
                  variant="outline"
                  _hover={{ bg: 'transparent' }}
                  _disabled={{ bg: '#0052FF', opacity: 0.5 }}
                  padding={'8px 16px'}
                  width={'100%'}
                  isDisabled={!isBuy}
                  onClick={() => setOpenModal(true)}
                >
                  Buy ETR
                </Button>
              </CustomConnectSaleTokenButton>
            </Box>
            <Box flex={'1'}>
              <ItemCardSale title="Max. token entry" value={`${addComma(max)} USDC`} />
              <ItemCardSale title="Additional fee:" value="0%" />
              <ItemCardSale
                title="Total committed:"
                value={`${addComma(divide(poolInfor ? (poolInfor as Array<bigint>)[4].toString() : 0, 6))} (${
                  poolInfor
                    ? addComma(
                        multiply(
                          divide(
                            divide((poolInfor as Array<bigint>)[4].toString(), 6),
                            divide((poolInfor as Array<bigint>)[0].toString(), 6),
                          ).toString(),
                          '100',
                        ),
                        2,
                      )
                    : 0
                }%)`}
              />
              <ItemCardSale
                title="Funds to raise:"
                value={`${addComma(divide(poolInfor ? (poolInfor as Array<bigint>)[0].toString() : 0, 6))} USDC`}
              />
              <ItemCardSale title="Price per ETR:" value={`${tokenPrice} USDC`} />
            </Box>
          </Box>
        </Grid>
      </Box>
      <Box
        margin={{ base: '100px 12px 0px', sm: '30px 12px 0px', md: '160px 20px 0px', lg: '160px 240px 24px' }}
        ref={faqRef}
      >
        <Text
          fontSize={{ base: '32px', md: '56px' }}
          textColor={'white'}
          lineHeight={{ base: '38px', md: '67px' }}
          fontWeight={600}
          textAlign={'center'}
          marginBottom={{ base: '40px', md: '80px' }}
        >
          How to Take Part in <br />
          the Public Sale
        </Text>
        <Grid
          templateColumns={{
            base: 'repeat(1, 1fr)',
            sm: 'repeat(1, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(3, 1fr)',
          }}
          justifyContent={'center'}
          alignItems={'stretch'}
          justifyItems={{ base: 'start', md: 'center' }}
          maxW={'1480px'}
          position={'relative'}
          _after={
            isMobile
              ? {}
              : {
                  content: '" "',
                  height: '1px',
                  position: 'absolute',
                  bottom: 0,
                  width: '80%',
                  background:
                    'radial-gradient(circle, rgba(37,37,40,0.8435749299719888) 57%, rgba(12,12,16,0.3561799719887955) 100%);',
                }
          }
        >
          <ItemCardPublicSale
            title="Mark Your Calendar"
            desc="Get ready to participate in ETR IDO"
            image="/images/saleToken/calendar.svg"
          />
          <ItemCardPublicSale
            title="Enable ETH"
            desc="Connect your wallet and approve the contract to use your ETH"
            image="/images/saleToken/enable-eth.svg"
          />
          <ItemCardPublicSale
            title="Commit ETH"
            desc="Enter the number of ETH you intend to commit in the sale"
            image="/images/saleToken/commit-eth.svg"
          />
        </Grid>
        <Grid
          templateColumns={{
            base: 'repeat(1, 1fr)',
            sm: 'repeat(1, 1fr)',
            md: 'auto auto',
            lg: 'auto auto',
          }}
          alignItems={'stretch'}
          justifyItems={{ base: 'start', sm: 'start', md: 'start', lg: 'center' }}
          justifyContent={'center'}
        >
          <ItemCardPublicSale
            title="Claim Your Tokens"
            desc="Claim your ETR tokens and unused ETH after the sale ended"
            image="/images/saleToken/claim-token.svg"
          />
          <ItemCardPublicSale
            title="Vesting"
            desc="Each round comes with different vesting schedule. Come back to claim ETR when tokens get unlocked."
            image="/images/saleToken/vesting.svg"
          />
        </Grid>
      </Box>
      <Box
        bgImage="url('/images/saleToken/bg-footer.png')"
        bgRepeat="no-repeat"
        bgPosition={'100% 57%'}
        bgSize={'cover'}
      >
        <Box margin={{ base: '100px 12px 0px', sm: '30px 12px 0px', md: '160px 20px 0px', lg: '160px 240px 0px' }}>
          <Image
            src="/images/saleToken/logo-token.png"
            alt="landingpage"
            width={'750px'}
            height={'750px'}
            position="absolute"
            bottom={'-200px'}
            left={'-165px'}
            zIndex={1}
            display={{ base: 'none', sm: 'none', md: 'block', lg: 'block' }}
          />
          <Text
            fontSize={{ base: '32px', md: '56px' }}
            textColor={'white'}
            lineHeight={{ base: '38px', md: '67px' }}
            fontWeight={600}
            textAlign={'center'}
            marginBottom={{ base: '40px', md: '80px' }}
          >
            FAQ
          </Text>
          <Box maxW={'720px'} margin={'0 auto'} position={'relative'} zIndex={2}>
            <Accordion>
              {dataFAQ.map((item, idx) => (
                <AccordionCustoms key={idx} title={item.title} desc={item.desc} />
              ))}
            </Accordion>
          </Box>
        </Box>
        <FooterLadingPage />
      </Box>

      {isOpen && (
        <Modal isOpen={isOpen} onClose={() => setOpenModal(false)} isCentered>
          <ModalOverlay />
          <ModalContent
            background={'rgba(28, 28, 30, 0.50)'}
            border={'1px solid #242428'}
            borderRadius={'20px'}
            boxShadow={'0px 4px 20px 0px rgba(0, 0, 0, 0.30)'}
            backdropFilter={'blur(7px)'}
            color={'#ffffff'}
            fontWeight={400}
            fontSize={'14px'}
          >
            <ModalHeader fontSize={'24px'}>Buy ETR</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <form>
                <VStack spacing={4} align="flex-start">
                  <FormControl>
                    <FormLabel htmlFor="amount" fontWeight={400} fontSize={'14px'} mr={0}>
                      <Flex display={'flex'} justifyContent={'flex-end'} width={'100%'}>
                        <Text as="span" fontSize={'14px'}>
                          Balance:{' '}
                          <Currency
                            value={balance !== undefined ? BigNumber(formatUnits(balance as bigint, 6)).toFixed() : 0}
                            decimal={2}
                            unit="USDC"
                          />{' '}
                          USDC
                        </Text>
                      </Flex>
                    </FormLabel>
                    <InputGroup>
                      <Input
                        id="amount"
                        placeholder="0.0"
                        paddingRight={'125px'}
                        fontSize={'14px'}
                        border={'1px solid #6D6D70'}
                        {...formik.getFieldProps('amount')}
                        onChange={(e) => {
                          if (validNumber.test(e.target.value)) {
                            formik.handleChange(e);
                          } else {
                            console.log('field value change');
                            return;
                          }
                        }}
                      />
                      <InputRightElement width={'125px'}>
                        <Button
                          h="1.75rem"
                          size="sm"
                          marginRight={'4px'}
                          fontSize={'14px'}
                          background={'#0C0C10'}
                          color="#ffffff"
                          fontWeight={600}
                          boxShadow={'0px 0px 3px -1px rgba(196,196,196,0.5)'}
                          _hover={{
                            background: '#252528',
                          }}
                          onClick={setMaxValue}
                        >
                          Max
                        </Button>
                        <Box as={'span'} color={'#38383A'}>
                          |
                        </Box>
                        <Text marginLeft={'4px'} fontSize={'14px'} fontWeight={400}>
                          USDC
                        </Text>
                      </InputRightElement>
                    </InputGroup>
                    {formik.errors.amount && formik.touched.amount && (
                      <Text color="red" marginTop={'4px'}>
                        {formik.errors.amount}
                      </Text>
                    )}
                  </FormControl>
                  <Flex flexDirection={'column'} alignItems={'end'} width={'100%'}>
                    <Text color={'#9E9E9F'} fontSize="12px">
                      Receive
                    </Text>
                    <Text color={'#1ED768'} fontSize="16px">
                      {addComma(divide(formik.getFieldProps('amount').value || 0, tokenPrice), 2)} ETR
                    </Text>
                  </Flex>
                </VStack>
              </form>
            </ModalBody>

            <ModalFooter>
              {isApproved ? (
                <Button
                  colorScheme="primary"
                  onClick={() => formik.handleSubmit()}
                  width={'100%'}
                  isLoading={loadingBuy}
                >
                  Buy
                </Button>
              ) : (
                <Button
                  colorScheme="primary"
                  onClick={onApprove}
                  width={'100%'}
                  isDisabled={isApproved && !loadingApproved}
                  isLoading={loadingApproved}
                >
                  Approve
                </Button>
              )}
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Flex>
  );
};
