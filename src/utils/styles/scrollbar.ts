import { css } from '@chakra-ui/react';

export const scrollbarStyle = css({
  '&::-webkit-scrollbar': {
    width: '6px',
    height: '6px',
  },
  // '&::-webkit-scrollbar-track': {
  //   border: '1px dashed rgba(255, 255, 255, 0.15)',
  // },
  '&::-webkit-scrollbar-thumb': {
    background: 'white',
  },
  // '&::-webkit-scrollbar-button': {
  //   backgroundSize: '10px 10px',
  //   backgroundRepeat: 'no-repeat',
  //   backgroundPosition: 'center center',
  //   height: '16px',
  //   width: '1em',
  // },
  // '&::-webkit-scrollbar-button:start:decrement': {
  //   backgroundImage: `url(/icons/arrow-up.svg)`,
  // },
  // '&::-webkit-scrollbar-button:end:increment': {
  //   backgroundImage: `url(/icons/arrow-down.svg)`,
  // },
});
