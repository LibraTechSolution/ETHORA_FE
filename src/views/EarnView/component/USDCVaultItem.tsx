import CustomConnectButton from '@/components/CustomConnectButton';
import { Heading, Text, Box, Flex, Button, Spacer } from '@chakra-ui/react';
import AddFundsModal from './AddFundsModal';
import WithdrawFundsModal from './WithdrawFundsModal';
import { useState } from 'react';
import BigNumber from 'bignumber.js';
import { addComma } from '@/utils/number';
import { formatUnits, parseUnits } from 'viem';
import Currency from '@/components/Currency';
import { Tooltip } from 'antd';

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
  maxLiquidity_BLP,
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
  maxLiquidity_BLP: bigint;
}) => {
  const [openAddFundModal, setOpenAddFundModal] = useState<boolean>(false);
  const [openWithdrawFundModal, setOpenWithdrawFundModal] = useState<boolean>(false);

  console.log(
    'exchangeRate',
    totalTokenXBalance_BLP,
    totalSupply_BLP,
    !totalTokenXBalance_BLP,
    !totalSupply_BLP,
    !totalTokenXBalance_BLP || !totalSupply_BLP,
  );
  const exchangeRate =
    !totalTokenXBalance_BLP || !totalSupply_BLP
      ? BigNumber(0)
      : BigNumber(totalTokenXBalance_BLP?.toString()).dividedBy(totalSupply_BLP?.toString());
  console.log('exchangeRate', exchangeRate.toFixed());
  const wallet = Number(stakedAmounts_fsBLP) / 10 ** 6;
  const USDC_APR = (100 * 31536000 * Number(tokensPerInterval_fBLP)) / Number(balanceOf_BLP_USDC);
  const esETR_APR =
    (100 * 31536000 * Number(tokensPerInterval_fsBLP) * price) / (Number(balanceOf_BLP_USDC) * 10 ** 12);
  const Total_APR = USDC_APR + esETR_APR;

  const USDC_Rewards = Number(claimable_fBLP) / 10 ** 6;
  const esETR_Rewards = Number(claimable_fsBLP) / 10 ** 18;
  const esETR_USD_Rewards = (Number(claimable_fsBLP) * price) / 10 ** 18;
  const rewards = USDC_Rewards + esETR_USD_Rewards;
  const withdrawableAmount = Number(getUnlockedLiquidity_BLP) / 10 ** 6;
  const totalStaked = Number(balanceOf_fBLP_BLP) / 10 ** 6;
  const totalStaked_USD = Number(exchangeRate.multipliedBy(balanceOf_fBLP_BLP?.toString())) / 10 ** 6;
  const totalSupply =
    !Number(exchangeRate) || !balanceOf_BLP_USDC ? 0 : Number(balanceOf_BLP_USDC) / (Number(exchangeRate) * 10 ** 6);
  const totalSupply_USD = !Number(exchangeRate) ? 0 : Number(balanceOf_BLP_USDC) / 10 ** 6;

  const getDataY = BigNumber(maxLiquidity_BLP ? formatUnits(maxLiquidity_BLP, 6) : 0).minus(
    totalTokenXBalance_BLP ? formatUnits(totalTokenXBalance_BLP, 6) : 0,
  );

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
          // hasArrow
          title={
            <Text fontSize={'12px'}>
              USDC vault takes counterposition against each trade and collects up to [percentage] of the settlement fee.
              USDC vault might face drawdowns if traders are collectively net profitable.
            </Text>
          }
          // color="white"
          placement="top"
          // bg="#050506"
          // minWidth="288px"
          overlayStyle={{ color: 'white', background: '#050506', maxWidth: '288px' }}
        >
          <Text>USDC Vault (ELP Token)</Text>
        </Tooltip>
        <Text textColor={'#6D6D70'} fontWeight={400} fontSize={'14px'} marginTop={'8px'}>
          Max Capacity : {maxLiquidity_BLP ? BigNumber(formatUnits(maxLiquidity_BLP, 6)).toFormat() : '0.00'} USDC
        </Text>
      </Heading>
      <Box display={'flex'} flexDirection={'column'} gap={'8px'}>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text fontSize={'12px'} fontWeight={400} color={'#9E9E9F'}>
            Exchange Rate
          </Text>
          <Text fontSize={'14px'} textAlign={'right'} fontWeight={500} color={'#fffff'}>
            <Tooltip
              // hasArrow
              title={
                <Text fontSize={'12px'}>
                  Exchange rate is used to mint and redeem ELP tokens and is calculated as (the total worth of assets in
                  the pool, including profits and losses of all previous trades) / (ELP supply)
                </Text>
              }
              // color="white"
              placement="top"
              // bg="#050506"
              // minWidth="288px"
              overlayStyle={{ color: 'white', background: '#050506', maxWidth: '288px' }}
            >
              <Text as="u">
                1.00 ELP = {exchangeRate.toFixed() ? BigNumber(exchangeRate).toFormat(2, BigNumber.ROUND_DOWN) : '0.00'}{' '}
                USDC
              </Text>
            </Tooltip>
          </Text>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text fontSize={'12px'} fontWeight={400} color={'#9E9E9F'}>
            Wallet
          </Text>
          <Text fontSize={'14px'} textAlign={'right'} fontWeight={500} color={'#fffff'}>
            <span>
              <Currency value={wallet !== undefined ? wallet : 0} decimal={2} unit="ELP" />
              {' ELP  '}
            </span>
            <span>
              {'('}
              <Currency
                value={wallet !== undefined ? exchangeRate.multipliedBy(wallet).toFixed() : 0}
                decimal={2}
                unit="USDC"
              />
              {' USDC)'}
            </span>
          </Text>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text fontSize={'12px'} fontWeight={400} color={'#9E9E9F'}>
            Staked
          </Text>
          <Text fontSize={'14px'} textAlign={'right'} fontWeight={500} color={'#fffff'}>
            <span>
              <Currency value={wallet !== undefined ? wallet : 0} decimal={2} unit="ELP" />
              {' ELP  '}
            </span>
            <span>
              {'('}
              <Currency
                value={wallet !== undefined ? exchangeRate.multipliedBy(wallet).toFixed() : 0}
                decimal={2}
                unit="USDC"
              />
              {' USDC)'}
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
                      Escrowed ETR APR
                    </Box>
                    <Spacer />
                    <Box padding={'0 8px'}>
                      {esETR_APR !== undefined ? BigNumber(esETR_APR).toFormat(6, BigNumber.ROUND_DOWN) : '0.000000'}%
                    </Box>
                  </Flex>
                  <Flex margin={'0 -8px'} alignItems={'center'}>
                    <Box fontSize={'12px'} color={'#9E9E9F'} padding={'0 8px'}>
                      USDC APR
                    </Box>
                    <Spacer />
                    <Box padding={'0 8px'}>
                      {USDC_APR !== undefined ? BigNumber(USDC_APR).toFormat(6, BigNumber.ROUND_DOWN) : '0.000000'}%
                    </Box>
                  </Flex>
                  <Text fontSize={'12px'} color={'#9E9E9F'}>
                    APRs are updated weekly on Wednesday and will depend on the fees collected for the week.
                  </Text>
                </Box>
              }
              // color="white"
              placement="top"
              // bg="#050506"
              // minWidth="450px"
              overlayStyle={{ color: 'white', background: '#050506', maxWidth: '288px' }}
            >
              <Text as="u">
                {Total_APR !== undefined ? BigNumber(Total_APR).toFormat(6, BigNumber.ROUND_DOWN) : '0.00'}%
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
                      {USDC_Rewards !== undefined
                        ? BigNumber(USDC_Rewards).toFormat(6, BigNumber.ROUND_DOWN)
                        : '0.000000'}
                    </Box>
                  </Flex>
                  <Flex margin={'0 -8px'} alignItems={'center'}>
                    <Box fontSize={'12px'} color={'#9E9E9F'} padding={'0 8px'}>
                      Escrowed ETR
                    </Box>
                    <Spacer />
                    <Box padding={'0 8px'}>{`${
                      esETR_Rewards !== undefined
                        ? BigNumber(esETR_Rewards).toFormat(6, BigNumber.ROUND_DOWN)
                        : '0.000000'
                    }($${
                      esETR_USD_Rewards !== undefined
                        ? BigNumber(esETR_USD_Rewards).toFormat(6, BigNumber.ROUND_DOWN)
                        : '0.000000'
                    })`}</Box>
                  </Flex>
                </Box>
              }
              // color="white"
              placement="top"
              // bg="#050506"
              // minWidth="350px"
              overlayStyle={{ color: 'white', background: '#050506', maxWidth: '350px' }}
            >
              <Text as="u">
                ${rewards !== undefined ? BigNumber(rewards).toFormat(2, BigNumber.ROUND_DOWN) : '0.00'}
              </Text>
            </Tooltip>
          </Text>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text fontSize={'12px'} fontWeight={400} color={'#9E9E9F'}>
            Lockup Period
          </Text>
          <Text fontSize={'14px'} textAlign={'right'} fontWeight={500} color={'#fffff'}>
            {lockupPeriod_BLP ? lockupPeriod_BLP / 86400 : '0.00'} day
          </Text>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text fontSize={'12px'} fontWeight={400} color={'#9E9E9F'}>
            Withdrawable Amount
          </Text>
          <Text fontSize={'14px'} textAlign={'right'} fontWeight={500} color={'#fffff'}>
            <Currency value={withdrawableAmount !== undefined ? withdrawableAmount : 0} decimal={2} unit="ELP" /> ELP
          </Text>
        </Box>
        <hr className="border-[#242428]" />
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text fontSize={'12px'} fontWeight={400} color={'#9E9E9F'}>
            Total Staked
          </Text>
          <Text fontSize={'14px'} textAlign={'right'} fontWeight={500} color={'#fffff'}>
            <span>
              <Currency value={totalStaked !== undefined ? totalStaked : 0} decimal={2} unit="ELP" />
              {' ELP  '}
            </span>
            <span>
              {'('}
              <Currency value={totalStaked_USD !== undefined ? totalStaked_USD : 0} decimal={2} unit="USDC" />
              {' USDC)'}
            </span>
          </Text>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text fontSize={'12px'} fontWeight={400} color={'#9E9E9F'}>
            Total Supply
          </Text>
          <Text fontSize={'14px'} textAlign={'right'} fontWeight={500} color={'#fffff'}>
            <span>
              <Currency value={totalSupply !== undefined ? totalSupply : 0} decimal={2} unit="ELP" />
              {' ELP  '}
            </span>
            <span>
              {' '}
              {'('}
              <Currency value={totalSupply_USD !== undefined ? totalSupply_USD : 0} decimal={2} unit="USDC" />
              {' USDC)'}
            </span>
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
          getDataY={getDataY}
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
