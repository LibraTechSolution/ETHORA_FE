import { appConfig } from '@/config';
import { Button } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const CustomConnectSaleTokenButton = ({
  children,
  isFullWidth,
}: {
  children?: React.ReactNode;
  isFullWidth?: boolean;
}) => {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, authenticationStatus, mounted }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready && account && chain && (!authenticationStatus || authenticationStatus === 'authenticated');
        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    colorScheme="primary"
                    fontSize={'16px'}
                    size="md"
                    width={`${isFullWidth ? '100%' : 'auto'} `}
                    marginTop={'20px'}
                    onClick={openConnectModal}
                  >
                    Connect Wallet
                  </Button>
                );
              }

              if (chain.id !== +(appConfig.TOKEN_SALE_CHAIN_ID || 0)) {
                return (
                  <Button
                    // onClick={openChainModal}
                    bgColor="#ff494a"
                    textColor="#ffffff"
                    fontSize={'16px'}
                    size="md"
                    width={`${isFullWidth ? '100%' : 'auto'} `}
                    marginTop={'20px'}
                    _hover={{ bgColor: '#ff494a' }}
                  >
                    Switch network to Base mainnet
                  </Button>
                );
              }

              // if (chain.unsupported) {
              //   return (
              //     <button onClick={openChainModal} type="button">
              //       Wrong network
              //     </button>
              //   );
              // }

              return <>{children}</>;
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default CustomConnectSaleTokenButton;
