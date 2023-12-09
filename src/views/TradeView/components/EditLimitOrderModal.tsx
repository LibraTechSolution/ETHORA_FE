'use client';

import { ToastLayout } from '@/components/ToastLayout';
import { editLimitOrder } from '@/services/trade';
import useListShowLinesStore from '@/store/useListShowLinesStore';
import { Status } from '@/types/faucet.type';
import { ITradingData, EditTradeReq } from '@/types/trade.type';
import { divide } from '@/utils/operationBigNumber';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  Button,
  Center,
  Grid,
  GridItem,
  useToast,
} from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { ChangeEvent, useEffect, useState } from 'react';

interface PropsType {
  item: ITradingData | null;
  isOpen: boolean;
  onClose: () => void;
}

const enum TimeType {
  TIME = 'time',
  EXPIRY_TIME = 'expiry time',
}

const EditLimitOrderModal = (props: PropsType) => {
  const { item, isOpen, onClose } = props;
  const listTimes = ['3m', '5m', '15m', '1h'];
  const [time, setTime] = useState<string>('15m');
  const [timeType, setTimeType] = useState<string>('m');
  const [timeNumber, setTimeNumber] = useState<string>('');
  const [expiryTimeType, setExpiryTimeType] = useState<string>('m');
  const [expiryTimeNumber, setExpiryTimeNumber] = useState<string>('');
  const [limitOrderPrice, setLimitOrderPrice] = useState<string>('');
  const [isAbove, setIsAbove] = useState<boolean>(false);
  const toast = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [limitOrderPriceError, setLimitOrderPriceError] = useState<string>('');
  const [timeError, setTimeError] = useState<string>('');
  const [expiryTimeError, setExpiryTimeError] = useState<string>('');
  const { setListLines } = useListShowLinesStore();

  useEffect(() => {
    if (item) {
      const periodToMin = item.period / 60;
      const expiryTimeToMin = item.limitOrderDuration / 60;
      setTime(periodToMin + timeType);
      setTimeNumber(periodToMin.toString());
      setExpiryTimeNumber(expiryTimeToMin.toString());
      setLimitOrderPrice(divide(item.strike, 8).toString());
      setIsAbove(item.isAbove);
    }
  }, [item, timeType]);

  const handleOnChangeTime = (e: ChangeEvent<HTMLInputElement>, type: TimeType) => {
    const numberRegex = /^[0-9]*$/;
    let numberValue = e.target.value;
    if (!numberRegex.test(numberValue)) {
      numberValue = type === TimeType.TIME ? timeNumber.toString() : expiryTimeNumber.toString();
    }
    if (type === TimeType.TIME) {
      setTimeError('');
      setTimeNumber(numberValue);
      setTime(numberValue + timeType);
    } else {
      setExpiryTimeError('');
      setExpiryTimeNumber(numberValue);
    }
  };

  const handleOnchangeTimeType = (e: ChangeEvent<HTMLSelectElement>, type: TimeType) => {
    if (type === TimeType.TIME) {
      setTimeError('');
      setTime(timeNumber + e.target.value);
      setTimeType(e.target.value);
    } else {
      setExpiryTimeError('');
      setExpiryTimeType(e.target.value);
    }
  };

  const handleOnChangeNumber = (e: ChangeEvent<HTMLInputElement>) => {
    setLimitOrderPriceError('');
    const numberRegex = /^[0-9]*([.])?([0-9]{1,8})?$/;
    let numberValue = e.target.value;
    if (!numberRegex.test(numberValue)) {
      numberValue = limitOrderPrice.toString();
    }
    setLimitOrderPrice(numberValue);
  };

  const convertToTimeStamp = (time: string) => {
    if (time.includes('m')) {
      return +time.slice(0, -1) * 60;
    } else {
      return +time.slice(0, -1) * 3600;
    }
  };

  const handleEdit = async () => {
    let hasError = false;
    if (convertToTimeStamp(time) < 180) {
      setTimeError('Minimum duration is 3 minutes');
      hasError = true;
    }
    if (convertToTimeStamp(time) > 14400) {
      setTimeError('Maximum duration is 4 hours');
      hasError = true;
    }
    if (convertToTimeStamp(expiryTimeNumber + expiryTimeType) < 120) {
      setExpiryTimeError('Min limit order expiry time is 2 minutes');
      hasError = true;
    }
    if (convertToTimeStamp(expiryTimeNumber + expiryTimeType) > 86400) {
      setExpiryTimeError('Max limit order expiry time is 24 hours');
      hasError = true;
    }
    if (!limitOrderPrice || +limitOrderPrice < 0.00000001) {
      setLimitOrderPriceError('Minimum limit price is 0.00000001');
      hasError = true;
    } else if (limitOrderPrice && +limitOrderPrice > 1000000000) {
      setLimitOrderPriceError('Maximum limit price is 1,000,000,000');
      hasError = true;
    }
    if (hasError) return;
    setIsLoading(true);

    try {
      if (!item) return;
      const data: EditTradeReq = {
        network: item?.network,
        _id: item?._id,
        strike: +limitOrderPrice * 100000000,
        period: convertToTimeStamp(time),
        slippage: item?.slippage,
        isAbove: isAbove,
        limitOrderDuration: convertToTimeStamp(expiryTimeNumber + expiryTimeType),
      };
      await editLimitOrder(data);
      setListLines(
        {
          ...item,
          strike: data.strike,
          isAbove: data.isAbove,
        },
        true,
      );
      queryClient.invalidateQueries({ queryKey: ['getLimitOrders'] });
      queryClient.invalidateQueries({ queryKey: ['getActiveTrades'] });
      toast({
        position: 'top',
        render: ({ onClose }) => (
          <ToastLayout title="Edited limit order successfully." status={Status.SUCCESSS} close={onClose} />
        ),
      });
      setIsLoading(false);
      onClose();
    } catch (error) {
      toast({
        position: 'top',
        render: ({ onClose }) => (
          <ToastLayout title="Edited limit order unsuccessfully." status={Status.ERROR} close={onClose} />
        ),
      });
      setIsLoading(false);
    }
  };

  return (
    <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxWidth="480px" background="#0f0f11" border="1px solid #242428" rounded="20px">
        <ModalHeader
          color="#fff"
          paddingX="32px"
          paddingTop="22px"
          paddingBottom="20px"
          fontSize="24px"
          fontWeight="600"
          display="flex"
        >
          <Image alt="bitcoin" src={`/images/icons/${item?.pair}.png`} w="32px" h="32px" marginRight={'10px'} />
          {item?.pair.toUpperCase()}
        </ModalHeader>
        <ModalCloseButton color="#fff" top="22px" right="32px" />
        <ModalBody>
          <Flex alignItems={'center'} justifyContent={'space-between'} marginBottom={5}>
            <span className="text-xs font-normal text-[#9E9E9F]">Trade size</span>
            <span className="text-sm text-[#fff]">
              {item && divide(item?.tradeSize, 6)} {item?.token}
            </span>
          </Flex>
          <p className="mb-3 text-xs font-normal text-[#9E9E9F]">Time</p>
          <Box marginBottom={5} display={{ base: 'block', xl: 'flex' }}>
            {listTimes.map((item) => (
              <Button
                key={item}
                border={time === item ? '1px solid #1E3EF0' : ''}
                bgColor="#0C0C10"
                rounded="10px"
                textColor={time === item ? '#fff' : '#6D6D70'}
                fontSize="sm"
                fontWeight="normal"
                width="48px"
                marginRight="4px"
                _hover={{
                  border: '1px solid #1E3EF0',
                  textColor: '#fff',
                }}
                _active={{
                  border: '1px solid #1E3EF0',
                  textColor: '#fff',
                }}
                onClick={() => {
                  setTimeNumber('');
                  setTime(item);
                }}
              >
                {item}
              </Button>
            ))}
            <InputGroup size="md" color={'#fff'}>
              <Input
                pr="4.5rem"
                placeholder="Enter"
                border={timeError ? '1px solid #F03D3E' : 'none'}
                _hover={{ border: 'none' }}
                _focusVisible={{ border: 'none' }}
                bg="#0C0C10"
                rounded={'10px'}
                minWidth={'128px'}
                onChange={(e) => handleOnChangeTime(e, TimeType.TIME)}
                value={timeNumber}
              />
              <InputRightElement width="4.5rem">
                <div className="h-6 border-r-[1px] border-r-[#38383A]"></div>
                <Select
                  value={timeType}
                  onChange={(e) => handleOnchangeTimeType(e, TimeType.TIME)}
                  border={'none'}
                  _focusVisible={{ border: 'none' }}
                >
                  <option value="m" className="!bg-black">
                    m
                  </option>
                  <option value="h" className="!bg-black">
                    h
                  </option>
                </Select>
              </InputRightElement>
            </InputGroup>
          </Box>
          <p className="mb-5 text-sm font-normal text-[#F03D3E]">{timeError}</p>
          <Flex alignItems={'center'} justifyContent={'space-between'}>
            <span className="text-xs font-normal text-[#9E9E9F]">Order expiry time</span>

            <InputGroup size="md" color={'#fff'} width={'126px'}>
              <Input
                pr="4.5rem"
                placeholder="Enter"
                border={expiryTimeError ? '1px solid #F03D3E' : 'none'}
                _hover={{ border: 'none' }}
                _focusVisible={{ border: 'none' }}
                bg="#0C0C10"
                rounded={'10px'}
                width={'126px'}
                onChange={(e) => handleOnChangeTime(e, TimeType.EXPIRY_TIME)}
                value={expiryTimeNumber}
              />
              <InputRightElement width="4.5rem">
                <div className="h-6 border-r-[1px] border-r-[#38383A]"></div>
                <Select
                  value={expiryTimeType}
                  onChange={(e) => handleOnchangeTimeType(e, TimeType.EXPIRY_TIME)}
                  border={'none'}
                  _focusVisible={{ border: 'none' }}
                >
                  <option value="m" className="!bg-black">
                    m
                  </option>
                  <option value="h" className="!bg-black">
                    h
                  </option>
                </Select>
              </InputRightElement>
            </InputGroup>
          </Flex>
          <p className="mb-5 text-sm font-normal text-[#F03D3E]">{expiryTimeError}</p>
          <Flex alignItems="center" justifyContent="space-between">
            <Center>
              <p className="text-xs font-normal text-[#9E9E9F]">Trigger price</p>
            </Center>
            <Center>
              <Input
                value={limitOrderPrice}
                onChange={handleOnChangeNumber}
                border={limitOrderPriceError ? '1px solid #F03D3E' : 'none'}
                _hover={{ border: 'none' }}
                _focusVisible={{ border: 'none' }}
                bg={'#38383A'}
                rounded={'6px'}
                w="167px"
                h="26px"
                color={'#fff'}
              />
            </Center>
          </Flex>
          <p className="mb-5 text-sm font-normal text-[#F03D3E]">{limitOrderPriceError}</p>
          <Grid templateColumns="repeat(2, 1fr)" gap="20px" marginBottom={5}>
            <GridItem>
              <Button
                bgColor={!isAbove ? '#3D3D40' : '#1ED768'}
                textColor={!isAbove ? '#6D6D70' : '#fff'}
                w="full"
                _hover={{ bgColor: '#1ED768', textColor: '#fff' }}
                _active={{ bgColor: '#1ED768', textColor: '#fff' }}
                onClick={() => setIsAbove(true)}
              >
                <TriangleUpIcon w="14px" h="14px" marginRight="10px" />
                Up
              </Button>
            </GridItem>
            <GridItem>
              <Button
                bgColor={isAbove ? '#3D3D40' : '#F03D3E'}
                textColor={isAbove ? '#6D6D70' : '#fff'}
                w="full"
                _hover={{ bgColor: '#F03D3E', textColor: '#fff' }}
                _active={{ bgColor: '#F03D3E', textColor: '#fff' }}
                onClick={() => setIsAbove(false)}
              >
                <TriangleDownIcon w="14px" h="14px" marginRight="10px" />
                Down
              </Button>
            </GridItem>
          </Grid>
          <Button
            bgColor={'#1E3EF0'}
            textColor={'#fff'}
            w="full"
            _hover={{ bgColor: '#4b65f3', textColor: '#fff' }}
            _active={{ bgColor: '#122590', textColor: '#fff' }}
            onClick={handleEdit}
            isLoading={isLoading}
          >
            Save
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EditLimitOrderModal;
