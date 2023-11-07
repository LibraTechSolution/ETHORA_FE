'use client';
import CustomConnectButton from '@/components/CustomConnectButton';
import { appConfig } from '@/config';
import { useBalanceOf } from '@/hooks/useContractRead';
import { addComma } from '@/utils/number';
import { Flex, Heading, Text, Box, Button, Tooltip, Spacer } from '@chakra-ui/react';
import { formatEther, formatUnits } from 'viem';
import { useState } from 'react';
import StakeModalETR from './StakeModalETR';
import UnStakeModaETR from './UnStakeModaETR';
import BigNumber from 'bignumber.js';

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

  const USDC_Rewards = Number(claimable_sbfETR) / 10 ** 6;
  const esETR_Rewards = Number(claimables_ETR) / 10 ** 18;
  const esETR_USD_Rewards = (Number(claimables_ETR) * price) / 10 ** 18;
  const rewards = USDC_Rewards + esETR_USD_Rewards;

  const esETR_APR = (100 * 31536000 * Number(tokensPerInterval_sETR)) / Number(totalSupply_sETR);
  const USDC_APR =
    (100 * 31536000 * Number(tokensPerInterval_sbfETR) * 10 ** 12) / (Number(totalSupply_sbfETR) * price);
  const boosted_APR = (Number(depositBalances_bnETR) * USDC_APR) / Number(depositBalances_sbETR);
  const boosted_Percentage = (Number(depositBalances_bnETR) / Number(depositBalances_sbETR)) * 100;
  const Total_APR = isNaN(boosted_APR) ? esETR_APR + USDC_APR : esETR_APR + USDC_APR + boosted_APR;

  const totalSupply = formatUnits((totalSupply_ETR - balanceOf_addressDead_ETR) as bigint, 18);
  const stakedMultiplierPoints = Number(depositBalances_bnETR) / 10 ** 18;
  console.log('stakedMultiplierPoints', stakedMultiplierPoints);
  // console.log(formatEther(BigInt(depositBalances_ETR)));
  // console.log(new BigNumber(formatEther(BigInt(depositBalances_ETR))).toFixed(18));
  // console.log(new BigNumber(formatEther(BigInt(depositBalances_ETR))).multipliedBy(price).toFixed(18));
  // console.log(BigNumber(depositBalances_ETR.toString()).multipliedBy(price));
  // console.log(+BigNumber(depositBalances_ETR.toString()).multipliedBy(price));
  // console.log(+formatUnits(depositBalances_ETR as bigint, 18) * price);
  // console.log(new BigNumber(formatEther(depositBalances_ETR)).multipliedBy(price).toString());

  return (
    <>
      <Heading as="h5" fontSize={'20px'} fontWeight={600} marginBottom={'20px'}>
        ETR
      </Heading>
      <Box display={'flex'} flexDirection={'column'} gap={'8px'}>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text as="span" fontSize={'12px'} fontWeight={400} color={'#9E9E9F'}>
            Price
          </Text>
          <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
            ${price}
          </Text>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text as="span" fontSize={'12px'} fontWeight={400} color={'#9E9E9F'}>
            Wallet
          </Text>
          <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
            {balance !== undefined ? addComma(formatUnits(balance as bigint, 18), 2) : '0.00'}
            {' ETR'}
            {balance !== undefined && `($${addComma(+formatUnits(balance as bigint, 18) * price, 2)})`}
          </Text>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text as="span" fontSize={'12px'} fontWeight={400} color={'#9E9E9F'}>
            Staked
          </Text>
          <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
            {depositBalances_ETR !== undefined ? addComma(formatUnits(depositBalances_ETR, 18), 2) : '0.00'}
            {' ETR'}
            {depositBalances_ETR !== undefined &&
              `($${addComma(+formatUnits(depositBalances_ETR as bigint, 18) * price, 2)})`}
          </Text>
        </Box>
        <hr className="border-[#242428]" />
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text as="span" fontSize={'12px'} fontWeight={400} color={'#9E9E9F'}>
            APR
          </Text>
          <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
            <Tooltip
              hasArrow
              label={
                <Box w="100%" p={4} color="white">
                  <Flex margin={'0 -8px'} alignItems={'center'}>
                    <Box fontSize={'12px'} color={'#9E9E9F'} padding={'0 8px'}>
                      Boosted APR
                    </Box>
                    <Spacer />
                    <Box padding={'0 8px'}>{addComma(boosted_APR, 2)}%</Box>
                  </Flex>
                  <Flex margin={'0 -8px'} alignItems={'center'}>
                    <Box fontSize={'12px'} color={'#9E9E9F'} padding={'0 8px'}>
                      Escrowed ETR APR
                    </Box>
                    <Spacer />
                    <Box padding={'0 8px'}>{addComma(esETR_APR, 2)}%</Box>
                  </Flex>
                  <Flex margin={'0 -8px'} alignItems={'center'}>
                    <Box fontSize={'12px'} color={'#9E9E9F'} padding={'0 8px'}>
                      Base USDC APR
                    </Box>
                    <Spacer />
                    <Box padding={'0 8px'}>{addComma(USDC_APR, 2)}%</Box>
                  </Flex>
                  <Flex margin={'0 -8px'} alignItems={'center'}>
                    <Box fontSize={'12px'} color={'#9E9E9F'} padding={'0 8px'}>
                      Total APR
                    </Box>
                    <Spacer />
                    <Box padding={'0 8px'}>{addComma(Total_APR, 2)}%</Box>
                  </Flex>
                  <Text fontSize={'12px'} color={'#9E9E9F'}>
                    The Boosted APR is from your staked Multiplier Points. APRs are updated weekly on Wednesday and will
                    depend on the fees collected for the week.
                  </Text>
                </Box>
              }
              color="white"
              placement="top"
              bg="#050506"
              minWidth="450px"
            >
              <Text as="u"> {Total_APR !== undefined ? addComma(Total_APR, 2) : '0.00'}%</Text>
            </Tooltip>
          </Text>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text as="span" fontSize={'12px'} fontWeight={400} color={'#9E9E9F'}>
            Rewards
          </Text>
          <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
            <Tooltip
              hasArrow
              label={
                <Box w="100%" p={4} color="white">
                  <Flex margin={'0 -8px'} alignItems={'center'}>
                    <Box fontSize={'12px'} color={'#9E9E9F'} padding={'0 8px'}>
                      USDC
                    </Box>
                    <Spacer />
                    <Box padding={'0 8px'}>{addComma(USDC_Rewards, 2)}</Box>
                  </Flex>
                  <Flex margin={'0 -8px'} alignItems={'center'}>
                    <Box fontSize={'12px'} color={'#9E9E9F'} padding={'0 8px'}>
                      Escrowed ETR
                    </Box>
                    <Spacer />
                    <Box padding={'0 8px'}>{`${addComma(esETR_Rewards, 2)}($${addComma(esETR_USD_Rewards, 2)})`}</Box>
                  </Flex>
                </Box>
              }
              color="white"
              placement="top"
              bg="#050506"
              minWidth="215px"
            >
              <Text as="u"> ${rewards !== undefined ? addComma(rewards, 2) : '0.00'}</Text>
            </Tooltip>
          </Text>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text as="span" fontSize={'12px'} fontWeight={400} color={'#9E9E9F'}>
            Multiplier Points APR
          </Text>
          <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
            <Tooltip
              hasArrow
              label={<Text fontSize={'12px'}>Boost your rewards with Multiplier Points.</Text>}
              color="white"
              placement="top"
              bg="#050506"
              minWidth="215px"
            >
              <Text as="u">100.00%</Text>
            </Tooltip>
          </Text>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text as="span" fontSize={'12px'} fontWeight={400} color={'#9E9E9F'}>
            Boost Percentage
          </Text>
          <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
            <Tooltip
              hasArrow
              label={
                <>
                  <Text fontSize={'12px'} marginBottom={'16px'}>{`You are earning  ${addComma(
                    boosted_Percentage,
                    2,
                  )}% more USDC rewards using ${addComma(stakedMultiplierPoints, 4)} Staked Multiplier Points.`}</Text>
                  <Text fontSize={'12px'}>Use the &quot;Compound&ldquo; button to stake your Multiplier Points.</Text>
                </>
              }
              color="white"
              placement="top"
              bg="#050506"
              minWidth="215px"
            >
              <Text as="u">{boosted_Percentage !== undefined ? addComma(boosted_Percentage, 2) : '0.00'}%</Text>
            </Tooltip>
          </Text>
        </Box>
        <hr className="border-[#242428]" />
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text as="span" fontSize={'12px'} fontWeight={400} color={'#9E9E9F'}>
            Total Staked
          </Text>
          <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
            {totalStaked_ETR !== undefined ? addComma(formatUnits(totalStaked_ETR, 18), 2) : '0.00'}
            {' ETR'}
            {totalStaked_ETR !== undefined && ` ($${addComma(+formatUnits(totalStaked_ETR as bigint, 18) * price, 2)})`}
          </Text>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text as="span" fontSize={'12px'} fontWeight={400} color={'#9E9E9F'}>
            Total Supply
          </Text>
          <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
            {totalSupply !== undefined ? addComma(totalSupply, 2) : '0.00'}
            {' ETR'}
            {totalSupply_ETR !== undefined &&
              balanceOf_addressDead_ETR !== undefined &&
              ` ($${addComma(+totalSupply * price, 2)})`}
          </Text>
        </Box>
        <hr className="border-[#242428]" />
        <Box position={'absolute'} left={'20px'} right={'20px'} bottom={'20px'} textAlign={'right'}>
          <CustomConnectButton>
            <Flex gap={'8px'} justifyContent={'flex-end'}>
              <Button
                colorScheme="primary"
                variant="outline"
                fontSize={'16px'}
                size="md"
                onClick={() => setOpenUnStakeModal(true)}
              >
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
      {openStakeModal && <StakeModalETR isOpen={openStakeModal} onDismiss={() => setOpenStakeModal(false)} />}
      {openUnStakeModal && <UnStakeModaETR isOpen={openUnStakeModal} onDismiss={() => setOpenUnStakeModal(false)} />}
    </>
  );
};
export default ETRItem;
