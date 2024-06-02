import {
  IProfileParams,
  IProfileResponse,
  ITradingActiveData,
  ITradingActiveParams,
  ITradingHistoryData,
  ITradingHistoryParams,
  ITradingLimitOrderData,
  ITradingLimitOrderParams,
  TradingHistoryDataResponse,
} from '@/types/profile';
import { deleteKeyNil } from '@/utils';
import { axiosInstance } from '@/utils/axios';

export const getProfile = async (params: IProfileParams): Promise<IProfileResponse> => {
  const response = await axiosInstance.get('/users/stats', {
    params: deleteKeyNil({
      ...params,
    }),
    headers: {
      Expires: '-1',
      'Cache-Control': 'no-cache',
    },
  });
  console.log('response', response);
  return response.data.data as IProfileResponse;
};

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
  return response.data.data.docs as ITradingLimitOrderData[];
};
