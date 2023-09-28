import { Button } from '@/components/Button/Button';
import { useDisclosure } from '@chakra-ui/react';

import { ModalConnectWallet } from './ModalConnectWallet';

export const ConnectWallet = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button onClick={onOpen}>Connect Wallet</Button>
      <ModalConnectWallet isOpen={isOpen} onClose={onClose} />
    </>
  );
};
