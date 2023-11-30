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
import * as Yup from 'yup';
import { EarnContext } from '..';
import { ToastLayout } from '@/components/ToastLayout';
import { Status } from '@/types/faucet.type';
import { BaseError } from 'viem';
// const validationSchema = Yup.object({
//   pay: Yup.string().required(),
//   rememberMe: Yup.boolean().equals([true]),
// });

const CompoundRewardsModal = ({ isOpen, onDismiss }: { isOpen: boolean; onDismiss: () => void }) => {
  const toast = useToast();
  const { onFetchData } = useContext(EarnContext);
  const [claimETRValue, setClaimETRValue] = useState<boolean>(false);
  const [claimEsETRValue, setClaimEsETRValue] = useState<boolean>(false);
  const [loadinCompound, setLoadingCompound] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
      stakeMultiplier: true,
      claimETR: false,
      stakeETR: false,
      claimEsETR: false,
      stakeEsETR: false,
      clainUSDC: true,
    },
    onSubmit: (values) => {
      onCompoundReward(values);
    },
    // validationSchema: validationSchema,
  });

  const onCompoundReward = async (data: any) => {
    const { claimETR, stakeETR, claimEsETR, stakeEsETR } = data;
    // const { isOpen, onOpen, onClose } = useDisclosure();
    // handleRewards(
    //     bool _shouldClaimBfr,
    //     bool _shouldStakeBfr,
    //     bool _shouldClaimEsBfr,
    //     bool _shouldStakeEsBfr,
    //     bool _shouldStakeMultiplierPoints,
    //     bool _shouldClaimUsdc
    // )
    try {
      setLoadingCompound(true);
      const configStake = await prepareWriteContract({
        address: appConfig.REWARD_ROUTER_V2_SC as `0x${string}`,
        abi: RewardRouterV2_ABI,
        functionName: 'handleRewards',
        args: [claimETR, stakeETR, claimEsETR, stakeEsETR, true, true],
      });

      const { hash } = await writeContract(configStake);
      const data = await waitForTransaction({
        hash,
      });
      setLoadingCompound(false);
      setClaimETRValue(false);
      setClaimEsETRValue(false);
      onFetchData();
      onDismiss();
      toast({
        position: 'top',
        render: ({ onClose }) => (
          <ToastLayout title="Successful transaction" status={Status.SUCCESSS} close={onClose}>
            <p className="text-[14px] font-medium text-white">{'Successful transaction'}</p>
            <Link href={`${appConfig.scan}/tx/${hash}`} isExternal color="#3396FF" fontSize={'12px'}>
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
      setLoadingCompound(false);
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
          <ModalHeader fontSize={'24px'}>Compound Rewards</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form>
              <VStack spacing={4} align="flex-start">
                <Checkbox
                  id="stakeMultiplier"
                  // name="rememberMe"
                  {...formik.getFieldProps('stakeMultiplier')}
                  colorScheme="primary"
                  fontWeight={400}
                  fontSize={'14px'}
                  disabled
                  defaultChecked
                >
                  <Text as="span" fontSize={'14px'}>
                    Stake Multiplier Points
                  </Text>
                </Checkbox>
                <Checkbox
                  id="claimETR"
                  // name="rememberMe"
                  {...formik.getFieldProps('claimETR')}
                  colorScheme="primary"
                  fontWeight={400}
                  fontSize={'14px'}
                  onChange={(e) => {
                    formik.setFieldValue('claimETR', !formik.values.claimETR);
                  }}
                  isChecked={formik.values.stakeETR || formik.values.claimETR}
                  isDisabled={claimETRValue}
                >
                  <Text as="span" fontSize={'14px'}>
                    Claim ETR Rewards
                  </Text>
                </Checkbox>
                <Checkbox
                  id="stakeETR"
                  // name="rememberMe"
                  {...formik.getFieldProps('stakeETR')}
                  colorScheme="primary"
                  fontWeight={400}
                  fontSize={'14px'}
                  onChange={(e) => {
                    setClaimETRValue(!claimETRValue);
                    if (e.target.checked) {
                      formik.setFieldValue('claimETR', true);
                    }
                    formik.setFieldValue('stakeETR', !formik.values.stakeETR);
                  }}
                >
                  <Text as="span" fontSize={'14px'}>
                    Stake ETR Rewards
                  </Text>
                </Checkbox>
                <Checkbox
                  id="claimEsETR"
                  // name="rememberMe"
                  {...formik.getFieldProps('claimEsETR')}
                  colorScheme="primary"
                  fontWeight={400}
                  fontSize={'14px'}
                  onChange={(e) => {
                    formik.setFieldValue('claimEsETR', !formik.values.claimEsETR);
                  }}
                  isChecked={formik.values.stakeEsETR || formik.values.claimEsETR}
                  isDisabled={claimEsETRValue}
                >
                  <Text as="span" fontSize={'14px'}>
                    Claim esETR Rewards
                  </Text>
                </Checkbox>
                <Checkbox
                  id="stakeEsETR"
                  // name="rememberMe"
                  {...formik.getFieldProps('stakeEsETR')}
                  colorScheme="primary"
                  fontWeight={400}
                  fontSize={'14px'}
                  onChange={(e) => {
                    setClaimEsETRValue(!claimEsETRValue);
                    if (e.target.checked) {
                      formik.setFieldValue('claimEsETR', true);
                    }
                    formik.setFieldValue('stakeEsETR', !formik.values.stakeEsETR);
                  }}
                >
                  <Text as="span" fontSize={'14px'}>
                    Stake esETR Rewards
                  </Text>
                </Checkbox>
                <Checkbox
                  id="clainUSDC"
                  // name="rememberMe"
                  {...formik.getFieldProps('clainUSDC')}
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
            <Button
              colorScheme="primary"
              onClick={() => formik.handleSubmit()}
              width={'100%'}
              isLoading={loadinCompound}
            >
              Compound
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default CompoundRewardsModal;
