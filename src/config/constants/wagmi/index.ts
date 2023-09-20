import memoize from 'lodash/memoize';
import { configureChains, createConfig, createStorage } from 'wagmi';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
// import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
// import { WalletConnectLegacyConnector } from 'wagmi/connectors/walletConnectLegacy';
import { publicProvider } from 'wagmi/providers/public';

import { appConfig } from '@/config';

import { listChains } from '../chains';

const CHAINS = appConfig.includeTestnet ? listChains : listChains.filter((chain) => !chain.testnet);

export const { chains, publicClient } = configureChains(CHAINS, [publicProvider()]);

export const injectedConnector = new InjectedConnector({
  chains,
  options: {
    shimDisconnect: false,
  },
});

export const metaMaskConnector = new MetaMaskConnector({
  chains,
  options: {
    shimDisconnect: false,
  },
});

export const coinbaseConnector = new CoinbaseWalletConnector({
  chains,
  options: {
    appName: 'app',
    appLogoUrl: './logo.png',
  },
});

// export const walletConnectNoQrCodeConnector = new WalletConnectConnector({
//   chains,
//   options: {
//     projectId: '',
//   },
// });

// export const walletConnectLegacyConnector = new WalletConnectLegacyConnector({
//   chains,
//   options: {
//     qrcode: true,
//     // chainId: targetChainId,
//   },
// });

// export const walletConnectLegacyNoQrCodeConnector = new WalletConnectLegacyConnector({
//   chains,
//   options: {
//     qrcode: false,
//   },
// });

export const noopStorage = {
  getItem: (_key: string) => '',
  setItem: (_key: string, _value: string) => null,
  removeItem: (_key: string) => null,
};

export const configClient = createConfig({
  storage: createStorage({
    storage: typeof window !== 'undefined' ? window.localStorage : noopStorage,
    key: 'wagmi_v1.1',
  }),
  autoConnect: false,
  publicClient,

  connectors: [metaMaskConnector, injectedConnector, coinbaseConnector],
});

export const CHAIN_IDS = chains.map((c) => c.id);

export const isChainSupported = memoize((chainId: number) => CHAIN_IDS.includes(chainId));

export const getChainId = memoize((networkName: string) => {
  if (!networkName) return undefined;
  return chains.find((chain) => chain.name === networkName)?.id;
});

export const getChainNetwork = memoize((chainId: number) => {
  if (!chainId) return undefined;
  return chains.find((chain) => chain.id === chainId)?.network;
});
