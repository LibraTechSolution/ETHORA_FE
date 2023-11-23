import { appConfig } from '@/config';
import ETR_ABI from '@/config/abi/ETR_ABI';
import RewardRouterV2_ABI from '@/config/abi/RewardRouterV2_ABI';
import { useAllowance, useBalanceOf } from '@/hooks/useContractRead';
import { addComma, roundDown } from '@/utils/number';
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
  Tooltip,
  useToast,
  Link,
} from '@chakra-ui/react';
import { prepareWriteContract, waitForTransaction, writeContract } from '@wagmi/core';
import BigNumber from 'bignumber.js';
import { useFormik } from 'formik';
import { useContext, useEffect, useState } from 'react';
import {
  TransactionExecutionError,
  UserRejectedRequestError,
  formatUnits,
  parseUnits,
  BaseError,
  parseEther,
} from 'viem';
import {
  useAccount,
  useContractRead,
  useContractWrite,
  ConnectorNotFoundError,
  SwitchChainNotSupportedError,
  useConnect,
  useNetwork,
} from 'wagmi';
import * as Yup from 'yup';
import { EarnContext } from '..';
import { ToastLayout } from '@/components/ToastLayout';
import { Status } from '@/types/faucet.type';
import Currency from '@/components/Currency';

const StakeModalETR = ({ isOpen, onDismiss }: { isOpen: boolean; onDismiss: () => void }) => {
  const { address } = useAccount();
  const toast = useToast();
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [loadingApproved, setLoadingApproved] = useState<boolean>(false);
  const [loadingStake, setLoadingStake] = useState<boolean>(false);

  const { onFetchData } = useContext(EarnContext);

  const validNumber = new RegExp(/^\d*\.?\d{0,6}$/);

  const { data: getAllowance } = useContractRead({
    address: appConfig.ETR_SC as `0x${string}`,
    abi: ETR_ABI,
    functionName: 'allowance',
    args: [address as `0x${string}`, appConfig.SETR_SC as `0x${string}`],
    enabled: !!(address && appConfig.ETR_SC),
  });

  const balance = useBalanceOf(appConfig.ETR_SC as `0x${string}`);

  const validationSchema = Yup.object({
    amount: Yup.string()
      .required('Amount is required')
      .test('Is positive?', 'Entered amount must be greater than 0', (value) => +value > 0)
      .test('Greater amount?', 'Not enough funds!', (value) => +value <= +formatUnits(balance as bigint, 18)),
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
        address: appConfig.ETR_SC as `0x${string}`,
        abi: ETR_ABI,
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
      toast({
        position: 'top',
        render: ({ onClose }) => (
          <ToastLayout title="Successful transaction" status={Status.SUCCESSS} close={onClose}>
            <p className="text-[14px] font-medium text-white">{'Successful transaction'}</p>
            <Link href={`https://goerli.arbiscan.io/tx/${hash}`} isExternal color="#3396FF" fontSize={'12px'}>
              View on explorer
            </Link>
          </ToastLayout>
        ),
      });
    } catch (error: any) {
      console.log(error);
      setLoadingApproved(false);
      setIsApproved(false);
      let msgContent = '';
      if (error instanceof BaseError) {
        if (error.shortMessage.includes('User rejected the request.')) {
          msgContent = 'User rejected the request!';
        } else if (error.shortMessage.includes('the balance of the account')) {
          msgContent = 'Your account balance is insufficient for gas * gas price + value!';
        } else {
          msgContent = 'Something went wrong. Please try again later.';
        }
        toast({
          position: 'top',
          render: ({ onClose }) => (
            <ToastLayout
              // title="Approve account Unsuccessfully"
              content={msgContent}
              status={Status.ERROR}
              close={onClose}
            />
          ),
        });
      } else {
        toast({
          position: 'top',
          render: ({ onClose }) => (
            <ToastLayout
              // title="Approve account Unsuccessfully"
              content={'Something went wrong. Please try again later.'}
              status={Status.ERROR}
              close={onClose}
            />
          ),
        });
      }
    }
    // }
  };

  const onStake = async (amount: string) => {
    const amoutBigint = parseEther(BigNumber(amount).toFixed());

    try {
      setLoadingStake(true);
      const configStake = await prepareWriteContract({
        address: appConfig.REWARD_ROUTER_V2_SC as `0x${string}`,
        abi: RewardRouterV2_ABI,
        functionName: 'stakeEtr',
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
      toast({
        position: 'top',
        render: ({ onClose }) => (
          <ToastLayout title="Successful transaction" status={Status.SUCCESSS} close={onClose}>
            <p className="text-[14px] font-medium text-white">{'Successful transaction'}</p>
            <Link href={`https://goerli.arbiscan.io/tx/${hash}`} isExternal color="#3396FF" fontSize={'12px'}>
              View on explorer
            </Link>
          </ToastLayout>
        ),
      });
    } catch (error: any) {
      console.log(error);
      // let errString = '';
      // if (error instanceof ConnectorNotFoundError) {
      //   errString = error.message;
      // }
      // if (error instanceof SwitchChainNotSupportedError) {
      //   errString = error.message;
      // }
      // if (error instanceof UserRejectedRequestError) {
      //   errString = error.shortMessage;
      // }
      // if (error instanceof TransactionExecutionError) {
      //   errString = error.shortMessage;
      // }
      // console.log('errString', errString);
      let msgContent = '';
      if (error instanceof BaseError) {
        if (error.shortMessage.includes('User rejected the request.')) {
          msgContent = 'User rejected the request!';
        } else if (error.shortMessage.includes('the balance of the account')) {
          msgContent = 'Your account balance is insufficient for gas * gas price + value!';
        } else {
          msgContent = 'Something went wrong. Please try again later.';
        }
        toast({
          position: 'top',
          render: ({ onClose }) => (
            <ToastLayout
              // title="Approve account Unsuccessfully"
              content={msgContent}
              status={Status.ERROR}
              close={onClose}
            />
          ),
        });
      } else {
        toast({
          position: 'top',
          render: ({ onClose }) => (
            <ToastLayout
              // title="Approve account Unsuccessfully"
              content={'Something went wrong. Please try again later.'}
              status={Status.ERROR}
              close={onClose}
            />
          ),
        });
      }
      setLoadingStake(false);
      onDismiss();
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
          <ModalHeader fontSize={'24px'}>Stake ETR</ModalHeader>
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
                        Max:{' '}
                        <Currency
                          value={balance !== undefined ? BigNumber(formatUnits(balance as bigint, 18)).toFixed() : 0}
                          decimal={2}
                          unit="ETR"
                        />{' '}
                        ETR
                      </Text>
                    </Flex>
                  </FormLabel>
                  <InputGroup>
                    <Input
                      id="amount"
                      placeholder="0.0"
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
                        fontWeight={600}
                        boxShadow={'0px 0px 3px -1px rgba(196,196,196,0.5)'}
                        _hover={{
                          background: '#252528',
                        }}
                        onClick={() => {
                          if (balance !== undefined) {
                            formik.setFieldValue('amount', BigNumber(Number(balance) / 10 ** 18).toFixed(6, BigNumber.ROUND_DOWN));
                          }
                        }}
                      >
                        Max
                      </Button>
                      <Box as={'span'} color={'#38383A'}>
                        |
                      </Box>
                      <Text marginLeft={'4px'} fontSize={'14px'} fontWeight={400}>
                        ETR
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
export default StakeModalETR;
