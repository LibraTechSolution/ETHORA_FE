import { appConfig } from '@/config';
import ETR_ABI from '@/config/abi/ETR_ABI';
import RewardRouterV2_ABI from '@/config/abi/RewardRouterV2_ABI';
import { useAllowance, useBalanceOf } from '@/hooks/useContractRead';
import { addComma } from '@/utils/number';
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
import { prepareWriteContract, waitForTransaction, writeContract } from '@wagmi/core';
import BigNumber from 'bignumber.js';
import { useFormik } from 'formik';
import { useContext, useEffect, useState } from 'react';
import { formatUnits, parseUnits } from 'viem';
import { useAccount, useContractRead, useContractWrite } from 'wagmi';
import * as Yup from 'yup';
import { EarnContext } from '..';
import ESETR_ABI from '@/config/abi/ESETR_ABI';

const StakeModalEsETR = ({ isOpen, onDismiss }: { isOpen: boolean; onDismiss: () => void }) => {
  const { address } = useAccount();
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [loadingApproved, setLoadingApproved] = useState<boolean>(false);
  const [loadingStake, setLoadingStake] = useState<boolean>(false);
  const validNumber = new RegExp(/^\d*\.?\d{0,6}$/);
  const { onFetchData } = useContext(EarnContext);

  const { data: getAllowance } = useContractRead({
    address: appConfig.ESETR_SC as `0x${string}`,
    abi: ESETR_ABI,
    functionName: 'allowance',
    args: [address as `0x${string}`, appConfig.SETR_SC as `0x${string}`],
    enabled: !!(address && appConfig.SETR_SC),
  });

  const balance = useBalanceOf(appConfig.ESETR_SC as `0x${string}`);

  const validationSchema = Yup.object({
    amount: Yup.string()
      .required('The number is required!')
      .test('Is positive?', 'The number must be greater than 0!', (value) => +value > 0)
      .test('Greater amount?', 'Not enough funds!', (value) => +value < +formatUnits(balance as bigint, 18)),
  });

  const formik = useFormik({
    initialValues: {
      amount: '',
    },
    onSubmit: async (values) => {
      onStake(values.amount);
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
        args: [appConfig.SETR_SC as `0x${string}`, BigInt(2 ** 256 / 1.1)],
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

  const onStake = async (amount: string) => {
    const amoutBigint = BigInt(+amount * 10 ** 18);

    try {
      setLoadingStake(true);
      const configStake = await prepareWriteContract({
        address: appConfig.REWARD_ROUTER_V2_SC as `0x${string}`,
        abi: RewardRouterV2_ABI,
        functionName: 'stakeEsBfr',
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
          <ModalHeader>Stake esETR</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form>
              <VStack spacing={4} align="flex-start">
                <FormControl>
                  <FormLabel htmlFor="amount" fontWeight={400} fontSize={'14px'}>
                    <Flex display={'flex'} justifyContent={'space-between'} width={'100%'}>
                      <Text as="span" fontSize={'12px'} color="#9E9E9F">
                        Stake
                      </Text>{' '}
                      <Text as="span" fontSize={'14px'}>
                        Max: {balance !== undefined ? addComma(formatUnits(balance as bigint, 18), 2) : '---'} esETR
                      </Text>
                    </Flex>
                  </FormLabel>
                  <InputGroup>
                    <Input
                      id="amount"
                      placeholder="Enter amount"
                      paddingRight={'125px'}
                      fontSize={'14px'}
                      border={'1px solid #6D6D70'}
                      {...formik.getFieldProps('amount')}
                      onChange={(e) => {
                        if (validNumber.test(e.target.value)) {
                          formik.handleChange(e);
                        } else {
                          console.log('field value change');
                          return;
                        }
                      }}
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
                        onClick={() => {
                          if (balance) {
                            formik.setFieldValue('amount', Number(balance) / 10 ** 18);
                          }
                        }}
                      >
                        Max
                      </Button>
                      |
                      <Text marginLeft={'4px'} fontSize={'14px'} fontWeight={400}>
                        USDC
                      </Text>
                    </InputRightElement>
                  </InputGroup>
                  {formik.errors.amount && formik.touched.amount && (
                    <Text color="red" marginTop={'4px'}>
                      {formik.errors.amount}
                    </Text>
                  )}
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
              Stake
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default StakeModalEsETR;