import { Box, Image, Text, Button } from '@chakra-ui/react';

interface ICardDualToken {
  image: string;
  percent: string;
  title: string;
  desc: string;
  textBtnRight?: string;
  textBtnLeft?: string;
  textBtnCenter?: string;
  isButton?: boolean;
}
const CardDualToken = ({
  image,
  title,
  desc,
  percent,
  textBtnRight,
  textBtnLeft,
  textBtnCenter,
  isButton = false,
}: ICardDualToken) => {
  return (
    <Box
      boxShadow="1px 0.5px 0px 0px #38383A inset"
      border={'1px solid #38383A'}
      paddingY="40px"
      paddingX="32px"
      rounded="20px"
      width={{ base: 'auto', sm: 'auto', md: 'auto', lg: '506px' }}
      marginBottom={{ base: '0px', sm: '0px', md: '20px', lg: '20px' }}
      bgColor="rgba(28, 28, 30, 0.7)"
      display={'flex'}
      justifyContent={'space-around'}
      gap={'20px'}
      flexDirection={'column'}
    >
      <Box
        width={77}
        height={77}
        display={'flex'}
        alignItems={'center'}
        justifyContent={'center'}
        border={'1px solid #242428'}
        borderRadius={8}
        backgroundColor={'rgba(28, 28, 30, 0.5)'}
      >
        <Image src={image} alt={title} width={'55px'} height={'55px'} />
      </Box>
      <Text fontSize="20px" textColor={'white'} fontWeight={600}>
        {title}
      </Text>
      <Text as="span" fontSize={'16px'} textColor={'#9E9E9F'}>
        {desc}
      </Text>
      <Text as="span" fontSize={'16px'} textColor={'#9E9E9F'}>
        {percent}
      </Text>
      <Box display={'flex'} alignItems={'center'} gap={'20px'}>
        {isButton &&
          (textBtnCenter ? (
            <Button
              flex={1}
              borderColor="#0052FF"
              bgColor={'#0052FF'}
              borderRadius={'10px'}
              textColor="white"
              variant="outline"
              _hover={{ bg: 'transparent' }}
              padding={'8px 16px'}
            >
              {textBtnCenter}
            </Button>
          ) : (
            <>
              <Button
                flex={1}
                borderColor="#0052FF"
                bgColor={'#0052FF'}
                borderRadius={'10px'}
                textColor="white"
                variant="outline"
                _hover={{ bg: 'transparent' }}
                padding={'8px 16px'}
              >
                {textBtnLeft}
              </Button>
              <Button
                flex={1}
                borderColor="#0052FF"
                bgColor={'#0052FF'}
                borderRadius={'10px'}
                textColor="white"
                variant="outline"
                _hover={{ bg: 'transparent' }}
                padding={'8px 16px'}
              >
                {textBtnRight}
              </Button>
            </>
          ))}
      </Box>
    </Box>
  );
};
export default CardDualToken;
