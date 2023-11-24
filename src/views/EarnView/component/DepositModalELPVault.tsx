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
  Spacer,
  useToast,
  Link,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import { useContext, useEffect, useState } from 'react';
import { useAccount, useContractRead, useContractReads } from 'wagmi';
import * as Yup from 'yup';
import { EarnContext } from '..';
import { appConfig } from '@/config';
import { prepareWriteContract, waitForTransaction, writeContract } from '@wagmi/core';
import BigNumber from 'bignumber.js';
import ESETR_ABI from '@/config/abi/ESETR_ABI';
import VBLP_ABI from '@/config/abi/VBLP_ABI';
import { useBalanceOf } from '@/hooks/useContractRead';
import { formatUnits, BaseError, parseEther, formatEther } from 'viem';
import { addComma, roundDown } from '@/utils/number';
import { ToastLayout } from '@/components/ToastLayout';
import { Status } from '@/types/faucet.type';
import Currency from '@/components/Currency';

const DepositModalELPVault = ({
  isOpen,
  depositBalances,
  onDismiss,
}: {
  isOpen: boolean;
  depositBalances: bigint;
  onDismiss: () => void;
}) => {
  const { address } = useAccount();
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [loadingApproved, setLoadingApproved] = useState<boolean>(false);
  const [loadingStake, setLoadingStake] = useState<boolean>(false);
  const validNumber = new RegExp(/^\d*\.?\d{0,6}$/);
  const { onFetchData } = useContext(EarnContext);
  const toast = useToast();
  const balance = useBalanceOf(appConfig.ESETR_SC as `0x${string}`);
  const [amoutBigNumer, setAmoutBigNumer] = useState<bigint>();

  const { data: getAllowance } = useContractRead({
    address: appConfig.ESETR_SC as `0x${string}`,
    abi: ESETR_ABI,
    functionName: 'allowance',
    args: [address as `0x${string}`, appConfig.VBLP_SC as `0x${string}`],
    enabled: !!(address && appConfig.ESETR_SC),
  });

  const VBLP_SC = {
    address: appConfig.VBLP_SC as `0x${string}`,
    abi: VBLP_ABI,
  };

  const { data: data_VBLP_SC } = useContractReads({
    contracts: [
      {
        ...VBLP_SC,
        functionName: 'getMaxVestableAmount',
        args: [address as `0x${string}`],
      },
      {
        ...VBLP_SC,
        functionName: 'getVestedAmount',
        args: [address as `0x${string}`],
      },
      {
        ...VBLP_SC,
        functionName: 'pairAmounts',
        args: [address as `0x${string}`],
      },
      {
        ...VBLP_SC,
        functionName: 'getCombinedAverageStakedAmount',
        args: [address as `0x${string}`],
      },
    ],
  });

  const getMaxVestableAmount_VBLP = data_VBLP_SC && data_VBLP_SC[0].result;
  const getVestedAmount_VBLP = data_VBLP_SC && data_VBLP_SC[1].result;
  const pairAmounts_VBLP = data_VBLP_SC && data_VBLP_SC[2].result;
  const getCombinedAverageStakedAmount_VBLP = data_VBLP_SC && data_VBLP_SC[2].result;

  const SE = balance ? formatUnits(balance as bigint, 18) : 0;
  const WW = (Number(getMaxVestableAmount_VBLP) - Number(getVestedAmount_VBLP)) / 10 ** 18;
  const getMax = Math.min(+SE, WW);

  const deposited = Number(getVestedAmount_VBLP) / 10 ** 18;
  const maxCapacity = Number(getMaxVestableAmount_VBLP) / 10 ** 18;

  const validationSchema = Yup.object({
    amount: Yup.string()
      .required('Amount is required')
      .test('Is positive?', 'Entered amount must be greater than 0', (value) => +value > 0)
      .test('Greater amount?', 'Not enough funds!', (value) => +value <= +getMax),
  });

  const formik = useFormik({
    initialValues: {
      amount: '',
    },
    onSubmit: (values) => {
      onDeposit(values.amount);
    },
    validationSchema: validationSchema,
  });

  function xSe(e: any, t: any, n: any, r: any, i: any) {
    let a = i;
    e && (a = e + i);
    let o = r,
      s = 0;
    return e && t && n && n > 0 && ((o = (t * a) / n), o > r && (s = o - r)), r >= s ? r : s;
  }

  const reserveFirst = xSe(
    amoutBigNumer,
    getCombinedAverageStakedAmount_VBLP,
    getMaxVestableAmount_VBLP,
    pairAmounts_VBLP,
    getVestedAmount_VBLP,
  );

  const onApprove = async () => {
    // if (!isApproved) {
    try {
      setLoadingApproved(true);
      const config = await prepareWriteContract({
        address: appConfig.ESETR_SC as `0x${string}`,
        abi: ESETR_ABI,
        functionName: 'approve',
        args: [appConfig.VBLP_SC as `0x${string}`, BigInt(2 ** 256 / 1.1)],
      });

      const { hash } = await writeContract(config);
      const data = await waitForTransaction({
        hash,
      });
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

  const onDeposit = async (amount: string) => {
    const amoutBigint = parseEther(BigNumber(amount).toFixed());

    try {
      setLoadingStake(true);
      const configStake = await prepareWriteContract({
        address: appConfig.VBLP_SC as `0x${string}`,
        abi: VBLP_ABI,
        functionName: 'deposit',
        args: [amoutBigint],
      });

      const { hash } = await writeContract(configStake);
      const data = await waitForTransaction({
        hash,
      });
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
          <ModalHeader fontSize={'24px'}>ELP Vault</ModalHeader>
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
                        Max:{' '}
                        <Currency
                          value={getMax !== undefined ? BigNumber(getMax).toFixed() : 0}
                          decimal={2}
                          unit="esETR"
                        />{' '}
                        esETR
                      </Text>
                    </Flex>
                  </FormLabel>
                  <InputGroup marginBottom={'14px'}>
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
                          setAmoutBigNumer(e.target.value ? parseEther(e.target.value) : parseEther('0'));
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
                          if (getMax !== undefined) {
                            formik.setFieldValue('amount', BigNumber(getMax).toFixed(6, BigNumber.ROUND_DOWN));
                            setAmoutBigNumer(parseEther(BigNumber(getMax).toFixed(6, BigNumber.ROUND_DOWN)));
                          }
                        }}
                      >
                        Max
                      </Button>
                      <Box as={'span'} color={'#38383A'}>
                        |
                      </Box>
                      <Text marginLeft={'4px'} fontSize={'14px'} fontWeight={400}>
                        esETR
                      </Text>
                    </InputRightElement>
                  </InputGroup>
                  {formik.errors.amount && formik.touched.amount && <Text color="red">{formik.errors.amount}</Text>}
                  <FormLabel htmlFor="wallet" fontWeight={400} fontSize={'14px'}>
                    <Flex display={'flex'} justifyContent={'space-between'} width={'100%'}>
                      <Text as="span" fontSize={'12px'} color="#9E9E9F">
                        Wallet
                      </Text>{' '}
                      <Text as="span" fontSize={'14px'}>
                        <Currency
                          value={balance !== undefined ? formatUnits(balance as bigint, 18) : 0}
                          decimal={2}
                          unit="esETR"
                        />{' '}
                        esETR
                      </Text>
                    </Flex>
                  </FormLabel>
                  <FormLabel htmlFor="capacity" fontWeight={400} fontSize={'14px'}>
                    <Flex display={'flex'} justifyContent={'space-between'} width={'100%'}>
                      <Text as="span" fontSize={'12px'} color="#9E9E9F">
                        Vault Capacity
                      </Text>{' '}
                      <Text as="span" fontSize={'14px'}>
                        <Tooltip
                          hasArrow
                          label={
                            <Box w="100%" p={4} color="white">
                              <Flex margin={'0 -8px'} alignItems={'center'}>
                                <Box fontSize={'12px'} color={'#9E9E9F'} padding={'0 8px'}>
                                  Deposited
                                </Box>
                                <Spacer />
                                <Box padding={'0 8px'}>
                                  {deposited
                                    ? BigNumber(deposited).toFormat(6, BigNumber.ROUND_DOWN)
                                    : BigNumber(0).toFormat(6, BigNumber.ROUND_DOWN)}{' '}
                                  esETR
                                </Box>
                              </Flex>
                              <Flex margin={'0 -8px'} alignItems={'center'}>
                                <Box fontSize={'12px'} color={'#9E9E9F'} padding={'0 8px'}>
                                  Max Capacity
                                </Box>
                                <Spacer />
                                <Box padding={'0 8px'}>
                                  {maxCapacity
                                    ? BigNumber(maxCapacity).toFormat(6, BigNumber.ROUND_DOWN)
                                    : BigNumber(0).toFormat(6, BigNumber.ROUND_DOWN)}{' '}
                                  esETR
                                </Box>
                              </Flex>
                            </Box>
                          }
                          color="white"
                          placement="top"
                          bg="#050506"
                          minWidth="215px"
                        >
                          <Text as="u">
                            {BigNumber(formik?.values?.amount ? formik?.values?.amount : 0)
                              .plus(deposited ? deposited : 0)
                              .toFormat(2, BigNumber.ROUND_DOWN)}{' '}
                            /{' '}
                            {maxCapacity
                              ? BigNumber(maxCapacity).toFormat(2, BigNumber.ROUND_DOWN)
                              : BigNumber(0).toFormat(2, BigNumber.ROUND_DOWN)}
                          </Text>
                        </Tooltip>
                      </Text>
                    </Flex>
                  </FormLabel>
                  <FormLabel htmlFor="reserveAmount" fontWeight={400} fontSize={'14px'}>
                    <Flex display={'flex'} justifyContent={'space-between'} width={'100%'}>
                      <Text as="span" fontSize={'12px'} color="#9E9E9F">
                        Reserve Amount
                      </Text>{' '}
                      <Text as="span" fontSize={'14px'}>
                        <Tooltip
                          hasArrow
                          label={
                            <Box w="100%" p={4} color="white">
                              <Flex margin={'0 -8px'} alignItems={'center'}>
                                <Box fontSize={'12px'} color={'#9E9E9F'} padding={'0 8px'}>
                                  Current Reserved
                                </Box>
                                <Spacer />
                                <Box padding={'0 8px'}>
                                  {pairAmounts_VBLP !== undefined
                                    ? BigNumber(formatEther(pairAmounts_VBLP as bigint)).toFormat(
                                        6,
                                        BigNumber.ROUND_DOWN,
                                      )
                                    : '0.000000'}
                                </Box>
                              </Flex>
                              <Flex margin={'0 -8px'} alignItems={'center'}>
                                <Box fontSize={'12px'} color={'#9E9E9F'} padding={'0 8px'}>
                                  Additional Reserve Required
                                </Box>
                                <Spacer />
                                <Box padding={'0 8px'}>
                                  {pairAmounts_VBLP !== undefined && reserveFirst !== undefined
                                    ? BigNumber(
                                        +formatEther(reserveFirst as bigint) - +formatEther(pairAmounts_VBLP as bigint),
                                      ).toFormat(6, BigNumber.ROUND_DOWN)
                                    : '0.000000'}
                                </Box>
                              </Flex>
                            </Box>
                          }
                          color="white"
                          placement="top"
                          bg="#050506"
                          minWidth="400px"
                        >
                          <Text as="u">
                            {reserveFirst !== undefined ? BigNumber(formatEther(reserveFirst)).toFormat(2, BigNumber.ROUND_DOWN) : '0.00'} /{' '}
                            {depositBalances !== undefined ?BigNumber(formatEther(depositBalances)).toFormat(2, BigNumber.ROUND_DOWN) : '0.00'}
                          </Text>
                        </Tooltip>
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
export default DepositModalELPVault;
