import { atom, useAtomValue } from 'jotai';
import { useSearchParams } from 'next/navigation';
import { useDeferredValue } from 'react';
import { useNetwork } from 'wagmi';

import { targetChainId } from '@/config';
import { getChainId, isChainSupported } from '@/config/constants/wagmi';

import { useSessionChainId } from './useSessionChainId';

const queryChainIdAtom = atom(-1); // -1 unload, 0 no chainId on query

queryChainIdAtom.onMount = (set) => {
  const params = new URL(window.location.href).searchParams;
  let chainId: string | number | null | undefined;
  const c = params.get('network');
  if (!c) {
    chainId = params.get('chainId');
  } else {
    chainId = getChainId(c);
  }
  if (chainId && isChainSupported(+chainId)) {
    set(+chainId);
  } else {
    set(0);
  }
};

export function useLocalNetworkChain() {
  const [sessionChainId] = useSessionChainId();
  const queryChainId = useAtomValue(queryChainIdAtom);

  const searchParams = useSearchParams();
  const network = searchParams.get('network');

  const chainId = +(sessionChainId || getChainId(network ?? '') || queryChainId);

  if (isChainSupported(chainId)) {
    return chainId;
  }

  return undefined;
}

export const useActiveChainId = () => {
  const localChainId = useLocalNetworkChain();
  const queryChainId = useAtomValue(queryChainIdAtom);

  const { chain } = useNetwork();
  const chainId = localChainId ?? chain?.id ?? (queryChainId >= 0 ? targetChainId : undefined);

  const isNotMatched = useDeferredValue(chain && localChainId && chain.id !== localChainId);

  return {
    chainId,
    isWrongNetwork: (chain?.unsupported ?? false) || !!isNotMatched,
    isNotMatched,
  };
};
