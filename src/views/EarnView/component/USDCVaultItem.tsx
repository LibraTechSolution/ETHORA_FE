import CustomConnectButton from '@/components/CustomConnectButton';
import { Heading, Text, Box, Flex, Button, Tooltip, Spacer } from '@chakra-ui/react';
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
  const wallet = Number(stakedAmounts_fsBLP) / 10 ** 6;
  const USDC_APR = (100 * 31536000 * Number(tokensPerInterval_fBLP)) / Number(balanceOf_BLP_USDC);
  const esETR_APR =
    (100 * 31536000 * Number(tokensPerInterval_fsBLP) * price) / (Number(balanceOf_BLP_USDC) * 10 ** 12);

  const Total_APR = USDC_APR + esETR_APR;

  const USDC_Rewards = Number(claimable_fBLP) / 10 ** 6;
  const esETR_Rewards = Number(claimable_fsBLP) / 10 ** 18;
  const esETR_USD_Rewards = (Number(claimable_fsBLP) * price) / 10 ** 18;
  const rewards = USDC_Rewards + esETR_Rewards;
  const withdrawableAmount = Number(getUnlockedLiquidity_BLP) / 10 ** 6;
  const totalStaked = Number(balanceOf_fBLP_BLP) / 10 ** 6;
  const totalStaked_USD = (Number(balanceOf_fBLP_BLP) * price) / 10 ** 6;
  const totalSupply_USD = Number(balanceOf_BLP_USDC) / 10 ** 6;
  const totalSupply = Number(balanceOf_BLP_USDC) / (price * 10 ** 6);

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
        <Tooltip
          hasArrow
          label={
            <Text fontSize={'12px'}>
              USDC vault takes counterposition against each trade and collects up to [percentage] of the settlement fee.
              USDC vault might face drawdowns if traders are collectively net profitable.
            </Text>
          }
          color="white"
          placement="top"
          bg="#050506"
          minWidth="288px"
        >
          <Text>USDC Vault (ELP Token)</Text>
        </Tooltip>
        <Text as="span" textColor={'#6D6D70'} fontWeight={400} fontSize={'14px'} marginTop={'8px'}>
          Max Capacity : 10,000,000 USDC
        </Text>
      </Heading>
      <Box display={'flex'} flexDirection={'column'} gap={'8px'}>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text as="span" fontSize={'12px'} fontWeight={400} color={'#9E9E9F'}>
            Exchange Rate
          </Text>
          <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
            <Tooltip
              hasArrow
              label={
                <Text fontSize={'12px'}>
                  Exchange rate is used to mint and redeem ELP tokens and is calculated as (the total worth of assets in
                  the pool, including profits and losses of all previous trades) / (ELP supply)
                </Text>
              }
              color="white"
              placement="top"
              bg="#050506"
              minWidth="288px"
            >
              <Text as="u">1.00 ELP = {!!exchangeRate ? addComma(exchangeRate.toString(), 2) : '0.00'} USDC</Text>
            </Tooltip>
          </Text>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text as="span" fontSize={'12px'} fontWeight={400} color={'#9E9E9F'}>
            Wallet
          </Text>
          <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
            {wallet !== undefined ? addComma(wallet, 2) : '0.00'} ELP (0.00 USDC)
          </Text>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text as="span" fontSize={'12px'} fontWeight={400} color={'#9E9E9F'}>
            Staked
          </Text>
          <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
            {wallet !== undefined ? addComma(wallet, 2) : '0.00'} ELP (0.00 USDC)
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
                      Escrowed ETR APR
                    </Box>
                    <Spacer />
                    <Box padding={'0 8px'}>{esETR_APR !== undefined && addComma(esETR_APR, 6)}%</Box>
                  </Flex>
                  <Flex margin={'0 -8px'} alignItems={'center'}>
                    <Box fontSize={'12px'} color={'#9E9E9F'} padding={'0 8px'}>
                      USDC APR
                    </Box>
                    <Spacer />
                    <Box padding={'0 8px'}>{USDC_APR !== undefined && addComma(USDC_APR, 6)}%</Box>
                  </Flex>
                  <Text fontSize={'12px'} color={'#9E9E9F'}>
                    APRs are updated weekly on Wednesday and will depend on the fees collected for the week.
                  </Text>
                </Box>
              }
              color="white"
              placement="top"
              bg="#050506"
              minWidth="450px"
            >
              <Text as="u">{Total_APR !== undefined && addComma(Total_APR, 2)}%</Text>
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
                    <Box padding={'0 8px'}>{USDC_Rewards !== undefined ? addComma(USDC_Rewards, 6) : '0.00'}%</Box>
                  </Flex>
                  <Flex margin={'0 -8px'} alignItems={'center'}>
                    <Box fontSize={'12px'} color={'#9E9E9F'} padding={'0 8px'}>
                      Escrowed ETR
                    </Box>
                    <Spacer />
                    <Box padding={'0 8px'}>{`${esETR_Rewards !== undefined ? addComma(esETR_Rewards, 6) : '0.00'}($${
                      esETR_USD_Rewards !== undefined ? addComma(esETR_USD_Rewards, 6) : '0.00'
                    })`}</Box>
                  </Flex>
                </Box>
              }
              color="white"
              placement="top"
              bg="#050506"
              minWidth="215px"
            >
              <Text as="u">${rewards !== undefined ? addComma(rewards, 2) : '0.00'}</Text>
            </Tooltip>
          </Text>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text as="span" fontSize={'12px'} fontWeight={400} color={'#9E9E9F'}>
            Lockup Period
          </Text>
          <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
            {lockupPeriod_BLP ? lockupPeriod_BLP / 86400 : '0.00'} day
          </Text>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text as="span" fontSize={'12px'} fontWeight={400} color={'#9E9E9F'}>
            Withdrawable Amount
          </Text>
          <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
            {withdrawableAmount !== undefined ? addComma(withdrawableAmount, 2) : '0.00'} ELP
          </Text>
        </Box>
        <hr className="border-[#242428]" />
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text as="span" fontSize={'12px'} fontWeight={400} color={'#9E9E9F'}>
            Total Staked
          </Text>
          <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
            {`${totalStaked !== undefined ? addComma(totalStaked, 2) : '0.00'} ELP `}
            {`(${totalStaked_USD !== undefined ? addComma(totalStaked_USD, 2) : '0.00'} USDC)`}
          </Text>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text as="span" fontSize={'12px'} fontWeight={400} color={'#9E9E9F'}>
            Total Supply
          </Text>
          <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
            {`${totalSupply !== undefined ? addComma(totalSupply, 2) : '0.00'} ELP `}
            {`(${totalSupply_USD !== undefined ? addComma(totalSupply_USD, 2) : '0.00'} USDC)`}
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
                onClick={() => setOpenWithdrawFundModal(true)}
              >
                Withdraw Funds
              </Button>
              <Button colorScheme="primary" fontSize={'16px'} size="md" onClick={() => setOpenAddFundModal(true)}>
                Add Funds
              </Button>
            </Flex>
          </CustomConnectButton>
        </Box>
      </Box>
      {openAddFundModal && (
        <AddFundsModal
          isOpen={openAddFundModal}
          onDismiss={() => setOpenAddFundModal(false)}
          exchangeRate={exchangeRate.toString()}
        />
      )}

      {openWithdrawFundModal && (
        <WithdrawFundsModal
          isOpen={openWithdrawFundModal}
          onDismiss={() => setOpenWithdrawFundModal(false)}
          exchangeRate={exchangeRate.toString()}
        />
      )}
    </>
  );
};
export default USDCVaultItem;
