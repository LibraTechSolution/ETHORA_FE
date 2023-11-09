import useListPairPrice from '@/store/useListPairPrice';
import useTradeStore from '@/store/useTradeStore';
import { addComma } from '@/utils/number';

export const ShowPrice = ({ pair }: { pair?: string }) => {
  const { price } = useTradeStore();
  const { listPairPrice } = useListPairPrice();
  return (
    <span>
      {pair && listPairPrice[pair] ? addComma(listPairPrice[pair].toFixed(2), 2) : addComma(price.toFixed(2), 2)} USDC
    </span>
  );
};
