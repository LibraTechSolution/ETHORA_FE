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
import { useContext, useEffect, useState } from 'react';
import { useAccount, useContractRead } from 'wagmi';
import * as Yup from 'yup';
import { EarnContext } from '..';
import { appConfig } from '@/config';
import { prepareWriteContract, waitForTransaction, writeContract } from '@wagmi/core';
import BigNumber from 'bignumber.js';
import ESETR_ABI from '@/config/abi/ESETR_ABI';
import VETR_ABI from '@/config/abi/VETR_ABI';

const validationSchema = Yup.object({
  amount: Yup.string().required(),
});

const DepositModalETRVault = ({ isOpen, onDismiss }: { isOpen: boolean; onDismiss: () => void }) => {
  const { address } = useAccount();
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [loadingApproved, setLoadingApproved] = useState<boolean>(false);
  const [loadingStake, setLoadingStake] = useState<boolean>(false);

  const { onFetchData } = useContext(EarnContext);

  const { data: getAllowance } = useContractRead({
    address: appConfig.ESETR_SC as `0x${string}`,
    abi: ESETR_ABI,
    functionName: 'allowance',
    args: [address as `0x${string}`, appConfig.SETR_SC as `0x${string}`],
    enabled: !!(address && appConfig.ESETR_SC),
  });

  const formik = useFormik({
    initialValues: {
      amount: '',
    },
    onSubmit: (values) => {
      onDeposit(values.amount)
    },
    validationSchema: validationSchema,
  });

  const onApprove = async () => {
    // if (!isApproved) {
    try {
      setLoadingApproved(true);
      const config = await prepareWriteContract({
        address: appConfig.ESETR_SC as `0x${string}`,
        abi: ESETR_ABI,
        functionName: 'approve',
        args: [appConfig.VETR_SC as `0x${string}`, BigInt(2 ** 256 / 1.1)],
      });

      const { hash } = await writeContract(config);
      const data = await waitForTransaction({
        hash,
      });
      console.log('data-hash', data);
      setLoadingApproved(false);
      setIsApproved(true);
    } catch (error) {
      console.log(error);
      setLoadingApproved(false);
      setIsApproved(false);
    }
    // }
  };

  const onDeposit = async (amount: string) => {
    const amoutBigint = BigInt(+amount * 10 ** 18);

    try {
      setLoadingStake(true);
      const configStake = await prepareWriteContract({
        address: appConfig.VETR_SC as `0x${string}`,
        abi: VETR_ABI,
        functionName: 'deposit',
        args: [amoutBigint],
      });

      const { hash } = await writeContract(configStake);
      const data = await waitForTransaction({
        hash,
      });
      console.log('dataStake', data);
      setLoadingStake(false);
      onFetchData();
      onDismiss();
    } catch (error) {
      setLoadingStake(false);
      console.log(error);
    }
  };

  useEffect(() => {
    console.log('formik', formik.errors);
  }, [formik.errors]);

  useEffect(() => {
    console.log(getAllowance);
    setIsApproved(getAllowance !== undefined && BigNumber(getAllowance.toString()).isGreaterThan(BigNumber(0)));
  }, [getAllowance]);

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
          <ModalHeader>ETR Vault</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form>
              <VStack spacing={4} align="flex-start">
                <FormControl>
                  <FormLabel htmlFor="pay" fontWeight={400} fontSize={'14px'}>
                    <Flex display={'flex'} justifyContent={'space-between'} width={'100%'}>
                      <Text as="span" fontSize={'12px'} color="#9E9E9F">
                        Deposit
                      </Text>{' '}
                      <Text as="span" fontSize={'14px'}>
                        Max: 0.00 esETR
                      </Text>
                    </Flex>
                  </FormLabel>
                  <InputGroup marginBottom={'14px'}>
                    <Input
                      id="amount"
                      // name="pay"
                      placeholder="Enter amount"
                      paddingRight={'125px'}
                      fontSize={'14px'}
                      border={'1px solid #6D6D70'}
                      {...formik.getFieldProps('amount')}
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
                  <FormLabel htmlFor="wallet" fontWeight={400} fontSize={'14px'}>
                    <Flex display={'flex'} justifyContent={'space-between'} width={'100%'}>
                      <Text as="span" fontSize={'12px'} color="#9E9E9F">
                        Wallet
                      </Text>{' '}
                      <Text as="span" fontSize={'14px'}>
                        0.00 esETR
                      </Text>
                    </Flex>
                  </FormLabel>
                  <FormLabel htmlFor="capacity" fontWeight={400} fontSize={'14px'}>
                    <Flex display={'flex'} justifyContent={'space-between'} width={'100%'}>
                      <Text as="span" fontSize={'12px'} color="#9E9E9F">
                        Vault Capacity
                      </Text>{' '}
                      <Text as="span" fontSize={'14px'}>
                        0.00 /0.00
                      </Text>
                    </Flex>
                  </FormLabel>
                  <FormLabel htmlFor="reserveAmount" fontWeight={400} fontSize={'14px'}>
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
              onClick={onApprove}
              width={'100%'}
              isDisabled={isApproved && !loadingApproved}
              isLoading={loadingApproved}
            >
              Approve
            </Button>
            <Button
              colorScheme="primary"
              onClick={() => formik.handleSubmit()}
              width={'100%'}
              isDisabled={!isApproved}
              isLoading={loadingStake}
            >
              Deposit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default DepositModalETRVault;
