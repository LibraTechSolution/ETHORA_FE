import { IResponData } from "@/types/api.type";
import { ILoginRes, INonce, IPermit } from "@/types/auth.type";
import { axiosInstance, axiosNoAuthInstance } from "@/utils/axios";

export function getNonce(address: string) {
  return axiosNoAuthInstance.get<IResponData<INonce>>('/auth/get-nonce/' + address);
}

export function login(network: number, address: `0x${string}`, signature: `0x${string}`, message: string) {
  return axiosNoAuthInstance.post<IResponData<ILoginRes>>('/auth/login', { network, address, signature, message });
}

export function register(signature: `0x${string}`, network: number, isRegister: boolean) {
  return axiosInstance.post<IResponData<ILoginRes>>('/auth/register', { signature, network, isRegister });
}

export function approveToken(permit: IPermit, network: number) {
  return axiosInstance.post<IResponData<ILoginRes>>('/auth/approve', { permit, network });
}