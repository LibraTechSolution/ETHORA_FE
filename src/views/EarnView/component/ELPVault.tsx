import CustomConnectButton from '@/components/CustomConnectButton';
import { addComma } from '@/utils/number';
import { Heading, Box, Text, Flex, Button } from '@chakra-ui/react';
import DepositModalELPVault from './DepositModalELPVault';
import { useContext, useState } from 'react';
import { prepareWriteContract, waitForTransaction, writeContract } from '@wagmi/core';
import { appConfig } from '@/config';
import { EarnContext } from '..';
import VBLP_ABI from '@/config/abi/VBLP_ABI';

const ELPVault = ({
  depositBalances_fBLP,
  pairAmounts_vBLP,
  claimedAmounts_vBLP,
  claimable_vBLP,
  getVestedAmount_vBLP,
}: {
  depositBalances_fBLP: bigint;
  pairAmounts_vBLP: bigint;
  claimedAmounts_vBLP: bigint;
  claimable_vBLP: bigint;
  getVestedAmount_vBLP: bigint;
}) => {
  const [openDepositModal, setOpenDepositModal] = useState<boolean>(false);
  const { onFetchData } = useContext(EarnContext);
  const [loadingWithdraw, setLoadingWithdraw] = useState<boolean>(false);

  const stakedTokens = +(depositBalances_fBLP as bigint)?.toString() / 10 ** 18;
  const pairAmounts = +(pairAmounts_vBLP as bigint)?.toString() / 10 ** 18;
  // const pairAmounts = +(claimedAmounts_vBLP as bigint)?.toString() / 10 ** 18;
  const claimed = (+(claimedAmounts_vBLP as bigint)?.toString() + +(claimable_vBLP as bigint)?.toString()) / 10 ** 18;
  const vested = +(getVestedAmount_vBLP as bigint)?.toString() / 10 ** 18;

  const claimable = +(claimable_vBLP as bigint)?.toString() / 10 ** 18;

  const onWithdraw = async () => {
    try {
      setLoadingWithdraw(true);
      const configUnStake = await prepareWriteContract({
        address: appConfig.VBLP_SC as `0x${string}`,
        abi: VBLP_ABI,
        functionName: 'withdraw',
      });

      const { hash } = await writeContract(configUnStake);
      const data = await waitForTransaction({
        hash,
      });
      setLoadingWithdraw(false);
      onFetchData();
    } catch (error) {
      setLoadingWithdraw(false);
      console.log(error);
    }
  };

  return (
    <>
      <Heading as="h5" fontSize={'20px'} fontWeight={600} marginBottom={'20px'}>
        ELP Vault
      </Heading>
      <Box display={'flex'} flexDirection={'column'} gap={'8px'}>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text as="span" fontSize={'14px'} fontWeight={400} color={'#9E9E9F'}>
            Staked Tokens
          </Text>
          <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
            {stakedTokens !== undefined ? addComma(stakedTokens, 2) : '---'}
          </Text>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text as="span" fontSize={'14px'} fontWeight={400} color={'#9E9E9F'}>
            Reserved for Vesting
          </Text>
          <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
            {pairAmounts !== undefined ? addComma(pairAmounts, 2) : '---'} /{' '}
            {stakedTokens !== undefined ? addComma(stakedTokens, 2) : '---'}
          </Text>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text as="span" fontSize={'14px'} fontWeight={400} color={'#9E9E9F'}>
            Vesting Status
          </Text>
          <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
            {claimed !== undefined ? addComma(claimed, 2) : '---'} /{' '}
            {vested !== undefined ? addComma(vested, 2) : '---'}
          </Text>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text as="span" fontSize={'14px'} fontWeight={400} color={'#9E9E9F'}>
            Claimable
          </Text>
          <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
            {claimable !== undefined ? addComma(claimable, 2) : '---'} ETR
          </Text>
        </Box>
        <hr className="border-[#242428]" />
        <Box position={'absolute'} left={'20px'} right={'20px'} bottom={'20px'} textAlign={'right'}>
          <CustomConnectButton>
            <Flex gap={'8px'} justifyContent={'flex-end'}>
              <Button
                colorScheme="primary"
                fontSize={'16px'}
                size="md"
                onClick={onWithdraw}
                isLoading={loadingWithdraw}
              >
                Withdraw
              </Button>
              <Button colorScheme="primary" fontSize={'16px'} size="md" onClick={() => setOpenDepositModal(true)}>
                Deposit
              </Button>
            </Flex>
          </CustomConnectButton>
        </Box>
      </Box>
      <DepositModalELPVault isOpen={openDepositModal} onDismiss={() => setOpenDepositModal(false)} />
    </>
  );
};

export default ELPVault;
