import { create } from 'zustand';

interface TradeState {
  price: number;
  setPrice(price: number): void;
}

const useTradeStore = create<TradeState>()(
  (set) => ({
    price: 0,
    setPrice: (price) => set(() => ({ price })),
  })
);

export default useTradeStore;
