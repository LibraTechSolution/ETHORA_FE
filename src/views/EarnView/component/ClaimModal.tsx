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

// const validationSchema = Yup.object({
//   pay: Yup.string().required(),
//   rememberMe: Yup.boolean().equals([true]),
// });

const ClaimModal = ({ isOpen, onDismiss }: { isOpen: boolean; onDismiss: () => void }) => {
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
    // validationSchema: validationSchema,
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
          <ModalHeader>Claim Rewards</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form>
              <VStack spacing={4} align="flex-start">
                <Checkbox
                  id="etr"
                  // name="rememberMe"
                  {...formik.getFieldProps('rememberMe')}
                  colorScheme="primary"
                  fontWeight={400}
                  fontSize={'14px'}
                >
                  <Text as="span" fontSize={'14px'}>
                    Claim ETR Rewards
                  </Text>
                </Checkbox>
                <Checkbox
                  id="esetr"
                  // name="rememberMe"
                  {...formik.getFieldProps('esetr')}
                  colorScheme="primary"
                  fontWeight={400}
                  fontSize={'14px'}
                >
                  <Text as="span" fontSize={'14px'}>
                    Claim esETR Rewards
                  </Text>
                </Checkbox>
                <Checkbox
                  id="usdc"
                  // name="rememberMe"
                  {...formik.getFieldProps('usdc')}
                  colorScheme="primary"
                  fontWeight={400}
                  fontSize={'14px'}
                  disabled
                  defaultChecked
                >
                  <Text as="span" fontSize={'14px'}>
                    Claim USDC Rewards
                  </Text>
                </Checkbox>
              </VStack>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="primary" onClick={() => formik.handleSubmit()} width={'100%'}>
              Claim
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default ClaimModal;
