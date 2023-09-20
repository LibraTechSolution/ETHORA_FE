import { WalletConfigV2 } from '@/types/wallet.type';

import { getTrustWalletProvider } from './connectors/trustWallet';
import { metaMaskConnector } from './wagmi';

export enum ConnectorNames {
  MetaMask = 'metaMask',
  Injected = 'injected',
  WalletConnect = 'walletConnect',
  BSC = 'bsc',
  Blocto = 'blocto',
  WalletLink = 'coinbaseWallet',
  Ledger = 'ledger',
  TrustWallet = 'trustWallet',
}

const delay = (t: number) => new Promise((resolve) => setTimeout(resolve, t));

const createQrCode = (chainId: number | undefined, connect: any) => async () => {
  // connect({ connector: walletConnectNoQrCodeConnector, chainId });
  // wait for WalletConnect to setup in order to get the uri
  // await delay(100);
  // const { uri } = walletConnectNoQrCodeConnector;
  // const { uri } = (await walletConnectNoQrCodeConnector.getProvider()).connector;
  // return uri;
};

const isMetamaskInstalled = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  if (window.ethereum?.isMetaMask) {
    return true;
  }

  if (window.ethereum?.providers?.some((p: any) => p.isMetaMask)) {
    return true;
  }

  return false;
};

const walletsConfig = ({
  chainId,
  connect,
}: {
  chainId: number | undefined;
  connect: any;
}): WalletConfigV2<ConnectorNames>[] => {
  // const qrCode = createQrCode(chainId, connect);
  return [
    {
      id: 'metamask',
      title: 'Metamask',
      icon: '/images/wallets/metamask.png',
      get installed() {
        return isMetamaskInstalled() && metaMaskConnector.ready;
      },
      connectorId: ConnectorNames.MetaMask,
      deepLink: 'https://metamask.app.link/dapp/pancakeswap.finance/',
      // qrCode,
      downloadLink: 'https://metamask.app.link/dapp/pancakeswap.finance/',
    },
    {
      id: 'coinbase',
      title: 'Coinbase Wallet',
      icon: '/images/wallets/coinbase.png',
      connectorId: ConnectorNames.WalletLink,
    },
    {
      id: 'trust',
      title: 'Trust Wallet',
      icon: '/images/wallets/trust.png',
      connectorId: ConnectorNames.TrustWallet,
      get installed() {
        return !!getTrustWalletProvider();
      },
      deepLink: 'https://link.trustwallet.com/open_url?coin_id=20000714&url=https://pancakeswap.finance/',
      downloadLink: 'https://chrome.google.com/webstore/detail/trust-wallet/egjidjbpglichdcondbcbdnbeeppgdph',
      guide: {
        desktop: 'https://trustwallet.com/browser-extension',
        mobile: 'https://trustwallet.com/',
      },
      // qrCode,
    },
    {
      id: 'walletconnect',
      title: 'WalletConnect',
      icon: '/images/wallets/walletconnect.png',
      connectorId: ConnectorNames.WalletConnect,
    },
    // {
    //   id: 'opera',
    //   title: 'Opera Wallet',
    //   icon: '/images/wallets/opera.png',
    //   connectorId: ConnectorNames.Injected,
    //   get installed() {
    //     return typeof window !== 'undefined' && Boolean(window.ethereum?.isOpera);
    //   },
    //   downloadLink: 'https://www.opera.com/crypto/next',
    // },
    // {
    //   id: 'brave',
    //   title: 'Brave Wallet',
    //   icon: '/images/wallets/brave.png',
    //   connectorId: ConnectorNames.Injected,
    //   get installed() {
    //     return typeof window !== 'undefined' && Boolean(window.ethereum?.isBraveWallet);
    //   },
    //   downloadLink: 'https://brave.com/wallet/',
    // },
    // {
    //   id: 'math',
    //   title: 'MathWallet',
    //   icon: '/images/wallets/mathwallet.png',
    //   connectorId: ConnectorNames.Injected,
    //   get installed() {
    //     return typeof window !== 'undefined' && Boolean(window.ethereum?.isMathWallet);
    //   },
    //   // qrCode,
    // },
    // {
    //   id: 'tokenpocket',
    //   title: 'TokenPocket',
    //   icon: '/images/wallets/tokenpocket.png',
    //   connectorId: ConnectorNames.Injected,
    //   get installed() {
    //     return typeof window !== 'undefined' && Boolean(window.ethereum?.isTokenPocket);
    //   },
    //   // qrCode,
    // },
    // {
    //   id: 'safepal',
    //   title: 'SafePal',
    //   icon: '/images/wallets/safepal.png',
    //   connectorId: ConnectorNames.Injected,
    //   get installed() {
    //     return typeof window !== 'undefined' && Boolean(window.ethereum?.isSafePal);
    //   },
    //   downloadLink:
    //     'https://chrome.google.com/webstore/detail/safepal-extension-wallet/lgmpcpglpngdoalbgeoldeajfclnhafa',
    //   // qrCode,
    // },
    // {
    //   id: 'coin98',
    //   title: 'Coin98',
    //   icon: '/images/wallets/coin98.png',
    //   connectorId: ConnectorNames.Injected,
    //   get installed() {
    //     return typeof window !== 'undefined' && (Boolean(window.ethereum?.isCoin98) || Boolean(window.coin98));
    //   },
    //   // qrCode,
    // },
    // {
    //   id: 'blocto',
    //   title: 'Blocto',
    //   icon: '/images/wallets/blocto.png?v=2',
    //   connectorId: ConnectorNames.Blocto,
    //   get installed() {
    //     return typeof window !== 'undefined' && Boolean(window.ethereum?.isBlocto) ? true : undefined; // undefined to show SDK
    //   },
    // },
    {
      id: 'ledger',
      title: 'Ledger',
      icon: '/images/wallets/ledger.png',
      connectorId: ConnectorNames.Ledger,
    },
  ];
};

export const createWallets = (chainId: number | undefined, connect: any) => {
  const hasInjected = typeof window !== 'undefined' && !window.ethereum;
  const config = walletsConfig({ chainId, connect });
  return hasInjected && config.some((c) => c.installed && c.connectorId === ConnectorNames.Injected)
    ? config // add injected icon if none of injected type wallets installed
    : [
      ...config,
      {
        id: 'injected',
        title: 'Injected',
        icon: '/images/wallets/walletfilled.svg',
        connectorId: ConnectorNames.Injected,
        installed: typeof window !== 'undefined' && Boolean(window.ethereum),
      },
    ];
};
