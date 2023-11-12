import CustomConnectButton from '@/components/CustomConnectButton';
import { Heading, Box, Text, Flex, Button, Tooltip, Spacer, useToast } from '@chakra-ui/react';
import DepositModal from './DepositModalETRVault';
import { useContext, useState } from 'react';
import { addComma } from '@/utils/number';
import { prepareWriteContract, waitForTransaction, writeContract } from '@wagmi/core';
import { appConfig } from '@/config';
import VBLP_ABI from '@/config/abi/VBLP_ABI';
import useActiveWeb3React from '@/hooks/useActiveWeb3React';
import { EarnContext } from '..';
import VETR_ABI from '@/config/abi/VETR_ABI';
import { ToastLayout } from '@/components/ToastLayout';
import { Status } from '@/types/faucet.type';
import { BaseError, formatUnits } from 'viem';
import Currency from '@/components/Currency';

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
  const toast = useToast();
  const [openDepositModal, setOpenDepositModal] = useState<boolean>(false);
  const { onFetchData } = useContext(EarnContext);
  const [loadingWithdraw, setLoadingWithdraw] = useState<boolean>(false);

  const stakedTokensETR = formatUnits(depositBalances_ETR, 18);
  const stakedTokens_esETR = formatUnits(depositBalances_esETR, 18);
  const multiplierPoints = formatUnits(depositBalances_bnETR, 18);

  const stakedTokens = Number(stakedTokensETR) + Number(stakedTokens_esETR) + Number(multiplierPoints);

  const pairAmounts = formatUnits(pairAmounts_vETR, 18);
  const depositBalances = Number(formatUnits(depositBalances_bnETR, 18)) + Number(formatUnits(depositBalances_sbETR, 18));

  const claimed = Number(formatUnits(claimedAmounts_vETR, 18)) + Number(formatUnits(claimable_vETR, 18));
  const vested = formatUnits(getVestedAmount_vETR, 18)
  const claimable = formatUnits(claimable_vETR, 18)

  console.log('stakedTokensETR', stakedTokensETR)

  const onWithdraw = async () => {
    if (+claimable === 0) {
      toast({
        position: 'top',
        render: ({ onClose }) => (
          <ToastLayout
            // title="Approve account Unsuccessfully"
            content={'You have not deposited any tokens'}
            status={Status.ERROR}
            close={onClose}
          />
        ),
      });
      return;
    }
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
      let msgContent = '';
      if (error instanceof BaseError) {
        if (error.shortMessage.includes('User rejected the request.')) {
          msgContent = 'User rejected the request!';
        } else if (error.shortMessage.includes('the balance of the account')) {
          msgContent = 'Your account balance is insufficient for gas * gas price + value!';
        } else {
          msgContent = 'Something went wrong. Please try again later.';
        }
        toast({
          position: 'top',
          render: ({ onClose }) => (
            <ToastLayout
              // title="Approve account Unsuccessfully"
              content={msgContent}
              status={Status.ERROR}
              close={onClose}
            />
          ),
        });
      } else {
        toast({
          position: 'top',
          render: ({ onClose }) => (
            <ToastLayout
              // title="Approve account Unsuccessfully"
              content={'Something went wrong. Please try again later.'}
              status={Status.ERROR}
              close={onClose}
            />
          ),
        });
      }
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
                    <Box padding={'0 8px'}>{stakedTokensETR !== undefined ? addComma(stakedTokensETR, 6) : '0.00'}</Box>
                  </Flex>
                  <Flex margin={'0 -8px'} alignItems={'center'}>
                    <Box fontSize={'12px'} color={'#9E9E9F'} padding={'0 8px'}>
                      esETR
                    </Box>
                    <Spacer />
                    <Box padding={'0 8px'}>
                      {stakedTokens_esETR !== undefined ? addComma(stakedTokens_esETR, 6) : '0.00'}
                    </Box>
                  </Flex>
                  <Flex margin={'0 -8px'} alignItems={'center'}>
                    <Box fontSize={'12px'} color={'#9E9E9F'} padding={'0 8px'}>
                      Multiplier Points
                    </Box>
                    <Spacer />
                    <Box padding={'0 8px'}>
                      {multiplierPoints !== undefined ? addComma(multiplierPoints, 6) : '0.00'}
                    </Box>
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
            <Currency value={pairAmounts !== undefined ? pairAmounts : 0.00} decimal={2} /> /{' '}
            <Currency value={depositBalances !== undefined ? depositBalances : 0} decimal={2} />
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
                    {claimed !== undefined ? addComma(claimed, 6) : '0.00'} esETR tokens have been converted to ETR from
                    the {vested !== undefined ? addComma(vested, 6) : '0.00'} esETR deposited for vesting.
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
                    {claimable !== undefined ? addComma(claimable, 6) : '0.00'} ETR tokens can be claimed, use the
                    options under the Total Rewards section to claim them.
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
                variant={'outline'}
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
