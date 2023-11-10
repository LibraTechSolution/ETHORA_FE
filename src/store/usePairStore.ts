import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StorageStoreName } from './constants';
import { PairData, PairType } from '@/types/trade.type';

const listPairData: PairData[] = [
  {
    pair: 'BTC/USD',
    isFavorite: false,
    currentPrice: 1815.35,
    changed24hPercent: 0.4,
    currentOL: 0,
    maxTradeSize: 100,
    maxOL: 2000,
    payout: 75,
    type: PairType.CRYPTO,
  },
  {
    pair: 'ETH/USD',
    isFavorite: false,
    currentPrice: 1815.35,
    changed24hPercent: 0.4,
    currentOL: 0,
    maxTradeSize: 50,
    maxOL: 2000,
    payout: 90,
    type: PairType.CRYPTO,
  },
  {
    pair: 'LINK/USD',
    isFavorite: false,
    currentPrice: 1815.35,
    changed24hPercent: 0.4,
    currentOL: 0,
    maxTradeSize: 50,
    maxOL: 2000,
    payout: 70,
    type: PairType.CRYPTO,
  },
  {
    pair: 'TON/USD',
    isFavorite: false,
    currentPrice: 1815.35,
    changed24hPercent: 0.4,
    currentOL: 0,
    maxTradeSize: 50,
    maxOL: 2000,
    payout: 65,
    type: PairType.CRYPTO,
  },
  {
    pair: 'ARB/USD',
    isFavorite: false,
    currentPrice: 1815.35,
    changed24hPercent: 0.4,
    currentOL: 0,
    maxTradeSize: 50,
    maxOL: 2000,
    payout: 70,
    type: PairType.CRYPTO,
  },
  {
    pair: 'XRP/USD',
    isFavorite: false,
    currentPrice: 1815.35,
    changed24hPercent: 0.4,
    currentOL: 0,
    maxTradeSize: 50,
    maxOL: 2000,
    payout: 70,
    type: PairType.CRYPTO,
  },
  {
    pair: 'SOL/USD',
    isFavorite: false,
    currentPrice: 1815.35,
    changed24hPercent: 0.4,
    currentOL: 0,
    maxTradeSize: 50,
    maxOL: 2000,
    payout: 65,
    type: PairType.CRYPTO,
  },
  {
    pair: 'BNB/USD',
    isFavorite: false,
    currentPrice: 1815.35,
    changed24hPercent: 0.4,
    currentOL: 0,
    maxTradeSize: 50,
    maxOL: 2000,
    payout: 70,
    type: PairType.CRYPTO,
  },
  {
    pair: 'EUR/USD',
    isFavorite: false,
    currentPrice: 1815.35,
    changed24hPercent: 0.4,
    currentOL: 0,
    maxTradeSize: 100,
    maxOL: 2000,
    payout: 55,
    type: PairType.FOREX,
  },
  {
    pair: 'XAU/USD',
    isFavorite: false,
    currentPrice: 1815.35,
    changed24hPercent: 0.4,
    currentOL: 0,
    maxTradeSize: 100,
    maxOL: 2000,
    payout: 75,
    type: PairType.FOREX,
  },
  {
    pair: 'GBP/USD',
    isFavorite: false,
    currentPrice: 1815.35,
    changed24hPercent: 0.4,
    currentOL: 0,
    maxTradeSize: 100,
    maxOL: 2000,
    payout: 75,
    type: PairType.FOREX,
  },
  {
    pair: 'XAG/USD',
    isFavorite: false,
    currentPrice: 1815.35,
    changed24hPercent: 0.4,
    currentOL: 0,
    maxTradeSize: 100,
    maxOL: 2000,
    payout: 75,
    type: PairType.FOREX,
  },
];

interface PairState {
  listPairData: PairData[],
  setListPairData(listPairsData: PairData[]): void;
}

const usePairStore = create<PairState>()(
  persist(
    (set) => ({
      listPairData: listPairData,
      setListPairData: (listPairData) => set(() => ({ listPairData })),
    }),
    {
      name: StorageStoreName.PAIR,
    },
  ),
);

export default usePairStore;
