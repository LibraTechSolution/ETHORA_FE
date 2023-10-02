'use client';

import Link from 'next/link';
import { Box, Button, Center, Flex, useToast } from '@chakra-ui/react';
import { Image } from '@chakra-ui/react';
import { ToastLayout } from '@/components/ToastLayout';
import { Status } from '@/types/faucet.type';

export const FaucetView = () => {
  const toast = useToast();

  const handleClaim = () => {
    toast({
      position: 'top',
      render: ({ onClose }) => (
        <ToastLayout
          title="Claim USDC Successfully"
          content="You have successfully claimed 500 Testnet USDC"
          status={Status.SUCCESSS}
          close={onClose}
        />
      ),
    });
  };

  return (
    <Flex flexDirection={'column'} marginTop="160px">
      <Center>
        <Box
          boxShadow="1px 0.5px 0px 0px #3D3D40 inset"
          paddingY="40px"
          paddingX="32px"
          rounded="20px"
          width="504px"
          marginBottom="20px"
        >
          <h1 className="pb-2 text-2xl font-[600] text-[#fff]">Claim tESTNET ETH</h1>
          <p className="pb-5 text-[#D0D0D2]">You will need to claim testnet tokens to cover the gas fee.</p>
          <Box padding="20px" background="#050506">
            <p className="mb-3 text-sm font-semibold text-[#D0D0D2]">Get Base Goerli ETH from these websites:</p>
            <ul className="list-disc pl-6">
              <li className="pb-3">
                <Link
                  href="https://coinbase.com/faucets/base-ethereum-goerli-faucet"
                  target="_blank"
                  className="w-full text-center"
                >
                  <Flex>
                    <span className="pr-[10px] underline">Coinbase Faucet</span>
                    <Image alt="Coinbase Faucet" src="/images/icons/open.svg" w="20px" h="20px" />
                  </Flex>
                </Link>
              </li>
              <li className="pb-3">
                <Link href="https://faucet.quicknode.com/drip" target="_blank" className="w-full text-center">
                  <Flex>
                    <span className="pr-[10px] underline">QuickNode Faucet</span>
                    <Image alt="QuickNode Faucet" src="/images/icons/open.svg" w="20px" h="20px" />
                  </Flex>
                </Link>
              </li>
              <li className="pb-3">
                <Link href="https://bwarelabs.com/faucets/base-testnet" target="_blank" className="w-full text-center">
                  <Flex>
                    <span className="pr-[10px] underline">BwareLabs Faucet</span>
                    <Image alt="BwareLabs Faucet" src="/images/icons/open.svg" w="20px" h="20px" />
                  </Flex>
                </Link>
              </li>
            </ul>
          </Box>
        </Box>
      </Center>
      <Center>
        <Box boxShadow="1px 0.5px 0px 0px #3D3D40 inset" paddingY="40px" paddingX="32px" rounded="20px" width="504px">
          <h1 className="mb-5 pb-2 text-center text-2xl font-[600] text-[#fff]">Claim tESTNET Tokens</h1>
          <Center>
            <Button
              bgColor="#6052FB"
              textColor="white"
              fontWeight={600}
              fontSize="16px"
              rounded="10px"
              _hover={{ bg: '#7A72F6' }}
              onClick={handleClaim}
            >
              Claim 500 USDC
            </Button>
          </Center>
        </Box>
      </Center>
    </Flex>
  );
};
