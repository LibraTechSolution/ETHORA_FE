import { Box, Image, Text } from '@chakra-ui/react';

interface ICardEthora {
  image: string;
  alt: string;
  title: string;
  desc: string;
}
const CardEthora = ({ image, title, desc, alt }: ICardEthora) => {
  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      gap={'35px'}
      borderLeft={'1px'}
      borderColor={'#252528'}
      padding={'40px 0'}
      // width={'624px'}
    >
      <Box padding={'0 40px'}>
        <Image alt={alt} src={image} w={'50px'} h={'50px'} objectFit="cover" />
      </Box>

      <Text
        as="h3"
        fontSize={'2xl'}
        textColor={'white'}
        borderLeft={'2px'}
        borderColor={'#38383A'}
        padding={'5px 0px 5px 40px'}
        lineHeight={1.2}
      >
        {title}
      </Text>
      <Text padding={'0 115px 0 40px'} as="span" fontSize={'xs'} textColor={'#9E9E9F'}>
        {desc}
      </Text>
    </Box>
  );
};
export default CardEthora;
