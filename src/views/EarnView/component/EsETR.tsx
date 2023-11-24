import CustomConnectButton from '@/components/CustomConnectButton';
import { addComma } from '@/utils/number';
import { Heading, Box, Text, Flex, Button, Spacer } from '@chakra-ui/react';
import { formatEther, formatUnits } from 'viem';
import UnStakeModaEsETR from './UnStakeModaEsETR';
import StakeModalEsETR from './StakeModalEsETR';
import { useState } from 'react';
import BigNumber from 'bignumber.js';
import Currency from '@/components/Currency';
import { Tooltip } from 'antd';

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
  const [openStakeModal, setOpenStakeModal] = useState<boolean>(false);
  const [openUnStakeModal, setOpenUnStakeModal] = useState<boolean>(false);

  const esETR_APR = (100 * 31536000 * Number(tokensPerInterval_sETR)) / Number(totalSupply_sETR);
  const USDC_APR =
    (100 * 31536000 * Number(tokensPerInterval_sbfETR) * 10 ** 12) / (Number(totalSupply_sbfETR) * price);
  const boosted_APR = (Number(depositBalances_bnETR) * USDC_APR) / Number(depositBalances_sbETR);

  const total_APR = isNaN(boosted_APR) ? esETR_APR + USDC_APR : esETR_APR + USDC_APR + boosted_APR;
  const totalStaked =
    totalSupply_sETR !== undefined && balanceOf_sETR_ETR !== undefined
      ? formatUnits((totalSupply_sETR - balanceOf_sETR_ETR) as bigint, 18)
      : undefined;
  const totalSupply =
    balanceOf_fsBLP_esETR !== undefined && balanceOf_sETR_esETR !== undefined
      ? formatUnits((balanceOf_fsBLP_esETR + balanceOf_sETR_esETR) as bigint, 18)
      : undefined;

  return (
    <>
      <Heading as="h5" fontSize={'20px'} fontWeight={600} marginBottom={'20px'}>
        Escrowed ETR
      </Heading>
      <Box display={'flex'} flexDirection={'column'} gap={'8px'}>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text fontSize={'12px'} fontWeight={400} color={'#9E9E9F'}>
            Price
          </Text>
          <Text fontSize={'14px'} textAlign={'right'} fontWeight={500} color={'#fffff'}>
            <span>
              $<Currency value={price !== undefined ? price : 0} decimal={2} />
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
                value={balanceOf_esETR !== undefined ? BigNumber(formatEther(balanceOf_esETR as bigint)).toFixed() : 0}
                decimal={2}
                unit="esETR"
              />
              {' esETR'}
            </span>
            <span>
              {' ('}
              <Currency
                value={
                  balanceOf_esETR !== undefined
                    ? BigNumber(formatEther(balanceOf_esETR as bigint))
                        .multipliedBy(price)
                        .toFixed()
                    : 0
                }
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
              <Currency
                value={
                  depositBalances_esETR !== undefined
                    ? BigNumber(formatEther(depositBalances_esETR as bigint)).toFixed()
                    : 0
                }
                decimal={2}
                unit="esETR"
              />
              {' esETR'}
            </span>
            <span>
              {' ('}
              <Currency
                value={
                  depositBalances_esETR !== undefined
                    ? BigNumber(formatEther(depositBalances_esETR as bigint))
                        .multipliedBy(price)
                        .toFixed()
                    : 0
                }
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
                    <Box padding={'0 8px'}>{esETR_APR !== undefined ? BigNumber(esETR_APR).toFormat(6, BigNumber.ROUND_DOWN) : '0.000000'}%</Box>
                  </Flex>
                  <Flex margin={'0 -8px'} alignItems={'center'}>
                    <Box fontSize={'12px'} color={'#9E9E9F'} padding={'0 8px'}>
                      Base USDC APR
                    </Box>
                    <Spacer />
                    <Box padding={'0 8px'}>{USDC_APR !== undefined ? BigNumber(USDC_APR).toFormat(6, BigNumber.ROUND_DOWN) : '0.000000'}%</Box>
                  </Flex>
                  <Flex margin={'0 -8px'} alignItems={'center'}>
                    <Box fontSize={'12px'} color={'#9E9E9F'} padding={'0 8px'}>
                      Boosted APR
                    </Box>
                    <Spacer />
                    <Box padding={'0 8px'}>{boosted_APR !== undefined ? BigNumber(boosted_APR).toFormat(6, BigNumber.ROUND_DOWN) : '0.000000'}%</Box>
                  </Flex>
                </Box>
              }
              // color="white"
              placement="top"
              // bg="#050506"
              // minWidth="215px"
              overlayStyle={{ color: 'white', background: '#050506', maxWidth: '280px' }}
            >
              <Text as="u">{total_APR !== undefined ? BigNumber(total_APR).toFormat(2, BigNumber.ROUND_DOWN) : '0.00'}%</Text>
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
        <hr className="border-[#242428]" />
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text fontSize={'12px'} fontWeight={400} color={'#9E9E9F'}>
            Total Staked
          </Text>
          <Text fontSize={'14px'} textAlign={'right'} fontWeight={500} color={'#fffff'}>
            <span>
              {' '}
              <Currency value={totalStaked !== undefined ? totalStaked : 0} decimal={2} unit="esETR" />
              {' esETR'}
            </span>
            <span>
              {' '}
              {' ('}
              <Currency value={totalStaked !== undefined ? +totalStaked * price : 0} decimal={2} unit="USDC" />
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
              {' '}
              <Currency value={totalSupply !== undefined ? totalSupply : 0} decimal={2} unit="esETR" />
              {' esETR'}
            </span>
            <span>
              {' ('}
              <Currency value={totalSupply !== undefined ? +totalSupply * price : 0} decimal={2} unit="USDC" />
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
                onClick={() => setOpenUnStakeModal(true)}
              >
                Unstake
              </Button>
              <Button colorScheme="primary" fontSize={'16px'} size="md" onClick={() => setOpenStakeModal(true)}>
                Stake
              </Button>
            </Flex>
          </CustomConnectButton>
        </Box>
      </Box>
      {openStakeModal && <StakeModalEsETR isOpen={openStakeModal} onDismiss={() => setOpenStakeModal(false)} />}
      {openUnStakeModal && <UnStakeModaEsETR isOpen={openUnStakeModal} onDismiss={() => setOpenUnStakeModal(false)} />}
    </>
  );
};
export default EsETR;
