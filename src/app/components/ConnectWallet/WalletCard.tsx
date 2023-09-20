'use client';

import { isDesktop, isMobile } from 'react-device-detect';

import ShimmerImage from '@/components/ShimmerImage';
import { ConnectorNames } from '@/config/constants/wallet';
import { LinkOfDevice, WalletConfigV2 } from '@/types/wallet.type';
import { Box, Flex, Link, Text } from '@chakra-ui/react';

export type Login<T> = (connectorId: WalletConfigV2<T>) => void;

interface Props<T> {
  wallet: WalletConfigV2<T>;
  login: Login<T>;
}

const WalletCard = ({ wallet, login }: Props<ConnectorNames>) => {
  const { title, icon, installed, downloadLink } = wallet;

  let linkAction: any = {
    onClick: () => login(wallet),
  };

  if (installed === false && isDesktop && downloadLink) {
    linkAction = {
      as: Link,
      href: getDesktopLink(downloadLink),
      style: {
        textDecoration: 'none',
      },
      target: '_blank',
      rel: 'noopener noreferrer',
    };
  }
  if (typeof window !== 'undefined' && !window.ethereum && wallet.deepLink && isMobile) {
    linkAction = {
      style: {
        textDecoration: 'none',
      },
      as: Link,
      href: wallet.deepLink,
      target: '_blank',
      rel: 'noopener noreferrer',
    };
  }

  return (
    <Box cursor="pointer" borderRadius={12} bg="nude.1" p={1} {...linkAction}>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        borderRadius={12}
        bg="linear-gradient(90deg, #EE8532 0%, #F3E9E2 96.17%)"
        py={2.5}
        pr={3}
        pl={5}
      >
        <Text fontSize={18} textTransform="uppercase">
          {title}
        </Text>
        <ShimmerImage src={icon} w="full" maxW={10} ratio={1} alt="" disableLoading />
      </Flex>
    </Box>
  );
};

export default WalletCard;

const getDesktopLink = (linkDevice: LinkOfDevice) =>
  typeof linkDevice === 'string'
    ? linkDevice
    : typeof linkDevice.desktop === 'string'
    ? linkDevice.desktop
    : linkDevice.desktop?.url;

export const getDesktopText = (linkDevice: LinkOfDevice, fallback: string) =>
  typeof linkDevice === 'string'
    ? fallback
    : typeof linkDevice.desktop === 'string'
    ? fallback
    : linkDevice.desktop?.text ?? fallback;
