import { Box, BoxProps, forwardRef } from '@chakra-ui/react';

export const Absolute = forwardRef<BoxProps, 'div'>((props, ref) => {
  return <Box ref={ref} pos="absolute" top={0} left={0} w="full" h="full" {...props} />;
});
