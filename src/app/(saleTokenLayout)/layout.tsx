import { Flex } from '@chakra-ui/react';
import { Header } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function SaleTokenLayout({ children }: { children: React.ReactNode }) {
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
