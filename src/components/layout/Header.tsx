'use client';

import Link from 'next/link';

import {
  Box,
  Button,
  Center,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
  useMediaQuery,
  Text,
} from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useEffect, useRef, useState } from 'react';
import useUserStore from '@/store/useUserStore';
import { Image } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import { AccountModal } from '../AccountModal';
import { appConfig } from '@/config';
import AdvanceSetting from '@/views/TradeView/components/AdvanceSetting';
import useAdvanceSetting from '@/store/useAdvanceSetting';
import { addComma } from '@/utils/number';
import { useQuery } from '@tanstack/react-query';
import { getLeaderboards } from '@/services/leaderboard';
import dayjs from 'dayjs';
import { startStreaming } from '../TradingView/streaming';

export const Header = () => {
  const [isMobile] = useMediaQuery('(max-width: 992px)');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenDraw, onOpen: onOpenDraw, onClose: onCloseDraw } = useDisclosure();
  const { address } = useAccount();
  const { listWallets, setUser, setToken, setCurrentWallet } = useUserStore();
  const { advanceSetting, setListAdvanceSetting } = useAdvanceSetting();
  const currentRoute = usePathname();
  const linkStyle = 'rounded-[10px] px-3 py-2 ';
  const activeStyle = linkStyle + ' bg-[#1E3EF0] text-[#fff]';
  const nonActiveStyle = linkStyle + ' text-[#6D6D70]';
  const [isShow, setIsShow] = useState<boolean>(false);
  const settingRef = useRef<HTMLDivElement>(null);
  const [isDisabledLeaderBoard, setIsDisabledLeaderBoard] = useState<boolean>(false);

  useEffect(() => {
    if (address) {
      setCurrentWallet(address.toLowerCase());
      if (listWallets && listWallets[address.toLowerCase()]) {
        setUser(listWallets[address.toLowerCase()].user);
        setToken(listWallets[address.toLowerCase()].tokens);
      } else {
        setUser(null);
        setToken(null);
      }
      if (!advanceSetting || !(advanceSetting && advanceSetting[address])) {
        console.log(address);
        setListAdvanceSetting(address);
      }
    } else {
      setUser(null);
      setToken(null);
    }
  }, [address, listWallets, setToken, setUser]);

  const handleOutSideClick = (e: Event) => {
    if (!settingRef.current?.contains(e.target as Node)) {
      setIsShow(false);
    }
  };

  useEffect(() => {
    startStreaming();
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleOutSideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutSideClick);
    };
  }, [settingRef]);

  const { data: leaderBoardData, isSuccess } = useQuery({
    queryKey: ['getLeaderBoard', { type: 'daily', network: Number(appConfig.chainId) }],
    queryFn: () => getLeaderboards({ type: 'daily', network: Number(appConfig.chainId) }),
    onError: (error: any) => {
      // notification.error({ message: error.message });
      console.log(error);
    },
    cacheTime: 0,
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (
      leaderBoardData &&
      leaderBoardData?.config?.dailyStart &&
      leaderBoardData?.config?.weeklyStart &&
      (dayjs().unix() < dayjs(leaderBoardData?.config?.dailyStart).unix() ||
        dayjs().unix() < dayjs(leaderBoardData?.config?.weeklyStart).unix())
    ) {
      setIsDisabledLeaderBoard(true);
    }
  }, [leaderBoardData]);

  return (
    <>
      <Flex
        as="header"
        role="menu"
        padding={'8px 12px 8px 12px'}
        justifyContent="space-between"
        alignItems="center"
        fontSize={14}
        zIndex={11}
        // position={'fixed'}
        width={'100%'}
        // backgroundColor={scrolled ? '#0f0f14eb' : 'transparent'}
        top={0}
      >
        <Flex
          gap={3}
          alignItems="center"
          width={isMobile ? '30px' : '100%'}
          justifyContent={isMobile ? 'space-between' : 'start'}
        >
          {!isMobile && (
            <Center>
              <Link href="/" className="mr-2">
                <Image alt="ethora" src="/images/icons/Ethora.svg" w="full" h="full" />
              </Link>
            </Center>
          )}
          {isMobile ? (
            <Box onClick={onOpenDraw}>
              <Image alt="ethora" src="/images/icons/li_menu.svg" w="24px" h="24px" />
            </Box>
          ) : (
            <>
              <Center>
                <Link href="/trade/BTC-USD" className={currentRoute.includes('/trade') ? activeStyle : nonActiveStyle}>
                  Trade
                </Link>
              </Center>
              {appConfig.includeTestnet && (
                <Center>
                  <Link href="/faucet" className={currentRoute === '/faucet' ? activeStyle : nonActiveStyle}>
                    Faucet
                  </Link>
                </Center>
              )}
              <Center>
                {isSuccess && isDisabledLeaderBoard ? (
                  <Box
                    bgColor={'#3D3D40'}
                    textColor={'#6D6D70'}
                    className="cursor-not-allowed rounded-[10px] px-3 py-2"
                  >
                    Leaderboard
                    <Text
                      className="ml-2 inline-block rounded px-2 font-normal"
                      background={'rgba(255, 190, 0, 0.10)'}
                      textColor={'#FFA500'}
                      fontSize={'12px'}
                    >
                      Coming soon
                    </Text>
                  </Box>
                ) : (
                  <Link href="/leaderboard" className={currentRoute === '/leaderboard' ? activeStyle : nonActiveStyle}>
                    Leaderboard
                  </Link>
                )}
              </Center>
              <Center>
                <Menu>
                  {({ isOpen }) => (
                    <>
                      <MenuButton className="text-[#6D6D70]">
                        More {isOpen ? <TriangleUpIcon w="20px" h="12px" /> : <TriangleDownIcon w="20px" h="12px" />}
                      </MenuButton>
                      <MenuList minWidth="160px" background="#252528" border="none" className="w-[160px]">
                        <MenuItem background="transparent">
                          <Link
                            href="/earn"
                            className={`w-full text-center ${currentRoute === '/earn' ? 'text-[#fff]' : ''}`}
                          >
                            Earn
                          </Link>
                        </MenuItem>
                        <MenuItem background="transparent">
                          <Link
                            href="/sale-token"
                            className={`w-full text-center ${currentRoute === '/sale-token' ? 'text-[#fff]' : ''}`}
                          >
                            Token sale
                          </Link>
                        </MenuItem>
                        <MenuItem background="transparent">
                          <Link
                            href="/referral"
                            className={`w-full text-center ${currentRoute === '/referral' ? 'text-[#fff]' : ''}`}
                          >
                            Referral
                          </Link>
                        </MenuItem>
                        <MenuItem background="transparent">
                          <Link
                            href="/trade/BTC-USD"
                            className={`w-full text-center ${currentRoute === '/trade/BTC-USD' ? 'text-[#fff]' : ''}`}
                          >
                            Practice Trading
                          </Link>
                        </MenuItem>
                        <MenuItem background="transparent">
                          <Link
                            href="/dashboard"
                            className={`w-full text-center ${currentRoute === '/dashboard' ? 'text-[#fff]' : ''}`}
                          >
                            Dashboard
                          </Link>
                        </MenuItem>
                        <MenuItem background="transparent">
                          <Link
                            href="/stats"
                            className={`w-full text-center ${currentRoute === '/stats' ? 'text-[#fff]' : ''}`}
                          >
                            Stats
                          </Link>
                        </MenuItem>
                        <MenuItem background="transparent">
                          <Link
                            href="https://docs.ethora.io"
                            target="_blank"
                            className={`w-full text-center ${currentRoute === '/docs' ? 'text-[#fff]' : ''}`}
                          >
                            Docs
                          </Link>
                        </MenuItem>
                        <MenuItem background="transparent">
                          <Link href="https://x.com/ethora_" target="_blank" className="w-full text-center">
                            Twitter
                          </Link>
                        </MenuItem>
                        <MenuItem background="transparent">
                          <Link href="https://discord.com/invite/ethora" target="_blank" className="w-full text-center">
                            Discord
                          </Link>
                        </MenuItem>
                        <MenuItem background="transparent">
                          <Link href="https://medium.com/@ethora" target="_blank" className="w-full text-center">
                            Medium
                          </Link>
                        </MenuItem>
                        {/* <MenuItem background="transparent">
                          <Link href="https://www.instagram.com" target="_blank" className="w-full text-center">
                            Instagram
                          </Link>
                        </MenuItem> */}
                      </MenuList>
                    </>
                  )}
                </Menu>
              </Center>
            </>
          )}
        </Flex>
        <Flex gap={isMobile ? 1 : 3} width={'100%'} justifyContent={'flex-end'}>
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
                                  fill="#1E3EF0"
                                />
                              </Icon>
                            }
                            rightIcon={<TriangleDownIcon w="20px" h="12px" />}
                            borderColor="#1E3EF0"
                            textColor="#1E3EF0"
                            variant="outline"
                            _hover={{ borderColor: '#4B65F3', textColor: '#4B65F3' }}
                            _active={{ borderColor: '#122590', textColor: '#122590' }}
                            onClick={openConnectModal}
                            size={`${isMobile ? 'sm' : 'md'}`}
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
                        <Flex gap={isMobile ? 1 : 3}>
                          <Button
                            onClick={openChainModal}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                            type="button"
                            bgColor="#252528"
                            textColor="#ffffff"
                            rightIcon={<TriangleDownIcon w="20px" h="12px" />}
                            width={`${isMobile ? '60px' : '200px'}`}
                            _hover={{ bg: '#252528' }}
                            rounded="10px"
                            size={`${isMobile ? 'sm' : 'md'}`}
                            padding={isMobile ? '4px 12px' : '4px 16px'}
                          >
                            <Flex>
                              <Center>
                                {chain.hasIcon && (
                                  <div
                                    style={{
                                      background: chain.iconBackground,
                                      width: 14,
                                      height: 14,
                                      borderRadius: 999,
                                      overflow: 'hidden',
                                      marginRight: '4px',
                                    }}
                                  >
                                    {chain.iconUrl && (
                                      <Image
                                        alt={chain.name ?? 'Chain icon'}
                                        src={chain.iconUrl}
                                        style={{ width: 14, height: 14 }}
                                      />
                                    )}
                                  </div>
                                )}
                                {!isMobile && chain.name}
                              </Center>
                            </Flex>
                          </Button>
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
                                  fill="#1E3EF0"
                                />
                              </Icon>
                            }
                            rightIcon={<TriangleDownIcon w="20px" h="12px" />}
                            borderColor="#1E3EF0"
                            textColor="#1E3EF0"
                            paddingX={`${isMobile ? '4px' : '12px'}`}
                            variant="outline"
                            _hover={{ borderColor: '#4B65F3', textColor: '#4B65F3' }}
                            _active={{ borderColor: '#122590', textColor: '#122590' }}
                            rounded="10px"
                            size={`${isMobile ? 'sm' : 'md'}`}
                            onClick={onOpen}
                            minWidth={'114px'}
                          >
                            <Text
                              style={{
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                                width: ' calc(100% - 60px)',
                              }}
                            >
                              {account?.balanceFormatted ? ` ${addComma(account?.balanceFormatted, 2)}` : '0'}
                              <span className="ml-1">{!isMobile && account?.balanceSymbol}</span>
                            </Text>
                          </Button>
                        </Flex>
                      );
                    })()}
                  </div>
                );
              }}
            </ConnectButton.Custom>
          </Center>
          <Center ref={settingRef} cursor="pointer" position={'relative'} zIndex={1}>
            <Button
              borderColor="#1E3EF0"
              textColor="#1E3EF0"
              variant="outline"
              _hover={{ bg: 'transparent' }}
              padding={isMobile ? '5px' : '10px'}
              size={`${isMobile ? 'sm' : 'md'}`}
              onClick={() => address && setIsShow(!isShow)}
            >
              <Image alt="setting" src="/images/icons/settings.svg" w="18px" h="18px" />
            </Button>
            <AdvanceSetting isShow={isShow} onClose={setIsShow} />
          </Center>
          <Center flex="none">
            <Link href={'/profile'}>
              <Image
                alt="avatar"
                src="/images/icons/avatar.svg"
                w={isMobile ? '32px' : '40px'}
                h={isMobile ? '32px' : '40px'}
              />
            </Link>
          </Center>
        </Flex>
        <Drawer isOpen={isOpenDraw} placement="left" onClose={onCloseDraw}>
          <DrawerOverlay />
          <DrawerContent backgroundColor={'#1a1a22'}>
            <DrawerHeader>
              <Image alt="ethora" src="/images/landingpage/logoText.svg" w="112px" h="32px" />
              <DrawerCloseButton color={'white'} />
            </DrawerHeader>

            <DrawerBody>
              <Center justifyContent={'flex-start'}>
                <Link href="/dashboard" className={currentRoute === '/dashboard' ? activeStyle : nonActiveStyle}>
                  Dashboard
                </Link>
              </Center>
              <Center justifyContent={'flex-start'}>
                <Link href="/trade/BTC-USD" className={currentRoute.includes('/trade') ? activeStyle : nonActiveStyle}>
                  Trade
                </Link>
              </Center>
              {appConfig.includeTestnet && (
                <Center justifyContent={'flex-start'}>
                  <Link href="/faucet" className={currentRoute === '/faucet' ? activeStyle : nonActiveStyle}>
                    Faucet
                  </Link>
                </Center>
              )}
              <Center justifyContent={'flex-start'}>
                <Link
                  href="/practice-trading"
                  className={currentRoute === '/practice-trading' ? activeStyle : nonActiveStyle}
                >
                  Practice Trading
                </Link>
              </Center>
              <Center justifyContent={'flex-start'}>
                {!isDisabledLeaderBoard ? (
                  <Link href="/leaderboard" className={currentRoute === '/leaderboard' ? activeStyle : nonActiveStyle}>
                    Leaderboard
                  </Link>
                ) : (
                  <Box
                    bgColor={'#3D3D40'}
                    textColor={'#6D6D70'}
                    className="cursor-not-allowed rounded-[10px] px-3 py-2"
                  >
                    Leaderboard
                    <Text
                      className="ml-2 inline-block rounded px-2 font-normal"
                      background={'rgba(255, 190, 0, 0.10)'}
                      textColor={'#FFA500'}
                      fontSize={'12px'}
                    >
                      Coming soon
                    </Text>
                  </Box>
                )}
              </Center>
              <Center justifyContent={'flex-start'}>
                <Link href="/referral" className={currentRoute === '/referral' ? activeStyle : nonActiveStyle}>
                  Referral
                </Link>
              </Center>
              <Center justifyContent={'flex-start'}>
                <Link
                  href="/earn"
                  className={`w-full text-left ${currentRoute === '/earn' ? 'text-[#fff]' : nonActiveStyle}`}
                >
                  Earn
                </Link>
              </Center>
              <Center justifyContent={'flex-start'}>
                <Link href="/sale-token" className={currentRoute === '/sale-token' ? activeStyle : nonActiveStyle}>
                  Token sale
                </Link>
              </Center>
              <Center justifyContent={'flex-start'}>
                <Link
                  href="/stats"
                  className={`w-full text-left ${currentRoute === '/stats' ? 'text-[#fff]' : nonActiveStyle}`}
                >
                  Stats
                </Link>
              </Center>
              <Center justifyContent={'flex-start'}>
                <Link
                  href="https://docs.ethora.io"
                  target="_blank"
                  className={`w-full text-left ${currentRoute === '/docs' ? 'text-[#fff]' : nonActiveStyle}`}
                >
                  Docs
                </Link>
              </Center>
              <Center justifyContent={'flex-start'}>
                <Link href="https://twitter.com" target="_blank" className={`w-full text-left ${nonActiveStyle}`}>
                  Twitter
                </Link>
              </Center>
              <Center justifyContent={'flex-start'}>
                <Link
                  href="https://discord.com/invite/ethora"
                  target="_blank"
                  className={`w-full text-left ${nonActiveStyle}`}
                >
                  Discord
                </Link>
              </Center>
              <Center justifyContent={'flex-start'}>
                <Link
                  href="https://medium.com/@ethora"
                  target="_blank"
                  className={`w-full text-left ${nonActiveStyle}`}
                >
                  Medium
                </Link>
              </Center>
              {/* <Center justifyContent={'flex-start'}>
                <Link
                  href="https://www.instagram.com/"
                  target="_blank"
                  className={`w-full text-left ${nonActiveStyle}`}
                >
                  Instagram
                </Link>
              </Center> */}
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Flex>
      <AccountModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};
