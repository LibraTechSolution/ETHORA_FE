export interface IOverviewParams {
  network: number;
}

interface IStat {
  totalSettlementFees: string,
  totalTrades: number,
  totalVolume: string
}

export interface IOverviewData {
  totalStats: IStat,
  USDCstats: IStat,
  ETRstats: IStat,
  totalTraders: {
    uniqueCountCumulative: number
  }[],
  total24stats: {
    amount: string,
    settlementFee: string
  }[],
  USDC24stats: {
    amount: string,
    settlementFee: string
  }[],
  ETR24stats: [],
  OIstats: {
    totalVolume: string
  },
  USDCIOstats: {
    totalVolume: string
  },
  ETRIOstats: {
    totalVolume: string
  }
}