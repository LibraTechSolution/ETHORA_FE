'use client';

import { Box, Flex, Text, Image } from '@chakra-ui/react';
import Link from 'next/link';

const FooterLadingPage = () => {
  return (
      <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={'24px'} margin={'80px 0 40px'}>
        <Link href="https://x.com/ethora_" className="z-10 flex items-center gap-1 text-sm">
          <Image alt="ethora" src="/images/icons/twitter.svg" w="24px" h="24p" />
          <Text as={'span'} display={{ base: 'none', sm: 'none', md: 'inline-block', lg: 'inline-block' }}>
            Twitter
          </Text>
        </Link>
        <Link href="https://discord.com/invite/ethora" className="z-10  flex items-center gap-1 text-sm">
          <Image alt="ethora" src="/images/icons/discord.svg" w="24p" h="24p" />
          <Text as={'span'} display={{ base: 'none', sm: 'none', md: 'inline-block', lg: 'inline-block' }}>
            Discord
          </Text>
        </Link>
        <Link href="https://medium.com/@ethora" className="z-10  flex items-center gap-1 text-sm">
          <Image alt="ethora" src="/images/icons/medium.svg" w="24p" h="24p" />
          <Text as={'span'} display={{ base: 'none', sm: 'none', md: 'inline-block', lg: 'inline-block' }}>
            Medium
          </Text>
        </Link>
        {/* <Link href="/" className="z-10 flex items-center gap-1 text-sm">
          <Image alt="ethora" src="/images/icons/instagram.svg" w="24p" h="24p" />
          <Text as={'span'} display={{ base: 'none', sm: 'none', md: 'inline-block', lg: 'inline-block' }}>
            Instagram
          </Text>
        </Link> */}
      </Box>
  );
};

export default FooterLadingPage;
