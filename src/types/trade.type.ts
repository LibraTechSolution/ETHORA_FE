export interface PairData {
  pair: string,
  isFavorite: boolean,
  payout: number,
  changed24h: number,
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