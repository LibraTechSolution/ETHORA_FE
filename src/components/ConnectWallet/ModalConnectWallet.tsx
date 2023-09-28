'use client';

import { atom, useAtom } from 'jotai';
import { useMemo } from 'react';
import { useConnect } from 'wagmi';

import { Button } from '@/components/Button/Button';
import { ImageCustom } from '@/components/ImageCustom';
import { ConnectorNames, createWallets } from '@/config/constants/wallet';
import { useActiveChainId } from '@/hooks/useActiveChainId';
import useAuth, { WalletConnectorNotFoundError, WalletSwitchChainError } from '@/hooks/useAuth';
import { usePreloadImages } from '@/hooks/usePreloadImage';
import { WalletConfigV2 } from '@/types/wallet.type';
import { Box, Modal, ModalContent, SimpleGrid, Text } from '@chakra-ui/react';

import WalletCard from './WalletCard';

const walletLocalStorageKey = 'wallet';

function sortWallets(wallets: WalletConfigV2<ConnectorNames>[], lastUsedWalletName: string | null) {
  const sorted = [...wallets].sort((a, b) => {
    if (a.installed === b.installed) return 0;
    return a.installed === true ? -1 : 1;
  });

  if (!lastUsedWalletName) {
    return sorted;
  }
  const foundLastUsedWallet = wallets.find((w) => w.title === lastUsedWalletName);
  if (!foundLastUsedWallet) return sorted;
  return [foundLastUsedWallet, ...sorted.filter((w) => w.id !== foundLastUsedWallet.id)];
}

const lastUsedWalletNameAtom = atom<string>('');

lastUsedWalletNameAtom.onMount = (set) => {
  const preferred = localStorage?.getItem(walletLocalStorageKey);
  if (preferred) {
    set(preferred);
  }
};

type Props = {
  isOpen: boolean;
  onClose(): void;
};

export function ModalConnectWallet({ isOpen, onClose }: Props) {
  const { connectAsync } = useConnect();
  const { chainId } = useActiveChainId();
  const { login } = useAuth();
  const [lastUsedWalletName] = useAtom(lastUsedWalletNameAtom);

  const _wallets = useMemo(() => createWallets(chainId, connectAsync), [chainId, connectAsync]);
  const wallets = useMemo(() => sortWallets(_wallets, lastUsedWalletName), [_wallets, lastUsedWalletName]);

  const imageSources = useMemo(() => wallets.map((w) => w.icon).filter((icon) => typeof icon === 'string'), [wallets]);

  usePreloadImages(imageSources);

  const connectWallet = (wallet: WalletConfigV2<ConnectorNames>) => {
    if (wallet.installed !== false) {
      login(wallet.connectorId)
        .then((v) => {
          if (v) {
            localStorage.setItem(walletLocalStorageKey, wallet.title);
          }
          onClose();
        })
        .catch((err) => {
          if (err instanceof WalletConnectorNotFoundError) {
            alert('no provider found');
          } else if (err instanceof WalletSwitchChainError) {
            alert(err.message);
          } else {
            alert('Error connecting, please authorize wallet to access.');
          }
        });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalContent maxW={748} w={{ base: 'full', md: '60%' }} mx={2.5} borderRadius={13} bg="nude.1">
        <Box pos="relative" w="full" bg="nude.1" borderRadius={13}>
          <Button pos="absolute" top={-3} right="2%" w={53} minW={10} onClick={onClose} zIndex={2}>
            <ImageCustom src="/icons/close.png" w="full" h="full" alt="" />
          </Button>

          <Box px={34} pt={5} pb={2}>
            <Text color="nude.1" fontSize={24} fontFamily="bangers">
              CHOOSE YOUR WALLET
            </Text>
          </Box>

          <Box mx={34} h={0.5} mb={3} background="bgLine" />
          <Box px={34} bg="nude.2" py={10} maxH={250} overflow="auto">
            <SimpleGrid columns={{ base: 1, md: 3 }} spacingX={6} spacingY={6}>
              {wallets.map((wallet) => (
                <WalletCard key={wallet.title} wallet={wallet} login={connectWallet} />
              ))}
            </SimpleGrid>
          </Box>
          <Box h={12} />
        </Box>
      </ModalContent>
    </Modal>
  );
}
