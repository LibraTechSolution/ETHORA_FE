'use client';
import React from 'react';
import { Box, Button, Flex, Grid, GridItem, Text, Image, Center, Icon } from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import CardEthora from './conponent/cardEthora';
import CardDualToken from './conponent/cartDualToken';
import Link from 'next/link';

const dataCardEthora = [
  {
    alt: 'Trading',
    image: '/images/landingpage/iconTrading.png',
    title: 'Predetermined Outcome Trading Experience',
    desc: 'Engage in trading with a clearly defined risk-reward ratio, free from the risk of liquidation.',
  },
  {
    alt: 'Easy',
    image: '/images/landingpage/iconEasy.png',
    title: 'Easy and Fun',
    desc: 'User-friendly approach to effortlessly trade short-term market volatility by choosing up/down option',
  },
  {
    alt: 'Wallet',
    image: '/images/landingpage/iconWallet.png',
    title: 'Your Wallet, Your Control',
    desc: 'Trade directly from your wallet with trust in a decentralized price feed, free from scam wicks.',
  },
  {
    alt: 'Access',
    image: '/images/landingpage/iconAccess.png',
    title: 'Access Various Markets',
    desc: 'Seamlessly trade the market volatility of cryptocurrencies, forex on-chain.',
  },
];
export const HomeView = () => {
  return (
    <Flex flexDirection={'column'} height="100%" w={'100%'}>
      <Grid
        templateColumns={{ base: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(2, 1fr)' }}
        gap="25px"
        alignItems={'center'}
        paddingBottom={'20px'}
        paddingTop="86px"
        bgImage="linear-gradient(to bottom, #0f0f14eb, #0c0c10), url('/images/landingpage/bg-lading-top.gif');"
      >
        <GridItem>
          <Box paddingLeft={'150px'} paddingRight={'80px'}>
            <Box display={'flex'} alignItems={'center'} gap={'2'} marginBottom={'30px'}>
              <Text as="span" fontSize={'xs'} color={'#9E9E9F'}>
                POWERED BY
              </Text>
              <Image alt="base" src="/images/landingpage/base.png" w="24" h="5" />
            </Box>
            <Text as="p" textColor={'white'} fontSize={'60px'} lineHeight={'70px'} marginBottom={'30px'}>
              Decentralized <br /> Options Trading
            </Text>
            <Text as="p" fontSize={'xs'} color={'#9E9E9F'} marginBottom={'30px'}>
              Discover a non-custodial platform specialized in options trading, tailored for effectively managing
              short-term price volatility and mitigating risks associated with high-leverage positions.
            </Text>
            <Box display={'flex'} alignItems={'center'} gap={10}>
              <Text as="span" fontSize={'xs'} textColor={'#0052FF'} cursor={'pointer'}>
                Trade <ExternalLinkIcon />
              </Text>
              <Text as="span" fontSize={'xs'} textColor={'#0052FF'} cursor={'pointer'}>
                Earn Real Yield <ExternalLinkIcon />
              </Text>
              <Text as="span" fontSize={'xs'} textColor={'#0052FF'} cursor={'pointer'}>
                Buy token <ExternalLinkIcon />
              </Text>
            </Box>
          </Box>
        </GridItem>
        <GridItem>
          <Image alt="trade" src="/images/landingpage/trade.png" w="full" h="full" objectFit="cover" />
        </GridItem>
      </Grid>
      <Box
        display={'flex'}
        alignItems={'center'}
        justifyContent={'center'}
        bgImage="url('/images/landingpage/bg-ethora.png')"
        bgRepeat="no-repeat"
        bgPosition={'center'}
        bgSize={'125% 250%'}
        paddingTop={'20%'}
        position={'relative'}
        flexDirection={'column'}
      >
        <Box position="absolute" top={'20px'} left={'-2'}>
          <Image src="/images/landingpage/ethora.png" alt="landingpage" width={'full'} height={'full'} />
        </Box>
        <Box maxWidth={'1150px'} margin={'0 auto'}>
          <Text fontSize="56px" textColor={'white'} lineHeight={'120px'} fontWeight={600} textAlign={'center'}>
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
        <Box position="absolute" bottom={'-140px'} left={'-2'}>
          <Image src="/images/landingpage/bg-hexagon.png" alt="landingpage" width={'full'} height={'full'} />
        </Box>
        <Box
          display={'flex'}
          alignItems={'center'}
          justifyContent={'center'}
          bgRepeat="no-repeat"
          bgPosition="center"
          flexDirection={'column'}
        >
          <Text fontSize="56px" textColor={'white'} lineHeight={'120px'} fontWeight={600} marginBottom={'80px'}>
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
          >
            <CardDualToken
              image="/images/landingpage/img_etr.png"
              title="ETR"
              desc="ETR is the utility and governance token that accrues up to X% of the fees generated by the platform."
              percent="APR: 9.97%"
              isButton={true}
              textBtnLeft="Buy"
              textBtnRight="Stake"
            />
            <CardDualToken
              image="/images/landingpage/img_elp.png"
              title="ELP"
              desc="
            BLP is the token issued to liquidity providers and accrues up to 70% of the fees generated by the platform."
              percent="APR: 26.56%"
              isButton={true}
              textBtnCenter="Earn Real Yield"
            />
          </Grid>
        </Box>
        <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={'24px'} margin={'80px 0 40px'}>
          <Link href="/" className="flex items-center gap-1 text-sm ">
            <Image alt="ethora" src="/images/icons/twitter.svg" w="24px" h="24p" />
            <span>Twitter</span>
          </Link>
          <Link href="/" className="flex items-center gap-1 text-sm">
            <Image alt="ethora" src="/images/icons/twitter.svg" w="24p" h="24p" />
            <span>Discord</span>
          </Link>
          <Link href="/" className="flex items-center gap-1 text-sm">
            <Image alt="ethora" src="/images/icons/medium.svg" w="24p" h="24p" />
            <span>Medium</span>
          </Link>
          <Link href="/" className="flex items-center gap-1 text-sm">
            <Image alt="ethora" src="/images/icons/instagram.svg" w="24p" h="24p" />
            <span>Instagram</span>
          </Link>
        </Box>
      </Box>
    </Flex>
  );
};
