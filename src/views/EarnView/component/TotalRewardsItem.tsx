import CustomConnectButton from '@/components/CustomConnectButton';
import { Heading, Box, Text, Flex, Button } from '@chakra-ui/react';
import ClaimModal from './ClaimModal';
import CompoundRewardsModal from './CompoundRewardsModal';
import { useState } from 'react';
import { addComma } from '@/utils/number';
import Currency from '@/components/Currency';

const TotalRewardsItem = ({
  claimable_sbfETR,
  claimable_fBLP,
  claimable_vETR,
  claimable_vBLP,
  claimables_ETR,
  claimable_fsBLP,
  claimable_sbETR,
  depositBalances_bnETR,
  price,
}: {
  claimable_sbfETR: bigint;
  claimable_fBLP: bigint;
  claimable_vETR: bigint;
  claimable_vBLP: bigint;
  claimables_ETR: bigint;
  claimable_fsBLP: bigint;
  claimable_sbETR: bigint;
  depositBalances_bnETR: bigint;
  price: number;
}) => {
  const [openClaimModal, setOpenClaimModal] = useState<boolean>(false);
  const [openCompoundRewardsModal, setOpenCompoundRewardsModal] = useState<boolean>(false);

  const USDC = (Number(claimable_sbfETR) + Number(claimable_fBLP)) / 10 ** 6;
  const ETR = (Number(claimable_vETR) + Number(claimable_vBLP)) / 10 ** 18;
  const esETR = (Number(claimables_ETR) + Number(claimable_fsBLP)) / 10 ** 18;
  const multiplierPoints = Number(claimable_sbETR) / 10 ** 18;
  const stakedMultiplierPoints = Number(depositBalances_bnETR) / 10 ** 18;

  return (
    <>
      <Heading as="h5" fontSize={'20px'} fontWeight={600} marginBottom={'20px'}>
        Total Rewards
      </Heading>
      <Box display={'flex'} flexDirection={'column'} gap={'8px'}>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text as="span" fontSize={'12px'} fontWeight={400} color={'#9E9E9F'}>
            USDC
          </Text>
          <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
            <Currency value={USDC !== undefined ? USDC : 0} decimal={2} />
          </Text>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text as="span" fontSize={'12px'} fontWeight={400} color={'#9E9E9F'}>
            ETR
          </Text>
          <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
            <Currency value={ETR !== undefined ? ETR : 0} decimal={2} />
            {'($'}
            <Currency value={ETR !== undefined ? +ETR * price : 0} decimal={2} />
            {')'}
          </Text>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text as="span" fontSize={'12px'} fontWeight={400} color={'#9E9E9F'}>
            Escrowed ETR
          </Text>
          <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
            <Currency value={esETR !== undefined ? esETR : 0} decimal={2} />
            {'($'}
            <Currency value={esETR !== undefined ? +esETR * price : 0} decimal={2} />
            {')'}
          </Text>
        </Box>
        <hr className="border-[#242428]" />
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text as="span" fontSize={'12px'} fontWeight={400} color={'#9E9E9F'}>
            Multiplier Points
          </Text>
          <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
            <Currency value={multiplierPoints !== undefined ? multiplierPoints : 0} decimal={2} />
          </Text>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text as="span" fontSize={'12px'} fontWeight={400} color={'#9E9E9F'}>
            Staked Multiplier Points
          </Text>
          <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
            <Currency value={stakedMultiplierPoints !== undefined ? stakedMultiplierPoints : 0} decimal={2} />
          </Text>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text as="span" fontSize={'12px'} fontWeight={400} color={'#9E9E9F'}>
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
              {/* <Button colorScheme="primary" fontSize={'16px'} size="md" onClick={() => setOpenClaimModal(true)}>
                Claim ARB
              </Button> */}
              <Button
                colorScheme="primary"
                variant={'outline'}
                fontSize={'16px'}
                size="md"
                onClick={() => setOpenClaimModal(true)}
              >
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
      {openClaimModal && <ClaimModal isOpen={openClaimModal} onDismiss={() => setOpenClaimModal(false)} />}
      {openCompoundRewardsModal && <CompoundRewardsModal isOpen={openCompoundRewardsModal} onDismiss={() => setOpenCompoundRewardsModal(false)} />}
    </>
  );
};
export default TotalRewardsItem;
