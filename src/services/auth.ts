import { IResponData } from "@/types/api.type";
import { ILoginRes, INonce } from "@/types/auth.type";
import { axiosNoAuthInstance } from "@/utils/axios";

export function getNonce(address: string) {
  return axiosNoAuthInstance.get<IResponData<INonce>>('/auth/get-nonce/' + address);
}

export function login(address: `0x${string}` | undefined, signature: `0x${string}` | undefined, message: string) {
  return axiosNoAuthInstance.post<IResponData<ILoginRes>>('/auth/login', { address, signature, message });
}