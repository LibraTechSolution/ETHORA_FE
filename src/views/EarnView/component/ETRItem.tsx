'use client';
import CustomConnectButton from '@/components/CustomConnectButton';
import { appConfig } from '@/config';
import { useBalanceOf } from '@/hooks/useContractRead';
import { addComma } from '@/utils/number';
import { Flex, Heading, Text, Box, Button, Tooltip } from '@chakra-ui/react';
import { formatUnits } from 'viem';
import StakeModal from './StakeModal';
import UnStakeModal from './UnStakeModal';
import { useState } from 'react';

const ETRItem = ({
  price,
  totalStaked_ETR,
  totalSupply_ETR,
  balanceOf_addressDead_ETR,
  depositBalances_ETR,
  tokensPerInterval_sETR,
  totalSupply_sETR,
  claimables_ETR,
  tokensPerInterval_sbfETR,
  totalSupply_sbfETR,
  depositBalances_bnETR,
  depositBalances_sbETR,
  claimable_sbfETR,
}: {
  price: number;
  totalStaked_ETR: bigint;
  totalSupply_ETR: bigint;
  balanceOf_addressDead_ETR: bigint;
  depositBalances_ETR: bigint;
  tokensPerInterval_sETR: bigint;
  totalSupply_sETR: bigint;
  claimables_ETR: bigint;
  tokensPerInterval_sbfETR: bigint;
  totalSupply_sbfETR: bigint;
  depositBalances_bnETR: bigint;
  depositBalances_sbETR: bigint;
  claimable_sbfETR: bigint;
}) => {
  const balance = useBalanceOf(appConfig.ETR_SC as `0x${string}`);
  const [openStakeModal, setOpenStakeModal] = useState<boolean>(false);
  const [openUnStakeModal, setOpenUnStakeModal] = useState<boolean>(false);

  const USDC_Rewards = +(claimable_sbfETR as bigint)?.toString() / 10 ** 6;
  const esETR_Rewards = +(claimables_ETR as bigint)?.toString() / 10 ** 18;
  const esETR_USD_Rewards = (+(claimables_ETR as bigint)?.toString() * price) / 10 ** 18;
  const rewards = USDC_Rewards + esETR_USD_Rewards;

  const esETR_APR =
    (100 * 31536000 * +(tokensPerInterval_sETR as bigint)?.toString()) / +(totalSupply_sETR as bigint)?.toString();
  const USDC_APR =
    (100 * 31536000 * +(tokensPerInterval_sbfETR as bigint)?.toString() * 10 ** 12) /
    (+(totalSupply_sbfETR as bigint)?.toString() * price);
  const boosted_APR =
    (+(depositBalances_bnETR as bigint)?.toString() * USDC_APR) / +(depositBalances_sbETR as bigint)?.toString();

  const Total_APR = isNaN(boosted_APR) ? esETR_APR + USDC_APR : esETR_APR + USDC_APR + boosted_APR;

  const totalSupply = formatUnits((totalSupply_ETR - balanceOf_addressDead_ETR) as bigint, 18);

  return (
    <>
      <Heading as="h5" fontSize={'20px'} fontWeight={600} marginBottom={'20px'}>
        ETR
      </Heading>
      <Tooltip label={<div>Hover me</div>} aria-label="A tooltip">
        Hover me
      </Tooltip>
      <Box display={'flex'} flexDirection={'column'} gap={'8px'}>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text as="span" fontSize={'14px'} fontWeight={400} color={'#9E9E9F'}>
            Price
          </Text>
          <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
            ${price}
          </Text>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text as="span" fontSize={'14px'} fontWeight={400} color={'#9E9E9F'}>
            Wallet
          </Text>
          <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
            {balance !== undefined ? addComma(formatUnits(balance as bigint, 18), 2) : '---'}
            {' ETR'}
            {balance !== undefined && `($${addComma(+formatUnits(balance as bigint, 18) * price, 2)})`}
          </Text>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text as="span" fontSize={'14px'} fontWeight={400} color={'#9E9E9F'}>
            Staked
          </Text>
          <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
            {depositBalances_ETR !== undefined ? addComma(formatUnits(depositBalances_ETR, 18), 2) : '---'}
            {' ETR'}
            {depositBalances_ETR !== undefined &&
              `($${addComma(+formatUnits(depositBalances_ETR as bigint, 18) * price, 2)})`}
          </Text>
        </Box>
        <hr className="border-[#242428]" />
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text as="span" fontSize={'14px'} fontWeight={400} color={'#9E9E9F'}>
            APR
          </Text>
          <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
            {Total_APR !== undefined ? addComma(Total_APR, 2) : '---'}%
          </Text>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text as="span" fontSize={'14px'} fontWeight={400} color={'#9E9E9F'}>
            Rewards
          </Text>
          <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
            ${rewards !== undefined ? addComma(rewards, 2) : '---'}
          </Text>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text as="span" fontSize={'14px'} fontWeight={400} color={'#9E9E9F'}>
            Multiplier Points APR
          </Text>
          <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
            100.00%
          </Text>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text as="span" fontSize={'14px'} fontWeight={400} color={'#9E9E9F'}>
            Boost Percentage
          </Text>
          <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
            0.00%
          </Text>
        </Box>
        <hr className="border-[#242428]" />
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text as="span" fontSize={'14px'} fontWeight={400} color={'#9E9E9F'}>
            Total Staked
          </Text>
          <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
            {totalStaked_ETR !== undefined ? addComma(formatUnits(totalStaked_ETR, 18), 2) : '---'}
            {' ETR'}
            {totalStaked_ETR !== undefined && `($${addComma(+formatUnits(totalStaked_ETR as bigint, 18) * price, 2)})`}
          </Text>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text as="span" fontSize={'14px'} fontWeight={400} color={'#9E9E9F'}>
            Total Supply
          </Text>
          <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
            {totalSupply !== undefined ? addComma(totalSupply, 2) : '---'}
            {' ETR'}
            {totalSupply_ETR !== undefined &&
              balanceOf_addressDead_ETR !== undefined &&
              `($${addComma(+totalSupply * price, 2)})`}
          </Text>
        </Box>
        <hr className="border-[#242428]" />
        <Box position={'absolute'} left={'20px'} right={'20px'} bottom={'20px'} textAlign={'right'}>
          <CustomConnectButton>
            <Flex gap={'8px'} justifyContent={'flex-end'}>
              <Button colorScheme="primary" fontSize={'16px'} size="md" onClick={() => setOpenUnStakeModal(true)}>
                Unstake
              </Button>
              <Button colorScheme="primary" fontSize={'16px'} size="md" onClick={() => setOpenStakeModal(true)}>
                Stake
              </Button>
              <Button colorScheme="primary" fontSize={'16px'} size="md">
                Buy ETR
              </Button>
            </Flex>
          </CustomConnectButton>
        </Box>
      </Box>
      <StakeModal isOpen={openStakeModal} onDismiss={() => setOpenStakeModal(false)} />
      <UnStakeModal isOpen={openUnStakeModal} onDismiss={() => setOpenUnStakeModal(false)} />
    </>
  );
};
export default ETRItem;
