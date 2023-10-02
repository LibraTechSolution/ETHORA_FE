'use client';

import { Flex, FlexProps } from '@chakra-ui/react';

type Props = React.PropsWithChildren &
  FlexProps & {
    showBg?: boolean;
  };

export default function SaleTokenLayout({ children, showBg, ...props }: Props) {
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
      {...props}
    >
      Sale token
      <Flex as="main" role="main" direction="column" flex="1" alignItems="stretch" zIndex={10} px={5}>
        {children}
      </Flex>
    </Flex>
  );
}
