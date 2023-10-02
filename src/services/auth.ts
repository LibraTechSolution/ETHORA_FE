import { ILoginRes } from "@/types/auth.type";
import { axiosInstance, axiosNoAuthInstance } from "@/utils/axios";

export function getNonce(address: string) {
  return axiosNoAuthInstance.get('/auth/get-nonce/' + address);
}

export function login(address: `0x${string}` | undefined, signature: `0x${string}` | undefined, message: string) {
  return axiosNoAuthInstance.post<ILoginRes>('/auth/login', { address, signature, message });
}