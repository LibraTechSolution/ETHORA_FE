import CustomConnectButton from '@/components/CustomConnectButton';
import { Heading, Box, Text, Flex, Button } from '@chakra-ui/react';
import ClaimModal from './ClaimModal';
import CompoundRewardsModal from './CompoundRewardsModal';
import { useState } from 'react';
import { addComma } from '@/utils/number';
import Currency from '@/components/Currency';
import BigNumber from 'bignumber.js';
import { formatUnits } from 'viem';

const TotalRewardsItem = ({
  claimable_sbfETR,
  claimable_fBLP,
  claimable_vETR,
  claimable_vBLP,
  claimables_sETR,
  claimable_fsBLP,
  claimable_sbETR,
  depositBalances_bnETR,
  price,
}: {
  claimable_sbfETR: bigint;
  claimable_fBLP: bigint;
  claimable_vETR: bigint;
  claimable_vBLP: bigint;
  claimables_sETR: bigint;
  claimable_fsBLP: bigint;
  claimable_sbETR: bigint;
  depositBalances_bnETR: bigint;
  price: number;
}) => {
  const [openClaimModal, setOpenClaimModal] = useState<boolean>(false);
  const [openCompoundRewardsModal, setOpenCompoundRewardsModal] = useState<boolean>(false);

  const USDC = (Number(claimable_sbfETR) + Number(claimable_fBLP)) / 10 ** 6;
  const ETR = (Number(claimable_vETR) + Number(claimable_vBLP)) / 10 ** 18;
  const esETR = (Number(claimables_sETR) + Number(claimable_fsBLP)) / 10 ** 18;
  const multiplierPoints = Number(claimable_sbETR) / 10 ** 18;
  const stakedMultiplierPoints = Number(depositBalances_bnETR) / 10 ** 18;
  const total1 = BigNumber(claimable_sbfETR ? formatUnits(claimable_sbfETR, 6) : 0).plus(
    claimable_fBLP ? formatUnits(claimable_fBLP, 6) : 0,
  );

  const total2 = BigNumber(claimable_vETR ? formatUnits(claimable_vETR, 18) : 0).plus(
    claimable_vBLP ? formatUnits(claimable_vBLP, 18) : 0,
  );
  const total2USD = total2.multipliedBy(price);

  const total3 = BigNumber(claimables_sETR ? formatUnits(claimables_sETR, 18) : 0).plus(
    claimable_fsBLP ? formatUnits(claimable_fsBLP, 18) : 0,
  );
  const total3USD = total3.multipliedBy(price);

  const total = total1.plus(total2USD).plus(total3USD);

  return (
    <>
      <Heading as="h5" fontSize={'20px'} fontWeight={600} marginBottom={'20px'}>
        Total Rewards
      </Heading>
      <Box display={'flex'} flexDirection={'column'} gap={'8px'}>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text fontSize={'12px'} fontWeight={400} color={'#9E9E9F'}>
            USDC
          </Text>
          <Text fontSize={'14px'} textAlign={'right'} fontWeight={500} color={'#fffff'}>
            <Currency value={USDC !== undefined ? USDC : 0} decimal={2} />
          </Text>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text fontSize={'12px'} fontWeight={400} color={'#9E9E9F'}>
            ETR
          </Text>
          <Text fontSize={'14px'} textAlign={'right'} fontWeight={500} color={'#fffff'}>
            <Currency value={ETR !== undefined ? ETR : 0} decimal={2} />
            <span>
              {' ($'}
              <Currency value={ETR !== undefined ? +ETR * price : 0} decimal={2} />
              {')'}
            </span>
          </Text>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text fontSize={'12px'} fontWeight={400} color={'#9E9E9F'}>
            Escrowed ETR
          </Text>
          <Text fontSize={'14px'} textAlign={'right'} fontWeight={500} color={'#fffff'}>
            <Currency value={esETR !== undefined ? esETR : 0} decimal={2} />
            <span>
              {' ($'}
              <Currency value={esETR !== undefined ? +esETR * price : 0} decimal={2} />
              {')'}
            </span>
          </Text>
        </Box>
        <hr className="border-[#242428]" />
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text fontSize={'12px'} fontWeight={400} color={'#9E9E9F'}>
            Multiplier Points
          </Text>
          <Text fontSize={'14px'} textAlign={'right'} fontWeight={500} color={'#fffff'}>
            <Currency value={multiplierPoints !== undefined ? multiplierPoints : 0} decimal={2} />
          </Text>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text fontSize={'12px'} fontWeight={400} color={'#9E9E9F'}>
            Staked Multiplier Points
          </Text>
          <Text fontSize={'14px'} textAlign={'right'} fontWeight={500} color={'#fffff'}>
            <Currency value={stakedMultiplierPoints !== undefined ? stakedMultiplierPoints : 0} decimal={2} />
          </Text>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text fontSize={'12px'} fontWeight={400} color={'#9E9E9F'}>
            Total
          </Text>
          <Text fontSize={'14px'} textAlign={'right'} fontWeight={500} color={'#fffff'}>
            $<Currency value={total !== undefined ? total : 0} decimal={2} unit="$" />
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
      {openCompoundRewardsModal && (
        <CompoundRewardsModal isOpen={openCompoundRewardsModal} onDismiss={() => setOpenCompoundRewardsModal(false)} />
      )}
    </>
  );
};
export default TotalRewardsItem;
