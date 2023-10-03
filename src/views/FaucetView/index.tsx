'use client';

import Link from 'next/link';
import { Box, Button, Center, Flex, Icon, useToast } from '@chakra-ui/react';
import { Image } from '@chakra-ui/react';
import { ToastLayout } from '@/components/ToastLayout';
import { Status } from '@/types/faucet.type';
import faucetABI from '@/config/abi/faucetABI';
import { useContractWrite } from 'wagmi';
import { BaseError, parseEther } from 'viem';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export const FaucetView = () => {
  const toast = useToast();

  const { writeAsync, isLoading } = useContractWrite({
    address: '0xEc4C9c881fA72bfe957717dB9812fEE6EFd80C2a',
    abi: faucetABI,
    functionName: 'claim',
  });

  const handleClaim = async () => {
    try {
      await writeAsync?.({
        value: parseEther('0.001'),
      });

      toast({
        position: 'top',
        render: ({ onClose }) => (
          <ToastLayout
            title="Claim USDC Successfully"
            content="You have successfully claimed 500 Testnet USDC"
            status={Status.SUCCESSS}
            close={onClose}
          />
        ),
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error instanceof BaseError && error.shortMessage);
      let msgContent = '';
      if (error instanceof BaseError) {
        if (error.shortMessage.includes('Already claimed!')) {
          msgContent = 'You can claim Testnet USDC only once per day (UTC timezone)!';
        } else if (error.shortMessage.includes('User rejected the request.')) {
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
          <ToastLayout title="Claim USDC Unsuccessfully" content={msgContent} status={Status.ERROR} close={onClose} />
        ),
      });
    }
  };

  return (
    <Flex
      flexDirection={'column'}
      height="100vh"
      paddingTop="160px"
      bgImage="url('/images/profile/bg-item.png')"
      bgRepeat="no-repeat"
      bgPosition="top -87px left 45px"
    >
      <Center>
        <Box
          boxShadow="1px 0.5px 0px 0px #3D3D40 inset"
          paddingY="40px"
          paddingX="32px"
          rounded="20px"
          width="504px"
          marginBottom="20px"
          bgColor="#1C1C1E80"
        >
          <h1 className="pb-2 text-2xl font-[600] text-[#fff]">Claim tESTNET ETH</h1>
          <p className="pb-5 text-[#D0D0D2]">You will need to claim testnet tokens to cover the gas fee.</p>
          <Box padding="20px" background="#050506" rounded="10px">
            <p className="mb-3 text-sm font-semibold text-[#D0D0D2]">Get Base Goerli ETH from these websites:</p>
            <ul className="list-disc pl-6">
              <li className="pb-3">
                <Link
                  href="https://coinbase.com/faucets/base-ethereum-goerli-faucet"
                  target="_blank"
                  className="w-full text-center"
                >
                  <Flex>
                    <span className="pr-[10px] underline">Coinbase Faucet</span>
                    <Image alt="Coinbase Faucet" src="/images/icons/open.svg" w="20px" h="20px" />
                  </Flex>
                </Link>
              </li>
              <li className="pb-3">
                <Link href="https://faucet.quicknode.com/drip" target="_blank" className="w-full text-center">
                  <Flex>
                    <span className="pr-[10px] underline">QuickNode Faucet</span>
                    <Image alt="QuickNode Faucet" src="/images/icons/open.svg" w="20px" h="20px" />
                  </Flex>
                </Link>
              </li>
              <li className="pb-3">
                <Link href="https://bwarelabs.com/faucets/base-testnet" target="_blank" className="w-full text-center">
                  <Flex>
                    <span className="pr-[10px] underline">BwareLabs Faucet</span>
                    <Image alt="BwareLabs Faucet" src="/images/icons/open.svg" w="20px" h="20px" />
                  </Flex>
                </Link>
              </li>
            </ul>
          </Box>
        </Box>
      </Center>
      <Center>
        <Box
          boxShadow="1px 0.5px 0px 0px #3D3D40 inset"
          paddingY="40px"
          paddingX="32px"
          rounded="20px"
          width="504px"
          bgColor="#1C1C1E80"
        >
          <h1 className="mb-5 pb-2 text-center text-2xl font-[600] text-[#fff]">Claim tESTNET Tokens</h1>
          <Center>
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
                            leftIcon={
                              <Icon
                                width="6"
                                height="7"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M6.07749 4.06252H16.2305C16.3765 4.06245 16.5223 4.07171 16.6672 4.09025C16.6181 3.74563 16.4997 3.41452 16.3192 3.11689C16.1387 2.81925 15.8998 2.56126 15.6168 2.35846C15.3339 2.15565 15.0129 2.01225 14.673 1.93688C14.3332 1.86152 13.9816 1.85575 13.6394 1.91994L3.76473 3.60581C3.62963 3.62651 3.49305 3.6495 3.3563 3.67502H3.34765C3.2873 3.68656 3.22758 3.70021 3.16858 3.71592C1.68446 4.08941 1.25 5.43511 1.25 6.25005V7.19063C1.23717 7.29274 1.23058 7.39605 1.23047 7.50005V15C1.23119 15.6629 1.49482 16.2983 1.9635 16.767C2.43219 17.2357 3.06765 17.4993 3.73047 17.5H16.2305C16.8933 17.4993 17.5288 17.2357 17.9974 16.767C18.4661 16.2983 18.7297 15.6629 18.7305 15V7.50005C18.7297 6.83723 18.4661 6.20176 17.9974 5.73308C17.5288 5.26439 16.8933 5.00077 16.2305 5.00005H6.25C5.58866 5.00005 5.51619 4.19854 6.07749 4.06252ZM14.375 12.5C14.1278 12.5 13.8861 12.4267 13.6805 12.2894C13.475 12.152 13.3148 11.9568 13.2201 11.7284C13.1255 11.5 13.1008 11.2487 13.149 11.0062C13.1973 10.7637 13.3163 10.541 13.4911 10.3662C13.6659 10.1913 13.8887 10.0723 14.1311 10.0241C14.3736 9.97583 14.6249 10.0006 14.8534 10.0952C15.0818 10.1898 15.277 10.35 15.4143 10.5556C15.5517 10.7611 15.625 11.0028 15.625 11.25C15.625 11.5816 15.4933 11.8995 15.2589 12.1339C15.0245 12.3683 14.7065 12.5 14.375 12.5Z"
                                  fill="#6052FB"
                                />
                              </Icon>
                            }
                            // rightIcon={<TriangleDownIcon w="20px" h="12px" />}
                            borderColor="#6052FB"
                            textColor="#6052FB"
                            variant="outline"
                            _hover={{ borderColor: '#7A72F6', textColor: '#7A72F6' }}
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
                          >
                            Wrong network
                          </Button>
                        );
                      }

                      return (
                        <Button
                          bgColor="#6052FB"
                          textColor="white"
                          fontWeight={600}
                          fontSize="16px"
                          rounded="10px"
                          _hover={{ bg: '#7A72F6' }}
                          onClick={handleClaim}
                          disabled={isLoading}
                        >
                          Claim 500 USDC
                        </Button>
                      );
                    })()}
                  </div>
                );
              }}
            </ConnectButton.Custom>
          </Center>
        </Box>
      </Center>
    </Flex>
  );
};
