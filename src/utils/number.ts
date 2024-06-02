import BigNumber from "bignumber.js";

export const addComma = (number: string | number, numberDecimal?: number) => {
  if (!number) return '0.00';
  const value = number.toString();
  let interger = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  let decimal = '';

  if (value.includes('.')) {
    interger = value.split('.')[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    decimal = value.split('.')[1].slice(0, numberDecimal);
  }
  return interger + (decimal ? '.' + decimal : '');
};

export const addZeroBefore = (number: number) => {
  if (number < 10) {
    return '0' + number;
  }
  return number;
};

export const checkDecimals = (num: number, decimals: number) => {
  if (!num) {
    return;
  }
  const numArr = num.toString().split('.');
  const lengthDecimal = numArr[1]?.length || 0;
  return lengthDecimal <= decimals;
};

export function roundDown(number: number, decimals = 0) {
  return checkDecimals(number, decimals)
    ? number
    : Math.floor(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
}
// export function formatBigNumberToFloatNumber(bignumber: BigNumber, decimals = 18) {
//   return parseFloat(formatEther;
// }
