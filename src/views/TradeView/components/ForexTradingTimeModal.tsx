import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Flex,
  Text,
} from '@chakra-ui/react';

interface PropsType {
  isOpen: boolean;
  onClose: () => void;
}

const ForexTradingTimeModal = (props: PropsType) => {
  const { isOpen, onClose } = props;

  return (
    <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxWidth="540px" background="#0f0f11" border="1px solid #242428" rounded="20px">
        <ModalHeader
          color="#fff"
          paddingX="32px"
          paddingTop="22px"
          paddingBottom="0"
          fontSize="24px"
          fontWeight="600"
          display="flex"
        >
          Forex Trading Timings
        </ModalHeader>
        <ModalCloseButton color="#fff" top="22px" right="32px" />
        <ModalBody paddingX="32px" paddingY="20px">
          <Flex justifyContent="space-between" marginBottom={'10px'}>
            <Text textColor="#9E9E9F" fontSize="12px">
              Monday
            </Text>
            <Text textColor="#FFFFFF" fontWeight="500">
              Opened from 06:00AM - 4:00PM UTC
            </Text>
          </Flex>
          <Flex justifyContent="space-between" marginBottom={'10px'}>
            <Text textColor="#9E9E9F" fontSize="12px">
              Tuesday
            </Text>
            <Text textColor="#FFFFFF" fontWeight="500">
              Opened from 06:00AM - 4:00PM UTC
            </Text>
          </Flex>
          <Flex justifyContent="space-between" marginBottom={'10px'}>
            <Text textColor="#9E9E9F" fontSize="12px">
              Wednesday
            </Text>
            <Text textColor="#FFFFFF" fontWeight="500">
              Opened from 06:00AM - 4:00PM UTC
            </Text>
          </Flex>
          <Flex justifyContent="space-between" marginBottom={'10px'}>
            <Text textColor="#9E9E9F" fontSize="12px">
              Thursday
            </Text>
            <Text textColor="#FFFFFF" fontWeight="500">
              Opened from 06:00AM - 4:00PM UTC
            </Text>
          </Flex>
          <Flex justifyContent="space-between" marginBottom={'10px'}>
            <Text textColor="#9E9E9F" fontSize="12px">
              Friday
            </Text>
            <Text textColor="#FFFFFF" fontWeight="500">
              Opened from 06:00AM - 4:00PM UTC
            </Text>
          </Flex>
          <Flex justifyContent="space-between" marginBottom={'10px'}>
            <Text textColor="#9E9E9F" fontSize="12px">
              Saturday
            </Text>
            <Text textColor="#FFFFFF" fontWeight="500">
              Close all day
            </Text>
          </Flex>
          <Flex justifyContent="space-between" marginBottom={'10px'}>
            <Text textColor="#9E9E9F" fontSize="12px">
              Sunday
            </Text>
            <Text textColor="#FFFFFF" fontWeight="500">
              Close all day
            </Text>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ForexTradingTimeModal;
