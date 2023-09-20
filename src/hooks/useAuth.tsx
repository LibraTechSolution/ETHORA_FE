import { useCallback } from 'react';
import { ConnectorNotFoundError, SwitchChainNotSupportedError, useConnect, useDisconnect } from 'wagmi';
import { getChainNetwork } from '@/config/constants/wagmi';
import { ConnectorNames } from '@/config/constants/wallet';
import replaceBrowserHistory from '@/utils/replaceBrowserHistory';
import { useActiveChainId } from './useActiveChainId';
import { useSessionChainId } from './useSessionChainId';

export class WalletConnectorNotFoundError extends Error {}
export class WalletSwitchChainError extends Error {}

const useAuth = () => {
  const { connectAsync, connectors } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { chainId } = useActiveChainId();
  const [, setSessionChainId] = useSessionChainId();

  const login = useCallback(
    async (connectorID: ConnectorNames) => {
      const findConnector = connectors.find((c) => c.id === connectorID);
      try {
        const connected = await connectAsync({ connector: findConnector, chainId });
        if (!connected.chain.unsupported && connected.chain.id !== chainId) {
          replaceBrowserHistory('network', getChainNetwork(connected.chain.id));
          setSessionChainId(connected.chain.id);
        }
        return connected;
      } catch (error) {
        if (error instanceof ConnectorNotFoundError) {
          throw new WalletConnectorNotFoundError();
        }
        if (error instanceof SwitchChainNotSupportedError) {
          throw new WalletSwitchChainError('Unable to switch network. Please try it on your wallet');
        }
      }
      return undefined;
    },
    [connectors, connectAsync, chainId, setSessionChainId],
  );

  const logout = useCallback(async () => {
    try {
      await disconnectAsync();
    } catch (error) {
      console.error(error);
    }
  }, [disconnectAsync]);

  return { login, logout };
};

export default useAuth;
