'use client';

import Link from 'next/link';

import {
  Center,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
  useMediaQuery,
  Image,
  Box,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerCloseButton,
  Text,
} from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getLeaderboards } from '@/services/leaderboard';
import dayjs from 'dayjs';
import { appConfig } from '@/config';

export const HeaderLanding = () => {
  const [isMobile] = useMediaQuery('(max-width: 768px)');
  const currentRoute = usePathname();
  const linkStyle = 'rounded-[10px] px-3 py-2 ';
  const activeStyle = linkStyle + ' bg-[#1E3EF0] text-[#fff]';
  const nonActiveStyle = linkStyle + ' text-[#6D6D70]';
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [scrolled, setScrolled] = useState(false);
  const [isDisabledLeaderBoard, setIsDisabledLeaderBoard] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const { data: leaderBoardData, isSuccess } = useQuery({
    queryKey: ['getLeaderBoard'],
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
    <Flex
      as="header"
      role="menu"
      padding={'8px 20px 8px 20px'}
      justifyContent="space-between"
      alignItems="center"
      fontSize={14}
      zIndex={11}
      position={'fixed'}
      width={'100%'}
      backgroundColor={scrolled ? '#0f0f14eb' : 'rgba(12, 12, 16, 0.60)'}
      boxShadow={'0px 4px 20px 0px rgba(0, 0, 0, 0.30)'}
      backdropFilter={'blur(7px)'}
      top={0}
    >
      <Flex gap={3} alignItems="center" width={'100%'} justifyContent={isMobile ? 'space-between' : 'start'}>
        <Center>
          <Link href="/" className="mr-2">
            <Image alt="ethora" src="/images/landingpage/logoText.svg" w="full" h="full" />
          </Link>
        </Center>
        {isMobile ? (
          <Box onClick={onOpen}>
            <Image alt="ethora" src="/images/icons/li_menu.svg" w="24px" h="24px" />
          </Box>
        ) : (
          <>
            <Center>
              <Link href="/trade/BTC-USD" className={currentRoute.includes('/trade') ? activeStyle : nonActiveStyle}>
                Trade
              </Link>
            </Center>
            <Center>
              <Link href="/earn" className={currentRoute === '/earn' ? activeStyle : nonActiveStyle}>
                Earn
              </Link>
            </Center>
            <Center>
              {isSuccess && isDisabledLeaderBoard ? (
                <Box bgColor={'#3D3D40'} textColor={'#6D6D70'} className="cursor-not-allowed rounded-[10px] px-3 py-2">
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
            {/* <Center>
              <Link href="/sale-token" className={currentRoute === '/sale-token' ? activeStyle : nonActiveStyle}>
                Token sale
              </Link>
            </Center> */}
            <Center>
              <Link
                href="/practice-trading"
                className={currentRoute === '/practice-trading' ? activeStyle : nonActiveStyle}
              >
                Practice Trading
              </Link>
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
                          href="https://docs.ethora.io"
                          target="_blank"
                          className={`w-full text-center ${currentRoute === '/docs' ? 'text-[#fff]' : ''}`}
                        >
                          Docs
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
                          href="/profile"
                          className={`w-full text-center ${currentRoute === '/profile' ? 'text-[#fff]' : ''}`}
                        >
                          Profile
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
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
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
            <Center justifyContent={'flex-start'}>
              <Link href="/faucet" className={currentRoute === '/faucet' ? activeStyle : nonActiveStyle}>
                Faucet
              </Link>
            </Center>
            <Center justifyContent={'flex-start'}>
              <Link href="/trading" className={currentRoute === '/trading' ? activeStyle : nonActiveStyle}>
                Practice Trading
              </Link>
            </Center>
            <Center justifyContent={'flex-start'}>
              {!isDisabledLeaderBoard ? (
                <Link href="/leaderboard" className={currentRoute === '/leaderboard' ? activeStyle : nonActiveStyle}>
                  Leaderboard
                </Link>
              ) : (
                <Box bgColor={'#3D3D40'} textColor={'#6D6D70'} className="cursor-not-allowed rounded-[10px] px-3 py-2">
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
              <Link href="/earn" className={currentRoute === 'earn' ? activeStyle : nonActiveStyle}>
                Earn
              </Link>
            </Center>
            {/* <Center justifyContent={'flex-start'}>
              <Link href="/sale-token" className={currentRoute === '/sale-token' ? activeStyle : nonActiveStyle}>
                Token sale
              </Link>
            </Center> */}
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
              <Link href="https://x.com/ethora_" target="_blank" className={`w-full text-left ${nonActiveStyle}`}>
                Twitter
              </Link>
            </Center>
            <Center justifyContent={'flex-start'}>
              <Link href="https://discord.com/invite/ethora" target="_blank" className={`w-full text-left ${nonActiveStyle}`}>
                Discord
              </Link>
            </Center>
            <Center justifyContent={'flex-start'}>
              <Link href="https://medium.com/@ethora" target="_blank" className={`w-full text-left ${nonActiveStyle}`}>
                Medium
              </Link>
            </Center>
            {/* <Center justifyContent={'flex-start'}>
              <Link href="https://www.instagram.com/" target="_blank" className={`w-full text-left ${nonActiveStyle}`}>
                Instagram
              </Link>
            </Center> */}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
};
