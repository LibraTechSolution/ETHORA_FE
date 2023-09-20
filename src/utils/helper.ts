import { PublicClient, WriteContractResult } from '@wagmi/core';

export const getReceiptTxs = async (writeAsync: () => Promise<WriteContractResult>, provider: PublicClient) => {
  const { hash } = await writeAsync();
  const receipt = await provider.waitForTransactionReceipt({ hash });
  if (receipt.status !== 'success') throw new Error('transactionError');
  return receipt;
};
