'use client';
import { Box, Flex, Image, Heading, Text, Button, Grid, Accordion, useMediaQuery } from '@chakra-ui/react';
import React, { useRef } from 'react';
import ItemCardSale from './conponent/itemCardSale';
import ItemCardPublicSale from './conponent/itemCardPublicSale';
import AccordionCustoms from './conponent/accordionCustom';
import FooterLadingPage from '@/components/layout/FooterLandingPage';

const dataFAQ = [
  {
    title: 'What’s the difference between a Public Sale and a Private Sale?',
    desc: 'In a Private Sale, you need to meet certain requirements listed on the IDO card to join. You can commit any amount of tokens, up to a maximum limit, if you are eligible. In a Public Sale, anyone can join and make a commitment.',
  },
  {
    title: 'Which sale should I participate in? Can I participate in both?',
    desc: 'You have the option to choose one or participate in both simultaneously!We suggest checking your eligibility for the Private Sale first. In the Public Sale, if the amount you commit is too small, you might not receive a significant number of IDO tokens.',
  },
  {
    title: 'How much is the participation fee?',
    desc: 'There’s only a participation fee for the Public Sale: there’s no fee for the Private Sale. The participation fee decreases in cliffs, based on the percentage of overflow from the “Public Sale” portion of the IDO.',
  },
  {
    title: 'Where does the participation fee go?',
    desc: 'After the IDO concludes, the participation fee will be transferred to the team’s treasury. These funds can then be utilized for purchasing and removing ETR tokens from circulation in the future.',
  },
];

