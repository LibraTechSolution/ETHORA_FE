'use client';

import { chakra, ChakraProps, forwardRef } from '@chakra-ui/react';

export type ButtonProps = ChakraProps;

export const Button = forwardRef<ChakraProps, 'button'>((props, ref) => {
  return (
    <chakra.button
      ref={ref}
      _hover={{
        opacity: 0.9,
      }}
      _disabled={{
        opacity: 0.8,
        cursor: 'not-allowed',
      }}
      _active={{
        opacity: 0.8,
      }}
      {...props}
    />
  );
});
