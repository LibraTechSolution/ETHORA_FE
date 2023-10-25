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

export interface ILeaderBoard {
  summary: ISummary,
  winners: ILeaderBoardDetail[],
  winnersWinrate: ILeaderBoardDetail[],
  losers: ILeaderBoardDetail[],
}

export interface ILeaderBoardParams {
  network: number,
  type: string,
  offset: number
}