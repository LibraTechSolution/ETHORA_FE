/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-var */
// Calculate the price of an option using the Black-Scholes model
// s= Stock price
// x=Strike price
// t=Years to maturity
// r= Risk-free rate
// v=Volatility
// a=Above
// y=Yes

import { divide } from "./operationBigNumber";

const BlackScholes = (y: any, a: any, s: any, x: any, t: any, r: any, v: any) => {
  // console.log(`y, a, s, x, t, r, v: `, y, a, s, x, t, r, v);
  var d1, d2;
  var DAYS_365 = 86400 * 365;
  t = +divide(t, DAYS_365.toString());
  d1 = (Math.log(s / x) + (r + (v * v) / 2.0) * t) / (v * Math.sqrt(t));
  d2 = d1 - v * Math.sqrt(t);
  if (y) {
    if (a) return CDF(d2);
    else return CDF(-d2);
  } else {
    if (a) return 1 - CDF(d2);
    else return 1 - CDF(-d2);
  }
};

/* Calculate Choudhury’s approximation of the Black-Scholes CDF*/
const CDF = (input: any) => {
  const inputSquared = input * input;
  const CDF_CONST_0 = 2260 / 3989;
  const CDF_CONST_1 = 6400 / 3989;
  const CDF_CONST_2 = 3300 / 3989;

  const value =
    Math.exp(-inputSquared / 2) /
    (CDF_CONST_0 +
      CDF_CONST_1 * Math.abs(input) +
      CDF_CONST_2 * Math.sqrt(inputSquared + 3));
  return input > 0 ? 1 - value : value;
};

export { BlackScholes };
