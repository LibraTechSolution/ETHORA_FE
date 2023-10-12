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
  VolumeUSDC: number | string;
  amount: number | string;
  timestamp: string;
}
// export interface IpoolStats {

// }

export interface IDataStats {
  USDC24stats: IUSDC24stats[];
  USDCstats: IUSDCstats;
  dashboardStats: IdashboardStats[];
  feeStats: IfeeStats[];
  totalTraders: ItotalTraders[];
  tradingStats: ItradingStats[];
  userStats: IuserStats[];
  volumeStats: IvolumeStats[];
  poolStats: any;
}
