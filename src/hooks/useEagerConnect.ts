import { useEffect } from 'react';
import { useConfig, useConnect } from 'wagmi';

const SAFE_ID = 'safe';

const useEagerConnect = () => {
  const client = useConfig();
  const { connectAsync, connectors } = useConnect();
  useEffect(() => {
    const connectorInstance = connectors.find((c) => c.id === SAFE_ID && c.ready);
    if (connectorInstance && !(window as any).cy) {
      connectAsync({ connector: connectorInstance }).catch(() => {
        client.autoConnect();
      });
    } else {
      client.autoConnect();
    }
  }, [client, connectAsync, connectors]);
};

export default useEagerConnect;
