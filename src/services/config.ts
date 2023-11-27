import { IResponData } from "@/types/api.type";
import { IConfigListPair } from "@/types/config.type";
import { axiosNoAuthInstance } from "@/utils/axios";

export const getConfigTrade = async (): Promise<IConfigListPair> => {
  const response = await axiosNoAuthInstance.get<IResponData<IConfigListPair>>('/trades/iv-config');
  return response.data.data
}