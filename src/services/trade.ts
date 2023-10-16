import { IResponData } from "@/types/api.type";
import { Changed24h } from "@/types/trade.type";
import { axiosNoAuthInstance } from "@/utils/axios";

export function getChanged24h() {
  return axiosNoAuthInstance.get<IResponData<Changed24h>>('/price/24h_change');
}