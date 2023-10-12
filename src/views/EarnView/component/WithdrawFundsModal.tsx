import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Checkbox,
  InputGroup,
  InputRightElement,
  Flex,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import { useEffect } from 'react';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  pay: Yup.string().required(),
  rememberMe: Yup.boolean().equals([true]),
});

const WithdrawFundsModal = ({ isOpen, onDismiss }: { isOpen: boolean; onDismiss: () => void }) => {
  // const { isOpen, onOpen, onClose } = useDisclosure();

  const formik = useFormik({
    initialValues: {
      pay: '',
      rememberMe: false,
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
          <ModalHeader>Sell ELP (WithdrawFundsModal)</ModalHeader>
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
                  <InputGroup>
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
                </FormControl>
                <Flex display={'flex'} flexDirection={'column'} alignItems={'flex-end'} width={'100%'}>
                  <Text as="span" fontSize={'12px'} color="#9E9E9F">
                    Receive
                  </Text>{' '}
                  <Text as="span" fontSize={'14px'} color={'#1ED768'}>
                    0.00 ELP
                  </Text>
                </Flex>
                <Checkbox
                  id="rememberMe"
                  // name="rememberMe"
                  {...formik.getFieldProps('rememberMe')}
                  colorScheme="primary"
                  fontWeight={400}
                  fontSize={'14px'}
                >
                  <Text as="span" fontSize={'14px'}>
                    {' '}
                    I have read how the USDC vault works and am aware of risk associated with being a liquidity provider
                  </Text>
                </Checkbox>
              </VStack>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="primary" onClick={() => formik.handleSubmit()} width={'100%'}>
              Withdraw Funds
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default WithdrawFundsModal;
