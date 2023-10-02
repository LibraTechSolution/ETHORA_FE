import { ITradingActiveData, ITradingActiveParams, ITradingHistoryData, ITradingHistoryParams, ITradingLimitOrderData, ITradingLimitOrderParams, TradingHistoryDataResponse } from '@/types/profile';
import { deleteKeyNil } from '@/utils';
import { axiosInstance } from '@/utils/axios';

export const getTradingHistory = async (params?: ITradingHistoryParams): Promise<ITradingHistoryData[]> => {
  const response = await axiosInstance.get('/trades/user/history', {
    params: deleteKeyNil({
      ...params,
    }),
    headers: {
      Expires: '-1',
      'Cache-Control': 'no-cache',
    },
  });
  console.log(response)
  return response.data.data.docs as ITradingHistoryData[];
};

export const getTradingActive = async (params?: ITradingActiveParams): Promise<ITradingActiveData[]> => {
  const response = await axiosInstance.get('/trades/user/active', {
    params: deleteKeyNil({
      ...params,
    }),
    headers: {
      Expires: '-1',
      'Cache-Control': 'no-cache',
    },
  });
  console.log(response)
  console.log(response.data)

  return response.data.data.docs as ITradingActiveData[];
};

export const getTradingLimitOrder = async (params?: ITradingLimitOrderParams): Promise<ITradingLimitOrderData[]> => {
  const response = await axiosInstance.get('/trades/user/limit-orders', {
    params: deleteKeyNil({
      ...params,
    }),
    headers: {
      Expires: '-1',
      'Cache-Control': 'no-cache',
    },
  });
  console.log(response)
  return response.data.data.docs as ITradingLimitOrderData[];
};

