import { appConfig } from '@/config';
import RewardRouterV2_ABI from '@/config/abi/RewardRouterV2_ABI';
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
import { prepareWriteContract, waitForTransaction, writeContract } from '@wagmi/core';
import { useFormik } from 'formik';
import { useContext, useEffect, useState } from 'react';
import { BaseError, formatEther, formatUnits, parseUnits } from 'viem';
import * as Yup from 'yup';
import { EarnContext } from '..';
import { useContractRead } from 'wagmi';
import SETR_ABI from '@/config/abi/SETR_ABI';
import useActiveWeb3React from '@/hooks/useActiveWeb3React';
import { addComma, roundDown } from '@/utils/number';
import { ToastLayout } from '@/components/ToastLayout';
import { Status } from '@/types/faucet.type';

const UnStakeModaETR = ({ isOpen, onDismiss }: { isOpen: boolean; onDismiss: () => void }) => {
  const toast = useToast();
  const { onFetchData } = useContext(EarnContext);
  const [loadingUnStake, setLoadingUnStake] = useState<boolean>(false);
  const { address } = useActiveWeb3React();

  const validNumber = new RegExp(/^\d*\.?\d{0,6}$/);

  const { data: dataDepositBalances } = useContractRead({
    address: appConfig.SETR_SC as `0x${string}`,
    abi: SETR_ABI,
    functionName: 'depositBalances',
    args: [address as `0x${string}`, appConfig.ETR_SC as `0x${string}`],
  });

  const validationSchema = Yup.object({
    amount: Yup.string()
      .required('The number is required!')
      .test('Is positive?', 'Entered amount must be greater than 0', (value) => +value > 0)
      .test(
        'Greater amount?',
        'Not enough funds!',
        (value) => +value <= +formatUnits(dataDepositBalances as bigint, 18),
      ),
  });

  const formik = useFormik({
    initialValues: {
      amount: '',
    },
    onSubmit: async (values) => {
      onUnStake(values.amount);
    },
    validationSchema: validationSchema,
  });

  const onUnStake = async (amount: string) => {
    const amoutBigint = BigInt(+amount * 10 ** 18);

    try {
      setLoadingUnStake(true);
      console.log('amount', amoutBigint);
      const configUnStake = await prepareWriteContract({
        address: appConfig.REWARD_ROUTER_V2_SC as `0x${string}`,
        abi: RewardRouterV2_ABI,
        functionName: 'unstakeBfr',
        args: [amoutBigint],
      });
      const { hash } = await writeContract(configUnStake);
      const data = await waitForTransaction({
        hash,
      });
      setLoadingUnStake(false);
      onFetchData();
      onDismiss();
      toast({
        position: 'top',
        render: ({ onClose }) => (
          <ToastLayout title="Successful transaction" status={Status.SUCCESSS} close={onClose}>
            <p className="text-[14px] font-medium text-white">{'Successful transaction'}</p>
            <Link href={`https://goerli.arbiscan.io/tx/${hash}`} isExternal color="#3396FF" fontSize={'12px'}>
              View on explorer (Hyperlink to transaction on Basescan)
            </Link>
          </ToastLayout>
        ),
      });
    } catch (error: any) {
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
      setLoadingUnStake(false);
      onDismiss();
    }
  };

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
          <ModalHeader fontSize={'24px'}>Unstake ETR</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form>
              <VStack spacing={4} align="flex-start">
                <FormControl>
                  <FormLabel htmlFor="amount" fontWeight={400} fontSize={'14px'}>
                    <Flex display={'flex'} justifyContent={'space-between'} width={'100%'}>
                      <Text as="span" fontSize={'12px'} color="#9E9E9F">
                        UnStake
                      </Text>{' '}
                      <Text as="span" fontSize={'14px'}>
                        Max:{' '}
                        {dataDepositBalances !== undefined
                          ? addComma(formatUnits(dataDepositBalances as bigint, 18), 2)
                          : '0.00'}{' '}
                        ETR
                      </Text>
                    </Flex>
                  </FormLabel>
                  <InputGroup>
                    <Input
                      id="amount"
                      // name="amount"
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
                        _hover={{
                          background: '#252528',
                        }}
                        onClick={() => {
                          if (dataDepositBalances !== undefined) {
                            formik.setFieldValue('amount', roundDown(+formatEther(BigInt(dataDepositBalances)), 6));
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
              onClick={() => {
                formik.handleSubmit();
              }}
              width={'100%'}
              isLoading={loadingUnStake}
            >
              Unstake
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default UnStakeModaETR;
