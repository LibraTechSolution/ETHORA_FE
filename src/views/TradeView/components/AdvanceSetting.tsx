import useAdvanceSetting, { ISetting, defaultSetting } from '@/store/useAdvanceSetting';
import {
  Box,
  Button,
  Center,
  Flex,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { Switch } from 'antd';
import { RotateCcw } from 'lucide-react';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useAccount } from 'wagmi';

interface Props {
  isShow: boolean;
  onClose: (isShow: boolean) => void;
}

const AdvanceSetting = (props: Props) => {
  const { address } = useAccount();
  const { advanceSetting, setListAdvanceSetting } = useAdvanceSetting();
  const { isShow, onClose } = props;
  const [slippage, setSlippage] = useState<string>('0.05');
  const [slippageError, setSlippageError] = useState<string>('');
  const [timeType, setTimeType] = useState<string>('h');
  const [timeNumber, setTimeNumber] = useState<string>('5');
  const [timeError, setTimeError] = useState<string>('');
  const [isPartialFill, setIsPartialFill] = useState<boolean>(true);
  const [isShowTradeSize, setIsShowTradeSize] = useState<boolean>(true);
  const [isShowSharePopup, setIsShowSharePopup] = useState<boolean>(true);
  const [isShowFavoriteAsset, setIsShowFavoriteAsset] = useState<boolean>(true);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (advanceSetting && address && advanceSetting[address] && isFirstLoad.current) {
      setSlippage(advanceSetting[address].slippage);
      setIsPartialFill(advanceSetting[address].isPartialFill);
      setIsShowTradeSize(advanceSetting[address].isShowTradeSize);
      setIsShowSharePopup(advanceSetting[address].isShowSharePopup);
      setIsShowFavoriteAsset(advanceSetting[address].isShowFavoriteAsset);
      setTimeType(advanceSetting[address].limitOrderExpiryTimeType);
      setTimeNumber(advanceSetting[address].limitOrderExpiryTime.toString());
      isFirstLoad.current = false;
    }
  }, [advanceSetting, address]);

  const setData = (keys: Array<string>, values: Array<string | number | boolean>) => {
    if (advanceSetting && address && keys.length > 0) {
      const temp = { ...advanceSetting[address] };
      keys.forEach((key: string, index) => (temp[key as keyof ISetting] = values[index]));

      setListAdvanceSetting(address, temp);
    }
  };

  const handleOnChangeSlippage = (e: ChangeEvent<HTMLInputElement>) => {
    setSlippageError('');
    let isError = false;
    const numberRegex = /^[0-9]*([.])?([0-9]{1,3})?$/;
    let numberValue = e.target.value;
    if (!numberRegex.test(numberValue)) {
      isError = true;
      numberValue = slippage.toString();
    }
    if (+numberValue > 5) {
      isError = true;
      setSlippageError('Slippage tolerance must be less than 5%');
    }
    if (+numberValue < 0.01) {
      isError = true;
      setSlippageError('Slippage tolerance must be greater than 0.01%');
    }
    setSlippage(numberValue);
    !isError && setData(['slippage'], [numberValue]);
  };

  const convertToTimeStamp = (time: string) => {
    if (time.includes('m')) {
      return +time.slice(0, -1) * 60;
    } else {
      return +time.slice(0, -1) * 3600;
    }
  };

  const handleOnChangeTime = (e: ChangeEvent<HTMLInputElement>) => {
    setTimeError('');
    const numberRegex = /^[0-9]*$/;
    let isError = false;
    let numberValue = e.target.value;
    if (!numberRegex.test(numberValue)) {
      isError = true;
      numberValue = timeNumber.toString();
    }
    if (convertToTimeStamp(numberValue + timeType) < 120) {
      isError = true;
      setTimeError('Min limit order expiry time is 2 minutes');
    }
    if (convertToTimeStamp(numberValue + timeType) > 86400) {
      isError = true;
      setTimeError('Max limit order expiry time is 24 hours');
    }
    setTimeNumber(numberValue);
    !isError && setData(['limitOrderExpiryTime', 'limitOrderExpiryTimeType'], [+numberValue, timeType]);
  };

  const handleOnchangeTimeType = (e: ChangeEvent<HTMLSelectElement>) => {
    setTimeError('');
    setTimeType(e.target.value);
    let isError = false;
    if (convertToTimeStamp(timeNumber + e.target.value) < 120) {
      isError = true;
      setTimeError('Min limit order expiry time is 2 minutes');
    }
    if (convertToTimeStamp(timeNumber + e.target.value) > 86400) {
      isError = true;
      setTimeError('Max limit order expiry time is 24 hours');
    }
    !isError && setData(['limitOrderExpiryTime', 'limitOrderExpiryTimeType'], [+timeNumber, e.target.value]);
  };

  return (
    <Box
      position={'absolute'}
      top={'calc(100% + 10px)'}
      right={0}
      rounded={'20px'}
      paddingX={'32px'}
      paddingY={'26px'}
      w={{ base: 'calc(100vw - 20px)', md: '568px' }}
      display={isShow ? 'block' : 'none'}
      backdropFilter={'blur(7px)'}
      boxShadow={'0px 4px 20px 0px rgba(0, 0, 0, 0.30)'}
      bgColor={'rgba(28, 28, 30, 0.5)'}
    >
      <Flex alignItems="center" justifyContent={'space-between'} marginBottom={'26px'}>
        <Text fontSize={'24px'} fontWeight={600} textColor={'#fff'}>
          Advanced Settings
        </Text>
        <Image alt="close" src={`/images/icons/close-icon.svg`} w="24px" h="24px" onClick={() => onClose(false)} />
      </Flex>
      <Flex alignItems="center" marginBottom={'8px'}>
        <Text fontSize={'16px'} fontWeight={400} textColor={'#fff'} marginRight={'8px'}>
          Trade Settings
        </Text>
        <Button
          bgColor={'#0C0C10'}
          _hover={{ bgColor: '#0C0C10' }}
          _active={{ bgColor: '#0C0C10' }}
          color={'#fff'}
          paddingX={3}
          paddingY={'9px'}
          onClick={() => {
            isFirstLoad.current = true;
            setData(
              ['isPartialFill', 'slippage', 'limitOrderExpiryTime', 'limitOrderExpiryTimeType'],
              [
                defaultSetting.isPartialFill,
                defaultSetting.slippage,
                defaultSetting.limitOrderExpiryTime,
                defaultSetting.limitOrderExpiryTimeType,
              ],
            );
          }}
        >
          <RotateCcw color="#fff" size={16} />
          <Text textColor={'13px'} fontWeight="600" marginLeft={'8px'}>
            Reset
          </Text>
        </Button>
      </Flex>
      <Flex alignItems="center" justifyContent={'space-between'} marginBottom={'8px'}>
        <Box display="flex" alignItems={'center'}>
          <Text fontSize={'12px'} fontWeight={400} textColor={'#9E9E9F'} marginRight={'8px'}>
            Partial fill
          </Text>
          <Tooltip
            hasArrow
            label={
              'By enabling "Partial Fill" your trade will be partially filled rather than cancelled in case of insufficient funds in the write pool'
            }
            color="white"
            placement="top"
            bg="#050506"
            minWidth="215px"
          >
            <Image alt="warning" src={`/images/icons/warning-grey.svg`} w="16px" h="16px" />
          </Tooltip>
        </Box>
        <Switch
          checked={isPartialFill}
          onChange={(value) => {
            setData(['isPartialFill'], [value]);
            setIsPartialFill(value);
          }}
        />
      </Flex>
      <Box display="flex" alignItems={'center'} marginBottom={'14px'}>
        <Text fontSize={'12px'} fontWeight={400} textColor={'#9E9E9F'} marginRight={'8px'}>
          Slippage tolerance
        </Text>
        <Tooltip
          hasArrow
          label={
            'Slippage tolerance is the percentage of price fluctuation you can tolerate before your trade is opened'
          }
          color="white"
          placement="top"
          bg="#050506"
          minWidth="215px"
        >
          <Image alt="warning" src={`/images/icons/warning-grey.svg`} w="16px" h="16px" />
        </Tooltip>
      </Box>
      <Box display={'flex'} marginBottom={'8px'}>
        {['0.03', '0.25', '0.5'].map((item) => (
          <Button
            key={item}
            border={slippage === item ? '1px solid #1E3EF0' : ''}
            bgColor="#0C0C10"
            rounded="10px"
            textColor={slippage === item ? '#fff' : '#6D6D70'}
            fontSize="sm"
            fontWeight="normal"
            width="60px"
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
              setSlippageError('');
              setSlippage(item);
              setData(['slippage'], [item]);
            }}
          >
            {item}%
          </Button>
        ))}
        <Input
          pr="4.5rem"
          placeholder="Enter"
          border={slippageError ? '1px solid #F03D3E' : 'none'}
          _hover={{ border: 'none' }}
          _focusVisible={{ border: 'none' }}
          bg="#0C0C10"
          rounded={'10px'}
          minWidth={'128px'}
          onChange={handleOnChangeSlippage}
          value={slippage}
        />
      </Box>
      <Text textColor={'#F03D3E'} marginBottom={2}>
        {slippageError}
      </Text>
      <Box marginBottom={'20px'}>
        <Box display="flex" alignItems={'center'} justifyContent={'space-between'}>
          <Text fontSize={'12px'} fontWeight={400} textColor={'#9E9E9F'} marginRight={'8px'}>
            Limit order expiry time
          </Text>
          <InputGroup size="md" width={'136px'}>
            <Input
              pr="4.5rem"
              placeholder="Enter"
              border={timeError ? '1px solid #F03D3E' : 'none'}
              _hover={{ border: 'none' }}
              _focusVisible={{ border: 'none' }}
              bg="#0C0C10"
              rounded={'10px'}
              width={'136px'}
              onChange={handleOnChangeTime}
              value={timeNumber}
            />
            <InputRightElement width="4.5rem">
              <div className="h-6 border-r-[1px] border-r-[#38383A]"></div>
              <Select
                value={timeType}
                onChange={handleOnchangeTimeType}
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
        <Text textColor={'#F03D3E'} marginBottom={2}>
          {timeError}
        </Text>
      </Box>
      <Flex alignItems="center" marginBottom={'8px'}>
        <Text fontSize={'16px'} fontWeight={400} textColor={'#fff'} marginRight={'8px'}>
          Share Related settings
        </Text>
        <Button
          bgColor={'#0C0C10'}
          _hover={{ bgColor: '#0C0C10' }}
          _active={{ bgColor: '#0C0C10' }}
          color={'#fff'}
          paddingX={3}
          paddingY={'9px'}
          onClick={() => {
            isFirstLoad.current = true;
            setData(
              ['isShowTradeSize', 'isShowSharePopup'],
              [defaultSetting.isShowTradeSize, defaultSetting.isShowSharePopup],
            );
          }}
        >
          <RotateCcw color="#fff" size={16} />
          <Text textColor={'13px'} fontWeight="600" marginLeft={'8px'}>
            Reset
          </Text>
        </Button>
      </Flex>
      <Flex alignItems="center" justifyContent={'space-between'} marginBottom={'12px'}>
        <Box display="flex" alignItems={'center'}>
          <Text fontSize={'12px'} fontWeight={400} textColor={'#9E9E9F'}>
            Show trade size
          </Text>
        </Box>
        <Switch
          checked={isShowTradeSize}
          onChange={(value) => {
            setData(['isShowTradeSize'], [value]);
            setIsShowTradeSize(value);
          }}
        />
      </Flex>
      <Flex alignItems="center" justifyContent={'space-between'} marginBottom={'20px'}>
        <Box display="flex" alignItems={'center'}>
          <Text fontSize={'12px'} fontWeight={400} textColor={'#9E9E9F'}>
            Show share popup
          </Text>
        </Box>
        <Switch
          checked={isShowSharePopup}
          onChange={(value) => {
            setData(['isShowSharePopup'], [value]);
            setIsShowSharePopup(value);
          }}
        />
      </Flex>
      <Flex alignItems="center" marginBottom={'8px'}>
        <Text fontSize={'16px'} fontWeight={400} textColor={'#fff'} marginRight={'8px'}>
          Miscellaneous
        </Text>
        <Button
          bgColor={'#0C0C10'}
          _hover={{ bgColor: '#0C0C10' }}
          _active={{ bgColor: '#0C0C10' }}
          color={'#fff'}
          paddingX={3}
          paddingY={'9px'}
          onClick={() => {
            isFirstLoad.current = true;
            setData(['isShowFavoriteAsset'], [defaultSetting.isShowFavoriteAsset]);
          }}
        >
          <RotateCcw color="#fff" size={16} />
          <Text textColor={'13px'} fontWeight="600" marginLeft={'8px'}>
            Reset
          </Text>
        </Button>
      </Flex>
      <Flex alignItems="center" justifyContent={'space-between'} marginBottom={'20px'}>
        <Box display="flex" alignItems={'center'}>
          <Text fontSize={'12px'} fontWeight={400} textColor={'#9E9E9F'}>
            Show favorite asset
          </Text>
        </Box>
        <Switch
          checked={isShowFavoriteAsset}
          onChange={(value) => {
            setData(['isShowFavoriteAsset'], [value]);
            setIsShowFavoriteAsset(value);
          }}
        />
      </Flex>
      <Center>
        <Button
          bgColor={'#0C0C10'}
          _hover={{ bgColor: '#0C0C10' }}
          _active={{ bgColor: '#0C0C10' }}
          color={'#fff'}
          paddingX={3}
          paddingY={'9px'}
          onClick={() => {
            isFirstLoad.current = true;
            address && setListAdvanceSetting(address);
          }}
        >
          <RotateCcw color="#fff" size={16} />
          <Text textColor={'16px'} fontWeight="600" marginLeft={'8px'}>
            Reset all settings
          </Text>
        </Button>
      </Center>
    </Box>
  );
};

export default AdvanceSetting;