export const SaleTokenView = () => {
  const [isMobile] = useMediaQuery('(max-width: 768px)');
  const faqRef = useRef<HTMLDivElement>(null);

  return (
    <Flex flexDirection={'column'} height="100%" w={'100%'}>
      <Box
        backgroundRepeat={'no-repeat'}
        backgroundSize={'100% 70%'}
        bgImage={{
          base: 'linear-gradient(to bottom, #1f1b46bd, #0c0c10),url(/images/saleToken/bg-top.png)',
          md: 'linear-gradient(to bottom, #1f1b46bd, #0c0c10),url(/images/saleToken/bg-top.png)',
        }}
      >
        <Box margin={{ base: '12px', md: '50px', lg: '67px 150px' }}>
          <Box
            bgImage={{
              base: 'none',
              md: "url('/images/saleToken/bg-header.png')",
              lg: "url('/images/saleToken/bg-header.png')",
            }}
            backgroundSize={'100% 100%'}
            backgroundRepeat={'no-repeat'}
            display={'flex'}
            alignItems={['flex-start', 'flex-start', 'center', 'center']}
            maxH={'695px'}
            // padding={'5px 76px'}
            flexDirection={['column-reverse', 'column-reverse', 'row', 'row']}
            padding={{ base: 'none', sm: 'none', md: '5px 76px', lg: '5px 76px' }}
            flexWrap={'wrap'}
          >
            <Box flex={1} w={{ base: '100%', sm: '100', md: 'auto', lg: 'auto' }}>
              <Heading
                as="h1"
                textColor={'white'}
                fontSize={{ base: '3xl', md: '30px', lg: '60px' }}
                lineHeight={{ base: '45px', md: '40px', lg: '70px' }}
                marginBottom={{ base: '20px', md: '30px' }}
                textAlign={'start'}
              >
                Ethora (ETR){' '}
                <Box as="br" display={{ base: 'none', sm: 'none', md: 'inline-block', lg: 'inline-block' }} />
                IDO
              </Heading>
              <Text as="p" fontSize={'xs'} color={'#9E9E9F'} marginBottom={'30px'} textAlign={'start'}>
                Access to the future of decentralized options trading
              </Text>
              <Button
                borderColor="#0052FF"
                bgColor={'#0052FF'}
                borderRadius={'10px'}
                textColor="white"
                variant="outline"
                _hover={{ bg: 'transparent' }}
                padding={'8px 16px'}
                w={{ base: '100%', sm: '100', md: 'auto', lg: 'auto' }}
                onClick={() => faqRef?.current && faqRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })}
              >
                How does it work
              </Button>
            </Box>
            <Box flex={{ base: 'none', sm: 'none', md: '1', lg: '1' }} maxH={'565px'} maxWidth={'565px'}>
              <Image alt="base" src="/images/saleToken/logo-token.png" w="full" h="full" />
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        display={'flex'}
        alignItems={'center'}
        justifyItems={'center'}
        flexWrap={'wrap'}
        margin={{ base: '50px 12px', sm: '50px 12px', md: '50px', lg: '67px 242px' }}
      >
        <Box flex={1}>
          <Image alt="base" src="/images/saleToken/logo-token.png" w="87.74" h="87.74" />
          <Text
            as="h3"
            fontSize={{ base: 'xl', sm: 'xl', md: '2xl', lg: '2xl' }}
            textColor={'white'}
            lineHeight={1.3}
            marginTop={{ base: '20px', sm: '20px', md: '20px', lg: '20px' }}
            marginBottom={{ base: '20px', sm: '20px', md: '20px', lg: '20px' }}
          >
            You have no tokens available for claiming
          </Text>
          <Text as="p" fontSize={'xs'} color={'#9E9E9F'} marginBottom={'30px'} textAlign={'start'}>
            Participate in our next IDO. Follow us on our social networks for more information!
          </Text>
        </Box>
        <Box
          display={{ base: 'none', sm: 'none', md: 'block', lg: 'block' }}
          flex={{ base: 'none', sm: 'none', md: '1', lg: '1' }}
        >
          <Image alt="base" src="/images/saleToken/ethora-twitter.png" w="627px" h="full" />
        </Box>
        <Box display={{ base: 'block', sm: 'block', md: 'none', lg: 'none' }}>
          <Image alt="base" src="/images/saleToken/ethora-twitter-mobile.png" w="627px" h="full" />
        </Box>
      </Box>
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
        <Box maxWidth={'1150px'} margin={'0 auto'}>
          <Text
            fontSize={{ base: '28px', md: '56px' }}
            textColor={'white'}
            lineHeight={'120px'}
            fontWeight={600}
            textAlign={'center'}
          >
            Sale Finished!
          </Text>
        </Box>
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
          <Box
            boxShadow="1px 0.5px 0px 0px #38383A inset"
            border={'1px solid #38383A'}
            paddingY="40px"
            paddingX="32px"
            rounded="20px"
            width={{ base: 'auto', sm: 'auto', md: 'auto', lg: '506px' }}
            marginBottom={{ base: '0px', sm: '0px', md: '20px', lg: '20px' }}
            bgColor="rgba(28, 28, 30, 0.7)"
            display={'flex'}
            justifyContent={'space-around'}
            gap={'20px'}
            flexDirection={'column'}
          >
            <Box flex={'1'} gap={'20px'} display={'flex'} flexDirection={'column'}>
              <Text fontSize="20px" textColor={'white'} fontWeight={600}>
                Private Sale
              </Text>
              <Text fontSize="32px" textColor={'white'} fontWeight={600}>
                100,000,000 ETR
              </Text>
              <Text as="span" fontSize={'xs'} textColor={'#9E9E9F'}>
                16.7% of total sale
              </Text>
              <Button
                flex={1}
                borderColor="#0052FF"
                bgColor={'#0052FF'}
                borderRadius={'10px'}
                textColor="white"
                variant="outline"
                _hover={{ bg: 'transparent' }}
                padding={'8px 16px'}
              >
                Connect Wallet
              </Button>
            </Box>
            <Box flex={'1'}>
              <ItemCardSale title="Max. token entry" value="0.200 WETH" />
              <ItemCardSale title="Total committed:" value="~13.3538 (66.77%)" />
              <ItemCardSale title="Funds to raise:" value="20 WETH" />
              <ItemCardSale title="Price per ETR:" value="0.00000020 WETH" />
            </Box>
          </Box>
          <Box
            boxShadow="1px 0.5px 0px 0px #38383A inset"
            border={'1px solid #38383A'}
            paddingY="32px"
            paddingX="32px"
            rounded="20px"
            width={{ base: 'auto', sm: 'auto', md: 'auto', lg: '506px' }}
            marginBottom={{ base: '0px', sm: '0px', md: '20px', lg: '20px' }}
            bgColor="rgba(28, 28, 30, 0.7)"
            justifyContent={'space-around'}
            gap={'20px'}
            display={'flex'}
            flexDirection={'column'}
          >
            <Box flex={'1'} gap={'20px'} display={'flex'} flexDirection={'column'}>
              <Text fontSize="20px" textColor={'white'} fontWeight={600}>
                Private Sale
              </Text>
              <Text fontSize="32px" textColor={'white'} fontWeight={600}>
                500,000,000 ETR
              </Text>
              <Text as="span" fontSize={'xs'} textColor={'#9E9E9F'}>
                500,000,000 ETR
              </Text>
              <Button
                flex={1}
                borderColor="#0052FF"
                bgColor={'#0052FF'}
                borderRadius={'10px'}
                textColor="white"
                variant="outline"
                _hover={{ bg: 'transparent' }}
                padding={'8px 16px'}
              >
                Connect Wallet
              </Button>
            </Box>
            <Box flex={'1'}>
              <ItemCardSale title="Max. token entry" value="1.000 WETH" />
              <ItemCardSale title="Additional fee:" value="0%" />
              <ItemCardSale title="Total committed:" value="~18.8451 (17.13%)" />
              <ItemCardSale title="Funds to raise:" value="110 WETH" />
              <ItemCardSale title="Price per ETR:" value="0.00000020 WETH" />
            </Box>
          </Box>
        </Grid>
      </Box>
      <Box margin={{ base: '30px 12px 0px', sm: '30px 12px 0px', md: '160px 20px 0px', lg: '160px 240px 24px' }}>
        <Text
          fontSize={{ base: '28px', md: '56px' }}
          textColor={'white'}
          lineHeight={{ base: '40px', md: '67px' }}
          fontWeight={600}
          textAlign={'center'}
          marginBottom={{ base: '40px', md: '80px' }}
        >
          How to Take Part in <br />
          the Public Sale
        </Text>
        <Grid
          templateColumns={{
            base: 'repeat(1, 1fr)',
            sm: 'repeat(1, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(3, 1fr)',
          }}
          justifyContent={'center'}
          alignItems={'stretch'}
          justifyItems={{ base: 'start', md: 'center' }}
          maxW={'1480px'}
          position={'relative'}
          _after={
            isMobile
              ? {}
              : {
                  content: '" "',
                  height: '1px',
                  position: 'absolute',
                  bottom: 0,
                  width: '80%',
                  background:
                    'radial-gradient(circle, rgba(37,37,40,0.8435749299719888) 57%, rgba(12,12,16,0.3561799719887955) 100%);',
                }
          }
        >
          <ItemCardPublicSale
            title="Mark Your Calendar"
            desc="Get ready to participate in ETR IDO"
            image="/images/saleToken/calendar.png"
          />
          <ItemCardPublicSale
            title="Enable ETH"
            desc="Connect your wallet and approve the contract to use your ETH"
            image="/images/saleToken/enable-eth.png"
          />
          <ItemCardPublicSale
            title="Commit ETH"
            desc="Enter the number of ETH you intend to commit in the sale"
            image="/images/saleToken/commit-eth.png"
          />
        </Grid>
        <Grid
          templateColumns={{
            base: 'repeat(1, 1fr)',
            sm: 'repeat(1, 1fr)',
            md: 'auto auto',
            lg: 'auto auto',
          }}
          alignItems={'stretch'}
          justifyItems={{ base: 'start', sm: 'start', md: 'start', lg: 'center' }}
          justifyContent={'center'}
        >
          <ItemCardPublicSale
            title="Claim Your Tokens"
            desc="Claim your ETR tokens and unused ETH after the sale ended"
            image="/images/saleToken/claim-token.png"
          />
          <ItemCardPublicSale
            title="Vesting"
            desc="Each round comes with different vesting schedule. Come back to claim ETR when tokens get unlocked."
            image="/images/saleToken/vesting.png"
          />
        </Grid>
      </Box>
      <Box
        bgImage="url('/images/saleToken/bg-footer.png')"
        bgRepeat="no-repeat"
        bgPosition={'100% 57%'}
        bgSize={'cover'}
        ref={faqRef}
      >
        <Box margin={{ base: '30px 12px 0px', sm: '30px 12px 0px', md: '160px 20px 0px', lg: '160px 240px 0px' }}>
          <Box
            position="absolute"
            bottom={'-200px'}
            left={'-165px'}
            zIndex={1}
            display={{ base: 'none', sm: 'none', md: 'block', lg: 'block' }}
          >
            <Image src="/images/saleToken/logo-token.png" alt="landingpage" width={'750px'} height={'750px'} />
          </Box>
          <Text
            fontSize={{ base: '28px', md: '56px' }}
            textColor={'white'}
            lineHeight={'67px'}
            fontWeight={600}
            textAlign={'center'}
            marginBottom={'80px'}
          >
            FAQ
          </Text>
          <Box maxW={'720px'} margin={'0 auto'} position={'relative'} zIndex={2}>
            <Accordion>
              {dataFAQ.map((item, idx) => (
                <AccordionCustoms key={idx} title={item.title} desc={item.desc} />
              ))}
            </Accordion>
          </Box>
        </Box>
        <FooterLadingPage />
      </Box>
    </Flex>
  );
};
