import { Abi, Address } from 'viem';
import { erc20ABI, erc721ABI, useContractWrite, usePrepareContractWrite, UsePrepareContractWriteConfig } from 'wagmi';

import useActiveWeb3React from './useActiveWeb3React';

export function useContractWriteCustom<
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends string,
  TChainId extends number,
>(prepareConfig: UsePrepareContractWriteConfig<TAbi, TFunctionName, TChainId>) {
  const { config } = usePrepareContractWrite({
    ...prepareConfig,
    address: prepareConfig?.enabled !== false ? prepareConfig?.address : undefined,
    enabled: true,
  });

  return useContractWrite<TAbi, TFunctionName, 'prepared'>(config);
}

export function useContractWriteApprove(
  contractAddress: Address | undefined,
  operator: Address | undefined,
  enable?: boolean,
) {
  const { address } = useActiveWeb3React();
  return useContractWriteCustom({
    address: contractAddress,
    abi: erc20ABI,
    functionName: 'approve',
    enabled: !!(enable && address && contractAddress && operator),
    args: operator ? [operator, BigInt(2 ** 255)] : undefined,
  });
}

export function useContractWriteSetApproveForAll(
  contractAddress: Address | undefined,
  operator: Address | undefined,
  enable?: boolean,
) {
  const { address } = useActiveWeb3React();
  return useContractWriteCustom({
    address: contractAddress,
    abi: erc721ABI,
    functionName: 'setApprovalForAll',
    enabled: !!(enable && address && contractAddress && operator),
    args: operator ? [operator, true] : undefined,
  });
}
