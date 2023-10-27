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
} from '@chakra-ui/react';
import { prepareWriteContract, waitForTransaction, writeContract } from '@wagmi/core';
import { useFormik } from 'formik';
import { useContext, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { EarnContext } from '..';

// const validationSchema = Yup.object({
//   pay: Yup.string().required(),
//   rememberMe: Yup.boolean().equals([true]),
// });

const CompoundRewardsModal = ({ isOpen, onDismiss }: { isOpen: boolean; onDismiss: () => void }) => {
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
      console.log('onSubmit');
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
      console.log('dataStake', data);
      setLoadingCompound(false);
      setClaimETRValue(false);
      setClaimEsETRValue(false);
      onFetchData();
      onDismiss();
    } catch (error) {
      setLoadingCompound(false);
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
          <ModalHeader>Claim Rewards</ModalHeader>
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
                    setClaimETRValue(!claimETRValue);
                    formik.setFieldValue('claimETR', !claimETRValue);
                  }}
                  isChecked={claimETRValue}
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
                    console.log(e.target.checked);
                    if (e.target.checked) {
                      setClaimETRValue(true);
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
                    setClaimEsETRValue(!claimEsETRValue);
                    formik.setFieldValue('claimEsETR', !claimEsETRValue);
                  }}
                  isChecked={claimEsETRValue}
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
                    if (e.target.checked) {
                      setClaimEsETRValue(true);
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
              Claim
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default CompoundRewardsModal;
