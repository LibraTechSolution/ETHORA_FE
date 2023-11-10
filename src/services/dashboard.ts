import { IResponData } from "@/types/api.type";
import { IOverviewData, IOverviewParams } from "@/types/dashboard.type";
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