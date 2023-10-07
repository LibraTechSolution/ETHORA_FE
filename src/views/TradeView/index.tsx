'use client';

import Currency from '@/components/Currency';
import { appConfig } from '@/config';
import { useBalanceOf } from '@/hooks/useContractRead';
import useModalStore from '@/store/useModalStore';
import useUserStore from '@/store/useUserStore';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
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
  useToast,
} from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Radio } from 'antd';
import dynamic from 'next/dynamic';
import { ChangeEvent, useMemo, useState } from 'react';
import { Address } from 'viem';
import { useAccount } from 'wagmi';

const TradingViewChart = dynamic(
  () => import('@/components/TradingView/TradingView').then((mod) => mod.TradingViewChart),
  { ssr: false },
);

const TradeView = () => {
  const { address } = useAccount();
  const { onOpen } = useModalStore();
  const balance = useBalanceOf(appConfig.usdcAddress as Address);
  const [tradeNumber, setTradeNumber] = useState<string>('0');
  const [tradeType, setTradeType] = useState<string>('market');
  const toast = useToast();
  const { listWallets } = useUserStore();
  const [time, setTime] = useState<string>('15m');
  const isRegisterd = useMemo(() => {
    if (listWallets && address && listWallets[address.toLocaleLowerCase()]) {
      return true;
    }
    return false;
  }, [address, listWallets]);

  const handleMax = () => {
    setTradeNumber('1000');
  };

  const handleOnChangeNumber = (e: ChangeEvent<HTMLInputElement>) => {
    const numberRegex = /^[0-9]*([.])?([0-9]{1,2})?$/;
    let numberValue = e.target.value;
    if (!numberRegex.test(numberValue)) {
      numberValue = tradeNumber.toString();
    }
    console.log(numberValue);
    setTradeNumber(numberValue);
  };

  const handleOnChangeType = (e: ChangeEvent<HTMLInputElement>) => {
    setTradeType(e.target.value);
  };

  return (
    <Grid templateColumns="repeat(24, 1fr)" gap={4} paddingTop="20px">
      <GridItem colSpan={6}>
        <Box className="pl-5">
          <p className="mb-3 text-xs font-normal text-[#9E9E9F]">Time</p>
          <Box marginBottom="12px">
            <Button
              border={time === '3m' ? '1px solid #6052FB' : ''}
              bgColor="#0C0C10"
              rounded="10px"
              textColor={time === '3m' ? '#fff' : '#6D6D70'}
              fontSize="sm"
              fontWeight="normal"
              width="48px"
              marginRight="4px"
              _hover={{
                border: '1px solid #6052FB',
                textColor: '#fff',
              }}
              _active={{
                border: '1px solid #6052FB',
                textColor: '#fff',
              }}
              onClick={() => setTime('3m')}
            >
              3m
            </Button>
            <Button
              border={time === '5m' ? '1px solid #6052FB' : ''}
              bgColor="#0C0C10"
              rounded="10px"
              textColor={time === '5m' ? '#fff' : '#6D6D70'}
              fontSize="sm"
              fontWeight="normal"
              width="48px"
              marginRight="4px"
              _hover={{
                border: '1px solid #6052FB',
                textColor: '#fff',
              }}
              _active={{
                border: '1px solid #6052FB',
                textColor: '#fff',
              }}
              onClick={() => setTime('5m')}
            >
              5m
            </Button>
            <Button
              border={time === '15m' ? '1px solid #6052FB' : ''}
              bgColor="#0C0C10"
              rounded="10px"
              textColor={time === '15m' ? '#fff' : '#6D6D70'}
              fontSize="sm"
              fontWeight="normal"
              width="48px"
              marginRight="4px"
              _hover={{
                border: '1px solid #6052FB',
                textColor: '#fff',
              }}
              _active={{
                border: '1px solid #6052FB',
                textColor: '#fff',
              }}
              onClick={() => setTime('15m')}
            >
              15m
            </Button>
            <Button
              border={time === '1h' ? '1px solid #6052FB' : ''}
              bgColor="#0C0C10"
              rounded="10px"
              textColor={time === '1h' ? '#fff' : '#6D6D70'}
              fontSize="sm"
              fontWeight="normal"
              width="48px"
              marginRight="4px"
              _hover={{
                border: '1px solid #6052FB',
                textColor: '#fff',
              }}
              _active={{
                border: '1px solid #6052FB',
                textColor: '#fff',
              }}
              onClick={() => setTime('1h')}
            >
              1h
            </Button>
          </Box>
          <Flex alignItems="center" justifyContent="space-between" marginBottom="12px">
            <Center>
              <p className="text-xs font-normal text-[#9E9E9F]">Trade size</p>
            </Center>
            <Center>
              <Image src="/images/icons/wallet.svg" alt="wallet" w="20px" h="20px" marginRight="8px" />
              <span className="text-sm font-normal text-[#ffffff]">
                <Currency decimalNumber={6} value={balance} /> USDC
              </span>
            </Center>
          </Flex>
          <Box marginBottom="12px">
            <InputGroup size="md" marginBottom="12px" borderColor="#6D6D70">
              <Input
                pr="8rem"
                type="text"
                rounded="10px"
                _hover={{ borderColor: '#6052FB' }}
                _focusVisible={{ borderColor: '#6052FB', borderWidth: '2px' }}
                value={tradeNumber}
                onChange={handleOnChangeNumber}
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
                  >
                    Max
                  </Button>
                  <span className="border-l border-[#38383A] pl-2 leading-6">USDC</span>
                </Flex>
              </InputRightElement>
            </InputGroup>
            <Radio.Group name="radiogroup" className="radio-custom" value={tradeType} onChange={handleOnChangeType}>
              <Radio value="market" className="text-[#fff]">
                Market
              </Radio>
              <Radio value="limit" className="text-[#fff]">
                Limit
              </Radio>
            </Radio.Group>
          </Box>
          <Flex alignItems="center" justifyContent="space-between" marginBottom="12px">
            <Center>
              <p className="text-xs font-normal text-[#9E9E9F]">Price</p>
            </Center>
            <Center>
              <span className="text-base font-normal text-[#ffffff]">26.565.65</span>
            </Center>
          </Flex>
          <Flex alignItems="center" justifyContent="space-between" marginBottom="12px">
            <Box>
              <p className="text-xs font-normal text-[#9E9E9F]">Payout</p>
              <Box>
                <span className="mr-1 text-base font-normal text-[#fff]">8.00 USDC</span>
                <span className="text-xs font-normal text-[#6D6D70]">60%</span>
              </Box>
            </Box>
            <Box>
              <p className="text-right text-xs font-normal text-[#9E9E9F]">Profit</p>
              <span className="text-base font-normal text-[#1ED768]">0 USDC</span>
            </Box>
          </Flex>
          <Box>
            <ConnectButton.Custom>
              {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                authenticationStatus,
                mounted,
              }) => {
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
                            borderColor="#6052FB"
                            bgColor="#6052FB"
                            textColor="#fff"
                            variant="outline"
                            _hover={{ bgColor: '#7A72F6', borderColor: '#7A72F6' }}
                            _active={{ bgColor: '#342BC3', borderColor: '#342BC3' }}
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
                          >
                            Wrong network
                          </Button>
                        );
                      }

                      if (!isRegisterd) {
                        return (
                          <Button
                            borderColor="#6052FB"
                            bgColor="#6052FB"
                            textColor="#fff"
                            variant="outline"
                            _hover={{ bgColor: '#7A72F6', borderColor: '#7A72F6' }}
                            _active={{ bgColor: '#342BC3', borderColor: '#342BC3' }}
                            width="full"
                            rounded="10px"
                            onClick={onOpen}
                          >
                            Activate Account
                          </Button>
                        );
                      }

                      return (
                        <Grid templateColumns="repeat(2, 1fr)" gap="20px">
                          <GridItem>
                            <Button
                              bgColor="#1ED768"
                              textColor="#fff"
                              w="full"
                              _hover={{ bgColor: '#1ED768', textColor: '#fff' }}
                              _active={{ bgColor: '#1ED768', textColor: '#fff' }}
                            >
                              <TriangleUpIcon color="#fff" w="14px" h="14px" marginRight="10px" />
                              Up
                            </Button>
                          </GridItem>
                          <GridItem>
                            <Button
                              bgColor="#F03D3E"
                              textColor="#fff"
                              w="full"
                              _hover={{ bgColor: '#F03D3E', textColor: '#fff' }}
                              _active={{ bgColor: '#F03D3E', textColor: '#fff' }}
                            >
                              <TriangleDownIcon color="#fff" w="14px" h="14px" marginRight="10px" />
                              Down
                            </Button>
                          </GridItem>
                        </Grid>
                      );
                    })()}
                  </div>
                );
              }}
            </ConnectButton.Custom>
          </Box>
        </Box>
      </GridItem>
      <GridItem colSpan={18}>
        <TradingViewChart />
      </GridItem>
    </Grid>
  );
};
export default TradeView;
