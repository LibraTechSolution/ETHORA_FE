import { IResponData } from "@/types/api.type";
import { IDashboardMarketData, IOverviewData, IOverviewParams } from "@/types/dashboard.type";
import { deleteKeyNil } from "@/utils";
import { axiosInstance } from "@/utils/axios";

export const getDashboardOverview = async (params: IOverviewParams): Promise<IOverviewData> => {
  const response = await axiosInstance.get('/dashboard/overview', {
    params: deleteKeyNil({
      ...params,
    }),
    headers: {
      Expires: '-1',
      'Cache-Control': 'no-cache',
    },
  });
  return response.data.data as IOverviewData;
  // return response.data.data.docs as ITradingLimitOrderData[];
};

export const getDashboardMarket = async (params: IOverviewParams): Promise<IDashboardMarketData> => {
  const response = await axiosInstance.get('/dashboard/markets', {
    params: deleteKeyNil({
      ...params,
    }),
    headers: {
      Expires: '-1',
      'Cache-Control': 'no-cache',
    },
  });
  return response.data.data as IDashboardMarketData;
  // return response.data.data.docs as ITradingLimitOrderData[];
};