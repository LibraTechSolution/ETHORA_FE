import { Box, Text, Image } from '@chakra-ui/react';

interface IItemCardPublicSale {
  image: string;
  title: string;
  desc: string;
}
const ItemCardPublicSale = ({ desc, title, image }: IItemCardPublicSale) => {
  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      borderLeft={'1px'}
      borderColor={'#252528'}
      padding={'40px 0'}
      maxW={'416px'}
    >
      <Box padding={'0 40px'} marginBottom={'40px'}>
        <Image alt={title} src={image} w={'45px'} h={'50px'} />
      </Box>
      <Text
        as="h3"
        fontSize={'2xl'}
        fontWeight={600}
        textColor={'white'}
        borderLeft={'2px'}
        borderColor={'#38383A'}
        padding={'5px 0px 5px 40px'}
        lineHeight={1.2}
        marginBottom={'8px'}
      >
        {title}
      </Text>
      <Text padding={'0 40px 0 40px'} as="span" fontSize={16} textColor={'#9E9E9F'}>
        {desc}
      </Text>
    </Box>
  );
};
export default ItemCardPublicSale;
