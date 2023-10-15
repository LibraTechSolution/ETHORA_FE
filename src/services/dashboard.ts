import { IOverviewParams } from "@/types/dashboard.type";
import { deleteKeyNil } from "@/utils";
import { axiosInstance } from "@/utils/axios";

export const getDashboardOverview = async (params: IOverviewParams): Promise<any> => {
  const response = await axiosInstance.get('/dashboard/overview', {
    params: deleteKeyNil({
      ...params,
    }),
    headers: {
      Expires: '-1',
      'Cache-Control': 'no-cache',
    },
  });
  return response.data.data as any;
  // return response.data.data.docs as ITradingLimitOrderData[];
};