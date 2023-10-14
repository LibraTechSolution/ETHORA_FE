import { IDataStats, IStatsParams } from '@/types/stats.type';
import { deleteKeyNil } from '@/utils';
import { axiosInstance } from '@/utils/axios';

export const getStats = async (params: IStatsParams): Promise<IDataStats> => {
  const response = await axiosInstance.get('/stats', {
    params: deleteKeyNil({
      ...params,
    }),
    headers: {
      Expires: '-1',
      'Cache-Control': 'no-cache',
    },
  });
  console.log(response);
  return response.data.data as IDataStats;
  // return response.data.data.docs as ITradingLimitOrderData[];
};
