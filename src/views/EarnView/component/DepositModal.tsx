import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Text,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Checkbox,
  InputGroup,
  InputRightElement,
  Box,
  Flex,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import { useEffect } from 'react';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  pay: Yup.string().required(),
});

const DepositModal = ({ isOpen, onDismiss }: { isOpen: boolean; onDismiss: () => void }) => {
  // const { isOpen, onOpen, onClose } = useDisclosure();

  const formik = useFormik({
    initialValues: {
      pay: '',
    },
    onSubmit: (values) => {
      console.log('onSubmit');
      alert(JSON.stringify(values, null, 2));
    },
    validationSchema: validationSchema,
  });

  useEffect(() => {
    console.log('formik', formik.errors);
  }, [formik.errors]);

  return (
    <>
      {/* <Button onClick={onOpen}>Open Modal</Button> */}
      <Modal isOpen={isOpen} onClose={onDismiss}>
        <ModalOverlay />
        <ModalContent
          background={'rgba(28, 28, 30, 0.50)'}
          border={'1px solid #242428'}
          borderRadius={'20px'}
          boxShadow={'0px 4px 20px 0px rgba(0, 0, 0, 0.30)'}
          backdropFilter={'blur(7px)'}
          color={'#ffffff'}
          fontWeight={400}
          fontSize={'14px'}
        >
          <ModalHeader>Stake esETR</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form>
              <VStack spacing={4} align="flex-start">
                <FormControl>
                  <FormLabel htmlFor="pay" fontWeight={400} fontSize={'14px'}>
                    <Flex display={'flex'} justifyContent={'space-between'} width={'100%'}>
                      <Text as="span" fontSize={'12px'} color="#9E9E9F">
                        Pay: $0.00
                      </Text>{' '}
                      <Text as="span" fontSize={'14px'}>
                        Balance: 0.00 USDC
                      </Text>
                    </Flex>
                  </FormLabel>
                  <InputGroup marginBottom={'14px'}>
                    <Input
                      id="pay"
                      // name="pay"
                      placeholder="Enter amount"
                      paddingRight={'125px'}
                      fontSize={'14px'}
                      border={'1px solid #6D6D70'}
                      {...formik.getFieldProps('pay')}
                    />
                    <InputRightElement width={'125px'}>
                      <Button
                        h="1.75rem"
                        size="sm"
                        marginRight={'4px'}
                        fontSize={'14px'}
                        background={'#0C0C10'}
                        color="#ffffff"
                        fontWeight={400}
                      >
                        Max
                      </Button>
                      |
                      <Text marginLeft={'4px'} fontSize={'14px'} fontWeight={400}>
                        USDC
                      </Text>
                    </InputRightElement>
                  </InputGroup>
                  <FormLabel htmlFor="pay" fontWeight={400} fontSize={'14px'}>
                    <Flex display={'flex'} justifyContent={'space-between'} width={'100%'}>
                      <Text as="span" fontSize={'12px'} color="#9E9E9F">
                        Wallet
                      </Text>{' '}
                      <Text as="span" fontSize={'14px'}>
                        0.00 esETR
                      </Text>
                    </Flex>
                  </FormLabel>
                  <FormLabel htmlFor="pay" fontWeight={400} fontSize={'14px'}>
                    <Flex display={'flex'} justifyContent={'space-between'} width={'100%'}>
                      <Text as="span" fontSize={'12px'} color="#9E9E9F">
                        Vault Capacity
                      </Text>{' '}
                      <Text as="span" fontSize={'14px'}>
                        0.00 /0.00
                      </Text>
                    </Flex>
                  </FormLabel>
                  <FormLabel htmlFor="pay" fontWeight={400} fontSize={'14px'}>
                    <Flex display={'flex'} justifyContent={'space-between'} width={'100%'}>
                      <Text as="span" fontSize={'12px'} color="#9E9E9F">
                        Reserve Amount
                      </Text>{' '}
                      <Text as="span" fontSize={'14px'}>
                        0.00 /0.00
                      </Text>
                    </Flex>
                  </FormLabel>
                </FormControl>
              </VStack>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="primary"
              mr={3}
              onClick={() => {
                console.log('Approve');
              }}
              width={'100%'}
            >
              Approve
            </Button>
            <Button colorScheme="primary" onClick={() => formik.handleSubmit()} width={'100%'}>
              Deposit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default DepositModal;
