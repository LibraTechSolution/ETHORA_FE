import CustomConnectButton from '@/components/CustomConnectButton';
import { addComma } from '@/utils/number';
import { Heading, Box, Text, Flex, Button } from '@chakra-ui/react';
import { formatUnits } from 'viem';

const EsETR = ({
  price,
  balanceOf_esETR,
  depositBalances_esETR,
  tokensPerInterval_sETR,
  totalSupply_sETR,
  tokensPerInterval_sbfETR,
  totalSupply_sbfETR,
  depositBalances_bnETR,
  depositBalances_sbETR,
  balanceOf_sETR_ETR,
  balanceOf_fsBLP_esETR,
  balanceOf_sETR_esETR,
}: {
  price: number;
  balanceOf_esETR: bigint;
  depositBalances_esETR: bigint;
  tokensPerInterval_sETR: bigint;
  totalSupply_sETR: bigint;
  tokensPerInterval_sbfETR: bigint;
  totalSupply_sbfETR: bigint;
  depositBalances_bnETR: bigint;
  depositBalances_sbETR: bigint;
  balanceOf_sETR_ETR: bigint;
  balanceOf_fsBLP_esETR: bigint;
  balanceOf_sETR_esETR: bigint;
}) => {
  const esETR_APR =
    (100 * 31536000 * +(tokensPerInterval_sETR as bigint)?.toString()) / +(totalSupply_sETR as bigint)?.toString();
  const USDC_APR =
    (100 * 31536000 * +(tokensPerInterval_sbfETR as bigint)?.toString() * 10 ** 12) /
    (+(totalSupply_sbfETR as bigint)?.toString() * price);
  const boosted_APR =
    (+(depositBalances_bnETR as bigint)?.toString() * USDC_APR) / +(depositBalances_sbETR as bigint)?.toString();

  const total_APR = isNaN(boosted_APR) ? esETR_APR + USDC_APR : esETR_APR + USDC_APR + boosted_APR;
  const totalStaked = formatUnits(totalSupply_sETR - balanceOf_sETR_ETR, 18);
  const totalSupply = formatUnits(balanceOf_fsBLP_esETR + balanceOf_sETR_esETR, 18);
  return (
    <>
      <Heading as="h5" fontSize={'20px'} fontWeight={600} marginBottom={'20px'}>
        Escrowed ETR
      </Heading>
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
            {balanceOf_esETR !== undefined ? addComma(formatUnits(balanceOf_esETR as bigint, 18), 2) : '---'}
            {' esETR'}
            {balanceOf_esETR !== undefined && `($${addComma(+formatUnits(balanceOf_esETR as bigint, 18) * price, 2)})`}
          </Text>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text as="span" fontSize={'14px'} fontWeight={400} color={'#9E9E9F'}>
            Staked
          </Text>
          <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
            {depositBalances_esETR !== undefined
              ? addComma(formatUnits(depositBalances_esETR as bigint, 18), 2)
              : '---'}
            {' esETR'}
            {depositBalances_esETR !== undefined &&
              `($${addComma(+formatUnits(depositBalances_esETR as bigint, 18) * price, 2)})`}
          </Text>
        </Box>
        <hr className="border-[#242428]" />
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text as="span" fontSize={'14px'} fontWeight={400} color={'#9E9E9F'}>
            APR
          </Text>
          <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
            {total_APR !== undefined ? addComma(total_APR, 2) : '---'}%
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
            {totalStaked !== undefined ? addComma(totalStaked, 2) : '---'}
            {' esETR'}
            {totalStaked !== undefined && `($${addComma(+totalStaked * price, 2)})`}
          </Text>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text as="span" fontSize={'14px'} fontWeight={400} color={'#9E9E9F'}>
            Total Supply
          </Text>
          <Text as="span" fontSize={'14px'} fontWeight={500} color={'#fffff'}>
            {totalSupply !== undefined ? addComma(totalSupply, 2) : '---'}
            {' esETR'}
            {totalSupply !== undefined && `($${addComma(+totalSupply * price, 2)})`}
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
    </>
  );
};
export default EsETR;
