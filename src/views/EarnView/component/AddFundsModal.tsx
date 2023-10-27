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
import ESETR_ABI from '@/config/abi/ESETR_ABI';
import { prepareWriteContract, waitForTransaction, writeContract } from '@wagmi/core';
import RewardRouterV2_ABI from '@/config/abi/RewardRouterV2_ABI';
import BigNumber from 'bignumber.js';
import { useBalanceOf } from '@/hooks/useContractRead';
import VETR_ABI from '@/config/abi/VETR_ABI';
import USDC_ABI from '@/config/abi/USDC_ABI';
import { addComma } from '@/utils/number';
import { formatUnits } from 'viem';

// const validationSchema = Yup.object({
//   amount: Yup.string().required(),
//   rememberMe: Yup.boolean().equals([true]),
// });

const AddFundsModal = ({
  isOpen,
  exchangeRate,
  onDismiss,
}: {
  isOpen: boolean;
  exchangeRate: string;
  onDismiss: () => void;
}) => {
  // const { isOpen, onOpen, onClose } = useDisclosure();
  const { address } = useAccount();
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [loadingApproved, setLoadingApproved] = useState<boolean>(false);
  const [loadingDeposit, setLoadingDeposit] = useState<boolean>(false);
  const validNumber = new RegExp(/^\d*\.?\d{0,6}$/);
  const { onFetchData } = useContext(EarnContext);

  const { data: getAllowance } = useContractRead({
    address: appConfig.USDC_SC as `0x${string}`,
    abi: USDC_ABI,
    functionName: 'allowance',
    args: [address as `0x${string}`, appConfig.BLP_SC as `0x${string}`],
    enabled: !!(address && appConfig.USDC_SC),
  });

  const balance = useBalanceOf(appConfig.USDC_SC as `0x${string}`);

  const validationSchema = Yup.object({
    amount: Yup.string()
      .required('The number is required!')
      .test('Is positive?', 'The number must be greater than 0!', (value) => +value > 0)
      .test('Greater amount?', 'Not enough funds!', (value) => +value < +formatUnits(balance as bigint, 6)),
      rememberMe: Yup.boolean().equals([true]),
  });

  const formik = useFormik({
    initialValues: {
      amount: '',
      rememberMe: false,
    },
    onSubmit: (values) => {
      console.log('onSubmit');
      onAddFund(values.amount);
    },
    validationSchema: validationSchema,
  });

  const onApprove = async () => {
    // if (!isApproved) {
    try {
      setLoadingApproved(true);

      const config = await prepareWriteContract({
        address: appConfig.USDC_SC as `0x${string}`,
        abi: USDC_ABI,
        functionName: 'approve',
        args: [appConfig.BLP_SC as `0x${string}`, BigInt(2 ** 256 / 1.1)],
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

  const onAddFund = async (amount: string) => {
    const amoutBigint = BigInt(+amount * 10 ** 6);
    try {
      setLoadingDeposit(true);
      const configStake = await prepareWriteContract({
        address: appConfig.REWARD_ROUTER_V2_SC as `0x${string}`,
        abi: RewardRouterV2_ABI,
        functionName: 'mintAndStakeBlp',
        args: [amoutBigint, BigInt(0)],
      });

      const { hash } = await writeContract(configStake);
      const data = await waitForTransaction({
        hash,
      });
      console.log('dataStake', data);
      setLoadingDeposit(false);
      onFetchData();
      onDismiss();
    } catch (error) {
      setLoadingDeposit(false);
      console.log(error);
    }
  };

  useEffect(() => {
    console.log('formik', formik.errors);
  }, [formik.errors]);

  useEffect(() => {
    console.log('getAllowance', getAllowance);
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
          <ModalHeader>Buy ELP</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form>
              <VStack spacing={4} align="flex-start">
                <FormControl>
                  <FormLabel htmlFor="pay" fontWeight={400} fontSize={'14px'}>
                    <Flex display={'flex'} justifyContent={'space-between'} width={'100%'}>
                      <Text as="span" fontSize={'12px'} color="#9E9E9F">
                        Pay
                      </Text>{' '}
                      <Text as="span" fontSize={'14px'}>
                        Balance: {balance !== undefined ? addComma(formatUnits(balance as bigint, 6), 2) : '---'} USDC
                      </Text>
                    </Flex>
                  </FormLabel>
                  <InputGroup>
                    <Input
                      id="amount"
                      // name="pay"
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
                            formik.setFieldValue('amount', Number(balance) / 10 ** 6);
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
                <Flex display={'flex'} flexDirection={'column'} alignItems={'flex-end'} width={'100%'}>
                  <Text as="span" fontSize={'12px'} color="#9E9E9F">
                    Receive
                  </Text>{' '}
                  <Text as="span" fontSize={'14px'} color={'#1ED768'}>
                    {addComma(+formik.values.amount / +exchangeRate, 2)} ELP
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
            <Button
              colorScheme="primary"
              mr={3}
              onClick={() => onApprove()}
              width={'100%'}
              isDisabled={(isApproved && !loadingApproved) || !formik.values.rememberMe}
              isLoading={loadingApproved}
            >
              Approve
            </Button>
            <Button
              colorScheme="primary"
              onClick={() => formik.handleSubmit()}
              width={'100%'}
              isDisabled={!isApproved || !formik.values.rememberMe}
              isLoading={loadingDeposit}
            >
              Add Funds
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default AddFundsModal;
