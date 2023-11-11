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
    minTradeSize: 5,
    maxOL: 2000,
    payout: 75,
    type: PairType.CRYPTO,
    status: true,
    dailyVol: '0'
  },
  {
    pair: 'ETH/USD',
    isFavorite: false,
    currentPrice: 1815.35,
    changed24hPercent: 0.4,
    currentOL: 0,
    maxTradeSize: 50,
    minTradeSize: 5,
    maxOL: 2000,
    payout: 90,
    type: PairType.CRYPTO,
    status: true,
    dailyVol: '0'
  },
  {
    pair: 'LINK/USD',
    isFavorite: false,
    currentPrice: 1815.35,
    changed24hPercent: 0.4,
    currentOL: 0,
    maxTradeSize: 50,
    minTradeSize: 5,
    maxOL: 2000,
    payout: 70,
    type: PairType.CRYPTO,
    status: true,
    dailyVol: '0'
  },
  {
    pair: 'TON/USD',
    isFavorite: false,
    currentPrice: 1815.35,
    changed24hPercent: 0.4,
    currentOL: 0,
    maxTradeSize: 50,
    minTradeSize: 5,
    maxOL: 2000,
    payout: 65,
    type: PairType.CRYPTO,
    status: true,
    dailyVol: '0'
  },
  {
    pair: 'ARB/USD',
    isFavorite: false,
    currentPrice: 1815.35,
    changed24hPercent: 0.4,
    currentOL: 0,
    maxTradeSize: 50,
    minTradeSize: 5,
    maxOL: 2000,
    payout: 70,
    type: PairType.CRYPTO,
    status: true,
    dailyVol: '0'
  },
  {
    pair: 'XRP/USD',
    isFavorite: false,
    currentPrice: 1815.35,
    changed24hPercent: 0.4,
    currentOL: 0,
    maxTradeSize: 50,
    minTradeSize: 5,
    maxOL: 2000,
    payout: 70,
    type: PairType.CRYPTO,
    status: true,
    dailyVol: '0'
  },
  {
    pair: 'SOL/USD',
    isFavorite: false,
    currentPrice: 1815.35,
    changed24hPercent: 0.4,
    currentOL: 0,
    maxTradeSize: 50,
    minTradeSize: 5,
    maxOL: 2000,
    payout: 65,
    type: PairType.CRYPTO,
    status: true,
    dailyVol: '0'
  },
  {
    pair: 'BNB/USD',
    isFavorite: false,
    currentPrice: 1815.35,
    changed24hPercent: 0.4,
    currentOL: 0,
    maxTradeSize: 50,
    minTradeSize: 5,
    maxOL: 2000,
    payout: 70,
    type: PairType.CRYPTO,
    status: true,
    dailyVol: '0'
  },
  {
    pair: 'EUR/USD',
    isFavorite: false,
    currentPrice: 1815.35,
    changed24hPercent: 0.4,
    currentOL: 0,
    maxTradeSize: 100,
    minTradeSize: 5,
    maxOL: 2000,
    payout: 55,
    type: PairType.FOREX,
    status: true,
    dailyVol: '0'
  },
  {
    pair: 'XAU/USD',
    isFavorite: false,
    currentPrice: 1815.35,
    changed24hPercent: 0.4,
    currentOL: 0,
    maxTradeSize: 100,
    minTradeSize: 5,
    maxOL: 2000,
    payout: 75,
    type: PairType.FOREX,
    status: true,
    dailyVol: '0'
  },
  {
    pair: 'GBP/USD',
    isFavorite: false,
    currentPrice: 1815.35,
    changed24hPercent: 0.4,
    currentOL: 0,
    maxTradeSize: 100,
    minTradeSize: 5,
    maxOL: 2000,
    payout: 75,
    type: PairType.FOREX,
    status: true,
    dailyVol: '0'
  },
  {
    pair: 'XAG/USD',
    isFavorite: false,
    currentPrice: 1815.35,
    changed24hPercent: 0.4,
    currentOL: 0,
    maxTradeSize: 100,
    minTradeSize: 5,
    maxOL: 2000,
    payout: 75,
    type: PairType.FOREX,
    status: true,
    dailyVol: '0'
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
