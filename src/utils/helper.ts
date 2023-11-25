import { ITradingData } from '@/types/trade.type';
import { PublicClient, WriteContractResult } from '@wagmi/core';
import dayjs from 'dayjs';
import { BlackScholes } from './blackscholes';
import { divide } from './operationBigNumber';
import { configDecimal } from '@/views/TradeView/components/TradeTable';

export const getReceiptTxs = async (writeAsync: () => Promise<WriteContractResult>, provider: PublicClient) => {
  const { hash } = await writeAsync();
  const receipt = await provider.waitForTransactionReceipt({ hash });
  if (receipt.status !== 'success') throw new Error('transactionError');
  return receipt;
};

export const getSVR = (sig: string) => {
  const sig0 = sig.substring(2);
  const r = '0x' + sig0.substring(0, 64);
  const s = '0x' + sig0.substring(64, 128);
  const v = parseInt(sig0.substring(128, 130), 16);
  return { s, v, r };
};

export const getProbability = (trade: ITradingData, price: number, IV: number, expiryTs?: string) => {
  const currentEpoch = dayjs().utc().unix();
  const expiryTime = getExpiry(trade, expiryTs);
  return getProbabilityByTime(trade, price, currentEpoch, expiryTime, IV);
};

export const getProbabilityByTime = (
  trade: ITradingData,
  price: number,
  currentTime: number,
  expirationTime: number,
  IV: number,
) => {
  const probability =
    BlackScholes(true, trade.isAbove, price, +divide(trade.strike, trade?.pair ? configDecimal[trade?.pair.replace('-', '').toUpperCase()] : 8), expirationTime - currentTime, 0, IV) * 100;

  return probability;
};

export const getExpiry = (trade: ITradingData, deb?: string) => {
  return dayjs(trade.closeDate).utc().unix() || dayjs(trade.openDate).utc().unix() + trade.period;
};

export const DataTickFormater = (number: number) => {
  if (number > 1000000000) {
    return (number / 1000000000).toFixed(2) + 'B';
  } else if (number > 1000000) {
    return (number / 1000000).toFixed(2) + 'M';
  } else if (number > 1000) {
    return (number / 1000).toFixed(2) + 'K';
  } else {
    return number.toFixed(2);
  }
};

export const DataTickDateFormater = (time: number | string) => {
  return dayjs(+time * 1000).format('DD.MM')
};
