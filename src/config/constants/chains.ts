import { Chain } from 'wagmi';
import { polygon, polygonMumbai as polygonMumbaiBase } from 'wagmi/chains';

const polygonMumbai: Chain = {
  ...polygonMumbaiBase,
  rpcUrls: {
    default: {
      http: ['https://rpc-mumbai.maticvigil.com/'],
    },
    public: {
      http: ['https://rpc-mumbai.maticvigil.com/'],
    },
  },
};

export { polygon, polygonMumbai };

export const listChains: Chain[] = [polygon, polygonMumbai];
