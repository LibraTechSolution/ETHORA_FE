import { Abi } from 'viem';
import { Address, erc20ABI, erc721ABI, useAccount, useBalance, useContractRead, UseContractReadConfig } from 'wagmi';

import { ReadContractResult } from '@wagmi/core';

import useActiveWeb3React from './useActiveWeb3React';

export function useContractReadCustom<
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends string,
  TSelectData = ReadContractResult<TAbi, TFunctionName>,
>(config: UseContractReadConfig<TAbi, TFunctionName, TSelectData>) {
  return useContractRead<TAbi, TFunctionName, TSelectData>({
    watch: true,
    // cacheOnBlock: true,
    // keepPreviousData: true,
    cacheTime: 0,
    ...config,
    address: config?.enabled !== false ? config?.address : undefined,
    enabled: true,
  });
}

export const useIsApprovedForAll = (contractAddress: Address | undefined, operator: Address | undefined) => {
  const { address } = useActiveWeb3React();
  const { data } = useContractReadCustom({
    address: contractAddress,
    abi: erc721ABI,
    functionName: 'isApprovedForAll',
    args: address && operator ? [address, operator] : undefined,
    enabled: !!(address && contractAddress && operator),
  });

  return address && contractAddress && operator ? data : undefined;
};

export const useBalanceOf = (contractAddress: Address | undefined) => {
  const { address } = useActiveWeb3React();
  console.log(address)

  const { data } = useContractReadCustom({
    address: contractAddress,
    abi: erc20ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    enabled: !!(address && contractAddress),
  });
  return address && contractAddress ? data : undefined;
};

export const useAllowance = (contractAddress: Address | undefined, operator: Address | undefined) => {
  const { address } = useActiveWeb3React();
  const { data } = useContractReadCustom({
    address: contractAddress,
    abi: erc20ABI,
    functionName: 'allowance',
    args: address && operator ? [address, operator] : undefined,
    enabled: !!(address && contractAddress && operator),
  });
  return address && contractAddress && operator ? data : undefined;
};

export const useGetNativeBalance = () => {
  const { address: account } = useAccount();
  const { status, refetch, data } = useBalance({
    address: account,
    watch: true,
    enabled: !!account,
  });

  return { balance: data?.value ? BigInt(data.value) : BigInt(0), fetchStatus: status, refresh: refetch };
};
