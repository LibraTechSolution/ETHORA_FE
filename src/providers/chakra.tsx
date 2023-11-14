'use client';

import { Bangers, Nunito, Poppins } from 'next/font/google';

import {
  ChakraProvider as ChakraBaseProvider,
  ChakraProviderProps,
  defineStyleConfig,
  extendTheme,
} from '@chakra-ui/react';

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

export const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

const colorBlack = 'black';

const Button = defineStyleConfig({
  // The styles all button have in common
  baseStyle: {
    // fontWeight: 'bold',
    // textTransform: 'uppercase',
    borderRadius: '0.625rem', // <-- border radius is same for all variants and sizes
  },
  // Two sizes: sm and md
  sizes: {
    sm: {
      fontSize: 'sm',
      px: 4, // <-- px is short for paddingLeft and paddingRight
      py: 3, // <-- py is short for paddingTop and paddingBottom
    },
    md: {
      fontSize: 'md',
      px: 6, // <-- these values are tokens from the design system
      py: 4, // <-- these values are tokens from the design system
    },
  },
  // Two variants: outline and solid
  variants: {
    outline: {
      border: '2px solid',
      borderColor: 'primary.500',
      color: 'primary.500',
      _hover: {
        borderColor: 'primary.400',
        color: 'primary.400',
      },
      _disabled: {
        opacity: 0.5,
      },
    },
    solid: {
      bg: 'primary.500',
      color: 'white',
      _hover: {
        backgroundColor: 'primary.400',
        color: 'white',
      },
      _disabled: {
        bg: '#3D3D40',
        color: '#6D6D70',
        pointerEvents: 'none',
      },
    },
  },
  // The default size and variant values
  // defaultProps: {
  //   size: 'md',
  //   variant: 'solid',
  // },
});

const Checkbox = defineStyleConfig({
  // parts: ['control'],
  baseStyle: {
    label: {
      _disabled: {
        color: 'white',
        opacity: 1,
      },
    },
    control: {
      _checked: {
        _disabled: {
          bg: '#3D3D40',
          borderColor: '#3D3D40',
          // color: 'white',
        },
      },
    },
  },
});

const customTheme = extendTheme({
  breakpoints: {
    base: '0em', // 0px
    sm: '30em', // ~480px. em is a relative unit and is dependant on the font-size.
    md: '48em', // ~768px
    lg: '62em', // ~992px
    xl: '80em', // ~1280px
    '1.5xl': '82em', // ~1296px
    '2xl': '96em', // ~1536px
    '3xl': '105rem', // ~1680px
  },
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
      100: '#D2D8FC',
      200: '#A5B2F9',
      300: '#788BF6',
      400: '#4B65F3',
      500: '#1E3EF0',
      600: '#1E3EF0',
      700: '#1E3EF0',
      900: '#1E3EF0',
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
  components: {
    Button,
    Checkbox,
  },
});

const chakraProps: ChakraProviderProps = {
  theme: customTheme,
};

function ChakraProvider({ children }: React.PropsWithChildren) {
  return <ChakraBaseProvider {...chakraProps}>{children}</ChakraBaseProvider>;
}

export default ChakraProvider;
