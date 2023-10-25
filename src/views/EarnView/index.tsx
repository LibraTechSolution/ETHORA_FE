'use client';
import Link from 'next/link';
import { Flex, Heading, Text, Box, GridItem, Grid, Button } from '@chakra-ui/react';
import { ArrowRight } from 'lucide-react';
import CardEarn from './component/CardEarn';
import CustomConnectButton from '@/components/CustomConnectButton';
import { createContext, useState } from 'react';
import DepositModal from './component/DepositModalETRVault';
import { useIsMounted } from '@/hooks/useIsMounted';
import ETRItem from './component/ETRItem';
import ETR_ABI from '@/config/abi/ETR_ABI';
import SBFETR_ABI from '@/config/abi/SBFETR_ABI';
import SETR_ABI from '@/config/abi/SETR_ABI';
import { useContractReads } from 'wagmi';
import { appConfig } from '@/config';
import useActiveWeb3React from '@/hooks/useActiveWeb3React';
import TotalRewardsItem from './component/TotalRewardsItem';
import VETR_ABI from '@/config/abi/VETR_ABI';
import VBLP_ABI from '@/config/abi/VBLP_ABI';
import FSBLP_ABI from '@/config/abi/FSBLP_ABI';
import SBETR_ABI from '@/config/abi/SBETR_ABI';
import EsETR from './component/EsETR';
import ESETR_ABI from '@/config/abi/ESETR_ABI';
import USDCVaultItem from './component/USDCVaultItem';
import BLP_ABI from '@/config/abi/BLP_ABI';
import USDC_ABI from '@/config/abi/USDC_ABI';
import FBLP_ABI from '@/config/abi/FBLP_ABI';
import ETRVault from './component/ETRVault';
import ELPVault from './component/ELPVault';

interface createContextType {
  onFetchData: () => void;
}

export const EarnContext = createContext<createContextType>({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onFetchData: () => {},
});

