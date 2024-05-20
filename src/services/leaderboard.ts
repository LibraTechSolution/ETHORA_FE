import { IPaginationResponse, IResponData } from "@/types/api.type";
import { ILeaderBoardParams, ILeaderBoard, ILeaderBoardOffset, IEthoraPointParams, IEthoraPointData } from "@/types/leaderboard.type";
import { deleteKeyNil } from "@/utils";
import { axiosInstance, axiosNoAuthInstance } from "@/utils/axios";

export const getLeaderboards = async (params?: ILeaderBoardParams): Promise<ILeaderBoard> => {
  const response = await axiosInstance.get('/leaderboard', {
    params: deleteKeyNil({
      ...params,
    }),
    headers: {
      Expires: '-1',
      'Cache-Control': 'no-cache',
    },
  });

  return response.data.data as ILeaderBoard;
}

export function getLeaderboardOffset(network: number) {
  return axiosNoAuthInstance.get<IResponData<ILeaderBoardOffset>>(`/leaderboard/offsets?network=${network}`);
}

export const getEthoraPointList = async (params?: IEthoraPointParams): Promise<IPaginationResponse<IEthoraPointData>> => {
  const response = await axiosInstance.get('/leaderboard/points', {
    params: deleteKeyNil({
      ...params,
    }),
    headers: {
      Expires: '-1',
      'Cache-Control': 'no-cache',
    },
  });

  return response.data.data as IPaginationResponse<IEthoraPointData>;
}