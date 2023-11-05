import { create } from 'zustand';

interface TradeState {
  listPairPrice: { [key: string]: number };
  setListPairPrice(listPairPrice: { [key: string]: number }): void;
}

const useListPairPrice = create<TradeState>()(
  (set) => ({
    listPairPrice: {},
    setListPairPrice: (listPairPrice) => set(() => ({ listPairPrice })),
  })
);

export default useListPairPrice;
