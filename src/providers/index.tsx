'use client';

import ChakraProvider from './chakra';
import { QueryProvider } from './query';
import { WagmiProvider } from './WagmiProvider';

export const Providers = ({ children }: React.PropsWithChildren) => {
  return (
    <QueryProvider>
      <WagmiProvider>
        <ChakraProvider>{children}</ChakraProvider>
      </WagmiProvider>
    </QueryProvider>
  );
};
