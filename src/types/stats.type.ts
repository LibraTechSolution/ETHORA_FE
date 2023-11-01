export interface IStatsParams {
  network: number;
  start: number;
  end: number;
}

export interface IUSDC24stats {
  amount: string;
  settlementFee: string;
}
export interface IUSDCstats {
  totalSettlementFees: string;
  totalTrades: number;
  totalVolume: string;
}
export interface IdashboardStats {
  openInterest: string;
}
export interface IfeeStats {
  fee: string;
  feeUSDC: string;
  timestamp: string;
}

export interface ItotalTraders {
  uniqueCountCumulative: number;
}

export interface ItradingStats {
  loss: string;
  lossCumulative: string;
  lossCumulativeUSDC: string;
  lossUSDC: string;
  profit: string;
  profitCumulative: string;
  profitCumulativeUSDC: string;
  profitUSDC: string;
  timestamp: string;
}

export interface IuserStats {
  existingCount: 5;
  timestamp: string;
  uniqueCount: 9;
  uniqueCountCumulative: 0;
}

export interface IvolumeStats {
  cumulative: number;
  amount: number;
  VolumeUSDC: number;
  all: number;
  timestamp: string | number;
}

export type IvolumeStatsChart = Omit<IvolumeStats, 'amount' | 'all'>;

export interface IFeeStats {
  timestamp: string | number;
  all: number;
  cumulative: number;
  fee: number;
}
export type IFeeStatsChart = Omit<IFeeStats, 'all'>;

export interface IPoolStats {
  timestamp: number;
  rate: number;
  glpSupply: number;
  cumulativeGlpSupply: number;
  glpSupplyChange: number;
  aumChange: number;
}

export type IRateStatsChart = Pick<IPoolStats, 'rate' | 'timestamp'>;
export type IELPPoolStatsChart = Pick<IPoolStats, 'glpSupply' | 'timestamp'>;

export interface IOverviewStats {
  totalVolume: number;
  totalVolumeDelta: number | string;
  totalFees: number;
  totalFeesDelta: number | string;
  totalPool: number;
  totalPoolDelta: number | string;
  totalUsers: number;
  totalUsersDelta: number | string;
  payout: number;
  payoutDelta: number | string;
}

export interface IDataStats {
  USDC24stats: IUSDC24stats[];
  // USDCstats: IUSDCstats;
  // dashboardStats: IdashboardStats[];
  feeStats: IFeeStats[];
  overviewStats: IOverviewStats;
  poolStats: {
    data: IPoolStats[];
  };
  tradingStats: ItradingStats[];
  volumeStats: IvolumeStats[];
  // userStats: IuserStats[];
}
