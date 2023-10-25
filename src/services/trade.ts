import { IPaginationResponse, IResponData } from "@/types/api.type";
import { Changed24h, CreateTradeReq, ITradingData, EditTradeReq, ITradingParams } from "@/types/trade.type";
import { deleteKeyNil } from "@/utils";
import { axiosInstance, axiosNoAuthInstance } from "@/utils/axios";

export function getChanged24h() {
  return axiosNoAuthInstance.get<IResponData<Changed24h>>('/price/24h_change');
}

export function createTrade(trade: CreateTradeReq) {
  return axiosInstance.post<IResponData<ITradingData>>('/trades/create', trade);
}

export function editLimitOrder(trade: EditTradeReq) {
  return axiosInstance.put<IResponData<ITradingData>>('/trades/update', trade);
}

export function cancelTrade(_id: string) {
  return axiosInstance.post<IResponData<ITradingData>>('/trades/cancel', { _id });
}

export function closeTrade(_id: string) {
  return axiosInstance.post<IResponData<ITradingData>>('/trades/close', { _id });
}

export const getTrades = async (params?: ITradingParams): Promise<IPaginationResponse<ITradingData>> => {
  const response = await axiosInstance.get('/trades/user/actives', {
    params: deleteKeyNil({
      ...params,
    }),
    headers: {
      Expires: '-1',
      'Cache-Control': 'no-cache',
    },
  });

  return response.data.data as IPaginationResponse<ITradingData>;
}

export function getLimitOrders(network: number) {
  return axiosInstance.get<IResponData<IPaginationResponse<ITradingData>>>(`/trades/user/limit-orders?page=1&limit=30&sortBy=createdAt&network=${network}`);
}

export const getTradeHistory = async (params?: ITradingParams): Promise<IPaginationResponse<ITradingData>> => {
  const response = await axiosInstance.get('/trades/user/history', {
    params: deleteKeyNil({
      ...params,
    }),
    headers: {
      Expires: '-1',
      'Cache-Control': 'no-cache',
    },
  });

  return response.data.data as IPaginationResponse<ITradingData>;
}

export const getTradeCancel = async (params?: ITradingParams): Promise<IPaginationResponse<ITradingData>> => {
  const response = await axiosInstance.get('/trades/user/cancelled', {
    params: deleteKeyNil({
      ...params,
    }),
    headers: {
      Expires: '-1',
      'Cache-Control': 'no-cache',
    },
  });

  return response.data.data as IPaginationResponse<ITradingData>;
}