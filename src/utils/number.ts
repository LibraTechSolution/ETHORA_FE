import BigNumber from "bignumber.js";

export const addComma = (number: string | number, numberDecimal?: number) => {
  if (!number) return '0';
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
// export function formatBigNumberToFloatNumber(bignumber: BigNumber, decimals = 18) {
//   return parseFloat(formatEther;
// }
