import { ITradingData } from '@/types/trade.type';
import { PublicClient, WriteContractResult } from '@wagmi/core';
import dayjs from 'dayjs';
import { BlackScholes } from './blackscholes';

export const getReceiptTxs = async (writeAsync: () => Promise<WriteContractResult>, provider: PublicClient) => {
  const { hash } = await writeAsync();
  const receipt = await provider.waitForTransactionReceipt({ hash });
  if (receipt.status !== 'success') throw new Error('transactionError');
  return receipt;
};

export const getSVR = (sig: string) => {
  const sig0 = sig.substring(2);
  const r = "0x" + sig0.substring(0, 64);
  const s = "0x" + sig0.substring(64, 128);
  const v = parseInt(sig0.substring(128, 130), 16);
  return { s, v, r }
}

export const getProbability = (
  trade: ITradingData,
  price: number,
  IV: number,
  expiryTs?: string
) => {
  const currentEpoch = dayjs().utc().unix();
  const expiryTime = getExpiry(trade, expiryTs);

  return getProbabilityByTime(trade, price, currentEpoch, expiryTime, IV);
};

export const getProbabilityByTime = (
  trade: ITradingData,
  price: number,
  currentTime: number,
  expirationTime: number,
  IV: number
) => {
  const probability =
    BlackScholes(
      true,
      trade.isAbove,
      price,
      +trade.strike / 100000000,
      expirationTime - currentTime,
      0,
      IV
    ) * 100;

  return probability;
};

export const getExpiry = (trade: ITradingData, deb?: string) => {
  return dayjs(trade.closeDate).utc().unix() || dayjs(trade.openDate).utc().unix() + trade.period;
};