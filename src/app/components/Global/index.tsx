'use client';

import { useNetworkConnectorUpdater } from '@/hooks/useActiveWeb3React';
import useEagerConnect from '@/hooks/useEagerConnect';

// import { UnsupportedNetworkModal } from '../NetworkModal/UnsupportedNetworkModal';

// const useDisconnect = () => {
//   const { isWrongNetwork, isConnected } = useActiveWeb3React();
//   const { logout } = useAuth();
//   useEffect(() => {
//     if (isConnected && isWrongNetwork) {
//       logout();
//     }
//   }, [isConnected, isWrongNetwork, logout]);
// };

function GlobalHooks() {
  useEagerConnect();

  useNetworkConnectorUpdater();

  // useDisconnect();

  return null;
}

const GlobalComponents = () => {
  return <>{/* <UnsupportedNetworkModal /> */}</>;
};

export const Global = () => {
  return (
    <>
      <GlobalComponents />
      <GlobalHooks />
    </>
  );
};
