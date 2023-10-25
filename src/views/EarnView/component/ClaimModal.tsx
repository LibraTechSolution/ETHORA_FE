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
import { appConfig } from '@/config';
import RewardRouterV2_ABI from '@/config/abi/RewardRouterV2_ABI';

// const validationSchema = Yup.object({
//   pay: Yup.string().required(),
//   rememberMe: Yup.boolean().equals([true]),
// });

const ClaimModal = ({ isOpen, onDismiss }: { isOpen: boolean; onDismiss: () => void }) => {
  const { onFetchData } = useContext(EarnContext);
  const [loadingClaim, setLoadingClaim] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
      claimETR: false,
      claimEsETR: false,
      claimUsdc: true,
    },
    onSubmit: (values) => {
      console.log('onSubmit');
      onClaim(values);
    },
    // validationSchema: validationSchema,
  });

  const onClaim = async (data: any) => {
    const { claimETR, claimEsETR, claimUsdc } = data;
    console.log(claimETR, claimEsETR, claimUsdc);
    // handleRewards(
    //     bool _shouldClaimBfr,
    //     bool _shouldStakeBfr,
    //     bool _shouldClaimEsBfr,
    //     bool _shouldStakeEsBfr,
    //     bool _shouldStakeMultiplierPoints,
    //     bool _shouldClaimUsdc
    // )
    try {
      const configStake = await prepareWriteContract({
        address: appConfig.REWARD_ROUTER_V2_SC as `0x${string}`,
        abi: RewardRouterV2_ABI,
        functionName: 'handleRewards',
        args: [claimETR, false, claimEsETR, false, false, claimUsdc],
      });

      const { hash } = await writeContract(configStake);
      const data = await waitForTransaction({
        hash,
      });
      console.log('dataStake', data);
      setLoadingClaim(false);
      onFetchData();
      onDismiss();
    } catch (error) {
      setLoadingClaim(false);
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
                  id="claimETR"
                  // name="rememberMe"
                  {...formik.getFieldProps('claimETR')}
                  colorScheme="primary"
                  fontWeight={400}
                  fontSize={'14px'}
                >
                  <Text as="span" fontSize={'14px'}>
                    Claim ETR Rewards
                  </Text>
                </Checkbox>
                <Checkbox
                  id="claimEsETR"
                  // name="rememberMe"
                  {...formik.getFieldProps('claimEsETR')}
                  colorScheme="primary"
                  fontWeight={400}
                  fontSize={'14px'}
                >
                  <Text as="span" fontSize={'14px'}>
                    Claim esETR Rewards
                  </Text>
                </Checkbox>
                <Checkbox
                  id="claimUsdc"
                  // name="rememberMe"
                  {...formik.getFieldProps('claimUsdc')}
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
            <Button colorScheme="primary" onClick={() => formik.handleSubmit()} width={'100%'} isLoading={loadingClaim}>
              Claim
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default ClaimModal;
