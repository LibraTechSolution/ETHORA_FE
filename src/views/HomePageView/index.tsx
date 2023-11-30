'use client';
import React from 'react';
import { Box, Button, Flex, Grid, GridItem, Text, Image, Center, Icon } from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import CardEthora from './conponent/cardEthora';
import CardDualToken from './conponent/cartDualToken';
import Link from 'next/link';
import FooterLadingPage from '@/components/layout/FooterLandingPage';
import { appConfig } from '@/config';
import useActiveWeb3React from '@/hooks/useActiveWeb3React';
import FBLP_ABI from '@/config/abi/FBLP_ABI';
import USDC_ABI from '@/config/abi/USDC_ABI';
import { useContractReads } from 'wagmi';
import FSBLP_ABI from '@/config/abi/FSBLP_ABI';
import BigNumber from 'bignumber.js';
import SETR_ABI from '@/config/abi/SETR_ABI';
import SBFETR_ABI from '@/config/abi/SBFETR_ABI';
import { useIsMounted } from '@/hooks/useIsMounted';

const dataCardEthora = [
  {
    alt: 'Trading',
    image: '/images/landingpage/iconTrading.svg',
    title: 'Predetermined Outcome Trading Experience',
    desc: 'Engage in trading with a clearly defined risk-reward ratio, free from the risk of liquidation.',
  },
  {
    alt: 'Easy',
    image: '/images/landingpage/iconEasy.svg',
    title: 'Easy and Fun',
    desc: 'User-friendly approach to effortlessly trade short-term market volatility by choosing up/down option',
  },
  {
    alt: 'Wallet',
    image: '/images/landingpage/iconWallet.svg',
    title: 'Your Wallet, Your Control',
    desc: 'Trade directly from your wallet with trust in a decentralized price feed, free from scam wicks.',
  },
  {
    alt: 'Access',
    image: '/images/landingpage/iconAccess.svg',
    title: 'Access Various Markets',
    desc: 'Seamlessly trade the market volatility of cryptocurrencies, forex on-chain.',
  },
];
export const HomeView = () => {
  const { address } = useActiveWeb3React();
  const price = 0.055;
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

  // const depositBalances_ETR = data_sETR_SC && data_sETR_SC[0].result;
  const tokensPerInterval_sETR = data_sETR_SC && data_sETR_SC[1].result;
  const totalSupply_sETR = data_sETR_SC && data_sETR_SC[2].result;
  // const claimables_sETR = data_sETR_SC && data_sETR_SC[3].result;
  // const depositBalances_esETR = data_sETR_SC && data_sETR_SC[4].result;

  const tokensPerInterval_sbfETR = data_sbfETR_SC && data_sbfETR_SC[0].result;
  const totalSupply_sbfETR = data_sbfETR_SC && data_sbfETR_SC[1].result;
  const depositBalances_bnETR = data_sbfETR_SC && data_sbfETR_SC[2].result;
  const depositBalances_sbETR = data_sbfETR_SC && data_sbfETR_SC[3].result;
  // const claimable_sbfETR = data_sbfETR_SC && data_sbfETR_SC[4].result;

  const esETR_APR = (100 * 31536000 * Number(tokensPerInterval_sETR)) / Number(totalSupply_sETR);
  const USDC_APR =
    (100 * 31536000 * Number(tokensPerInterval_sbfETR) * 10 ** 12) / (Number(totalSupply_sbfETR) * price);
  const boosted_APR =
    depositBalances_bnETR || depositBalances_sbETR
      ? (Number(depositBalances_bnETR) * USDC_APR) / Number(depositBalances_sbETR)
      : 0;
  // const boosted_Percentage = depositBalances_bnETR || depositBalances_sbETR ?  (Number(depositBalances_bnETR) / Number(depositBalances_sbETR)) * 100 : 0;
  const Total_APR_ETR = isNaN(boosted_APR) ? esETR_APR + USDC_APR : esETR_APR + USDC_APR + boosted_APR;

  // const claimable_fBLP = data_FBLP_SC && data_FBLP_SC[0].result;
  const tokensPerInterval_fBLP = data_FBLP_SC && data_FBLP_SC[1].result;
  // const depositBalances_fBLP = data_FBLP_SC && data_FBLP_SC[2].result;

  const balanceOf_BLP_USDC = data_USDC_SC && data_USDC_SC[0].result;

  // const claimable_fsBLP = data_FSBLP_SC && data_FSBLP_SC[0].result;
  // const stakedAmounts_fsBLP = data_FSBLP_SC && data_FSBLP_SC[1].result;
  const tokensPerInterval_fsBLP = data_FSBLP_SC && data_FSBLP_SC[2].result;

  const USDC_APR_ELP = (100 * 31536000 * Number(tokensPerInterval_fBLP)) / Number(balanceOf_BLP_USDC);
  const esETR_APR_ELP =
    (100 * 31536000 * Number(tokensPerInterval_fsBLP) * price) / (Number(balanceOf_BLP_USDC) * 10 ** 12);
  const Total_APR_ELP = USDC_APR_ELP + esETR_APR_ELP;
  return (
    <Flex flexDirection={'column'} height="100%" w={'100%'}>
      <Grid
        templateColumns={{ base: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(2, 1fr)' }}
        gap="25px"
        alignItems={'center'}
        paddingBottom={'20px'}
        backgroundRepeat={'no-repeat'}
        backgroundSize={'cover'}
        paddingTop={'86px'}
        position={'relative'}
        height={'100vh'}
        // bgImage={{
        //   base: "linear-gradient(to bottom, #0f0f14eb, #0f0f1a), url('/images/landingpage/bg-lading-top.gif')",
        //   md: "linear-gradient(to bottom, #0f0f14eb, #0c0c10), url('/images/landingpage/bg-lading-top.gif')",
        // }}
      >
        <video src="/images/landingpage/bg.mp4" autoPlay loop playsInline muted className="video-bg"></video>
        <GridItem zIndex={2}>
          <Box paddingLeft={{ base: '12px', md: '50px', lg: '150px' }} paddingRight={{ base: '12px', md: '80px' }}>
            <Box
              display={'flex'}
              alignItems={'center'}
              gap={'2'}
              marginBottom={{ base: '20px', md: '30px' }}
              justifyContent={{ base: 'center', sm: 'center', md: 'start', lg: 'start' }}
            >
              <Text as="span" fontSize={'xs'} color={'#9E9E9F'}>
                POWERED BY
              </Text>
              <Image alt="base" src="/images/landingpage/base.png" w="24" h="5" />
            </Box>
            <Text
              as="p"
              textColor={'white'}
              fontSize={{ base: '3xl', md: '30px', lg: '60px' }}
              lineHeight={{ base: '45px', md: '40px', lg: '70px' }}
              fontWeight={{ base: '500', lg: '600' }}
              marginBottom={{ base: '20px', md: '30px' }}
              textAlign={{ base: 'center', md: 'start' }}
            >
              Decentralized <br /> Options Trading
            </Text>
            <Text
              as="p"
              fontSize={'16px'}
              color={'#9E9E9F'}
              marginBottom={'30px'}
              textAlign={{ base: 'center', md: 'start' }}
            >
              Discover a non-custodial platform specialized in options trading, tailored for effectively managing
              short-term price volatility and mitigating risks associated with high-leverage positions.
            </Text>
            <Box
              display={'flex'}
              alignItems={'center'}
              gap={10}
              paddingLeft={{ base: '12px', md: '0px' }}
              paddingRight={{ base: '12px', md: '0px' }}
              justifyContent={{ base: 'center', md: 'start' }}
            >
              <Link href={'/trade/BTC-USD'}>
                <Text
                  as="span"
                  fontSize={{ base: '13px', md: '16px' }}
                  textColor={'#0052FF'}
                  cursor={'pointer'}
                  fontWeight={600}
                >
                  Trade <ExternalLinkIcon />
                </Text>
              </Link>
              <Link href={'/earn'}>
                <Text
                  as="span"
                  fontSize={{ base: '13px', md: '16px' }}
                  textColor={'#0052FF'}
                  cursor={'pointer'}
                  fontWeight={600}
                >
                  Earn Real Yield <ExternalLinkIcon />
                </Text>
              </Link>
              <Link href={'/sale-token'}>
                <Text
                  as="span"
                  fontSize={{ base: '13px', md: '16px' }}
                  textColor={'#0052FF'}
                  cursor={'pointer'}
                  fontWeight={600}
                >
                  Buy token <ExternalLinkIcon />
                </Text>
              </Link>
            </Box>
          </Box>
        </GridItem>
        <GridItem display={{ base: 'none', sm: 'none', md: 'block', lg: 'block' }} zIndex={2}>
          <Image alt="trade" src="/images/landingpage/trade.png" w="full" h="full" objectFit="cover" />
        </GridItem>
        <GridItem display={{ base: 'block', sm: 'block', md: 'none', lg: 'none' }} margin={'0px 12px'} zIndex={2}>
          <Image alt="trade" src="/images/landingpage/trade_mobile.png" w="full" h="full" objectFit="cover" />
        </GridItem>
        <div className="gradient-layer" />
      </Grid>
      <Box
        display={'flex'}
        alignItems={'center'}
        justifyContent={'center'}
        // bgImage={`url('/images/landingpage/bg-ethora.png'), url('/images/landingpage/bg-ethora.png')`}
        bgRepeat="no-repeat"
        // bgPosition={'center 130px ,center top'}
        // bgSize={{ base: '400% 370%', sm: '400% 370%', md: '195% 295%', lg: '125% 250%' }}
        paddingTop={'20%'}
        position={'relative'}
        flexDirection={'column'}
        zIndex={2}
        className="custom-shawdow"
      >
        <Box
          position="absolute"
          top={'20px'}
          left={'-2'}
          display={{ base: 'none', sm: 'none', md: 'none', lg: 'block' }}
          zIndex={1}
        >
          <Image src="/images/landingpage/ethora.png" alt="landingpage" width={'full'} height={'full'} />
        </Box>
        <Box maxWidth={'1150px'} margin={'0 auto'} zIndex={2}>
          <Text
            fontSize={{ base: '28px', md: '56px' }}
            textColor={'white'}
            lineHeight={'120px'}
            fontWeight={600}
            textAlign={'center'}
          >
            What does Ethora offer?
          </Text>
          <Grid
            templateColumns={{
              base: 'repeat(1, 1fr)',
              sm: 'repeat(1, 1fr)',
              md: 'repeat(2, 1fr)',
              lg: 'repeat(2, 1fr)',
            }}
            gap="25px"
            alignItems={'center'}
            marginLeft={{ base: '12px', sm: '12px', md: '0px', lg: '0px' }}
          >
            {dataCardEthora.map((item, idx) => (
              <CardEthora key={idx} alt={item.alt} image={item.image} title={item.title} desc={item.desc} />
            ))}
          </Grid>
        </Box>
      </Box>
      <Box
        position={'relative'}
        bgImage={`url('/images/landingpage/bg-bottom.png')`}
        bgPosition={'right bottom'}
        bgSize={'cover'}
        paddingTop={'10%'}
      >
        <Box
          position="absolute"
          bottom={'-140px'}
          left={'-2'}
          display={{ base: 'none', sm: 'none', md: 'block', lg: 'block' }}
        >
          <Image src="/images/landingpage/bg-hexagon.png" alt="landingpage" width={'full'} height={'full'} />
        </Box>
        <Box
          position="absolute"
          bottom={'-19px'}
          left={'-342px'}
          display={{ base: 'block', sm: 'block', md: 'none', lg: 'none' }}
        >
          <Image src="/images/landingpage/ethora.png" alt="landingpage" width={'800px'} height={'800px'} />
        </Box>
        <Box
          display={'flex'}
          alignItems={'center'}
          justifyContent={'center'}
          bgRepeat="no-repeat"
          bgPosition="center"
          flexDirection={'column'}
        >
          <Text
            fontSize={{ base: '28px', md: '56px' }}
            textColor={'white'}
            lineHeight={'120px'}
            fontWeight={600}
            marginBottom={{ base: '0px', sm: '0px', md: '80px', lg: '80px' }}
          >
            Dual Token System
          </Text>
          <Grid
            templateColumns={{
              base: 'repeat(1, 1fr)',
              sm: 'repeat(1, 1fr)',
              md: 'repeat(2, 1fr)',
              lg: 'repeat(2, 1fr)',
            }}
            gap="25px"
            zIndex={'2'}
            alignItems={'stretch'}
            marginLeft={{ base: '12px', sm: '12px', md: '12px', lg: '0px' }}
            marginRight={{ base: '12px', sm: '12px', md: '12px', lg: '0px' }}
          >
            <CardDualToken
              image="/images/landingpage/logo.svg"
              title="ETR"
              desc="ETR is the utility and governance token that accrues up to X% of the fees generated by the platform."
              percent={`APR: ${
                Total_APR_ETR !== undefined ? BigNumber(Total_APR_ETR).toFormat(2, BigNumber.ROUND_DOWN) : '0.00'
              }%`}
              isButton={true}
              textBtnLeft="Buy"
              textBtnRight="Stake"
              linkBtnRight="/earn"
            />
            <CardDualToken
              image="/images/landingpage/logo.svg"
              title="ELP"
              desc="
              ELP is the token issued to liquidity providers and accrues up to 70% of the fees generated by the platform."
              percent={`APR: ${
                Total_APR_ELP !== undefined ? BigNumber(Total_APR_ELP).toFormat(2, BigNumber.ROUND_DOWN) : '0.00'
              }%`}
              isButton={true}
              textBtnCenter="Earn Real Yield"
              linkBtnCenter="/earn"
            />
          </Grid>
        </Box>
        <FooterLadingPage />
      </Box>
    </Flex>
  );
};
