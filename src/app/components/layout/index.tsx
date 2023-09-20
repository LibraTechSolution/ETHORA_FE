'use client';

import { Flex, FlexProps } from '@chakra-ui/react';

import Footer from './Footer';
import { Header } from './Header';

type Props = React.PropsWithChildren &
  FlexProps & {
    showBg?: boolean;
  };

export const DefaultLayout = ({ children, showBg, ...props }: Props) => {
  return (
    <Flex
      direction="column"
      flex="1"
      minH="100vh"
      color="black"
      pos="relative"
      lineHeight={1.4}
      fontWeight={700}
      overflow="hidden"
      {...props}
    >
      <Header />
      <Flex as="main" role="main" direction="column" flex="1" alignItems="stretch" zIndex={10}>
        {children}
      </Flex>
      <Footer />
    </Flex>
  );
};
