import CustomConnectButton from '@/components/CustomConnectButton';
import { addComma } from '@/utils/number';
import { Heading, Box, Text, Flex, Button, Tooltip, useToast, Link } from '@chakra-ui/react';
import DepositModalELPVault from './DepositModalELPVault';
import { useContext, useState } from 'react';
import { prepareWriteContract, waitForTransaction, writeContract } from '@wagmi/core';
import { appConfig } from '@/config';
import { EarnContext } from '..';
import VBLP_ABI from '@/config/abi/VBLP_ABI';
import { ToastLayout } from '@/components/ToastLayout';
import { Status } from '@/types/faucet.type';
import { BaseError, formatUnits } from 'viem';
import Currency from '@/components/Currency';

const ELPVault = ({
  depositBalances_fBLP,
  pairAmounts_vBLP,
  claimedAmounts_vBLP,
  claimable_vBLP,
  getVestedAmount_vBLP,
}: {
  depositBalances_fBLP: bigint;
  pairAmounts_vBLP: bigint;
  claimedAmounts_vBLP: bigint;
  claimable_vBLP: bigint;
  getVestedAmount_vBLP: bigint;
}) => {
  const toast = useToast();
  const [openDepositModal, setOpenDepositModal] = useState<boolean>(false);
  const { onFetchData } = useContext(EarnContext);
  const [loadingWithdraw, setLoadingWithdraw] = useState<boolean>(false);

  const stakedTokens =  depositBalances_fBLP ? formatUnits(depositBalances_fBLP, 6) : 0;
  const pairAmounts = pairAmounts_vBLP ? formatUnits(pairAmounts_vBLP, 6) : 0;
  // const pairAmounts = +(claimedAmounts_vBLP as bigint)?.toString() / 10 ** 18;
  const claimed = Number(claimedAmounts_vBLP ? formatUnits(claimedAmounts_vBLP, 18) : 0) + Number(claimable_vBLP ? formatUnits(claimable_vBLP, 18) : 0) 
  // (Number(claimedAmounts_vBLP) + Number(claimable_vBLP)) / 10 ** 18;
  const vested =  getVestedAmount_vBLP ? formatUnits(getVestedAmount_vBLP, 18) : 0
  // Number(getVestedAmount_vBLP) / 10 ** 18;

  const claimable = claimable_vBLP ? formatUnits(claimable_vBLP, 18) : 0
  // Number(claimable_vBLP) / 10 ** 18;

  const onWithdraw = async () => {
    if (claimable === 0) {
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
        address: appConfig.VBLP_SC as `0x${string}`,
        abi: VBLP_ABI,
        functionName: 'withdraw',
      });

      const { hash } = await writeContract(configUnStake);
      const data = await waitForTransaction({
        hash,
      });
      toast({
        position: 'top',
        render: ({ onClose }) => (
          <ToastLayout title="Successful transaction" status={Status.SUCCESSS} close={onClose}>
            <p className="text-[14px] font-medium text-white">{'Successful transaction'}</p>
            <Link href={`https://goerli.arbiscan.io/tx/${hash}`} isExternal color="#3396FF" fontSize={'12px'}>
              View on explorer
            </Link>
          </ToastLayout>
        ),
      });
      setLoadingWithdraw(false);
      onFetchData();
    } catch (error) {
      console.log(error)
      setLoadingWithdraw(false);
      console.log(error);
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
        ELP Vault
      </Heading>
      <Box display={'flex'} flexDirection={'column'} gap={'8px'}>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text as="span" fontSize={'12px'} fontWeight={400} color={'#9E9E9F'}>
            Staked Tokens
          </Text>
          <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
            <Currency value={stakedTokens !== undefined ? stakedTokens : 0} decimal={2} /> ELP
          </Text>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text as="span" fontSize={'12px'} fontWeight={400} color={'#9E9E9F'}>
            Reserved for Vesting
          </Text>
          <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
            <Currency value={pairAmounts !== undefined ? pairAmounts : 0} decimal={2} /> /{' '}
            <Currency value={stakedTokens !== undefined ? stakedTokens : 0} decimal={2} />
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
                    {addComma(claimable, 6)} ETR tokens can be claimed, use the options under the Total Rewards section
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
                variant={'outline'}
                fontSize={'16px'}
                size="md"
                onClick={onWithdraw}
                isLoading={loadingWithdraw}
              >
                Withdraw
              </Button>
              <Button colorScheme="primary" fontSize={'16px'} size="md" onClick={() => setOpenDepositModal(true)}>
                Deposit
              </Button>
            </Flex>
          </CustomConnectButton>
        </Box>
      </Box>
      {openDepositModal && (
        <DepositModalELPVault
          isOpen={openDepositModal}
          onDismiss={() => setOpenDepositModal(false)}
          depositBalances={depositBalances_fBLP}
        />
      )}
    </>
  );
};

export default ELPVault;
