'use client';

import Currency from '@/components/Currency';
import { appConfig } from '@/config';
import { useBalanceOf } from '@/hooks/useContractRead';
import useModalStore from '@/store/useModalStore';
import useUserStore from '@/store/useUserStore';
import { InfoIcon, TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  GridItem,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  useBreakpoint,
  useToast,
} from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Radio, RadioChangeEvent } from 'antd';
import BigNumber from 'bignumber.js';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Address, BaseError } from 'viem';
import { useAccount, useNetwork } from 'wagmi';
import useTradeStore from '@/store/useTradeStore';
import { addComma } from '@/utils/number';
import { readContract, signTypedData } from '@wagmi/core';
import USDC_ABI from '@/config/abi/USDC_ABI';
import { ToastLayout } from '@/components/ToastLayout';
import { Status } from '@/types/faucet.type';
import { getSVR } from '@/utils/helper';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import { IPermit } from '@/types/auth.type';
import { approveToken } from '@/services/auth';
import { useParams } from 'next/navigation';
import usePairStore from '@/store/usePairStore';
import { PairData, PairType, TRADE_TOKEN } from '@/types/trade.type';
import { createTrade } from '@/services/trade';
import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';
import referralABI from '@/config/abi/referralABI';
import useListShowLinesStore from '@/store/useListShowLinesStore';
import { useGetMinMaxTradeSize, useGetTradeContract } from '@/hooks/useGetTradeContract';
import bufferBOABI from '@/config/abi/bufferBOABI';
import { divide, multiply, subtract } from '@/utils/operationBigNumber';
import useAdvanceSetting from '@/store/useAdvanceSetting';
import { ShowPrice } from './ShowPrice';
import { useCheckForexClose } from '@/hooks/useCheckForexClose';
dayjs.extend(utc);

const approveParamType = [
  { name: 'owner', type: 'address' },
  { name: 'spender', type: 'address' },
  { name: 'value', type: 'uint256' },
  { name: 'nonce', type: 'uint256' },
  { name: 'deadline', type: 'uint256' },
];

const enum InputName {
  TRADE_SIZE = 'tradeSize',
  LIMIT_ORDER_PRICE = 'limitOrderPrice',
}

const enum TradeType {
  MARKET = 'market',
  LIMIT = 'limit',
}

