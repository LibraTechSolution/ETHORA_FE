import { IResponData } from "@/types/api.type";
import { ILeaderBoardParams, ILeaderBoard, ILeaderBoardOffset } from "@/types/leaderboard.type";
import { deleteKeyNil } from "@/utils";
import { axiosInstance } from "@/utils/axios";

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
  return axiosInstance.get<IResponData<ILeaderBoardOffset>>(`/leaderboard/offsets?network=${network}`);
}