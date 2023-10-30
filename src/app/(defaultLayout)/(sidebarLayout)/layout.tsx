'use client';
import { Flex, Box } from '@chakra-ui/react';
import NavBar from '@/components/layout/NavBar';

export default function SidebarLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  // const [isMobile] = useMediaQuery('(max-width: 992px)');
  return (
    <Flex
      color="white"
      marginX={'-20px'}
      height={'100%'}
      flex={1}
      bgImage="url('/images/profile/bg-item.png')"
      bgRepeat="no-repeat"
      bgPosition="top -50px left -120px"
      paddingBottom={{ base: '70px', lg: '0' }}
      // position={isMobile ? 'relative' : 'static'}
    >
      <NavBar />
      <Box flex={1} paddingX={{ base: '12px', lg: '80px' }}>
        {children}
      </Box>
    </Flex>
  );
}
