export interface ILeaderBoardDetail {
  user: string,
  totalTrades: number,
  netPnL: string,
  volume: string,
  usdcNetPnL: string,
  usdcTotalTrades: number,
  usdcTradesWon: number,
  usdcVolume: string,
  usdcWinRate: number,
  bfrNetPnL: string,
  bfrTotalTrades: number,
  bfrTradesWon: number,
  bfrVolume: string,
  bfrWinRate: number,
  arbNetPnL: string,
  arbTotalTrades: number,
  arbTradesWon: number,
  arbVolume: string,
  arbWinRate: number
}

export interface ISummary {
  totalRewardPool: string,
  timeLeftByMs: number,
  endDate: string,
  totalUserTrades: number,
  totalTrades: number,
  totalVolume: string
}

export interface IConfig {
  createdAt: string,
  dailyEnd: string,
  dailyStart: string,
  updatedAt: string,
  weeklyEnd: string,
  weeklyStart: string,
  _id: string
}

export interface ILeaderBoard {
  summary: ISummary,
  winners: ILeaderBoardDetail[],
  winnersWinrate: ILeaderBoardDetail[],
  losers: ILeaderBoardDetail[],
  winnersVolume: ILeaderBoardDetail[],
  config: IConfig
}

export interface ILeaderBoardParams {
  network: number,
  type: string,
  offset?: number
}

export interface ILeaderBoardOffset {
  dailyOffset: number,
  weeklyOffset: number,
  dailyId: number,
  weeklyId: number
}

export interface IEthoraPointParams {
  page: number,
  limit: number,
  network: number,
  sortBy?: string,
  sortType?: string
}

export interface IEthoraPointData {
  id: string
  point: string
  totalTrades: number
  volume: string
  usdcVolume: string
  usdcTotalTrades: number
  totalRebateEarned: string
}