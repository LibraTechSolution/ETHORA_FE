import { IPaginationResponse } from './api.type';

export enum TRADE_STATE {
  QUEUED = 'QUEUED',
  CREATED = 'CREATED',
  OPENED = 'OPENED',
  CLOSED = 'CLOSED',
  CANCELLED = 'CANCELLED',
}

export interface ITradingHistoryParams {
  page: number;
  limit: number;
  chain: string;
}

export interface ITradingHistoryData {
  _id: string;
  queuedDate: string;
  queueId: number;
  strike: number;
  period: number;
  targetContract: string;
  tradeSize: string;
  allowPartialFill: boolean;
  referralCode: string;
  slippage: number;
  settlementFee: number;
  expirationDate: string;
  isAbove: boolean;
  state: TRADE_STATE;
  optionId: number;
  isLimitOrder: boolean;
  limitOrderExpirationDate: string;
  chain: number;
  expiryPrice: number;
  payout:string;
  closeDate: string;
  limitOrderDuration: number;
  lockedAmount: string;
  isCancelled: boolean;
  cancellationReason: string;
  cancellationDate: string;
  earlyCloseSignature: string;
  userCloseDate: string;
  openDate: string;
  token: string;
  router: string;
  createdAt: string;
  updatedAt: string;
}

export interface TradingHistoryDataResponse extends IPaginationResponse {
  items: Array<ITradingHistoryData>;
}

export interface ITradingActiveParams {
  page: number;
  limit: number;
  chain: string;
}

export interface ITradingActiveData {
  _id: string;
  signatureDate: string;
  queuedDate: string;
  queueId: number;
  strike: number;
  period: number;
  targetContract: string;
  userPartialSignature: string;
  userFullSignature: string;
  userAddress: string;
  tradeSize: string;
  allowPartialFill: boolean;
  referralCode: string;
  traderNftId: number;
  slippage: number;
  settlementFee: number;
  settlementFeeSignExpiration: number;
  settlementFeeSignature: string;
  expirationDate: string;
  isAbove: boolean;
  state: TRADE_STATE;
  optionId: number;
  isLimitOrder: boolean;
  limitOrderExpirationDate: string;
  chain: string;
  expiryPrice: string;
  payout: string;
  closeDate: string;
  limitOrderDuration: number;
  lockedAmount: string;
  isCancelled: string;
  cancellationReason: string;
  cancellationDate: string;
  earlyCloseSignature: string;
  userCloseDate: string;
  openDate: string;
  token: string;
  router: string;
  pendingOperation: string;
}

export interface TradingActiveDataResponse extends IPaginationResponse {
  items: Array<ITradingActiveData>;
}

export interface ITradingLimitOrderParams {
  page: number;
  limit: number;
  chain: string;
}

export interface ITradingLimitOrderData {
  _id: string;
  queuedDate: string;
  queueId: number;
  strike: number;
  period: number;
  targetContract: string;
  tradeSize: string;
  allowPartialFill: boolean;
  referralCode: string;
  slippage: number;
  settlementFee: number;
  expirationDate: string;
  isAbove: boolean;
  state: TRADE_STATE;
  optionId: string;
  isLimitOrder: boolean;
  limitOrderExpirationDate: string;
  chain: number;
  expiryPrice: string;
  payout: string;
  closeDate: string;
  limitOrderDuration: number;
  lockedAmount: string;
  isCancelled: boolean;
  cancellationReason: string;
  cancellationDate: string;
  earlyCloseSignature: string;
  userCloseDate: string;
  openDate: string;
  token: string;
  createdAt: string;
  updatedAt: string;
}

export interface TradingLimitOrderDataResponse extends IPaginationResponse {
  items: Array<ITradingLimitOrderData>;
}
