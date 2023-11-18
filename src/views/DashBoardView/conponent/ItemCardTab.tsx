import { Box, Text, Tooltip } from '@chakra-ui/react';

interface IItemCardTab {
  title: string;
  value: string;
  tooltip: string;
}
const ItemCardTab = ({ value, title, tooltip }: IItemCardTab) => {
  return (
    <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} gap={'20px'}>
      <Text as="span" fontSize={'xs'} textColor={'#9E9E9F'}>
        {title}
      </Text>

      <Tooltip
        hasArrow
        label={
          <Box p={1} color="white">
            {tooltip}
          </Box>
        }
        color="white"
        placement="top"
        bg="#050506"
      >
        <Text fontSize="xs" textColor={'white'} fontWeight={600} textAlign={'right'}>
          {value}
        </Text>
      </Tooltip>
    </Box>
  );
};
export default ItemCardTab;