const TradeControl = () => {
  const toast = useToast();
  const { address } = useAccount();
  const { onOpen } = useModalStore();
  const balance = useBalanceOf(appConfig.USDC_SC as Address);
  const [tradeSize, setTradeSize] = useState<string>('0');
  const [tradeSizeError, setTradeSizeError] = useState<string>('');
  const [limitOrderPrice, setLimitOrderPrice] = useState<string>('0');
  const [limitOrderPriceError, setLimitOrderPriceError] = useState<string>('');
  const [timeError, setTimeError] = useState<string>('');
  const [tradeType, setTradeType] = useState<string>('market');
  const { price } = useTradeStore();
  const { user, toggleApprovedAccount } = useUserStore();
  const listTimes = ['3m', '5m', '15m', '1h'];
  const [time, setTime] = useState<string>('15m');
  const [timeType, setTimeType] = useState<string>('m');
  const [timeNumber, setTimeNumber] = useState<string>('');
  const { chain } = useNetwork();
  const [isLoadingApprove, setIsLoadingApprove] = useState<boolean>(false);
  const params = useParams();
  const { listPairData } = usePairStore();
  const [isShowWarning, setIsShowWarning] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const { bufferBOSC, settlementFee } = useGetTradeContract();
  const { resetListLine, setListLines } = useListShowLinesStore();
  const [referCode, setReferCode] = useState('');
  const [pairPayout, setPairPayout] = useState(0);
  const [isPendingUp, setIsPendingUp] = useState<boolean>(false);
  const [isPendingDown, setIsPendingDown] = useState<boolean>(false);
  const { advanceSetting } = useAdvanceSetting();
  const { minTradeSize, maxTradeSize } = useGetMinMaxTradeSize();
  const breakpoint = useBreakpoint({ ssr: false });
  const isClosed = useCheckForexClose();

  useEffect(() => {
    const listBreakPoints = ['xl', '1.5xl', '2xl', '3xl'];
    if (listBreakPoints.includes(breakpoint) && !timeNumber) {
      setTime('');
    }
  }, [breakpoint]);

  useEffect(() => {
    if (address) {
      resetListLine();
      queryClient.clear();
      setIsShowWarning(false);
    }
  }, [address, queryClient, resetListLine]);

  const currentPair = useMemo<PairData | null>(() => {
    if (!params?.pair) return null;
    return (
      listPairData.find(
        (item: PairData) => item.pair.replace('/', '-').toLowerCase() === (params?.pair as string).toLowerCase(),
      ) ?? null
    );
  }, [listPairData, params?.pair]);

  const isRegisterd = useMemo(() => {
    if (user && address && user.isRegistered) {
      return true;
    }
    return false;
  }, [address, user]);

  const isApproved = useMemo(() => {
    if (user && address && user.isApproved) {
      return true;
    }
    return false;
  }, [address, user]);

  const domain = {
    name: 'USDC',
    version: '1',
    chainId: chain ? chain?.id : 5,
    verifyingContract: appConfig.USDC_SC as Address,
  };

  const handleMax = () => {
    setTradeSizeError('');
    if (!balance) return;
    let maxBalance = BigNumber(balance.toString()).div(1000000).toString();

    if (+maxBalance > maxTradeSize) {
      maxBalance = maxTradeSize.toString();
    }
    setTradeSize(maxBalance);
  };

  const handleOnChangeNumber = (e: ChangeEvent<HTMLInputElement>, inputName: InputName) => {
    if (inputName === InputName.TRADE_SIZE) {
      setTradeSizeError('');
      setIsShowWarning(false);
    }
    if (inputName === InputName.LIMIT_ORDER_PRICE) {
      setLimitOrderPriceError('');
    }
    const numberRegex = /^[0-9]*([.])?([0-9]{1,6})?$/;
    let numberValue = e.target.value;
    if (!numberRegex.test(numberValue)) {
      numberValue = inputName === InputName.TRADE_SIZE ? tradeSize.toString() : limitOrderPrice.toString();
    }
    if (inputName === InputName.TRADE_SIZE) {
      setTradeSize(numberValue);
    } else {
      setLimitOrderPrice(numberValue);
    }
  };

  const handleOnChangeTime = (e: ChangeEvent<HTMLInputElement>) => {
    setTimeError('');
    const numberRegex = /^[0-9]*$/;
    let numberValue = e.target.value;
    if (!numberRegex.test(numberValue)) {
      numberValue = timeNumber.toString();
    }
    setTimeNumber(numberValue);
    setTime(numberValue + timeType);
  };

  const handleOnChangeType = (e: RadioChangeEvent) => {
    setTradeType(e.target.value);
  };

  const handleApprove = async (permit: IPermit) => {
    try {
      const res = await approveToken(permit, chain?.id as number, true);
      toggleApprovedAccount(true);
      setIsLoadingApprove(false);
      toast({
        position: 'top',
        render: ({ onClose }) => <ToastLayout title="Approved successfully" status={Status.SUCCESSS} close={onClose} />,
      });
    } catch (error) {
      setIsLoadingApprove(false);
      toast({
        position: 'top',
        render: ({ onClose }) => (
          <ToastLayout
            title="Approve account Unsuccessfully"
            content={'Something went wrong. Please try again later.'}
            status={Status.ERROR}
            close={onClose}
          />
        ),
      });
    }
  };

  const signTypedDataV4 = async (nonce: bigint) => {
    try {
      const deadline = dayjs().utc().add(1, 'day').unix();
      const approveMessage = {
        nonce: nonce,
        value: 115792089237316195423570985008687907853269984665640564039457584007913129639935n,
        owner: address,
        deadline,
        spender: appConfig.bufferRouterSC as Address,
      };
      const signature = await signTypedData({
        domain,
        message: approveMessage,
        types: {
          Permit: approveParamType,
        },
        primaryType: 'Permit',
      });

      const permit = {
        ...getSVR(signature),
        deadline,
      };
      handleApprove(permit);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setIsLoadingApprove(false);
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
            title="Approve account Unsuccessfully"
            content={msgContent}
            status={Status.ERROR}
            close={onClose}
          />
        ),
      });
    }
  };

  const approve = async () => {
    try {
      setIsLoadingApprove(true);
      const nonce = await readContract({
        address: appConfig.USDC_SC as Address,
        abi: USDC_ABI,
        functionName: 'nonces',
        args: [address as Address],
      });
      signTypedDataV4(nonce);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setIsLoadingApprove(false);
    }
  };

  const handleOnchangeTimeType = (e: ChangeEvent<HTMLSelectElement>) => {
    setTimeError('');
    setTime(timeNumber + e.target.value);
    setTimeType(e.target.value);
  };

  const convertToTimeStamp = (time: string) => {
    if (time.includes('m')) {
      return +time.slice(0, -1) * 60;
    } else {
      return +time.slice(0, -1) * 3600;
    }
  };

  useEffect(() => {
    if (tradeType === TradeType.LIMIT) {
      setLimitOrderPrice(price.toFixed(2).toString());
    }
  }, [tradeType]);

  const getRoundPrice = (number: string) => {
    let pow = 8;
    if (currentPair?.pair) {
      if (['XAU/USD'].includes(currentPair?.pair)) {
        pow = 3;
      } else if (['XAG/USD', 'EUR/USD', 'GBP/USD'].includes(currentPair?.pair)) {
        pow = 5;
      }
    }

    return +multiply(number.toString(), pow);
  };

  const handleCreateTrade = async (isAbove: boolean) => {
    setIsShowWarning(false);
    let hasError = false;
    if (tradeType === TradeType.LIMIT) {
      if (!limitOrderPrice || +limitOrderPrice < 0.00000001) {
        setLimitOrderPriceError('Minimum limit price is 0.00000001');
        hasError = true;
      } else if (limitOrderPrice && +limitOrderPrice > 1000000000) {
        setLimitOrderPriceError('Maximum limit price is 1,000,000,000');
        hasError = true;
      }
    }

    if (convertToTimeStamp(time) < 180) {
      setTimeError('Minimum duration is 3 minutes');
      hasError = true;
    }

    if (convertToTimeStamp(time) > 14400) {
      setTimeError('Maximum duration is 4 hours');
      hasError = true;
    }
    if (!balance || (balance && +divide(balance.toString(), 6) < +tradeSize + +(appConfig?.FEE ?? 0.1))) {
      setTradeSizeError('You dont have enough USDC for platform fee');
      hasError = true;
    }

    if (+tradeSize > maxTradeSize) {
      setTradeSizeError('Amount exceeds max trade size');
      hasError = true;
    }
    if (+tradeSize < minTradeSize) {
      setTradeSizeError(`Min trade size is ${minTradeSize} USDC`);
      hasError = true;
    }

    if (hasError) return;
    try {
      if (isAbove) {
        setIsPendingUp(true);
      } else {
        setIsPendingDown(true);
      }
      const currentDate = dayjs().utc().format();
      const data = {
        network: chain?.id ?? 5,
        strike: tradeType === TradeType.LIMIT ? getRoundPrice(limitOrderPrice) : getRoundPrice(price.toString()),
        strikeDate: currentDate,
        period: convertToTimeStamp(time),
        targetContract: bufferBOSC as string,
        tradeSize: (+tradeSize * 1000000).toString(),
        slippage: address && advanceSetting && advanceSetting[address] ? +advanceSetting[address].slippage * 100 : 5,
        isAbove,
        isLimitOrder: tradeType === TradeType.LIMIT,
        limitOrderDuration:
          address && advanceSetting && advanceSetting[address]
            ? convertToTimeStamp(
                `${advanceSetting[address].limitOrderExpiryTime}${advanceSetting[address].limitOrderExpiryTimeType}`,
              )
            : 18000,
        token: TRADE_TOKEN.USDC,
        pair: currentPair?.pair ? currentPair?.pair.replace('/', '-').toLowerCase() : '',
        referralCode: referCode ?? '',
      };
      const res = await createTrade(data);
      setListLines(res.data.data);
      toast({
        position: 'top',
        render: ({ onClose }) => (
          <ToastLayout
            title="Trade order placed"
            content={`${data.pair} to go ${isAbove ? 'Higher' : 'Lower'}`}
            status={Status.SUCCESSS}
            close={onClose}
          >
            <p className="font-semibold text-[#fff]">
              {data.isLimitOrder ? 'Limit Order placed' : 'Trade order placed'}
            </p>
            <p className="text-[#9E9E9F]">
              <span className="text-[#fff]">{data.pair.toUpperCase()}</span> to go{' '}
              <span className="text-[#fff]">{isAbove ? 'Higher' : 'Lower'}</span>
            </p>
            <p className="text-[#9E9E9F]">
              Total amount: <span className="text-[#fff]">{tradeSize}</span> USDC
            </p>
          </ToastLayout>
        ),
      });
      setTimeout(() => {
        if (isAbove) {
          setIsPendingUp(false);
        } else {
          setIsPendingDown(false);
        }
      }, 200);
      queryClient.invalidateQueries({ queryKey: ['getActiveTrades'] });
      queryClient.invalidateQueries({ queryKey: ['getLimitOrders'] });
    } catch (error) {
      if (isAbove) {
        setIsPendingUp(false);
      } else {
        setIsPendingDown(false);
      }
      toast({
        position: 'top',
        render: ({ onClose }) => (
          <ToastLayout title="Create trade Unsuccessfully" status={Status.ERROR} close={onClose} />
        ),
      });
    }
  };

  const getPayout = useCallback(async () => {
    try {
      const payout = await readContract({
        address: bufferBOSC as `0x${string}`,
        abi: bufferBOABI,
        functionName: 'evaluateParams',
        args: [
          {
            strike: 0n,
            amount: 0n,
            period: 900n,
            allowPartialFill: true,
            totalFee: 10000000n,
            user: address as `0x${string}`,
            referralCode: referCode,
            baseSettlementFeePercentage: BigInt(settlementFee),
          },
          0n,
        ],
      });
      const pairPayout = Math.round(
        100 * +divide(subtract(payout[0].toString(), payout[1].toString()), payout[1].toString()),
      );
      setPairPayout(pairPayout);
      // setCurrentOI(+divide(currentOI.toString(), 6));
    } catch (error) {}
  }, [address, bufferBOSC, referCode, settlementFee]);

  const getReferCode = useCallback(async () => {
    try {
      const code = await readContract({
        address: appConfig.referralSC as Address,
        abi: referralABI,
        functionName: 'traderReferralCodes',
        args: [address as Address],
      });
      setReferCode(code);
    } catch (error) {}
  }, [address]);

  useEffect(() => {
    const interval = setInterval(() => {
      getPayout();
      getReferCode();
    }, 5000);

    return () => clearInterval(interval);
  }, [getPayout, getReferCode]);

  return (
    <>
      <p className="mb-3 text-xs font-normal text-[#9E9E9F]">Time</p>
      <Box display={{ base: 'flex' }}>
        <Box display={{ base: 'flex', xl: 'none', '4xl': 'flex' }}>
          {listTimes.map((item) => (
            <Button
              key={item}
              border={time === item ? '1px solid #1E3EF0' : '1px solid #0C0C10'}
              bgColor="#0C0C10"
              rounded="10px"
              textColor={time === item ? '#fff' : '#6D6D70'}
              fontSize="sm"
              fontWeight="normal"
              width="48px"
              marginRight="4px"
              _hover={{
                border: '1px solid #1E3EF0',
                textColor: '#fff',
              }}
              _active={{
                border: '1px solid #1E3EF0',
                textColor: '#fff',
              }}
              onClick={() => {
                setTimeNumber('');
                setTimeError('');
                setTime(item);
              }}
            >
              {item}
            </Button>
          ))}
        </Box>
        {/* <Select
          display={{ base: 'none', xl: 'block', '4xl': 'none' }}
          value={time}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => setTime(e.target.value)}
          border={'none'}
          _focusVisible={{ border: 'none' }}
          bgColor={'#0C0C10'}
          marginRight={1}
          width={'130px'}
        >
          <option value="3m" className="!bg-black">
            3m
          </option>
          <option value="5m" className="!bg-black">
            5m
          </option>
          <option value="15m" className="!bg-black">
            15m
          </option>
          <option value="1h" className="!bg-black">
            1h
          </option>
        </Select> */}
        <InputGroup size="md">
          <Input
            pr="4.5rem"
            placeholder="Enter"
            border={timeError ? '1px solid #F03D3E' : 'none'}
            _hover={{ border: 'none' }}
            _focusVisible={{ border: 'none' }}
            bg="#0C0C10"
            rounded={'10px'}
            minWidth={'128px'}
            onChange={handleOnChangeTime}
            value={timeNumber}
          />
          <InputRightElement width="4.5rem">
            <div className="h-6 border-r-[1px] border-r-[#38383A]"></div>
            <Select
              value={timeType}
              onChange={handleOnchangeTimeType}
              border={'none'}
              _focusVisible={{ border: 'none' }}
            >
              <option value="m" className="!bg-black">
                m
              </option>
              <option value="h" className="!bg-black">
                h
              </option>
            </Select>
          </InputRightElement>
        </InputGroup>
      </Box>
      <p className="mb-3 text-sm font-normal text-[#F03D3E]">{timeError}</p>
      <Flex alignItems="center" justifyContent="space-between" marginBottom="12px">
        <Center>
          <p className="text-xs font-normal text-[#9E9E9F]">Trade size</p>
        </Center>
        <Center>
          <Image src="/images/icons/wallet.svg" alt="wallet" w="20px" h="20px" marginRight="8px" />
          <span className="text-sm font-normal text-[#ffffff]">
            <Currency decimalNumber={6} value={balance} decimal={2} /> USDC
          </span>
        </Center>
      </Flex>
      <Box marginBottom="12px">
        <InputGroup size="md" borderColor="#6D6D70">
          <Input
            pr="8rem"
            type="text"
            rounded="10px"
            border={tradeSizeError ? '1px solid #F03D3E' : '1px solid #6D6D70'}
            _hover={{ borderColor: '#1E3EF0' }}
            _focusVisible={{ borderColor: '#1E3EF0', borderWidth: '2px' }}
            value={tradeSize}
            onChange={(e) => handleOnChangeNumber(e, InputName.TRADE_SIZE)}
          />
          <InputRightElement width="8rem">
            <Flex alignItems="center">
              <Button
                size="sm"
                bgColor="#000"
                fontWeight="600"
                fontSize="14px"
                textColor="#fff"
                paddingX="3"
                onClick={handleMax}
                _hover={{ bgColor: '#000' }}
                marginRight={'10px'}
              >
                Max
              </Button>
              <span className="border-l border-[#38383A] pl-2 leading-6">USDC</span>
            </Flex>
          </InputRightElement>
        </InputGroup>
        {tradeSizeError ? (
          <p className="mb-3 text-sm font-normal text-[#F03D3E]">{tradeSizeError}</p>
        ) : (
          <p className="my-3 text-sm font-normal text-[#6D6D70]">Platform fee: +0.1 USDC</p>
        )}
        {isShowWarning && (
          <Center justifyContent={'start'} mb={3}>
            <InfoIcon color={'#F03D3E'} />
            <span className="pl-2 pr-1 text-sm font-normal text-[#F03D3E]">You don&apos;t have enough USDC.</span>{' '}
            <Link href={'/faucet'} target="_blank">
              <span className="text-sm font-normal text-[#1E3EF0] underline">Buy USDC</span>{' '}
            </Link>
          </Center>
        )}
        <Radio.Group name="radiogroup" className="radio-custom" value={tradeType} onChange={handleOnChangeType}>
          <Radio value={TradeType.MARKET} className="text-[#fff]">
            Market
          </Radio>
          <Radio value={TradeType.LIMIT} className="text-[#fff]">
            Limit
          </Radio>
        </Radio.Group>
      </Box>
      <Flex alignItems="center" justifyContent="space-between">
        <Box>
          <p className="text-xs font-normal text-[#9E9E9F]">Price</p>
        </Box>
        <Box>
          {currentPair?.pair && tradeType === 'market' ? (
            <span className="text-base font-normal text-[#ffffff]">
              <ShowPrice pair={currentPair.pair.replace('/', '').toUpperCase()} />
            </span>
          ) : (
            <>
              <Input
                value={limitOrderPrice}
                onChange={(e) => handleOnChangeNumber(e, InputName.LIMIT_ORDER_PRICE)}
                border={'none'}
                _hover={{ border: 'none' }}
                _focusVisible={{ border: 'none' }}
                bg={'#38383A'}
                rounded={'6px'}
                w="110px"
                h="26px"
              />
            </>
          )}
        </Box>
      </Flex>
      <p className="mb-3 text-sm font-normal text-[#F03D3E]">{limitOrderPriceError}</p>
      <Flex alignItems="center" justifyContent="space-between" marginBottom="12px">
        <Box>
          <p className="text-xs font-normal text-[#9E9E9F]">Payout</p>
          <Box>
            <span className="mr-1 text-base font-normal text-[#fff]">
              {addComma((+tradeSize * (100 + (pairPayout ?? 0))) / 100, 2)} USDC
            </span>
            <span className="text-xs font-normal text-[#6D6D70]">{pairPayout}%</span>
          </Box>
        </Box>
        <Box>
          <p className="text-right text-xs font-normal text-[#9E9E9F]">Profit</p>
          <span className="text-base font-normal text-[#1ED768]">
            {addComma((+tradeSize * (pairPayout ?? 0)) / 100, 2)} USDC
          </span>
        </Box>
      </Flex>
      <Box>
        <ConnectButton.Custom>
          {({ account, chain, openAccountModal, openChainModal, openConnectModal, authenticationStatus, mounted }) => {
            // Note: If your app doesn't use authentication, you
            // can remove all 'authenticationStatus' checks
            const ready = mounted && authenticationStatus !== 'loading';
            const connected =
              ready && account && chain && (!authenticationStatus || authenticationStatus === 'authenticated');

            return (
              <div
                {...(!ready && {
                  'aria-hidden': true,
                  style: {
                    opacity: 0,
                    pointerEvents: 'none',
                    userSelect: 'none',
                  },
                })}
              >
                {(() => {
                  if (!connected) {
                    return (
                      <Button
                        borderColor="#1E3EF0"
                        bgColor="#1E3EF0"
                        textColor="#fff"
                        variant="outline"
                        _hover={{ bgColor: '#4B65F3', borderColor: '#4B65F3' }}
                        _active={{ bgColor: '#122590', borderColor: '#122590' }}
                        width="full"
                        rounded="10px"
                        onClick={openConnectModal}
                      >
                        Connect Wallet
                      </Button>
                    );
                  }

                  if (chain.unsupported) {
                    return (
                      <Button
                        onClick={openChainModal}
                        type="button"
                        bgColor="#ff494a"
                        textColor="#ffffff"
                        _hover={{ bgColor: '#ff494a' }}
                        rounded="10px"
                        width="full"
                      >
                        Wrong network
                      </Button>
                    );
                  }

                  if (!isRegisterd) {
                    return (
                      <Button
                        borderColor="#1E3EF0"
                        bgColor="#1E3EF0"
                        textColor="#fff"
                        variant="outline"
                        _hover={{ bgColor: '#4B65F3', borderColor: '#4B65F3' }}
                        _active={{ bgColor: '#122590', borderColor: '#122590' }}
                        width="full"
                        rounded="10px"
                        onClick={onOpen}
                      >
                        Activate Account
                      </Button>
                    );
                  }

                  if (!isApproved) {
                    return (
                      <Button
                        borderColor="#1E3EF0"
                        bgColor="#1E3EF0"
                        textColor="#fff"
                        variant="outline"
                        _hover={{ bgColor: '#4B65F3', borderColor: '#4B65F3' }}
                        _active={{ bgColor: '#122590', borderColor: '#122590' }}
                        width="full"
                        rounded="10px"
                        onClick={approve}
                        isLoading={isLoadingApprove}
                      >
                        Approve
                      </Button>
                    );
                  }

                  return (
                    <>
                      {isClosed && currentPair?.type === PairType.FOREX ? (
                        <Center>Trading is halted for this asset</Center>
                      ) : (
                        <Grid templateColumns="repeat(2, 1fr)" gap={{ base: '5px', '2xl': '20px' }}>
                          <GridItem colSpan={1}>
                            <Button
                              bgColor="#1ED768"
                              textColor="#fff"
                              w="full"
                              _hover={{ bgColor: '#1ED768', textColor: '#fff' }}
                              _active={{ bgColor: '#1ED768', textColor: '#fff' }}
                              onClick={() => handleCreateTrade(true)}
                              isDisabled={isPendingUp}
                              isLoading={isPendingUp}
                            >
                              <TriangleUpIcon color="#fff" w="14px" h="14px" marginRight="10px" />
                              Up
                            </Button>
                          </GridItem>
                          <GridItem colSpan={1}>
                            <Button
                              bgColor="#F03D3E"
                              textColor="#fff"
                              w="full"
                              _hover={{ bgColor: '#F03D3E', textColor: '#fff' }}
                              _active={{ bgColor: '#F03D3E', textColor: '#fff' }}
                              isDisabled={isPendingDown}
                              isLoading={isPendingDown}
                              onClick={() => handleCreateTrade(false)}
                            >
                              <TriangleDownIcon color="#fff" w="14px" h="14px" marginRight="10px" />
                              Down
                            </Button>
                          </GridItem>
                        </Grid>
                      )}
                    </>
                  );
                })()}
              </div>
            );
          }}
        </ConnectButton.Custom>
      </Box>
    </>
  );
};

export default TradeControl;
