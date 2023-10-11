import { Box, Flex, Grid } from '@chakra-ui/react';
import { Header } from '@/components/layout/Header';
import NavBar from '@/components/layout/NavBar';

export default function DashBoardLayout({ children }: { children: React.ReactNode }) {
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
      <Box
        display={'flex'}
        alignItems={'flex-start'}
        justifyContent={'flex-start'}
        flexDirection={['column-reverse', 'column-reverse', 'row', 'row']}
      >
        <NavBar />
        {children}
      </Box>
    </Flex>
  );
}
