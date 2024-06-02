import { create } from 'zustand';

interface TradeState {
  listPairPriceSlow: { [key: string]: number };
  setListPairPriceSlow(listPairPrice: { [key: string]: number }): void;
}

const useListPairPriceSlow = create<TradeState>()(
  (set) => ({
    listPairPriceSlow: {},
    setListPairPriceSlow: (listPairPriceSlow) => set(() => ({ listPairPriceSlow })),
  })
);

export default useListPairPriceSlow;
