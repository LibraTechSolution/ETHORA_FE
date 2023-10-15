'use client';
import Link from 'next/link';
import { Flex, Heading, Text, Box, GridItem, Grid, Button } from '@chakra-ui/react';
import { ArrowRight } from 'lucide-react';
import CardEarn from './component/CardEarn';
import CustomConnectButton from '@/components/CustomConnectButton';
import AddFundsModal from './component/AddFundsModal';
import { useState } from 'react';
import WithdrawFundsModal from './component/WithdrawFundsModal';
import StakeModal from './component/StakeModal';
import UnStakeModal from './component/UnStakeModal';
import DepositModal from './component/DepositModal';
import ClaimModal from './component/ClaimModal';
import CompoundRewardsModal from './component/CompoundRewardsModal';

const EarnView = () => {
  const [openAddFundModal, setOpenAddFundModal] = useState<boolean>(false);
  const [openWithdrawFundModal, setOpenWithdrawFundModal] = useState<boolean>(false);
  const [openStakeModal, setOpenStakeModal] = useState<boolean>(false);
  const [openUnStakeModal, setOpenUnStakeModal] = useState<boolean>(false);
  const [openDepositModal, setOpenDepositModal] = useState<boolean>(false);
  const [openClaimModal, setOpenClaimModal] = useState<boolean>(false);
  const [openCompoundRewardsModal, setOpenCompoundRewardsModal] = useState<boolean>(false);

  return (
    <Flex flexWrap={'wrap'} flexDirection={'column'} gap={'20px'} paddingY={'20px'}>
      <Box>
        <Heading as="h3" fontSize="24px" fontWeight={400} marginBottom={'12px'}>
          Earn
        </Heading>
        <Text className="flex w-full items-center">
          Stake ETR and ELP to earn rewards.{' '}
          <Link
            href="https://coinbase.com/faucets/base-ethereum-goerli-faucet"
            target="_blank"
            className="group ml-1 flex text-center align-middle text-[#6052FB]"
          >
            <span className="pr-[10px] group-hover:underline">Learn more</span>
            <ArrowRight className="text-white" />
          </Link>
        </Text>
      </Box>

      <Grid templateColumns={{ md: 'repeat(2, 1fr)' }} gap={'20px'}>
        <GridItem w="100%" colSpan={{ md: 2, lg: 1 }}>
          <CardEarn>
            <Heading as="h5" fontSize={'20px'} fontWeight={600} marginBottom={'20px'}>
              ETR
            </Heading>
            <Box display={'flex'} flexDirection={'column'} gap={'8px'}>
              <Box display={'flex'} justifyContent={'space-between'}>
                <Text as="span" fontSize={'14px'} fontWeight={400} color={'#9E9E9F'}>
                  Price
                </Text>
                <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
                  $0.0597
                </Text>
              </Box>
              <Box display={'flex'} justifyContent={'space-between'}>
                <Text as="span" fontSize={'14px'} fontWeight={400} color={'#9E9E9F'}>
                  Wallet
                </Text>
                <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
                  0.00 ETR ($0.00)
                </Text>
              </Box>
              <Box display={'flex'} justifyContent={'space-between'}>
                <Text as="span" fontSize={'14px'} fontWeight={400} color={'#9E9E9F'}>
                  Staked
                </Text>
                <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
                  0.00 ETR ($0.00)
                </Text>
              </Box>
              <hr className="border-[#242428]" />
              <Box display={'flex'} justifyContent={'space-between'}>
                <Text as="span" fontSize={'14px'} fontWeight={400} color={'#9E9E9F'}>
                  APR
                </Text>
                <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
                  9.89%
                </Text>
              </Box>
              <Box display={'flex'} justifyContent={'space-between'}>
                <Text as="span" fontSize={'14px'} fontWeight={400} color={'#9E9E9F'}>
                  Rewards
                </Text>
                <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
                  $0.00
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
                  20,390,672.54 ETR ($1,219,133.02)
                </Text>
              </Box>
              <Box display={'flex'} justifyContent={'space-between'}>
                <Text as="span" fontSize={'14px'} fontWeight={400} color={'#9E9E9F'}>
                  Total Supply
                </Text>
                <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
                  79,876,450.83 ETR ($4,775,713.94)
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
          </CardEarn>
        </GridItem>
        <GridItem w="100%" colSpan={{ md: 2, lg: 1 }}>
          <CardEarn>
            <Heading as="h5" fontSize={'20px'} fontWeight={600} marginBottom={'20px'}>
              Total Rewards
            </Heading>
            <Box display={'flex'} flexDirection={'column'} gap={'8px'}>
              <Box display={'flex'} justifyContent={'space-between'}>
                <Text as="span" fontSize={'14px'} fontWeight={400} color={'#9E9E9F'}>
                  USDC
                </Text>
                <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
                  0.00
                </Text>
              </Box>
              <hr className="border-[#242428]" />
              <Box display={'flex'} justifyContent={'space-between'}>
                <Text as="span" fontSize={'14px'} fontWeight={400} color={'#9E9E9F'}>
                  Multiplier Points
                </Text>
                <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
                  0.00
                </Text>
              </Box>
              <Box display={'flex'} justifyContent={'space-between'}>
                <Text as="span" fontSize={'14px'} fontWeight={400} color={'#9E9E9F'}>
                  Staked Multiplier Points
                </Text>
                <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
                  $0.00
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
          </CardEarn>
        </GridItem>
      </Grid>

      <Grid templateColumns={{ md: 'repeat(2, 1fr)' }} gap={'20px'}>
        <GridItem w="100%" colSpan={{ md: 2, lg: 1 }}>
          <CardEarn>
            <Heading as="h5" fontSize={'20px'} fontWeight={600} marginBottom={'20px'}>
              Escrowed ETR
            </Heading>
            <Box display={'flex'} flexDirection={'column'} gap={'8px'}>
              <Box display={'flex'} justifyContent={'space-between'}>
                <Text as="span" fontSize={'14px'} fontWeight={400} color={'#9E9E9F'}>
                  Price
                </Text>
                <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
                  $0.0597
                </Text>
              </Box>
              <Box display={'flex'} justifyContent={'space-between'}>
                <Text as="span" fontSize={'14px'} fontWeight={400} color={'#9E9E9F'}>
                  Wallet
                </Text>
                <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
                  0.00 esETR (0.00 USDC)
                </Text>
              </Box>
              <Box display={'flex'} justifyContent={'space-between'}>
                <Text as="span" fontSize={'14px'} fontWeight={400} color={'#9E9E9F'}>
                  Staked
                </Text>
                <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
                  0.00 esETR (0.00 USDC)
                </Text>
              </Box>
              <hr className="border-[#242428]" />
              <Box display={'flex'} justifyContent={'space-between'}>
                <Text as="span" fontSize={'14px'} fontWeight={400} color={'#9E9E9F'}>
                  APR
                </Text>
                <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
                  9.89%
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
              <hr className="border-[#242428]" />
              <Box display={'flex'} justifyContent={'space-between'}>
                <Text as="span" fontSize={'14px'} fontWeight={400} color={'#9E9E9F'}>
                  Total Staked
                </Text>
                <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
                  20,390,672.54 ETR ($1,219,133.02)
                </Text>
              </Box>
              <Box display={'flex'} justifyContent={'space-between'}>
                <Text as="span" fontSize={'14px'} fontWeight={400} color={'#9E9E9F'}>
                  Total Supply
                </Text>
                <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
                  4,765,877.50 esETR (284,945.90 USDC)v
                </Text>
              </Box>
              <hr className="border-[#242428]" />
              <Box position={'absolute'} left={'20px'} right={'20px'} bottom={'20px'} textAlign={'right'}>
                <CustomConnectButton>
                  <Flex gap={'8px'} justifyContent={'flex-end'}>
                    <Button colorScheme="primary" fontSize={'16px'} size="md">
                      Unstake
                    </Button>
                    <Button colorScheme="primary" fontSize={'16px'} size="md">
                      Stake
                    </Button>
                  </Flex>
                </CustomConnectButton>
              </Box>
            </Box>
          </CardEarn>
        </GridItem>

        <GridItem w="100%" colSpan={{ md: 2, lg: 1 }}>
        <CardEarn>
            <Heading
              as="h5"
              fontSize={'20px'}
              fontWeight={600}
              marginBottom={'20px'}
              display={'flex'}
              flexDirection={'column'}
            >
              USDC Vault (uELP Token)
              <Text as="span" textColor={'#6D6D70'} fontWeight={400} fontSize={'14px'}>
                Max Capacity : 10,000,000.00 USDC
              </Text>
            </Heading>
            <Box display={'flex'} flexDirection={'column'} gap={'8px'}>
              <Box display={'flex'} justifyContent={'space-between'}>
                <Text as="span" fontSize={'14px'} fontWeight={400} color={'#9E9E9F'}>
                  Exchange Rate
                </Text>
                <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
                  1.00 uELP = 0.74 USDC
                </Text>
              </Box>
              <Box display={'flex'} justifyContent={'space-between'}>
                <Text as="span" fontSize={'14px'} fontWeight={400} color={'#9E9E9F'}>
                  Wallet
                </Text>
                <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
                  0.00 uELP (0.00 USDC)
                </Text>
              </Box>
              <Box display={'flex'} justifyContent={'space-between'}>
                <Text as="span" fontSize={'14px'} fontWeight={400} color={'#9E9E9F'}>
                  Staked
                </Text>
                <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
                  0.00 ETR ($0.00)
                </Text>
              </Box>
              <hr className="border-[#242428]" />
              <Box display={'flex'} justifyContent={'space-between'}>
                <Text as="span" fontSize={'14px'} fontWeight={400} color={'#9E9E9F'}>
                  APR
                </Text>
                <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
                  9.89%
                </Text>
              </Box>
              <Box display={'flex'} justifyContent={'space-between'}>
                <Text as="span" fontSize={'14px'} fontWeight={400} color={'#9E9E9F'}>
                  Rewards
                </Text>
                <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
                  $0.00
                </Text>
              </Box>
              <Box display={'flex'} justifyContent={'space-between'}>
                <Text as="span" fontSize={'14px'} fontWeight={400} color={'#9E9E9F'}>
                  Lockup Period
                </Text>
                <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
                  1 day
                </Text>
              </Box>
              <Box display={'flex'} justifyContent={'space-between'}>
                <Text as="span" fontSize={'14px'} fontWeight={400} color={'#9E9E9F'}>
                  Withdrawable Amount
                </Text>
                <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
                  0.00 uELP
                </Text>
              </Box>
              <hr className="border-[#242428]" />
              <Box display={'flex'} justifyContent={'space-between'}>
                <Text as="span" fontSize={'14px'} fontWeight={400} color={'#9E9E9F'}>
                  Total Staked
                </Text>
                <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
                  739,590.53 uELP (550,703.30 USDC)
                </Text>
              </Box>
              <Box display={'flex'} justifyContent={'space-between'}>
                <Text as="span" fontSize={'14px'} fontWeight={400} color={'#9E9E9F'}>
                  Total Supply
                </Text>
                <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
                  743,024.28 uELP (553,260.08 USDC)
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
                      onClick={() => setOpenWithdrawFundModal(true)}
                    >
                      With draw Funds
                    </Button>
                    <Button colorScheme="primary" fontSize={'16px'} size="md" onClick={() => setOpenAddFundModal(true)}>
                      Add Funds
                    </Button>
                  </Flex>
                </CustomConnectButton>
              </Box>
            </Box>
          </CardEarn>
        </GridItem>
      </Grid>

      <Box marginTop={'20px'}>
        <Heading as="h3" fontSize="24px" fontWeight={400} marginBottom={'12px'}>
          Vest
        </Heading>
        <Text className="flex w-full items-center">
          Convert esETR tokens to ETR tokens.
          <Link
            href="https://coinbase.com/faucets/base-ethereum-goerli-faucet"
            target="_blank"
            className="group ml-1 flex text-center align-middle text-[#6052FB]"
          >
            <span className="pr-[10px] group-hover:underline">Learn more</span>
            <ArrowRight className="text-white" />
          </Link>
        </Text>
      </Box>

      <Grid templateColumns={{ md: 'repeat(2, 1fr)' }} gap={'20px'}>
        <GridItem w="100%" colSpan={{ md: 2, lg: 1 }}>
          <CardEarn>
            <Heading as="h5" fontSize={'20px'} fontWeight={600} marginBottom={'20px'}>
              ETR Vault
            </Heading>
            <Box display={'flex'} flexDirection={'column'} gap={'8px'}>
              <Box display={'flex'} justifyContent={'space-between'}>
                <Text as="span" fontSize={'14px'} fontWeight={400} color={'#9E9E9F'}>
                  Staked Tokens
                </Text>
                <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
                  0.00
                </Text>
              </Box>
              <Box display={'flex'} justifyContent={'space-between'}>
                <Text as="span" fontSize={'14px'} fontWeight={400} color={'#9E9E9F'}>
                  Reserved for Vesting
                </Text>
                <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
                  0.00 / 0.00
                </Text>
              </Box>
              <Box display={'flex'} justifyContent={'space-between'}>
                <Text as="span" fontSize={'14px'} fontWeight={400} color={'#9E9E9F'}>
                  Vesting Status
                </Text>
                <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
                  0.00 / 0.00
                </Text>
              </Box>
              <Box display={'flex'} justifyContent={'space-between'}>
                <Text as="span" fontSize={'14px'} fontWeight={400} color={'#9E9E9F'}>
                  Claimable
                </Text>
                <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
                  0.00 ETR
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
          </CardEarn>
        </GridItem>

        <GridItem w="100%" colSpan={{ md: 2, lg: 1 }}>
          <CardEarn>
            <Heading as="h5" fontSize={'20px'} fontWeight={600} marginBottom={'20px'}>
              uELP Vault
            </Heading>
            <Box display={'flex'} flexDirection={'column'} gap={'8px'}>
              <Box display={'flex'} justifyContent={'space-between'}>
                <Text as="span" fontSize={'14px'} fontWeight={400} color={'#9E9E9F'}>
                  Staked Tokens
                </Text>
                <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
                  0.00
                </Text>
              </Box>
              <Box display={'flex'} justifyContent={'space-between'}>
                <Text as="span" fontSize={'14px'} fontWeight={400} color={'#9E9E9F'}>
                  Reserved for Vesting
                </Text>
                <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
                  0.00 / 0.00
                </Text>
              </Box>
              <Box display={'flex'} justifyContent={'space-between'}>
                <Text as="span" fontSize={'14px'} fontWeight={400} color={'#9E9E9F'}>
                  Vesting Status
                </Text>
                <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
                  0.00 / 0.00
                </Text>
              </Box>
              <Box display={'flex'} justifyContent={'space-between'}>
                <Text as="span" fontSize={'14px'} fontWeight={400} color={'#9E9E9F'}>
                  Claimable
                </Text>
                <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
                  0.00 ETR
                </Text>
              </Box>
              <hr className="border-[#242428]" />
              <Box position={'absolute'} left={'20px'} right={'20px'} bottom={'20px'} textAlign={'right'}>
                <CustomConnectButton>
                  <Flex gap={'8px'} justifyContent={'flex-end'}>
                    <Button colorScheme="primary" fontSize={'16px'} size="md">
                      Withdraw
                    </Button>
                    <Button colorScheme="primary" fontSize={'16px'} size="md">
                      Deposit
                    </Button>
                  </Flex>
                </CustomConnectButton>
              </Box>
            </Box>
          </CardEarn>
        </GridItem>
      </Grid>
      <AddFundsModal isOpen={openAddFundModal} onDismiss={() => setOpenAddFundModal(false)} />
      <WithdrawFundsModal isOpen={openWithdrawFundModal} onDismiss={() => setOpenWithdrawFundModal(false)} />
      <StakeModal isOpen={openStakeModal} onDismiss={() => setOpenStakeModal(false)} />
      <UnStakeModal isOpen={openUnStakeModal} onDismiss={() => setOpenUnStakeModal(false)} />
      <DepositModal isOpen={openDepositModal} onDismiss={() => setOpenDepositModal(false)} />
      <ClaimModal isOpen={openClaimModal} onDismiss={() => setOpenClaimModal(false)} />
      <CompoundRewardsModal isOpen={openCompoundRewardsModal} onDismiss={() => setOpenCompoundRewardsModal(false)} />
    </Flex>
  );
};
export default EarnView;
