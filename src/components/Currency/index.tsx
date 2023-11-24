'use client';
import { Tooltip } from 'antd';
import BigNumber from 'bignumber.js';
import { isNil } from 'lodash';
import { FC, PropsWithChildren } from 'react';
import { formatEther } from 'viem';

// import { Tooltip } from '@chakra-ui/react';/

export type Value = string | number | undefined | BigNumber | bigint;

interface Props extends PropsWithChildren {
  value: Value;
  isWei?: boolean;
  rounded?: boolean;
  decimal?: number;
  decimalNumber?: number;
  tofixedLabel?: number;
  unit?: string;
}

const getValue = (
  value: Value,
  isWei: boolean | undefined,
  rounded: boolean | undefined,
  decimal = 3,
  decimalNumber = 0,
) => {
  let valueShow = '0.00';
  let fullValue = '0.000000';
  let isRounded = false;
  try {
    if (!isNil(value)) {
      const valueTemp = value instanceof BigNumber ? value.toFixed() : value.toString();
      const valTemp = isWei
        ? formatEther(BigInt(valueTemp))
        : decimalNumber
        ? BigNumber(valueTemp).dividedBy(Math.pow(10, decimalNumber))
        : valueTemp;
      const valueBig = BigNumber(valTemp);
      if (valueBig.isNaN()) {
        throw new Error();
      }
      const valueStr = valueBig.toFormat(decimal, BigNumber.ROUND_DOWN);
      // valueShow = BigNumber(valueStr).toFormat();
      valueShow = valueStr;
      fullValue = valueBig.toFormat(6, BigNumber.ROUND_DOWN);
      isRounded = valueShow !== fullValue;

      if (rounded && valueBig.gt(10 ** 3)) {
        valueShow = '> 1,000';
        isRounded = true;
      } else if (rounded && valueBig.lt(10 ** -3)) {
        valueShow = '< 0.001';
        isRounded = true;
      }
    }
  } catch {
    valueShow = '0.00';
    fullValue = '0.000000';
    isRounded = false;
  }
  return {
    value: valueShow,
    fullValue,
    isRounded,
  };
};

const Currency: FC<Props> = ({ value, isWei, rounded, decimal, decimalNumber, unit }) => {
  const { value: valueShow, isRounded, fullValue } = getValue(value, isWei, rounded, decimal, decimalNumber);
  // if (!isRounded) return <>{valueShow}</>;
  return (
    // <Tooltip hasArrow label={`${unit === '$' ? unit : ''}${fullValue} ${!unit ? '' : unit !== '$' ? unit : ''}`}>
    //   {valueShow}
    // </Tooltip>
    <Tooltip title={`${unit === '$' ? unit : ''}${fullValue} ${!unit ? '' : unit !== '$' ? unit : ''}`} color='#050506' overlayStyle={{fontSize: '12px'}} zIndex={99999}>
      <span>{valueShow}</span>
    </Tooltip>
  );
};

export default Currency;
