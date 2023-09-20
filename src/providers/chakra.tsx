'use client';

import { Bangers, Nunito } from 'next/font/google';

import { ChakraProvider as ChakraBaseProvider, ChakraProviderProps, extendTheme } from '@chakra-ui/react';

const nunito = Nunito({
  style: ['italic', 'normal'],
  subsets: ['latin-ext'],
  weight: ['400', '700', '900'],
  display: 'swap',
  variable: '--font-nunito',
});

const bangers = Bangers({
  // style: 'normal',
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-bangers',
});

const colorBlack = 'black';

const customTheme = extendTheme({
  textStyles: {
    shadowBlack: {
      textShadow: `2px 0 ${colorBlack}, -2px 0 ${colorBlack}, 0 2px ${colorBlack}, 0 -2px ${colorBlack}, 1px 1px ${colorBlack}, -1px -1px ${colorBlack}, 1px -1px ${colorBlack}, -1px 1px ${colorBlack}`,
    },
  },
  fonts: {
    heading: nunito.style.fontFamily,
    body: nunito.style.fontFamily,
    nunito: nunito.style.fontFamily,
    bangers: bangers.style.fontFamily,
  },
  colors: {},
});

const chakraProps: ChakraProviderProps = {
  theme: customTheme,
};

function ChakraProvider({ children }: React.PropsWithChildren) {
  return <ChakraBaseProvider {...chakraProps}>{children}</ChakraBaseProvider>;
}

export default ChakraProvider;
