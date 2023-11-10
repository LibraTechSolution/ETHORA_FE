export interface PairData {
  pair: string,
  isFavorite: boolean,
  payout: number,
  currentPrice: number,
  changed24hPercent: number,
  maxTradeSize: number,
  currentOL: number,
  maxOL: number,
  type: PairType
}

export enum PairType {
  CRYPTO = 'crypto',
  FOREX = 'forex',
}

export interface Changed24h {
  [key: string]: string
}

export interface CreateTradeReq {
  network: number,
  strike: number,
  strikeDate: string,
  period: number,
  targetContract: string,
  tradeSize: string,
  slippage: number,
  isAbove: boolean,
  isLimitOrder: boolean,
  limitOrderDuration: number,
  token: string,
  pair: string
}

export enum State {
  QUEUED = "QUEUED",
  CREATED = "CREATED",
  OPENED = "OPENED",
  CLOSED = "CLOSED",
  CANCELLED = "CANCELLED",
}

export enum TRADE_TOKEN {
  USDC = "USDC",
}

export interface ITradingParams {
  page: number,
  limit: number,
  network: string,
  sortBy?: string,
  sortType?: string,
  userAddress?: string,
}

export interface ITradingData {
  pair: string,
  queuedDate: string,
  queueId: number,
  strike: number,
  strikeDate: string,
  period: number,
  targetContract: string,
  tradeSize: string,
  slippage: number,
  settlementFee: number,
  expirationDate: string,
  isAbove: boolean,
  state: State,
  optionId: number,
  isLimitOrder: boolean,
  limitOrderExpirationDate: string,
  network: number,
  expiryPrice: number | null,
  payout: string | null;
  closeDate: string,
  limitOrderDuration: number,
  lockedAmount: string | null;
  cancellationReason: string,
  cancellationDate: string,
  earlyCloseSignature: string,
  userCloseDate: string,
  openDate: string,
  token: TRADE_TOKEN,
  pendingOperation: string | null;
  _id: string,
  createdAt: string,
  updatedAt: string,
  status: TRADE_STATUS,
  pnl: number,
  profit: number
}

export interface EditTradeReq {
  network: number,
  _id: string,
  strike: number,
  period: number,
  slippage: number,
  isAbove: boolean,
  limitOrderDuration: number
}

export enum TRADE_STATUS {
  WIN = "Win",
  LOSS = "Loss",
}