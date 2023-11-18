import useListPairPrice from '@/store/useListPairPrice';
import useTradeStore from '@/store/useTradeStore';
import { addComma } from '@/utils/number';
import { Tooltip } from '@chakra-ui/react';

export const ShowPrice = ({ pair }: { pair?: string }) => {
  const { price } = useTradeStore();
  const { listPairPrice } = useListPairPrice();
  return (
    <Tooltip
      label={pair && listPairPrice[pair] ? addComma(listPairPrice[pair], 6) : addComma(price, 6)}
      hasArrow
      color="white"
      placement="top"
      bg="#050506"
    >
      <span>
        {pair && listPairPrice[pair] ? addComma(listPairPrice[pair].toFixed(2), 2) : addComma(price.toFixed(2), 2)}
      </span>
    </Tooltip>
  );
};