const EarnView = () => {
  const isMounted = useIsMounted();
  const { address } = useActiveWeb3React();

  const price = 0.055;

  const ETR_SC = {
    address: appConfig.ETR_SC as `0x${string}`,
    abi: ETR_ABI,
  };

  const { data: data_ETR_SC, refetch: refetchETR_SC } = useContractReads({
    contracts: [
      {
        ...ETR_SC,
        functionName: 'balanceOf',
        args: [appConfig.SETR_SC as `0x${string}`],
      },
      {
        ...ETR_SC,
        functionName: 'totalSupply',
      },
      {
        ...ETR_SC,
        functionName: 'balanceOf',
        args: ['0x000000000000000000000000000000000000dead'],
      },
      {
        ...ETR_SC,
        functionName: 'balanceOf',
        args: [appConfig.SETR_SC as `0x${string}`],
      },
    ],
    // args: [address as `0x${string}`, appConfig.ETR_SC as `0x${string}`],
    // enabled: !!appConfig.SETR_SC,
  });

  const sETR_SC = {
    address: appConfig.SETR_SC as `0x${string}`,
    abi: SETR_ABI,
  };

  const { data: data_sETR_SC, refetch: refetchSETR_SC } = useContractReads({
    contracts: [
      {
        ...sETR_SC,
        functionName: 'depositBalances',
        args: [address as `0x${string}`, appConfig.ETR_SC as `0x${string}`],
        // enabled: !!(address && appConfig.SETR_SC),
      },
      {
        ...sETR_SC,
        functionName: 'tokensPerInterval',
      },
      {
        ...sETR_SC,
        functionName: 'totalSupply',
      },
      {
        ...sETR_SC,
        functionName: 'claimable',
        args: [address as `0x${string}`],
      },
      {
        ...sETR_SC,
        functionName: 'depositBalances',
        args: [address as `0x${string}`, appConfig.ESETR_SC as `0x${string}`],
        // enabled: !!(address && appConfig.SETR_SC),
      },
    ],
    // args: [address as `0x${string}`, appConfig.ETR_SC as `0x${string}`],
    // enabled: !!appConfig.SETR_SC,
  });

  const sbfETR_SC = {
    address: appConfig.SBFETR_SC as `0x${string}`,
    abi: SBFETR_ABI,
  };

  const { data: data_sbfETR_SC, refetch: refetchSBFETR_SC } = useContractReads({
    contracts: [
      {
        ...sbfETR_SC,
        functionName: 'tokensPerInterval',
      },
      {
        ...sbfETR_SC,
        functionName: 'totalSupply',
      },
      {
        ...sbfETR_SC,
        functionName: 'depositBalances',
        args: [address as `0x${string}`, appConfig.BNETR_SC as `0x${string}`],
      },
      {
        ...sbfETR_SC,
        functionName: 'depositBalances',
        args: [address as `0x${string}`, appConfig.SBETR_SC as `0x${string}`],
      },
      {
        ...sbfETR_SC,
        functionName: 'claimable',
        args: [address as `0x${string}`],
      },
    ],
  });

  const FBLP_SC = {
    address: appConfig.FBLP_SC as `0x${string}`,
    abi: FBLP_ABI,
  };

  const { data: data_FBLP_SC, refetch: refetchFBLP_SC } = useContractReads({
    contracts: [
      {
        ...FBLP_SC,
        functionName: 'claimable',
        args: [address as `0x${string}`],
      },
      {
        ...FBLP_SC,
        functionName: 'tokensPerInterval',
      },
      {
        ...FBLP_SC,
        functionName: 'depositBalances',
        args: [address as `0x${string}`, appConfig.BLP_SC as `0x${string}`],
      },
    ],
  });

  const VETR_SC = {
    address: appConfig.VETR_SC as `0x${string}`,
    abi: VETR_ABI,
  };

  const { data: data_VETR_SC, refetch: refetchVETR_SC } = useContractReads({
    contracts: [
      {
        ...VETR_SC,
        functionName: 'claimable',
        args: [address as `0x${string}`],
      },
      {
        ...VETR_SC,
        functionName: 'pairAmounts',
        args: [address as `0x${string}`],
      },
      {
        ...VETR_SC,
        functionName: 'claimedAmounts',
        args: [address as `0x${string}`],
      },
      {
        ...VETR_SC,
        functionName: 'getVestedAmount',
        args: [address as `0x${string}`],
      },
    ],
  });

  const VBLP_SC = {
    address: appConfig.VBLP_SC as `0x${string}`,
    abi: VBLP_ABI,
  };

  const { data: data_VBLP_SC, refetch: refetchVBLP_SC } = useContractReads({
    contracts: [
      {
        ...VBLP_SC,
        functionName: 'claimable',
        args: [address as `0x${string}`],
      },
      {
        ...VBLP_SC,
        functionName: 'pairAmounts',
        args: [address as `0x${string}`],
      },
      {
        ...VBLP_SC,
        functionName: 'claimedAmounts',
        args: [address as `0x${string}`],
      },
      {
        ...VBLP_SC,
        functionName: 'getVestedAmount',
        args: [address as `0x${string}`],
      },
    ],
  });

  const FSBLP_SC = {
    address: appConfig.FSBLP_SC as `0x${string}`,
    abi: FSBLP_ABI,
  };

  const { data: data_FSBLP_SC, refetch: refetchFSBLP_SC } = useContractReads({
    contracts: [
      {
        ...FSBLP_SC,
        functionName: 'claimable',
        args: [address as `0x${string}`],
      },
      {
        ...FSBLP_SC,
        functionName: 'stakedAmounts',
        args: [address as `0x${string}`],
      },
      {
        ...FSBLP_SC,
        functionName: 'tokensPerInterval',
      },
    ],
  });

  const SBETR_SC = {
    address: appConfig.SBETR_SC as `0x${string}`,
    abi: SBETR_ABI,
  };

  const { data: data_SBETR_SC, refetch: refetchSBETR_SC } = useContractReads({
    contracts: [
      {
        ...SBETR_SC,
        functionName: 'claimable',
        args: [address as `0x${string}`],
      },
      // {
      //   ...SBETR_SC,
      //   functionName: 'depositBalances',
      //   args: [address as `0x${string}`, appConfig.ESETR_SC as `0x${string}`],
      // },
    ],
  });

  const ESETR_SC = {
    address: appConfig.ESETR_SC as `0x${string}`,
    abi: ESETR_ABI,
  };

  const { data: data_ESETR_SC, refetch: refetchESETR_SC } = useContractReads({
    contracts: [
      {
        ...ESETR_SC,
        functionName: 'balanceOf',
        args: [address as `0x${string}`],
      },
      {
        ...ESETR_SC,
        functionName: 'balanceOf',
        args: [appConfig.FSBLP_SC as `0x${string}`],
      },
      {
        ...ESETR_SC,
        functionName: 'balanceOf',
        args: [appConfig.SETR_SC as `0x${string}`],
      },
    ],
  });

  const BLP_SC = {
    address: appConfig.BLP_SC as `0x${string}`,
    abi: BLP_ABI,
  };

  const { data: data_BLP_SC, refetch: refetchBLP_SC } = useContractReads({
    contracts: [
      {
        ...BLP_SC,
        functionName: 'totalTokenXBalance',
      },
      {
        ...BLP_SC,
        functionName: 'totalSupply',
      },
      {
        ...BLP_SC,
        functionName: 'lockupPeriod',
      },
      {
        ...BLP_SC,
        functionName: 'getUnlockedLiquidity',
        args: [address as `0x${string}`],
      },
      {
        ...BLP_SC,
        functionName: 'balanceOf',
        args: [appConfig.FBLP_SC as `0x${string}`],
      },
    ],
  });

  const USDC_SC = {
    address: appConfig.USDC_SC as `0x${string}`,
    abi: USDC_ABI,
  };

  const { data: data_USDC_SC, refetch: refetchUSDC_SC } = useContractReads({
    contracts: [
      {
        ...USDC_SC,
        functionName: 'balanceOf',
        args: [appConfig.BLP_SC as `0x${string}`],
      },
    ],
  });

  const totalStaked_ETR = data_ETR_SC && data_ETR_SC[0].result;
  const totalSupply_ETR = data_ETR_SC && data_ETR_SC[1].result;
  const balanceOf_addressDead_ETR = data_ETR_SC && data_ETR_SC[2].result;
  const balanceOf_sETR_ETR = data_ETR_SC && data_ETR_SC[3].result;

  const depositBalances_ETR = data_sETR_SC && data_sETR_SC[0].result;
  const tokensPerInterval_sETR = data_sETR_SC && data_sETR_SC[1].result;
  const totalSupply_sETR = data_sETR_SC && data_sETR_SC[2].result;
  const claimables_ETR = data_sETR_SC && data_sETR_SC[3].result;
  const depositBalances_esETR = data_sETR_SC && data_sETR_SC[4].result;

  const tokensPerInterval_sbfETR = data_sbfETR_SC && data_sbfETR_SC[0].result;
  const totalSupply_sbfETR = data_sbfETR_SC && data_sbfETR_SC[1].result;
  const depositBalances_bnETR = data_sbfETR_SC && data_sbfETR_SC[2].result;
  const depositBalances_sbETR = data_sbfETR_SC && data_sbfETR_SC[3].result;
  const claimable_sbfETR = data_sbfETR_SC && data_sbfETR_SC[4].result;

  const claimable_fBLP = data_FBLP_SC && data_FBLP_SC[0].result;
  const tokensPerInterval_fBLP = data_FBLP_SC && data_FBLP_SC[1].result;
  const depositBalances_fBLP = data_FBLP_SC && data_FBLP_SC[2].result;

  const claimable_vETR = data_VETR_SC && data_VETR_SC[0].result;
  const pairAmounts_vETR = data_VETR_SC && data_VETR_SC[1].result;
  const claimedAmounts_vETR = data_VETR_SC && data_VETR_SC[2].result;
  const getVestedAmount_vETR = data_VETR_SC && data_VETR_SC[3].result;

  const claimable_vBLP = data_VBLP_SC && data_VBLP_SC[0].result;
  const pairAmounts_vBLP = data_VBLP_SC && data_VBLP_SC[1].result;
  const claimedAmounts_vBLP = data_VBLP_SC && data_VBLP_SC[2].result;
  const getVestedAmount_vBLP = data_VBLP_SC && data_VBLP_SC[3].result;

  const claimable_fsBLP = data_FSBLP_SC && data_FSBLP_SC[0].result;
  const stakedAmounts_fsBLP = data_FSBLP_SC && data_FSBLP_SC[1].result;
  const tokensPerInterval_fsBLP = data_FSBLP_SC && data_FSBLP_SC[2].result;

  const claimable_sbETR = data_SBETR_SC && data_SBETR_SC[0].result;
  // const depositBalances_sbBFR = data_SBETR_SC && data_SBETR_SC[1].result;

  const balanceOf_esETR = data_ESETR_SC && data_ESETR_SC[0].result;
  const balanceOf_fsBLP_esETR = data_ESETR_SC && data_ESETR_SC[1].result;
  const balanceOf_sETR_esETR = data_ESETR_SC && data_ESETR_SC[2].result;

  const balanceOf_BLP_USDC = data_USDC_SC && data_USDC_SC[0].result;

  const totalTokenXBalance_BLP = data_BLP_SC && data_BLP_SC[0].result;
  const totalSupply_BLP = data_BLP_SC && data_BLP_SC[1].result;
  const lockupPeriod_BLP = data_BLP_SC && data_BLP_SC[2].result;
  const getUnlockedLiquidity_BLP = data_BLP_SC && data_BLP_SC[3].result;
  const balanceOf_fBLP_BLP = data_BLP_SC && data_BLP_SC[4].result;

  // console.log('totalSupply_sETR', totalSupply_sETR);
  const onFetch = () => {
    console.log('onFetch');
    refetchETR_SC();
    refetchSETR_SC();
    refetchSBFETR_SC();
    refetchFBLP_SC();
    refetchVETR_SC();
    refetchVBLP_SC();
    refetchFSBLP_SC();
    refetchSBETR_SC();
    refetchESETR_SC();
    refetchBLP_SC();
    refetchUSDC_SC();
  };

  // console.log('depositBalances_ETR', depositBalances_ETR)

  return (
    <EarnContext.Provider
      value={{
        onFetchData: () => onFetch(),
      }}
    >
      <Flex flexWrap={'wrap'} flexDirection={'column'} gap={'20px'} paddingY={'20px'}>
        <Box>
          <Heading as="h3" fontSize="24px" fontWeight={400} marginBottom={'12px'}>
            Earn
          </Heading>
          <Text className="flex w-full items-center">
            Stake ETR and ELP to earn rewards.{' '}
            <Link
              href="https://coinbase.com/faucets/base-ethereum-goerli-faucet"
              target="_blank"
              className="group ml-1 flex text-center align-middle text-[#6052FB]"
            >
              <span className="pr-[10px] group-hover:underline">Learn more</span>
              <ArrowRight className="text-white" />
            </Link>
          </Text>
        </Box>

        <Grid templateColumns={{ md: 'repeat(2, 1fr)' }} gap={'20px'}>
          <GridItem w="100%" colSpan={{ md: 2, lg: 1 }}>
            <CardEarn>
              {isMounted && (
                <ETRItem
                  price={price}
                  totalStaked_ETR={totalStaked_ETR as bigint}
                  totalSupply_ETR={totalSupply_ETR as bigint}
                  balanceOf_addressDead_ETR={balanceOf_addressDead_ETR as bigint}
                  depositBalances_ETR={depositBalances_ETR as bigint}
                  tokensPerInterval_sETR={tokensPerInterval_sETR as bigint}
                  totalSupply_sETR={totalSupply_sETR as bigint}
                  claimables_ETR={claimables_ETR as bigint}
                  tokensPerInterval_sbfETR={tokensPerInterval_sbfETR as bigint}
                  totalSupply_sbfETR={totalSupply_sbfETR as bigint}
                  depositBalances_bnETR={depositBalances_bnETR as bigint}
                  depositBalances_sbETR={depositBalances_sbETR as bigint}
                  claimable_sbfETR={claimable_sbfETR as bigint}
                />
              )}
            </CardEarn>
          </GridItem>
          <GridItem w="100%" colSpan={{ md: 2, lg: 1 }}>
            <CardEarn>
              {isMounted && (
                <TotalRewardsItem
                  claimable_sbfETR={claimable_sbfETR as bigint}
                  claimable_fBLP={claimable_fBLP as bigint}
                  claimable_vETR={claimable_vETR as bigint}
                  claimable_vBLP={claimable_vBLP as bigint}
                  claimables_ETR={claimables_ETR as bigint}
                  claimable_fsBLP={claimable_fsBLP as bigint}
                  claimable_sbETR={claimable_sbETR as bigint}
                  depositBalances_bnETR={depositBalances_bnETR as bigint}
                />
              )}
            </CardEarn>
          </GridItem>
        </Grid>

        <Grid templateColumns={{ md: 'repeat(2, 1fr)' }} gap={'20px'}>
          <GridItem w="100%" colSpan={{ md: 2, lg: 1 }}>
            <CardEarn>
              {isMounted && (
                <EsETR
                  price={price}
                  balanceOf_esETR={balanceOf_esETR as bigint}
                  depositBalances_esETR={depositBalances_esETR as bigint}
                  tokensPerInterval_sETR={tokensPerInterval_sETR as bigint}
                  totalSupply_sETR={totalSupply_sETR as bigint}
                  tokensPerInterval_sbfETR={tokensPerInterval_sbfETR as bigint}
                  totalSupply_sbfETR={totalSupply_sbfETR as bigint}
                  depositBalances_bnETR={depositBalances_bnETR as bigint}
                  depositBalances_sbETR={depositBalances_sbETR as bigint}
                  balanceOf_sETR_ETR={balanceOf_sETR_ETR as bigint}
                  balanceOf_fsBLP_esETR={balanceOf_fsBLP_esETR as bigint}
                  balanceOf_sETR_esETR={balanceOf_sETR_esETR as bigint}
                />
              )}
            </CardEarn>
          </GridItem>

          <GridItem w="100%" colSpan={{ md: 2, lg: 1 }}>
            <CardEarn>
              {isMounted && (
                <USDCVaultItem
                  price={price}
                  totalTokenXBalance_BLP={totalTokenXBalance_BLP as bigint}
                  totalSupply_BLP={totalSupply_BLP as bigint}
                  stakedAmounts_fsBLP={stakedAmounts_fsBLP as bigint}
                  tokensPerInterval_fBLP={tokensPerInterval_fBLP as bigint}
                  balanceOf_BLP_USDC={balanceOf_BLP_USDC as bigint}
                  tokensPerInterval_fsBLP={tokensPerInterval_fsBLP as bigint}
                  claimable_fBLP={claimable_fBLP as bigint}
                  claimable_fsBLP={claimable_fsBLP as bigint}
                  lockupPeriod_BLP={lockupPeriod_BLP as number}
                  getUnlockedLiquidity_BLP={getUnlockedLiquidity_BLP as bigint}
                  balanceOf_fBLP_BLP={balanceOf_fBLP_BLP as bigint}
                />
              )}
            </CardEarn>
          </GridItem>
        </Grid>

        <Box marginTop={'20px'}>
          <Heading as="h3" fontSize="24px" fontWeight={400} marginBottom={'12px'}>
            Vest
          </Heading>
          <Text className="flex w-full items-center">
            Convert esETR tokens to ETR tokens.
            <Link
              href="https://coinbase.com/faucets/base-ethereum-goerli-faucet"
              target="_blank"
              className="group ml-1 flex text-center align-middle text-[#6052FB]"
            >
              <span className="pr-[10px] group-hover:underline">Learn more</span>
              <ArrowRight className="text-white" />
            </Link>
          </Text>
        </Box>

        <Grid templateColumns={{ md: 'repeat(2, 1fr)' }} gap={'20px'}>
          <GridItem w="100%" colSpan={{ md: 2, lg: 1 }}>
            <CardEarn>
              <ETRVault
                depositBalances_ETR={depositBalances_ETR as bigint}
                depositBalances_esETR={depositBalances_esETR as bigint}
                depositBalances_bnETR={depositBalances_bnETR as bigint}
                pairAmounts_vETR={pairAmounts_vETR as bigint}
                depositBalances_sbETR={depositBalances_sbETR as bigint}
                claimedAmounts_vETR={claimedAmounts_vETR as bigint}
                claimable_vETR={claimable_vETR as bigint}
                getVestedAmount_vETR={getVestedAmount_vETR as bigint}
              />
            </CardEarn>
          </GridItem>

          <GridItem w="100%" colSpan={{ md: 2, lg: 1 }}>
            <CardEarn>
              <ELPVault
                depositBalances_fBLP={depositBalances_fBLP as bigint}
                pairAmounts_vBLP={pairAmounts_vBLP as bigint}
                claimedAmounts_vBLP={claimedAmounts_vBLP as bigint}
                claimable_vBLP={claimable_vBLP as bigint}
                getVestedAmount_vBLP={getVestedAmount_vBLP as bigint}
              />
            </CardEarn>
          </GridItem>
        </Grid>
      </Flex>
    </EarnContext.Provider>
  );
};
export default EarnView;
