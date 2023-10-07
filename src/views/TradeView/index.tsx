'use client';

import useModalStore from '@/store/useModalStore';
import useUserStore from '@/store/useUserStore';
import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  GridItem,
  Icon,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Radio,
  RadioGroup,
  Stack,
  useToast,
} from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { useAccount } from 'wagmi';

const TradingViewChart = dynamic(
  () => import('@/components/TradingView/TradingView').then((mod) => mod.TradingViewChart),
  { ssr: false },
);

const TradeView = () => {
  const { address } = useAccount();
  const { onOpen } = useModalStore();
  const toast = useToast();
  const { listWallets } = useUserStore();
  const isRegisterd = useMemo(() => {
    if (listWallets && address && listWallets[address.toLocaleLowerCase()]) {
      return true;
    }
    return false;
  }, [address, listWallets]);

  return (
    <Grid templateColumns="repeat(24, 1fr)" gap={4} paddingTop="20px">
      <GridItem colSpan={6}>
        <Box className="pl-5">
          <p className="mb-3 text-xs font-normal text-[#9E9E9F]">Time</p>
          <Box marginBottom="12px">
            <button>3m</button>
            <button>5m</button>
            <button>15m</button>
            <button>1h</button>
          </Box>
          <Flex alignItems="center" justifyContent="space-between" marginBottom="12px">
            <Center>
              <p className="text-xs font-normal text-[#9E9E9F]">Trade size</p>
            </Center>
            <Center>
              <Image src="/images/icons/wallet.svg" alt="wallet" w="20px" h="20px" marginRight="8px" />
              <span className="text-sm font-normal text-[#ffffff]">0 USDC</span>
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
                    onClick={() => console.log('====')}
                    _hover={{ bgColor: '#000' }}
                  >
                    Max
                  </Button>
                  <span className="border-l border-[#38383A] pl-2 leading-6">USDC</span>
                </Flex>
              </InputRightElement>
            </InputGroup>
            <RadioGroup defaultValue="2">
              <Stack spacing={10} direction="row">
                <Radio value="market">Market</Radio>
                <Radio value="limit">Limit</Radio>
              </Stack>
            </RadioGroup>
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
              <span className="text-base font-normal text-[#1ED768]">0.00 USDC</span>
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

                      return <Button>aaaaaa</Button>;
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
