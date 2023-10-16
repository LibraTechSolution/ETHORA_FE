import { listChains, polygon } from './constants/chains';


export const appConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? '',
  publicUrl: process.env.NEXT_PUBLIC_URL,
  chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID),
  includeTestnet: (process.env.NEXT_PUBLIC_INCLUDE_TESTNET ?? 'false') === 'true',
  cdnUrl: process.env.NEXT_PUBLIC_CDN_URL,
  faucetSC: process.env.NEXT_PUBLIC_FAUCET_SC,
  arbiscan: process.env.NEXT_PUBLIC_ARBISCAN,
  usdcAddress: process.env.NEXT_PUBLIC_USDC_ADD,
  registerSC: process.env.NEXT_PUBLIC_REGISTER_SC,
  referralSC: process.env.NEXT_PUBLIC_REFERRAL_SC
};

export const targetChainId = appConfig.chainId;

export const targetNetwork = listChains.find((chain) => chain.id === targetChainId) ?? polygon;
