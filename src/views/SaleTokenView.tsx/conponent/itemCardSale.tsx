import { Box, Text } from '@chakra-ui/react';

interface IItemCardSale {
  title: string;
  value: string;
}
const ItemCardSale = ({ value, title }: IItemCardSale) => {
  return (
    <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
      <Text as="span" fontSize={'xs'} textColor={'#9E9E9F'}>
        {title}
      </Text>
      <Text fontSize="xs" textColor={'white'} fontWeight={600}>
        {value}
      </Text>
    </Box>
  );
};
export default ItemCardSale;
