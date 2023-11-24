'use client';
import CustomConnectButton from '@/components/CustomConnectButton';
import { appConfig } from '@/config';
import { useBalanceOf } from '@/hooks/useContractRead';
import { addComma } from '@/utils/number';
import { Flex, Heading, Text, Box, Button, Spacer } from '@chakra-ui/react';
import { formatEther, formatUnits, parseUnits } from 'viem';
import { useState } from 'react';
import StakeModalETR from './StakeModalETR';
import UnStakeModaETR from './UnStakeModaETR';
import BigNumber from 'bignumber.js';
// import { Currency } from '@/components/Currency';
import Link from 'next/link';
import Currency from '@/components/Currency';
import { Tooltip } from 'antd';

const ETRItem = ({
  price,
  totalStaked_ETR,
  totalSupply_ETR,
  balanceOf_addressDead_ETR,
  depositBalances_ETR,
  tokensPerInterval_sETR,
  totalSupply_sETR,
  claimables_sETR,
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
  claimables_sETR: bigint;
  tokensPerInterval_sbfETR: bigint;
  totalSupply_sbfETR: bigint;
  depositBalances_bnETR: bigint;
  depositBalances_sbETR: bigint;
  claimable_sbfETR: bigint;
}) => {
  const balance = useBalanceOf(appConfig.ETR_SC as `0x${string}`);
  const [openStakeModal, setOpenStakeModal] = useState<boolean>(false);
  const [openUnStakeModal, setOpenUnStakeModal] = useState<boolean>(false);

  const USDC_Rewards = claimable_sbfETR ? formatUnits(claimable_sbfETR, 6) : 0; //Number(claimable_sbfETR) / 10 ** 6;
  const esETR_Rewards = claimables_sETR ? formatUnits(claimables_sETR, 18) : 0; //Number(claimables_sETR) / 10 ** 18;
  const esETR_USD_Rewards = BigNumber(claimables_sETR ? formatUnits(claimables_sETR, 18) : 0).multipliedBy(price); //(Number(claimables_sETR) * price) / 10 ** 18;
  const rewards = esETR_USD_Rewards.plus(USDC_Rewards); // USDC_Rewards + esETR_USD_Rewards

  const esETR_APR = (100 * 31536000 * Number(tokensPerInterval_sETR)) / Number(totalSupply_sETR);
  const USDC_APR =
    (100 * 31536000 * Number(tokensPerInterval_sbfETR) * 10 ** 12) / (Number(totalSupply_sbfETR) * price);
  const boosted_APR = depositBalances_bnETR || depositBalances_sbETR ? (Number(depositBalances_bnETR) * USDC_APR) / Number(depositBalances_sbETR) : 0;
  const boosted_Percentage = depositBalances_bnETR || depositBalances_sbETR ?  (Number(depositBalances_bnETR) / Number(depositBalances_sbETR)) * 100 : 0;
  const Total_APR = isNaN(boosted_APR) ? esETR_APR + USDC_APR : esETR_APR + USDC_APR + boosted_APR;

  const totalSupply = formatUnits((totalSupply_ETR - balanceOf_addressDead_ETR) as bigint, 18);
  const stakedMultiplierPoints = depositBalances_bnETR ? formatUnits(depositBalances_bnETR, 18) : 0 //Number(depositBalances_bnETR) / 10 ** 18;
  
  return (
    <>
      <Heading as="h5" fontSize={'20px'} fontWeight={600} marginBottom={'20px'}>
        ETR
      </Heading>
      <Box display={'flex'} flexDirection={'column'} gap={'8px'}>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text fontSize={'12px'} fontWeight={400} color={'#9E9E9F'}>
            Price
          </Text>
          <Text fontSize={'14px'} textAlign={'right'} fontWeight={500} color={'#fffff'}>
            <span>
              $<Currency value={0.055} decimal={2} />
            </span>
          </Text>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text fontSize={'12px'} fontWeight={400} color={'#9E9E9F'}>
            Wallet
          </Text>
          <Text fontSize={'14px'} textAlign={'right'} fontWeight={500} color={'#fffff'}>
            <span>
              <Currency
                value={balance !== undefined ? BigNumber(formatEther(balance as bigint)).toFixed() : 0}
                decimal={2}
                unit="ETR"
              />
              {' ETR '}
            </span>
            <span>
              {'($'}
              <Currency
                value={
                  balance !== undefined
                    ? BigNumber(formatEther(balance as bigint))
                        .multipliedBy(price)
                        .toFixed()
                    : 0
                }
                decimal={2}
              />
              {')'}
            </span>
          </Text>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text fontSize={'12px'} fontWeight={400} color={'#9E9E9F'}>
            Staked
          </Text>
          <Text fontSize={'14px'} textAlign={'right'} fontWeight={500} color={'#fffff'}>
            <span>
              <Currency
                value={
                  depositBalances_ETR !== undefined
                    ? BigNumber(formatEther(depositBalances_ETR as bigint)).toFixed()
                    : 0
                }
                decimal={2}
                unit="ETR"
              />
              {' ETR'}
            </span>
            <span>
              {' ($'}
              <Currency
                value={
                  depositBalances_ETR !== undefined
                    ? BigNumber(formatEther(depositBalances_ETR as bigint))
                        .multipliedBy(price)
                        .toFixed()
                    : 0
                }
                decimal={2}
              />
              {')'}
            </span>
          </Text>
        </Box>
        <hr className="border-[#242428]" />
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text fontSize={'12px'} fontWeight={400} color={'#9E9E9F'}>
            APR
          </Text>
          <Text fontSize={'14px'} textAlign={'right'} fontWeight={500} color={'#fffff'}>
            <Tooltip
              // hasArrow
              title={
                <Box w="100%" p={4} color="white">
                  <Flex margin={'0 -8px'} alignItems={'center'}>
                    <Box fontSize={'12px'} color={'#9E9E9F'} padding={'0 8px'}>
                      Boosted APR
                    </Box>
                    <Spacer />
                    <Box padding={'0 8px'}>
                      {boosted_APR !== undefined
                        ? BigNumber(boosted_APR).toFormat(6, BigNumber.ROUND_DOWN)
                        : '0.000000'}
                      %
                    </Box>
                  </Flex>
                  <Flex margin={'0 -8px'} alignItems={'center'}>
                    <Box fontSize={'12px'} color={'#9E9E9F'} padding={'0 8px'}>
                      Escrowed ETR APR
                    </Box>
                    <Spacer />
                    <Box padding={'0 8px'}>
                      {esETR_APR !== undefined ? BigNumber(esETR_APR).toFormat(6, BigNumber.ROUND_DOWN) : '0.000000'}%
                    </Box>
                  </Flex>
                  <Flex margin={'0 -8px'} alignItems={'center'}>
                    <Box fontSize={'12px'} color={'#9E9E9F'} padding={'0 8px'}>
                      Base USDC APR
                    </Box>
                    <Spacer />
                    <Box padding={'0 8px'}>
                      {USDC_APR !== undefined ? BigNumber(USDC_APR).toFormat(6, BigNumber.ROUND_DOWN) : '0.000000'}%
                    </Box>
                  </Flex>
                  <Flex margin={'0 -8px'} alignItems={'center'}>
                    <Box fontSize={'12px'} color={'#9E9E9F'} padding={'0 8px'}>
                      Total APR
                    </Box>
                    <Spacer />
                    <Box padding={'0 8px'}>
                      {Total_APR !== undefined ? BigNumber(Total_APR).toFormat(6, BigNumber.ROUND_DOWN) : '0.000000'}%
                    </Box>
                  </Flex>
                  <Text fontSize={'12px'} color={'#9E9E9F'}>
                    The Boosted APR is from your staked Multiplier Points. APRs are updated weekly on Wednesday and will
                    depend on the fees collected for the week.
                  </Text>
                </Box>
              }
              // color="white"
              placement="top"
              // bg="#050506"
              // minWidth="450px"
              overlayStyle={{ color: 'white', background: '#050506', maxWidth: '350px' }}
            >
              <Text as="u">
                {' '}
                {Total_APR !== undefined ? BigNumber(Total_APR).toFormat(2, BigNumber.ROUND_DOWN) : '0.00'}%
              </Text>
            </Tooltip>
          </Text>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text fontSize={'12px'} fontWeight={400} color={'#9E9E9F'}>
            Rewards
          </Text>
          <Text fontSize={'14px'} textAlign={'right'} fontWeight={500} color={'#fffff'}>
            <Tooltip
              // hasArrow
              title={
                <Box w="100%" p={4} color="white">
                  <Flex margin={'0 -8px'} alignItems={'center'}>
                    <Box fontSize={'12px'} color={'#9E9E9F'} padding={'0 8px'}>
                      USDC
                    </Box>
                    <Spacer />
                    <Box padding={'0 8px'}>
                      {USDC_Rewards !== undefined ? BigNumber(USDC_Rewards).toFormat(6, BigNumber.ROUND_DOWN) : '0.000000'}
                    </Box>
                  </Flex>
                  <Flex margin={'0 -8px'} alignItems={'center'}>
                    <Box fontSize={'12px'} color={'#9E9E9F'} padding={'0 8px'}>
                      Escrowed ETR
                    </Box>
                    <Spacer />
                    <Box padding={'0 8px'}>{`${
                      esETR_Rewards !== undefined ? BigNumber(esETR_Rewards).toFormat(6, BigNumber.ROUND_DOWN) : '0.000000'
                    }($${
                      esETR_USD_Rewards !== undefined ? esETR_USD_Rewards.toFormat(6, BigNumber.ROUND_DOWN) : '0.000000'
                    })`}</Box>
                  </Flex>
                </Box>
              }
              // color="white"
              placement="top"
              // bg="#050506"
              // minWidth="215px"
              overlayStyle={{ color: 'white', background: '#050506', maxWidth: '250px' }}
            >
              <Text as="u"> ${rewards !== undefined ? rewards.toFormat(2, BigNumber.ROUND_DOWN) : '0.00'}</Text>
            </Tooltip>
          </Text>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text fontSize={'12px'} fontWeight={400} color={'#9E9E9F'}>
            Multiplier Points APR
          </Text>
          <Text fontSize={'14px'} textAlign={'right'} fontWeight={500} color={'#fffff'}>
            <Tooltip
              // hasArrow
              title={<Text fontSize={'12px'}>Boost your rewards with Multiplier Points.</Text>}
              // color="white"
              placement="top"
              // bg="#050506"
              // minWidth="215px"
              overlayStyle={{ color: 'white', background: '#050506', maxWidth: '280px' }}
            >
              <Text as="u">100.00%</Text>
            </Tooltip>
          </Text>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text fontSize={'12px'} fontWeight={400} color={'#9E9E9F'}>
            Boost Percentage
          </Text>
          <Text fontSize={'14px'} textAlign={'right'} fontWeight={500} color={'#fffff'}>
            <Tooltip
              // hasArrow
              title={
                <>
                  <Text fontSize={'12px'} marginBottom={'16px'}>{`You are earning  ${
                    boosted_Percentage !== undefined
                      ? BigNumber(boosted_Percentage).toFormat(6, BigNumber.ROUND_DOWN)
                      : '0.000000'
                  }% more USDC rewards using ${
                    stakedMultiplierPoints !== undefined
                      ? BigNumber(stakedMultiplierPoints).toFormat(6, BigNumber.ROUND_DOWN)
                      : '0.000000'
                  } Staked Multiplier Points.`}</Text>
                  <Text fontSize={'12px'}>Use the &quot;Compound&ldquo; button to stake your Multiplier Points.</Text>
                </>
              }
              // color="white"
              placement="top"
              // bg="#050506"
              // minWidth="215px"
              overlayStyle={{ color: 'white', background: '#050506', maxWidth: '215px' }}
            >
              <Text as="u">
                {boosted_Percentage !== undefined
                  ? BigNumber(boosted_Percentage).toFormat(2, BigNumber.ROUND_DOWN)
                  : '0.00'}
                %
              </Text>
            </Tooltip>
          </Text>
        </Box>
        <hr className="border-[#242428]" />
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text fontSize={'12px'} fontWeight={400} color={'#9E9E9F'}>
            Total Staked
          </Text>
          <Text fontSize={'14px'} textAlign={'right'} fontWeight={500} color={'#fffff'}>
            <span>
              <Currency
                value={totalStaked_ETR !== undefined ? BigNumber(formatEther(totalStaked_ETR as bigint)).toFixed() : 0}
                decimal={2}
                unit="ETR"
              />
              {' ETR'}
            </span>
            <span>
              {' ($'}
              <Currency
                value={
                  totalStaked_ETR !== undefined
                    ? BigNumber(formatEther(totalStaked_ETR as bigint))
                        .multipliedBy(price)
                        .toFixed()
                    : 0
                }
                decimal={2}
              />
              {')'}
            </span>
          </Text>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text fontSize={'12px'} fontWeight={400} color={'#9E9E9F'}>
            Total Supply
          </Text>
          <Text fontSize={'14px'} textAlign={'right'} fontWeight={500} color={'#fffff'}>
            <span>
              <Currency value={totalSupply !== undefined ? totalSupply : 0} decimal={2} unit="ETR" />
              {' ETR '}
            </span>
            <span>
              {'($'}
              <Currency
                value={
                  totalSupply_ETR !== undefined && balanceOf_addressDead_ETR !== undefined ? +totalSupply * price : 0
                }
                decimal={2}
              />
              {')'}
            </span>
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
              <Link href="https://app.uniswap.org/swap" target="_blank">
                <Button colorScheme="primary" fontSize={'16px'} size="md" as={'span'}>
                  Buy ETR
                </Button>
              </Link>
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
