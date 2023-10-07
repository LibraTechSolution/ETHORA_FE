'use client';

import { Header } from '@/components/layout/Header';
import { Flex, FlexProps } from '@chakra-ui/react';

type Props = React.PropsWithChildren &
  FlexProps & {
    showBg?: boolean;
  };

  export default function LandingPageLayout({
    children, // will be a page or nested layout
  }: {
    children: React.ReactNode
  }) {

  return (
    <Flex
      direction="column"
      flex="1"
      minH="100vh"
      color="#9E9E9F"
      background="#0C0C10"
      pos="relative"
      fontSize={'14px'}
      lineHeight={'22.4px'}
      fontWeight={400}
      overflow="hidden"
    >
      <Header />
      {children}
    </Flex>
  );
}
