import { listChains, polygon } from './constants/chains';

export const appConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? '',
  publicUrl: process.env.NEXT_PUBLIC_URL,
  chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID),
  includeTestnet: (process.env.NEXT_PUBLIC_INCLUDE_TESTNET ?? 'false') === 'true',
  cdnUrl: process.env.NEXT_PUBLIC_CDN_URL,
  faucetSC: process.env.NEXT_PUBLIC_FAUCET_SC,
  arbiscan: process.env.NEXT_PUBLIC_ARBISCAN,
  registerSC: process.env.NEXT_PUBLIC_REGISTER_SC,
  referralSC: process.env.NEXT_PUBLIC_REFERRAL_SC,
  bufferRouterSC: process.env.NEXT_PUBLIC_BUFFER_ROUTER_SC,
  bufferBOSC: process.env.NEXT_PUBLIC_BUFFER_BO_SC,
  optionsConfigSC: process.env.NEXT_PUBLIC_OPTIONS_CONFIG_SC,
  ETR_SC: process.env.NEXT_PUBLIC_ETR_SC,
  SETR_SC: process.env.NEXT_PUBLIC_SETR_SC,
  SBFETR_SC: process.env.NEXT_PUBLIC_SBFETR_SC,
  BNETR_SC: process.env.NEXT_PUBLIC_BNETR_SC,
  SBETR_SC: process.env.NEXT_PUBLIC_SBETR_SC,
  VETR_SC: process.env.NEXT_PUBLIC_VETR_SC,
  VBLP_SC: process.env.NEXT_PUBLIC_VBLP_SC,
  FBLP_SC: process.env.NEXT_PUBLIC_FBLP_SC,
  FSBLP_SC: process.env.NEXT_PUBLIC_FSBLP_SC,
  ESETR_SC: process.env.NEXT_PUBLIC_ESETR_SC,
  BLP_SC: process.env.NEXT_PUBLIC_BLP_SC,
  USDC_SC: process.env.NEXT_PUBLIC_USDC_SC,
  REWARD_ROUTER_V2_SC: process.env.NEXT_PUBLIC_REWARD_ROUTER_V2_SC
};

export const targetChainId = appConfig.chainId;

export const targetNetwork = listChains.find((chain) => chain.id === targetChainId) ?? polygon;
