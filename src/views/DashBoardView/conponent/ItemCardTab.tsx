import { Box, Text } from '@chakra-ui/react';

interface IItemCardTab {
  title: string;
  value: string;
}
const ItemCardTab = ({ value, title }: IItemCardTab) => {
  return (
    <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} gap={'20px'}>
      <Text as="span" fontSize={'xs'} textColor={'#9E9E9F'}>
        {title}
      </Text>
      <Text fontSize="xs" textColor={'white'} fontWeight={600} textAlign={'right'}>
        {value}
      </Text>
    </Box>
  );
};
export default ItemCardTab;
