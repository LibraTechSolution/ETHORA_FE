import CustomConnectButton from '@/components/CustomConnectButton';
import { Heading, Box, Text, Flex, Button } from '@chakra-ui/react';
import ClaimModal from './ClaimModal';
import CompoundRewardsModal from './CompoundRewardsModal';
import { useState } from 'react';
import { addComma } from '@/utils/number';

const TotalRewardsItem = ({
  claimable_sbfETR,
  claimable_fBLP,
  claimable_vETR,
  claimable_vBLP,
  claimables_ETR,
  claimable_fsBLP,
  claimable_sbETR,
  depositBalances_bnETR,
}: {
  claimable_sbfETR: bigint;
  claimable_fBLP: bigint;
  claimable_vETR: bigint;
  claimable_vBLP: bigint;
  claimables_ETR: bigint;
  claimable_fsBLP: bigint;
  claimable_sbETR: bigint;
  depositBalances_bnETR: bigint;
}) => {
  const [openClaimModal, setOpenClaimModal] = useState<boolean>(false);
  const [openCompoundRewardsModal, setOpenCompoundRewardsModal] = useState<boolean>(false);

  const USDC = (+(claimable_sbfETR as bigint)?.toString() + +(claimable_fBLP as bigint)?.toString()) / 10 ** 6;
  const ETR = (+(claimable_vETR as bigint)?.toString() + +(claimable_vBLP as bigint)?.toString()) / 10 ** 18;
  const esETR = (+(claimables_ETR as bigint)?.toString() + +(claimable_fsBLP as bigint)?.toString()) / 10 ** 18;
  const multiplierPoints = +(claimable_sbETR as bigint)?.toString() / 10 ** 18;
  const stakedMultiplierPoints = +(depositBalances_bnETR as bigint)?.toString() / 10 ** 18;

  return (
    <>
      <Heading as="h5" fontSize={'20px'} fontWeight={600} marginBottom={'20px'}>
        Total Rewards
      </Heading>
      <Box display={'flex'} flexDirection={'column'} gap={'8px'}>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text as="span" fontSize={'14px'} fontWeight={400} color={'#9E9E9F'}>
            USDC
          </Text>
          <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
            {USDC !== undefined ? addComma(USDC, 2) : '---'}
          </Text>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text as="span" fontSize={'14px'} fontWeight={400} color={'#9E9E9F'}>
            ETR
          </Text>
          <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
            {ETR !== undefined ? addComma(ETR, 2) : '---'}
          </Text>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text as="span" fontSize={'14px'} fontWeight={400} color={'#9E9E9F'}>
            Escrowed ETR
          </Text>
          <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
            {esETR !== undefined ? addComma(esETR, 2) : '---'}
          </Text>
        </Box>
        <hr className="border-[#242428]" />
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text as="span" fontSize={'14px'} fontWeight={400} color={'#9E9E9F'}>
            Multiplier Points
          </Text>
          <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
            {multiplierPoints !== undefined ? addComma(multiplierPoints, 2) : '---'}
          </Text>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text as="span" fontSize={'14px'} fontWeight={400} color={'#9E9E9F'}>
            Staked Multiplier Points
          </Text>
          <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
            {stakedMultiplierPoints !== undefined ? addComma(stakedMultiplierPoints, 2) : '---'}
          </Text>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text as="span" fontSize={'14px'} fontWeight={400} color={'#9E9E9F'}>
            Total
          </Text>
          <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
            $0.00
          </Text>
        </Box>
        <hr className="border-[#242428]" />
        <Box position={'absolute'} left={'20px'} right={'20px'} bottom={'20px'} textAlign={'right'}>
          <CustomConnectButton>
            <Flex gap={'8px'} justifyContent={'flex-end'}>
              <Button colorScheme="primary" fontSize={'16px'} size="md" onClick={() => setOpenClaimModal(true)}>
                Claim ARB
              </Button>
              <Button colorScheme="primary" fontSize={'16px'} size="md" onClick={() => setOpenClaimModal(true)}>
                Claim
              </Button>
              <Button
                colorScheme="primary"
                fontSize={'16px'}
                size="md"
                onClick={() => setOpenCompoundRewardsModal(true)}
              >
                Compound
              </Button>
            </Flex>
          </CustomConnectButton>
        </Box>
      </Box>
      <ClaimModal isOpen={openClaimModal} onDismiss={() => setOpenClaimModal(false)} />
      <CompoundRewardsModal isOpen={openCompoundRewardsModal} onDismiss={() => setOpenCompoundRewardsModal(false)} />
    </>
  );
};
export default TotalRewardsItem;
