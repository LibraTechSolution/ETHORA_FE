import CustomConnectButton from '@/components/CustomConnectButton';
import { Heading, Text, Box, Flex, Button } from '@chakra-ui/react';
import AddFundsModal from './AddFundsModal';
import WithdrawFundsModal from './WithdrawFundsModal';
import { useState } from 'react';
import BigNumber from 'bignumber.js';
import { addComma } from '@/utils/number';

const USDCVaultItem = ({
  price,
  totalTokenXBalance_BLP,
  totalSupply_BLP,
  stakedAmounts_fsBLP,
  claimable_fBLP,
  claimable_fsBLP,
  tokensPerInterval_fBLP,
  balanceOf_BLP_USDC,
  tokensPerInterval_fsBLP,
  lockupPeriod_BLP,
  getUnlockedLiquidity_BLP,
  balanceOf_fBLP_BLP,
}: {
  price: number;
  totalTokenXBalance_BLP: bigint;
  totalSupply_BLP: bigint;
  stakedAmounts_fsBLP: bigint;
  claimable_fBLP: bigint;
  claimable_fsBLP: bigint;
  tokensPerInterval_fBLP: bigint;
  balanceOf_BLP_USDC: bigint;
  tokensPerInterval_fsBLP: bigint;
  lockupPeriod_BLP: number;
  getUnlockedLiquidity_BLP: bigint;
  balanceOf_fBLP_BLP: bigint;
}) => {
  const [openAddFundModal, setOpenAddFundModal] = useState<boolean>(false);
  const [openWithdrawFundModal, setOpenWithdrawFundModal] = useState<boolean>(false);

  // const exchangeRate = totalTokenXBalance_BLP / totalSupply_BLP;
  const exchangeRate = BigNumber(totalTokenXBalance_BLP?.toString()).dividedBy(totalSupply_BLP?.toString());
  const wallet = +stakedAmounts_fsBLP?.toString() / 10 ** 6;
  const USDC_APR =
    (100 * 31536000 * +(tokensPerInterval_fBLP as bigint)?.toString()) / +(balanceOf_BLP_USDC as bigint)?.toString();
  const esETR_APR =
    (100 * 31536000 * +(tokensPerInterval_fsBLP as bigint)?.toString() * price) /
    (+(balanceOf_BLP_USDC as bigint)?.toString() * 10 ** 12);

  const Total_APR = USDC_APR + esETR_APR;

  const USDC_Rewards = +(claimable_fBLP as bigint)?.toString() / 10 ** 6;
  const esETR_USD_Rewards = +(claimable_fsBLP as bigint)?.toString() / 10 ** 18;
  const rewards = USDC_Rewards + esETR_USD_Rewards;
  const withdrawableAmount = +(getUnlockedLiquidity_BLP as bigint)?.toString() / 10 ** 6;
  const totalStaked = +(balanceOf_fBLP_BLP as bigint)?.toString() / 10 ** 6;
  const totalStaked_USD = (+(balanceOf_fBLP_BLP as bigint)?.toString() * price) / 10 ** 6;
  const totalSupply_USD = +(balanceOf_BLP_USDC as bigint)?.toString() / 10 ** 6;
  const totalSupply = +(balanceOf_BLP_USDC as bigint)?.toString() / (price * 10 ** 6);

  console.log('exchangeRate', exchangeRate, typeof exchangeRate);

  return (
    <>
      <Heading
        as="h5"
        fontSize={'20px'}
        fontWeight={600}
        marginBottom={'20px'}
        display={'flex'}
        flexDirection={'column'}
      >
        USDC Vault (ELP Token)
        <Text as="span" textColor={'#6D6D70'} fontWeight={400} fontSize={'14px'}>
          Max Capacity : ----USDC
        </Text>
      </Heading>
      <Box display={'flex'} flexDirection={'column'} gap={'8px'}>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text as="span" fontSize={'14px'} fontWeight={400} color={'#9E9E9F'}>
            Exchange Rate
          </Text>
          <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
            1.00 ELP = {!!exchangeRate ? exchangeRate?.toString() : 0} USDC
          </Text>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text as="span" fontSize={'14px'} fontWeight={400} color={'#9E9E9F'}>
            Wallet
          </Text>
          <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
            {wallet !== undefined ? addComma(wallet, 2) : '---'} ELP (0.00 USDC)
          </Text>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text as="span" fontSize={'14px'} fontWeight={400} color={'#9E9E9F'}>
            Staked
          </Text>
          <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
            {wallet !== undefined ? addComma(wallet, 2) : '---'} ELP (0.00 USDC)
          </Text>
        </Box>
        <hr className="border-[#242428]" />
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text as="span" fontSize={'14px'} fontWeight={400} color={'#9E9E9F'}>
            APR
          </Text>
          <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
            {Total_APR !== undefined && addComma(Total_APR, 2)}%
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
            Lockup Period
          </Text>
          <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
            {lockupPeriod_BLP ? lockupPeriod_BLP / 86400 : '---'} day
          </Text>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text as="span" fontSize={'14px'} fontWeight={400} color={'#9E9E9F'}>
            Withdrawable Amount
          </Text>
          <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
            {withdrawableAmount !== undefined ? addComma(withdrawableAmount, 2) : '---'} ELP
          </Text>
        </Box>
        <hr className="border-[#242428]" />
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text as="span" fontSize={'14px'} fontWeight={400} color={'#9E9E9F'}>
            Total Staked
          </Text>
          <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
            {`${totalStaked !== undefined ? addComma(totalStaked, 2) : '---'} ELP `}
            {`(${totalStaked_USD !== undefined ? addComma(totalStaked_USD, 2) : '---'} USDC)`}
          </Text>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text as="span" fontSize={'14px'} fontWeight={400} color={'#9E9E9F'}>
            Total Supply
          </Text>
          <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
            {`${totalSupply !== undefined ? addComma(totalSupply, 2) : '---'} ELP `}
            {`(${totalSupply_USD !== undefined ? addComma(totalSupply_USD, 2) : '---'} USDC)`}
          </Text>
        </Box>
        <hr className="border-[#242428]" />
        <Box position={'absolute'} left={'20px'} right={'20px'} bottom={'20px'} textAlign={'right'}>
          <CustomConnectButton>
            <Flex gap={'8px'} justifyContent={'flex-end'}>
              <Button colorScheme="primary" fontSize={'16px'} size="md" onClick={() => setOpenWithdrawFundModal(true)}>
                Withdraw Funds
              </Button>
              <Button colorScheme="primary" fontSize={'16px'} size="md" onClick={() => setOpenAddFundModal(true)}>
                Add Funds
              </Button>
            </Flex>
          </CustomConnectButton>
        </Box>
      </Box>
      <AddFundsModal
        isOpen={openAddFundModal}
        onDismiss={() => setOpenAddFundModal(false)}
        exchangeRate={exchangeRate.toString()}
      />
      <WithdrawFundsModal
        isOpen={openWithdrawFundModal}
        onDismiss={() => setOpenWithdrawFundModal(false)}
        exchangeRate={exchangeRate.toString()}
      />
    </>
  );
};
export default USDCVaultItem;
