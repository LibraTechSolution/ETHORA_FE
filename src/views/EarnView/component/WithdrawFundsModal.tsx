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
import { useContext, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { EarnContext } from '..';
import useActiveWeb3React from '@/hooks/useActiveWeb3React';
import { prepareWriteContract, waitForTransaction, writeContract } from '@wagmi/core';
import { appConfig } from '@/config';
import VETR_ABI from '@/config/abi/VETR_ABI';
import RewardRouterV2_ABI from '@/config/abi/RewardRouterV2_ABI';
import { useContractRead, useContractReads } from 'wagmi';
import FBLP_ABI from '@/config/abi/FBLP_ABI';
import VBLP_ABI from '@/config/abi/VBLP_ABI';
import { addComma } from '@/utils/number';
import BLP_ABI from '@/config/abi/BLP_ABI';

// const validationSchema = Yup.object({
//   amount: Yup.string().required(),
//   rememberMe: Yup.boolean().equals([true]),
// });

const WithdrawFundsModal = ({
  isOpen,
  exchangeRate,
  onDismiss,
}: {
  isOpen: boolean;
  exchangeRate: string;
  onDismiss: () => void;
}) => {
  const { onFetchData } = useContext(EarnContext);
  const [loadingWithdraw, setLoadingWithdraw] = useState<boolean>(false);
  const { address } = useActiveWeb3React();
  const validNumber = new RegExp(/^\d*\.?\d{0,6}$/);

  const validationSchema = Yup.object({
    amount: Yup.string()
      .required('The number is required!')
      .test('Is positive?', 'The number must be greater than 0!', (value) => +value > 0),
    // .test('Greater amount?', 'Not enough funds!', (value) => +value < +formatUnits(dataDepositBalances as bigint, 18)),
    rememberMe: Yup.boolean().equals([true]),
  });

  const formik = useFormik({
    initialValues: {
      amount: '',
      rememberMe: false,
    },
    onSubmit: (values) => {
      console.log('onSubmit');
      onWithdrawfund(values.amount);
    },
    validationSchema: validationSchema,
  });

  const { data: pairAmounts_vBLP } = useContractRead({
    address: appConfig.VBLP_SC as `0x${string}`,
    abi: VBLP_ABI,
    functionName: 'pairAmounts',
    args: [address as `0x${string}`],
    enabled: !!address,
  });

  const { data: depositBalances_BLP_fBLP } = useContractRead({
    address: appConfig.FBLP_SC as `0x${string}`,
    abi: FBLP_ABI,
    functionName: 'depositBalances',
    args: [address as `0x${string}`, appConfig.BLP_SC as `0x${string}`],
    enabled: !!(address && appConfig.BLP_SC),
  });

  const BLP_SC = {
    address: appConfig.BLP_SC as `0x${string}`,
    abi: BLP_ABI,
  };

  const { data: data_BLP_SC } = useContractReads({
    contracts: [
      {
        ...BLP_SC,
        functionName: 'totalSupply',
      },
      {
        ...BLP_SC,
        functionName: 'availableBalance',
      },
      {
        ...BLP_SC,
        functionName: 'totalTokenXBalance',
      },
      {
        ...BLP_SC,
        functionName: 'getUnlockedLiquidity',
        args: [address as `0x${string}`],
      },
    ],
  });

  const totalSupply_BLP = data_BLP_SC && data_BLP_SC[0].result;
  const availableBalance_BLP = data_BLP_SC && data_BLP_SC[1].result;
  const totalTokenXBalance_BLP = data_BLP_SC && data_BLP_SC[2].result;
  const getUnlockedLiquidity_BLP = data_BLP_SC && data_BLP_SC[3].result;

  const LA = Number(depositBalances_BLP_fBLP) / 10 ** 6 - Number(pairAmounts_vBLP) / 10 ** 6;
  const KW =
    (totalSupply_BLP as bigint) > 0
      ? (Number(availableBalance_BLP) * Number(totalSupply_BLP)) / (Number(totalTokenXBalance_BLP) * 10 ** 6)
      : Number(availableBalance_BLP) / 10 ** 6;
  const unlockedLiquidity = Number(getUnlockedLiquidity_BLP) / 10 ** 6;

  const getMax = Math.min(LA, KW, unlockedLiquidity)


  const onWithdrawfund = async (amount: string) => {
    const amoutBigint = BigInt(+amount * 10 ** 6);
    try {
      setLoadingWithdraw(true);
      const configUnStake = await prepareWriteContract({
        address: appConfig.REWARD_ROUTER_V2_SC as `0x${string}`,
        abi: RewardRouterV2_ABI,
        functionName: 'unstakeAndRedeemBlp',
        args: [amoutBigint],
      });

      const { hash } = await writeContract(configUnStake);
      const data = await waitForTransaction({
        hash,
      });
      setLoadingWithdraw(false);
      onFetchData();
      onDismiss();
    } catch (error) {
      setLoadingWithdraw(false);
      console.log(error);
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
          <ModalHeader>Sell ELP</ModalHeader>
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
                        Max: {getMax !== undefined ? addComma(getMax, 2) : '---'} ELP
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
                          if (getMax) {
                            formik.setFieldValue('amount', getMax);
                          }
                        }}
                      >
                        Max
                      </Button>
                      |
                      <Text marginLeft={'4px'} fontSize={'14px'} fontWeight={400}>
                        ELP
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
                    {addComma(+formik.values.amount / +exchangeRate, 2)}
                    {''} ELP
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
              onClick={() => formik.handleSubmit()}
              width={'100%'}
              isDisabled={loadingWithdraw || !formik.values.rememberMe}
            >
              Withdraw Funds
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default WithdrawFundsModal;
