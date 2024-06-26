'use client';

import { WagmiConfig, configureChains, createConfig } from 'wagmi';

// import { configClient } from '@/config/constants/wagmi';
import { RainbowKitProvider, connectorsForWallets, darkTheme } from '@rainbow-me/rainbowkit';
import {
  trustWallet,
  ledgerWallet,
  tahoWallet,
  imTokenWallet,
  omniWallet,
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
  rainbowWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { mainnet, goerli, arbitrumGoerli, arbitrum, baseGoerli, base } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import '@rainbow-me/rainbowkit/styles.css';
import { defineChain } from 'viem';

console.log('baseGoerli', baseGoerli);

export const baseSepolia = defineChain({
  id: 84532,
  name: 'Base Sepolia',
  network: 'base-sepolia',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://base-sepolia-rpc.publicnode.com'],
      webSocket: ['wss://sepolia-rpc.scroll.io/ws'],
    },
    public: {
      http: ['https://base-sepolia-rpc.publicnode.com'],
      webSocket: ['wss://sepolia-rpc.scroll.io/ws'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Base Sepolia Explorer',
      url: 'https://sepolia.basescan.org',
    },
  },
  testnet: true,
});

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [...(process.env.NEXT_PUBLIC_INCLUDE_TESTNET === 'true' ? [baseSepolia] : [base, mainnet])],
  [publicProvider()],
);

const projectId = '12e38ee3a03a9abc2d80cf849b11312d';

const demoAppInfo = {
  appName: 'Rainbowkit Demo',
};

const connectors = connectorsForWallets([
  // ...wallets,
  {
    groupName: 'Wallets',
    wallets: [
      metaMaskWallet({ projectId, chains }),
      coinbaseWallet({ appName: 'coinbase', chains }),
      trustWallet({ projectId, chains }),
      walletConnectWallet({ chains, projectId }),
      tahoWallet({ chains }),
      rainbowWallet({ projectId, chains }),
      imTokenWallet({ projectId, chains }),
      ledgerWallet({ projectId, chains }),
      omniWallet({ projectId, chains }),
    ],
  },
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

export const WagmiProvider = ({ children }: React.PropsWithChildren) => {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider appInfo={demoAppInfo} chains={chains} theme={darkTheme()}>
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
};
