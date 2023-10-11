import { Box } from '@chakra-ui/react';
import { relative } from 'path';

const CardEarn = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      p={'20px 20px 80px 20px'}
      color="white"
      flex={1}
      gap={'20px'}
      border={'1px solid #3D3D40'}
      background="rgba(28, 28, 30, 0.50)"
      boxShadow={'0px 4px 20px 0px rgba(0, 0, 0, 0.30)'}
      backdropFilter={'blur(7px)'}
      borderRadius={'20px'}
      height={'100%'}
      position={'relative'}
    >
      {children}
    </Box>
  );
};
export default CardEarn;
