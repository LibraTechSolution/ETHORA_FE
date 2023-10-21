import CustomConnectButton from '@/components/CustomConnectButton';
import { Heading, Box, Text, Flex, Button } from '@chakra-ui/react';
import DepositModal from './DepositModal';
import { useState } from 'react';
import { addComma } from '@/utils/number';

const ETRVault = ({
  depositBalances_ETR,
  depositBalances_sbBFR,
  depositBalances_bnETR,
  pairAmounts_vETR,
  depositBalances_sbETR,
  claimedAmounts_vETR,
  claimable_vETR,
  getVestedAmount_vETR,
}: {
  depositBalances_ETR: bigint;
  depositBalances_sbBFR: bigint;
  depositBalances_bnETR: bigint;
  pairAmounts_vETR: bigint;
  depositBalances_sbETR: bigint;
  claimedAmounts_vETR: bigint;
  claimable_vETR: bigint;
  getVestedAmount_vETR: bigint;
}) => {
  const [openDepositModal, setOpenDepositModal] = useState<boolean>(false);

  const stakedTokensETR = +(depositBalances_ETR as bigint)?.toString() / 10 ** 18;
  const stakedTokens_esETR = +(depositBalances_sbBFR as bigint)?.toString() / 10 ** 18;
  const multiplierPoints = +(depositBalances_bnETR as bigint)?.toString() / 10 ** 18;

  const stakedTokens = stakedTokensETR + stakedTokens_esETR + multiplierPoints;

  const pairAmounts = +(pairAmounts_vETR as bigint)?.toString() / 10 ** 18;
  const depositBalances =
    (+(depositBalances_bnETR as bigint)?.toString() + +(depositBalances_sbETR as bigint)?.toString()) / 10 ** 18;

  const claimed = (+(claimedAmounts_vETR as bigint)?.toString() + +(claimable_vETR as bigint)?.toString()) / 10 ** 18;
  const vested = +(getVestedAmount_vETR as bigint)?.toString() / 10 ** 18;
  const claimable = +(claimable_vETR as bigint)?.toString() / 10 ** 18;
  return (
    <>
      <Heading as="h5" fontSize={'20px'} fontWeight={600} marginBottom={'20px'}>
        ETR Vault
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
            {depositBalances !== undefined ? addComma(depositBalances, 2) : '---'}
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
              <Button colorScheme="primary" fontSize={'16px'} size="md">
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
      <DepositModal isOpen={openDepositModal} onDismiss={() => setOpenDepositModal(false)} />
    </>
  );
};
export default ETRVault;
