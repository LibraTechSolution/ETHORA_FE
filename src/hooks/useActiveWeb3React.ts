import { useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useAccount, useNetwork, usePublicClient } from 'wagmi';

import { targetChainId } from '@/config';
import { getChainId, getChainNetwork, isChainSupported } from '@/config/constants/wagmi';
import { getNetworkName } from '@/utils';

import { useActiveChainId } from './useActiveChainId';
import { useSwitchNetworkLoading } from './useSwitchNetworkLoading';

export function useNetworkConnectorUpdater() {
  const { chainId } = useActiveChainId();
  const previousChainIdRef = useRef(chainId);
  const [loading] = useSwitchNetworkLoading();
  const searchParams = useSearchParams();
  const network = searchParams.get('network');

  useEffect(() => {
    const setPrevChainId = () => {
      previousChainIdRef.current = chainId;
    };
    if (loading) return setPrevChainId();
    const parsedQueryChainId = getChainId(network ?? '');

    if (!parsedQueryChainId && chainId === targetChainId) return setPrevChainId();
    // if (chainId && parsedQueryChainId !== chainId && isChainSupported(chainId)) {
    //   const { chainId: _chainId, ...omittedQuery } = router.query;
    //   router.replace(
    //     {
    //       query: {
    //         ...omittedQuery,
    //         network: getChainNetwork(chainId),
    //       },
    //     },
    //     undefined,
    //   );
    // }
    return setPrevChainId();
  }, [chainId, loading, network]);
}

const useActiveWeb3React = () => {
  const { chain } = useNetwork();
  const { address, connector, isConnected, isConnecting } = useAccount();
  const { chainId, isWrongNetwork } = useActiveChainId();
  const provider = usePublicClient({ chainId });

  return {
    provider,
    address,
    connector,
    isConnected,
    isConnecting,
    chain,
    chainId,
    isWrongNetwork,
    networkName: getNetworkName(chainId),
  };
};

export default useActiveWeb3React;
