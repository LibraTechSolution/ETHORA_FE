import CustomConnectButton from '@/components/CustomConnectButton';
import { Heading, Box, Text, Flex, Button, Tooltip, Spacer } from '@chakra-ui/react';
import DepositModal from './DepositModalETRVault';
import { useContext, useState } from 'react';
import { addComma } from '@/utils/number';
import { prepareWriteContract, waitForTransaction, writeContract } from '@wagmi/core';
import { appConfig } from '@/config';
import VBLP_ABI from '@/config/abi/VBLP_ABI';
import useActiveWeb3React from '@/hooks/useActiveWeb3React';
import { EarnContext } from '..';
import VETR_ABI from '@/config/abi/VETR_ABI';

const ETRVault = ({
  depositBalances_ETR,
  depositBalances_esETR,
  depositBalances_bnETR,
  pairAmounts_vETR,
  depositBalances_sbETR,
  claimedAmounts_vETR,
  claimable_vETR,
  getVestedAmount_vETR,
}: {
  depositBalances_ETR: bigint;
  depositBalances_esETR: bigint;
  depositBalances_bnETR: bigint;
  pairAmounts_vETR: bigint;
  depositBalances_sbETR: bigint;
  claimedAmounts_vETR: bigint;
  claimable_vETR: bigint;
  getVestedAmount_vETR: bigint;
}) => {
  const [openDepositModal, setOpenDepositModal] = useState<boolean>(false);
  const { onFetchData } = useContext(EarnContext);
  const [loadingWithdraw, setLoadingWithdraw] = useState<boolean>(false);

  const stakedTokensETR = Number(depositBalances_ETR) / 10 ** 18;
  const stakedTokens_esETR = Number(depositBalances_esETR) / 10 ** 18;
  const multiplierPoints = Number(depositBalances_bnETR) / 10 ** 18;

  const stakedTokens = stakedTokensETR + stakedTokens_esETR + multiplierPoints;

  const pairAmounts = Number(pairAmounts_vETR) / 10 ** 18;
  const depositBalances = (Number(depositBalances_bnETR) + Number(depositBalances_sbETR)) / 10 ** 18;

  const claimed = (Number(claimedAmounts_vETR) + Number(claimable_vETR)) / 10 ** 18;
  const vested = Number(getVestedAmount_vETR) / 10 ** 18;
  const claimable = Number(claimable_vETR) / 10 ** 18;

  const onWithdraw = async () => {
    try {
      setLoadingWithdraw(true);
      const configUnStake = await prepareWriteContract({
        address: appConfig.VETR_SC as `0x${string}`,
        abi: VETR_ABI,
        functionName: 'withdraw',
        // args:[]
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
        ETR Vault
      </Heading>
      <Box display={'flex'} flexDirection={'column'} gap={'8px'}>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text as="span" fontSize={'12px'} fontWeight={400} color={'#9E9E9F'}>
            Staked Tokens
          </Text>
          <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
            <Tooltip
              hasArrow
              label={
                <Box w="100%" p={4} color="white">
                  <Flex margin={'0 -8px'} alignItems={'center'}>
                    <Box fontSize={'12px'} color={'#9E9E9F'} padding={'0 8px'}>
                      ETR
                    </Box>
                    <Spacer />
                    <Box padding={'0 8px'}>{addComma(stakedTokensETR, 2)}%</Box>
                  </Flex>
                  <Flex margin={'0 -8px'} alignItems={'center'}>
                    <Box fontSize={'12px'} color={'#9E9E9F'} padding={'0 8px'}>
                      esETR
                    </Box>
                    <Spacer />
                    <Box padding={'0 8px'}>{addComma(stakedTokens_esETR, 2)}%</Box>
                  </Flex>
                  <Flex margin={'0 -8px'} alignItems={'center'}>
                    <Box fontSize={'12px'} color={'#9E9E9F'} padding={'0 8px'}>
                      Multiplier Points
                    </Box>
                    <Spacer />
                    <Box padding={'0 8px'}>{addComma(multiplierPoints, 2)}%</Box>
                  </Flex>
                </Box>
              }
              color="white"
              placement="top"
              bg="#050506"
              minWidth="215px"
            >
              <Text as="u">{stakedTokens !== undefined ? addComma(stakedTokens, 2) : '0.00'}</Text>
            </Tooltip>
          </Text>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text as="span" fontSize={'12px'} fontWeight={400} color={'#9E9E9F'}>
            Reserved for Vesting
          </Text>
          <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
            {pairAmounts !== undefined ? addComma(pairAmounts, 2) : '0.00'} /{' '}
            {depositBalances !== undefined ? addComma(depositBalances, 2) : '0.00'}
          </Text>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text as="span" fontSize={'12px'} fontWeight={400} color={'#9E9E9F'}>
            Vesting Status
          </Text>
          <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
            <Tooltip
              hasArrow
              label={
                <Box>
                  <Text fontSize={'12px'} marginBottom={'16px'}>
                    {addComma(claimed, 2)} esETR tokens have been converted to ETR from the {addComma(vested, 2)} esETR
                    deposited for vesting.
                  </Text>
                </Box>
              }
              color="white"
              placement="top"
              bg="#050506"
              minWidth="288px"
            >
              <Text as="u">
                {claimed !== undefined ? addComma(claimed, 2) : '0.00'} /{' '}
                {vested !== undefined ? addComma(vested, 2) : '0.00'}
              </Text>
            </Tooltip>
          </Text>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text as="span" fontSize={'12px'} fontWeight={400} color={'#9E9E9F'}>
            Claimable
          </Text>
          <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
            <Tooltip
              hasArrow
              label={
                <Box>
                  <Text fontSize={'12px'} marginBottom={'16px'}>
                    {addComma(claimable, 2)} ETR tokens can be claimed, use the options under the Total Rewards section
                    to claim them.
                  </Text>
                </Box>
              }
              color="white"
              placement="top"
              bg="#050506"
              minWidth="288px"
            >
              <Text as="u">{claimable !== undefined ? addComma(claimable, 2) : '0.00'} ETR</Text>
            </Tooltip>
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
              <Button
                colorScheme="primary"
                fontSize={'16px'}
                size="md"
                onClick={() => {
                  setOpenDepositModal(true);
                }}
              >
                Deposit
              </Button>
            </Flex>
          </CustomConnectButton>
        </Box>
      </Box>
      {openDepositModal && <DepositModal isOpen={openDepositModal} onDismiss={() => setOpenDepositModal(false)} />}
    </>
  );
};
export default ETRVault;
