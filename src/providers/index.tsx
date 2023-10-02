'use client';
import ConfigProvider from "antd/es/config-provider";
import ChakraProvider from './chakra';
import { QueryProvider } from './query';
import { WagmiProvider } from './WagmiProvider';

export const Providers = ({ children }: React.PropsWithChildren) => {
  return (
    <QueryProvider>
      <ConfigProvider
          // theme={{
          //   hashed: false,
          // }}
        >
      <WagmiProvider>
        <ChakraProvider>{children}</ChakraProvider>
      </WagmiProvider>
      </ConfigProvider>
    </QueryProvider>
  );
};
