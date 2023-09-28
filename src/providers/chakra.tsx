'use client';

import { Bangers, Nunito, Poppins } from 'next/font/google';

import { ChakraProvider as ChakraBaseProvider, ChakraProviderProps, extendTheme } from '@chakra-ui/react';

// const nunito = Nunito({
//   style: ['italic', 'normal'],
//   subsets: ['latin-ext'],
//   weight: ['400', '700', '900'],
//   display: 'swap',
//   variable: '--font-nunito',
// });

// const bangers = Bangers({
//   // style: 'normal',
//   subsets: ['latin'],
//   weight: '400',
//   display: 'swap',
//   variable: '--font-bangers',
// });

const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

const colorBlack = 'black';

const customTheme = extendTheme({
  textStyles: {
    shadowBlack: {
      textShadow: `2px 0 ${colorBlack}, -2px 0 ${colorBlack}, 0 2px ${colorBlack}, 0 -2px ${colorBlack}, 1px 1px ${colorBlack}, -1px -1px ${colorBlack}, 1px -1px ${colorBlack}, -1px 1px ${colorBlack}`,
    },
  },
  fonts: {
    heading: poppins.style.fontFamily,
    body: poppins.style.fontFamily,
    poppins: poppins.style.fontFamily,
    // bangers: bangers.style.fontFamily,
  },
  colors: {
    primary: {
      100: '#DEDCFD',
      300: '#BDB9FB',
      400: '#9B95F8',
      500: '#6052FB',
      600: '#9B95F8',
      700: '#7A72F6',
      900: '#594FF4',
    },
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
    '7xl': '4.5rem',
    '8xl': '6rem',
    '9xl': '8rem',
  },
  fontWeights: {
    hairline: 100,
    thin: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
  lineHeights: {
    normal: 'normal',
    none: 1,
    shorter: 1.25,
    short: 1.375,
    base: 1.5,
    tall: 1.625,
    taller: '2',
    '3': '.75rem',
    '4': '1rem',
    '5': '1.25rem',
    '6': '1.5rem',
    '7': '1.75rem',
    '8': '2rem',
    '9': '2.25rem',
    '10': '2.5rem',
  },
  letterSpacings: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
});

const chakraProps: ChakraProviderProps = {
  theme: customTheme,
};

function ChakraProvider({ children }: React.PropsWithChildren) {
  return <ChakraBaseProvider {...chakraProps}>{children}</ChakraBaseProvider>;
}

export default ChakraProvider;
