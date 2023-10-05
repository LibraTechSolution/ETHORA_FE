'use client';

import Link from 'next/link';

import { Button, Center, Flex, Icon, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useSignMessage } from 'wagmi';
import { useCallback, useEffect, useState } from 'react';
import { getNonce, login } from '@/services/auth';
import useUserStore from '@/store/useUserStore';
import { Image } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';

export const Header = () => {
  const { address } = useAccount();
  const [nonce, setNonce] = useState<string>('');
  const { setUserAndTokens, listWallets, setUser, setToken } = useUserStore();
  const currentRoute = usePathname();
  const linkStyle = 'rounded-[10px] px-3 py-2 ';
  const activeStyle = linkStyle + ' bg-[#6052FB] text-[#fff]';
  const nonActiveStyle = linkStyle + ' text-[#6D6D70]';
  const msg = 'test';
  const signMessage = useSignMessage({
    message: nonce,
    onSuccess(data) {
      console.log('Success', data);
      signIn(data);
    },
    onMutate(data) {
      console.log('Mutate', data);
    },
    onError(data) {
      console.log('Error', data);
    },
  });

  const fetchNonce = useCallback(async () => {
    if (!address || (listWallets && listWallets[address.toLowerCase()])) return;
    try {
      const nonceRes = await getNonce(address);
      console.log(nonceRes.data.data.nonce);
      const msgContent = msg + nonceRes.data.data.nonce;
      setNonce(msgContent);
    } catch (error) {
      console.log(error);
    }
  }, [address, listWallets]);

  useEffect(() => {
    if (address) {
      console.log(address);
      console.log(listWallets);
      if (listWallets && listWallets[address.toLowerCase()]) {
        console.log(listWallets[address.toLowerCase()]);
        setUser(listWallets[address.toLowerCase()].user);
        setToken(listWallets[address.toLowerCase()].tokens);
      } else {
        fetchNonce();
      }
    }
  }, [address, fetchNonce, listWallets, setToken, setUser]);

  const signMsg = () => {
    signMessage.signMessage();
  };

  const signIn = async (signMessageData: `0x${string}`) => {
    try {
      const userInfo = await login(address, signMessageData, msg);
      setUserAndTokens(userInfo.data.data.user, userInfo.data.data.tokens);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Flex
      as="header"
      role="menu"
      // px={{ base: 2.5, md: 10 }}
      // pt={{ base: 2.5, md: 5 }}
      padding={'8px 20px 8px 20px'}
      justifyContent="space-between"
      alignItems="center"
      fontSize={14}
      zIndex={11}
      // position={'sticky'}
      top={0}
      borderBottom={'1px solid #242428'}
      // backgroundColor={'rgba(28, 28, 30)'}
    >
      <Flex gap={3} alignItems="center">
        <Center>
          <Link href="/" className="mr-2">
            <Image alt="ethora" src="/images/icons/Ethora.svg" w="full" h="full" />
          </Link>
        </Center>
        <Center>
          <Link href="trade" className={currentRoute === '/' ? activeStyle : nonActiveStyle}>
            Trade
          </Link>
        </Center>
        <Center>
          <Link href="faucet" className={currentRoute === '/faucet' ? activeStyle : nonActiveStyle}>
            Faucet
          </Link>
        </Center>
        <Center>
          <Link href="profile" className={currentRoute === '/profile' ? activeStyle : nonActiveStyle}>
            Leaderboard
          </Link>
        </Center>
        <Center>
          <Menu>
            {({ isOpen }) => (
              <>
                <MenuButton className="text-[#6D6D70]">
                  More {isOpen ? <TriangleUpIcon w="20px" h="12px" /> : <TriangleDownIcon w="20px" h="12px" />}
                </MenuButton>
                <MenuList minWidth="107px" background="#252528" border="none" className="w-[107px]">
                  <MenuItem background="transparent">
                    <Link href="earn" className={`w-full text-center ${currentRoute === '/earn' ? 'text-[#fff]' : ''}`}>
                      Earn
                    </Link>
                  </MenuItem>
                  <MenuItem background="transparent">
                    <Link href="docs" className={`w-full text-center ${currentRoute === '/docs' ? 'text-[#fff]' : ''}`}>
                      Docs
                    </Link>
                  </MenuItem>
                  <MenuItem background="transparent">
                    <Link
                      href="stats"
                      className={`w-full text-center ${currentRoute === '/stats' ? 'text-[#fff]' : ''}`}
                    >
                      Stats
                    </Link>
                  </MenuItem>
                  <MenuItem background="transparent">
                    <Link
                      href="profile"
                      className={`w-full text-center ${currentRoute === '/profile' ? 'text-[#fff]' : ''}`}
                    >
                      Profile
                    </Link>
                  </MenuItem>
                  <MenuItem background="transparent">
                    <Link href="https://twitter.com/home?lang=vi" target="_blank" className="w-full text-center">
                      Twitter
                    </Link>
                  </MenuItem>
                  <MenuItem background="transparent">
                    <Link href="https://github.com" target="_blank" className="w-full text-center">
                      Github
                    </Link>
                  </MenuItem>
                  <MenuItem background="transparent">
                    <Link href="https://web.telegram.org/" target="_blank" className="w-full text-center">
                      Telegram
                    </Link>
                  </MenuItem>
                  <MenuItem background="transparent">
                    <Link href="https://discord.com/" target="_blank" className="w-full text-center">
                      Discord
                    </Link>
                  </MenuItem>
                </MenuList>
              </>
            )}
          </Menu>
        </Center>
      </Flex>
      <Flex gap={3}>
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
                          rightIcon={<TriangleDownIcon w="20px" h="12px" />}
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
                      <div style={{ display: 'flex', gap: 12 }}>
                        <Button
                          onClick={openChainModal}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                          type="button"
                          bgColor="#252528"
                          textColor="#ffffff"
                          rightIcon={<TriangleDownIcon w="20px" h="12px" />}
                          width="200px"
                          _hover={{ bg: '#252528' }}
                          rounded="10px"
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
                                    marginRight: 8,
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
                              {chain.name}
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
                                fill="#6052FB"
                              />
                            </Icon>
                          }
                          rightIcon={<TriangleDownIcon w="20px" h="12px" />}
                          borderColor="#6052FB"
                          textColor="#6052FB"
                          paddingX="12px"
                          variant="outline"
                          _hover={{ borderColor: '#7A72F6', textColor: '#7A72F6' }}
                          rounded="10px"
                          onClick={openAccountModal}
                        >
                          {/* {account.displayName} */}
                          {account.displayBalance ? ` ${account.displayBalance}` : ''}
                        </Button>
                      </div>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>
          {nonce && <Button onClick={signMsg}>Sign msg</Button>}
        </Center>
        <Center>
          <Button
            borderColor="#6052FB"
            textColor="#6052FB"
            variant="outline"
            _hover={{ bg: 'transparent' }}
            padding="10px"
          >
            <Image alt="setting" src="/images/icons/settings.svg" w="18px" h="18px" />
          </Button>
        </Center>
        <Center>
          <Image alt="avatar" src="/images/icons/avatar.svg" w="40px" h="40px" />
        </Center>
      </Flex>
    </Flex>
  );
};
