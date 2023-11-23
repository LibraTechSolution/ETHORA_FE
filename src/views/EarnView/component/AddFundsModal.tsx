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
  useToast,
  Link,
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
import { addComma, roundDown } from '@/utils/number';
import { formatUnits, BaseError, parseUnits } from 'viem';
import { ToastLayout } from '@/components/ToastLayout';
import { Status } from '@/types/faucet.type';
import Currency from '@/components/Currency';

const AddFundsModal = ({
  isOpen,
  exchangeRate,
  getDataY,
  onDismiss,
}: {
  isOpen: boolean;
  exchangeRate: string;
  getDataY: BigNumber;
  onDismiss: () => void;
}) => {
  // const { isOpen, onOpen, onClose } = useDisclosure();
  const { address } = useAccount();
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [loadingApproved, setLoadingApproved] = useState<boolean>(false);
  const [loadingDeposit, setLoadingDeposit] = useState<boolean>(false);
  const validNumber = new RegExp(/^\d*\.?\d{0,6}$/);
  const { onFetchData } = useContext(EarnContext);
  const toast = useToast();

  const { data: getAllowance } = useContractRead({
    address: appConfig.USDC_SC as `0x${string}`,
    abi: USDC_ABI,
    functionName: 'allowance',
    args: [address as `0x${string}`, appConfig.BLP_SC as `0x${string}`],
    enabled: !!(address && appConfig.USDC_SC),
  });

  const balance = useBalanceOf(appConfig.USDC_SC as `0x${string}`);
  const balanceFixed = BigNumber(balance ? formatUnits(balance, 6) : 0).toFixed();
  const max = BigNumber.minimum(getDataY.toFixed(), balanceFixed).toFixed()

  const validationSchema = Yup.object({
    amount: Yup.string()
      .required('Amount is required')
      .test('Is positive?', 'Entered amount must be greater than 0', (value) => +value > 0)
      .test('Greater amount?', 'Not enough funds!', (value) => +value <= +formatUnits(balance as bigint, 6)),
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

  const onAddFund = async (amount: string) => {
    const amoutBigint = parseUnits(BigNumber(amount).toFixed(), 6);
    if (+amount > +max) {
      toast({
        position: 'top',
        render: ({ onClose }) => (
          <ToastLayout
            // title="Approve account Unsuccessfully"
            content={' Entered amount exceeds deposit limit of the pool.'}
            status={Status.ERROR}
            close={onClose}
          />
        ),
      });
      return;
    }
    try {
      setLoadingDeposit(true);
      const configStake = await prepareWriteContract({
        address: appConfig.REWARD_ROUTER_V2_SC as `0x${string}`,
        abi: RewardRouterV2_ABI,
        functionName: 'mintAndStakeElp',
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
    } catch (error) {
      console.log(error);
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
      setLoadingDeposit(false);
      onDismiss();
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
          <ModalHeader fontSize={'24px'}>Buy ELP</ModalHeader>
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
                        Balance:{' '}
                        <Currency
                          value={balance !== undefined ? BigNumber(formatUnits(balance as bigint, 6)).toFixed() : 0}
                          decimal={2}
                          unit="USDC"
                        />{' '}
                        USDC
                      </Text>
                    </Flex>
                  </FormLabel>
                  <InputGroup>
                    <Input
                      id="amount"
                      // name="pay"
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
                            formik.setFieldValue('amount', roundDown(Number(balance) / 10 ** 6, 6));
                          }
                        }}
                      >
                        Max
                      </Button>
                      <Box as={'span'} color={'#38383A'}>
                        |
                      </Box>
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
                  <Text as="span" fontSize={'16px'} color={'#1ED768'}>
                    <Currency
                      value={exchangeRate !== undefined ? BigNumber(formik.values.amount).dividedBy(exchangeRate) : 0}
                      decimal={2}
                      unit="ELP"
                    />{' '}
                    ELP
                  </Text>
                </Flex>
                <Checkbox
                  id="rememberMe"
                  // name="rememberMe"
                  {...formik.getFieldProps('rememberMe')}
                  colorScheme="primary"
                  fontWeight={400}
                  fontSize={'14px'}
                  // defaultChecked
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
