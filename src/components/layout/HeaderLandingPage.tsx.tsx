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
} from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import { useEffect, useState } from 'react';

export const HeaderLanding = () => {
  const [isMobile] = useMediaQuery('(max-width: 768px)');
  const currentRoute = usePathname();
  const linkStyle = 'rounded-[10px] px-3 py-2 ';
  const activeStyle = linkStyle + ' bg-[#1E3EF0] text-[#fff]';
  const nonActiveStyle = linkStyle + ' text-[#6D6D70]';
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [scrolled, setScrolled] = useState(false);

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
              <Link href="/leaderboard" className={currentRoute === '/leaderboard' ? activeStyle : nonActiveStyle}>
                Leaderboard
              </Link>
            </Center>
            <Center>
              <Link href="/sale-token" className={currentRoute === '/sale-token' ? activeStyle : nonActiveStyle}>
                Token sale
              </Link>
            </Center>
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
                    <MenuList minWidth="107px" background="#252528" border="none" className="w-[107px]">
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
                          href="/docs"
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
              <Link href="/leaderboard" className={currentRoute === '/leaderboard' ? activeStyle : nonActiveStyle}>
                Leaderboard
              </Link>
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
                href="/docs"
                className={`w-full text-left ${currentRoute === '/docs' ? 'text-[#fff]' : nonActiveStyle}`}
              >
                Docs
              </Link>
            </Center>
            <Center justifyContent={'flex-start'}>
              <Link
                href="/profile"
                className={`w-full text-left ${currentRoute === '/profile' ? 'text-[#fff]' : nonActiveStyle}`}
              >
                Profile
              </Link>
            </Center>
            <Center justifyContent={'flex-start'}>
              <Link
                href="https://twitter.com/home?lang=vi"
                target="_blank"
                className={`w-full text-left ${nonActiveStyle}`}
              >
                Twitter
              </Link>
            </Center>
            <Center justifyContent={'flex-start'}>
              <Link href="https://github.com" target="_blank" className={`w-full text-left ${nonActiveStyle}`}>
                Github
              </Link>
            </Center>
            <Center justifyContent={'flex-start'}>
              <Link href="https://web.telegram.org/" target="_blank" className={`w-full text-left ${nonActiveStyle}`}>
                Telegram
              </Link>
            </Center>
            <Center justifyContent={'flex-start'}>
              <Link href="https://discord.com/" target="_blank" className={`w-full text-left ${nonActiveStyle}`}>
                Discord
              </Link>
            </Center>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
};
