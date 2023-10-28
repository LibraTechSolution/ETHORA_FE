'use client';

import useTradeStore from '@/store/useTradeStore';
import { addComma, addZeroBefore } from '@/utils/number';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import { Flex, Center, GridItem, Button, Box, Grid, Image, useToast, Tooltip } from '@chakra-ui/react';
import CountDown from './CountDown';
import dayjs from 'dayjs';
import { ITradingData, State } from '@/types/trade.type';
import { cancelTrade } from '@/services/trade';
import { useQueryClient } from '@tanstack/react-query';
import { ToastLayout } from '@/components/ToastLayout';
import { Status } from '@/types/faucet.type';
import { useEffect } from 'react';
import { divide } from '@/utils/operationBigNumber';
import { convertDurationToHourAndMinutes } from '@/utils/time';

interface PropsType {
  item: ITradingData;
  openEditModal: (item: ITradingData) => void;
}

const LimitOrderBox = (props: PropsType) => {
  const { item, openEditModal } = props;
  const { price } = useTradeStore();
  const queryClient = useQueryClient();
  const toast = useToast();

  const handleCancelTrade = async () => {
    try {
      await cancelTrade(item._id);
      queryClient.invalidateQueries({ queryKey: ['getLimitOrders'] });
      toast({
        position: 'top',
        render: ({ onClose }) => <ToastLayout title="Cancel Successfully" status={Status.SUCCESSS} close={onClose} />,
      });
    } catch (error) {
      toast({
        position: 'top',
        render: ({ onClose }) => <ToastLayout title="Cancel Unsuccessfully" status={Status.ERROR} close={onClose} />,
      });
    }
  };

  useEffect(() => {
    if (item.state === State.OPENED) return;

    if (price <= (item.strike * (100 + item.slippage)) / 100 && price >= (item.strike * (100 - item.slippage)) / 100) {
      queryClient.invalidateQueries({ queryKey: ['getLimitOrders'] });
      queryClient.invalidateQueries({ queryKey: ['getActiveTrades'] });
    }
  }, [item.slippage, item.state, item.strike, price, queryClient]);

  const timeOutCallBack = () => {
    // console.log('end');
    queryClient.invalidateQueries({ queryKey: ['getLimitOrders'] });
  };

  const handleOpenEditModal = () => {
    openEditModal(item);
  };

  return (
    <>
      <Box bg="#0c0c10" padding="20px" marginBottom={2} rounded={'10px'}>
        <Flex alignItems="center" justifyContent="space-between" display={{ base: 'flex', xl: 'block', '3xl': 'flex' }}>
          <Center>
            <Image alt="" src={`/images/icons/${item.pair}.png`} w="20px" h="20px" />
            <p className="px-2 text-sm font-normal text-[#fff]">{item.pair && item.pair.toUpperCase()}</p>
            {item.isAbove ? (
              <span className="h-6 rounded border border-[#1ED768] px-[6px] text-sm font-normal text-[#1ED768]">
                <TriangleUpIcon color={'#1ED768'} marginRight="4px" />
                Up
              </span>
            ) : (
              <span className="h-6 rounded border border-[#F03D3E] px-[6px] text-sm font-normal text-[#F03D3E]">
                <TriangleDownIcon color={'#F03D3E'} marginRight="4px" />
                Down
              </span>
            )}
          </Center>
          <Center>
            <span className="rounded bg-[#252528] px-2 text-[#9E9E9F]">Limit Order</span>
          </Center>
        </Flex>
        <CountDown
          endTime={dayjs(item.limitOrderExpirationDate).utc().unix()}
          period={item.limitOrderDuration}
          timeOutCallBack={timeOutCallBack}
          isLimitOrder={true}
        />
        <Box marginTop="2" marginBottom="3">
          <span className="rounded bg-[#252528] px-2 py-1 text-sm text-[#fff]">USDC</span>
        </Box>
        <Grid
          templateColumns="repeat(2, 1fr)"
          borderBottom="1px solid #242428"
          paddingBottom="3"
          marginBottom="3"
          gap={3}
        >
          <GridItem>
            <p className="mb-2 text-xs font-normal text-[#9E9E9F]">Trigger Price</p>
            <p>
              <Tooltip
                hasArrow
                label={item.strike}
                bg="#050506"
                color={'white'}
                placement="bottom-start"
                borderRadius={'4px'}
                fontSize={'12px'}
              >
                <span className="pr-1 text-sm font-normal text-[#FFFFFF]">
                  {addComma(divide(item.strike.toFixed(2), 8), 2)}
                </span>
              </Tooltip>

              <span className="text-xs font-normal text-[#6D6D70]">±{item.slippage}%</span>
            </p>
          </GridItem>
          <GridItem>
            <p className="mb-2 text-xs font-normal text-[#9E9E9F]">Duration</p>
            <p className="text-sm font-normal text-[#FFFFFF]">
              {convertDurationToHourAndMinutes(item.limitOrderDuration)}
            </p>
          </GridItem>
        </Grid>
        <Grid templateColumns="repeat(2, 1fr)" marginBottom="3" gap={3}>
          <GridItem>
            <p className="mb-2 text-xs font-normal text-[#9E9E9F]">Trade Size</p>
            <Tooltip
              hasArrow
              label={divide(item?.tradeSize, 6)}
              bg="#050506"
              color={'white'}
              placement="bottom-start"
              borderRadius={'4px'}
              fontSize={'12px'}
            >
              <p className="text-sm font-normal text-[#FFFFFF]">{addComma(divide(item?.tradeSize, 6), 2)} USDC</p>
            </Tooltip>
          </GridItem>
          <GridItem>
            <p className="mb-2 text-xs font-normal text-[#9E9E9F]">Current Price</p>
            <Tooltip
              hasArrow
              label={price}
              bg="#050506"
              color={'white'}
              placement="bottom-start"
              borderRadius={'4px'}
              fontSize={'12px'}
            >
              <p className="text-sm font-normal text-[#FFFFFF]">{addComma(price.toFixed(2), 2)}</p>
            </Tooltip>
          </GridItem>
        </Grid>
        <Grid templateColumns="repeat(2, 1fr)" marginBottom="3" gap={3}>
          <GridItem>
            <Button
              bg="#252528"
              color="#fff"
              w="full"
              _hover={{ bgColor: '#252528', textColor: '#fff' }}
              _active={{ bgColor: '#252528', textColor: '#fff' }}
              rounded="md"
              onClick={handleCancelTrade}
            >
              Cancel
            </Button>
          </GridItem>
          <GridItem>
            <Button
              borderColor="#1E3EF0"
              textColor="#1E3EF0"
              variant="outline"
              _hover={{ borderColor: '#4B65F3', textColor: '#4B65F3' }}
              _active={{ borderColor: '#122590', textColor: '#122590' }}
              w="full"
              rounded="md"
              onClick={handleOpenEditModal}
            >
              Edit
            </Button>
          </GridItem>
        </Grid>
      </Box>
    </>
  );
};

export default LimitOrderBox;
