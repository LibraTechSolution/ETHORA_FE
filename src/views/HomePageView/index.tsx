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
        paddingTop={{ base: '57px', md: '86px' }}
        bgImage={{
          base: "linear-gradient(to bottom, #0f0f14eb, #0f0f1a), url('/images/landingpage/bg-lading-top.gif')",
          md: "linear-gradient(to bottom, #0f0f14eb, #0c0c10), url('/images/landingpage/bg-lading-top.gif')",
        }}
      >
        <GridItem>
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
              marginBottom={{ base: '20px', md: '30px' }}
              textAlign={{ base: 'center', md: 'start' }}
            >
              Decentralized <br /> Options Trading
            </Text>
            <Text
              as="p"
              fontSize={'xs'}
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
        <GridItem display={{ base: 'none', sm: 'none', md: 'block', lg: 'block' }}>
          <Image alt="trade" src="/images/landingpage/trade.png" w="full" h="full" objectFit="cover" />
        </GridItem>
        <GridItem display={{ base: 'block', sm: 'block', md: 'none', lg: 'none' }} margin={'0px 12px'}>
          <Image alt="trade" src="/images/landingpage/trade_mobile.png" w="full" h="full" objectFit="cover" />
        </GridItem>
      </Grid>
      <Box
        display={'flex'}
        alignItems={'center'}
        justifyContent={'center'}
        bgImage={"url('/images/landingpage/bg-ethora.png')"}
        bgRepeat="no-repeat"
        bgPosition={'center'}
        bgSize={{ base: '400% 370%', sm: '400% 370%', md: '195% 295%', lg: '125% 250%' }}
        paddingTop={'20%'}
        position={'relative'}
        flexDirection={'column'}
      >
        <Box
          position="absolute"
          top={'20px'}
          left={'-2'}
          display={{ base: 'none', sm: 'none', md: 'none', lg: 'block' }}
        >
          <Image src="/images/landingpage/ethora.png" alt="landingpage" width={'full'} height={'full'} />
        </Box>
        <Box maxWidth={'1150px'} margin={'0 auto'}>
          <Text
            fontSize={{ base: '28px', md: '60px' }}
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
            fontSize={{ base: '28px', md: '60px' }}
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
          <Link href="/" className="z-10 flex items-center gap-1 text-sm">
            <Image alt="ethora" src="/images/icons/twitter.svg" w="24px" h="24p" />
            <Text as={'span'} display={{ base: 'none', sm: 'none', md: 'inline-block', lg: 'inline-block' }}>
              Twitter
            </Text>
          </Link>
          <Link href="/" className="z-10  flex items-center gap-1 text-sm">
            <Image alt="ethora" src="/images/icons/twitter.svg" w="24p" h="24p" />
            <Text as={'span'} display={{ base: 'none', sm: 'none', md: 'inline-block', lg: 'inline-block' }}>
              Discord
            </Text>
          </Link>
          <Link href="/" className="z-10  flex items-center gap-1 text-sm">
            <Image alt="ethora" src="/images/icons/medium.svg" w="24p" h="24p" />
            <Text as={'span'} display={{ base: 'none', sm: 'none', md: 'inline-block', lg: 'inline-block' }}>
              Medium
            </Text>
          </Link>
          <Link href="/" className="z-10 flex items-center gap-1 text-sm">
            <Image alt="ethora" src="/images/icons/instagram.svg" w="24p" h="24p" />
            <Text as={'span'} display={{ base: 'none', sm: 'none', md: 'inline-block', lg: 'inline-block' }}>
              Instagram
            </Text>
          </Link>
        </Box>
      </Box>
    </Flex>
  );
};
