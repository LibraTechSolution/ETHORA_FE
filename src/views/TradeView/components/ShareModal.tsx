import { ToastLayout } from '@/components/ToastLayout';
import useAdvanceSetting from '@/store/useAdvanceSetting';
import { Status } from '@/types/faucet.type';
import { ITradingData, TRADE_STATUS } from '@/types/trade.type';
import { copyText } from '@/utils/copyText';
import { addComma } from '@/utils/number';
import { divide } from '@/utils/operationBigNumber';
import { convertDurationToHourMinutesSeconds } from '@/utils/time';
import { TriangleUpIcon, TriangleDownIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  GridItem,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast,
} from '@chakra-ui/react';
import { QRCode } from 'antd';
import dayjs from 'dayjs';
import { Copy, Download } from 'lucide-react';
import { useMemo, useRef } from 'react';
import { useAccount } from 'wagmi';
import * as htmlToImage from 'html-to-image';

interface PropsType {
  item: ITradingData;
  isOpen: boolean;
  onClose: () => void;
}

const ShareModal = (props: PropsType) => {
  const { item, isOpen, onClose } = props;
  const toast = useToast();
  const { address } = useAccount();
  const { advanceSetting } = useAdvanceSetting();
  const sharePngRef = useRef<HTMLDivElement | null>(null);

  const duration = useMemo(() => {
    let duration = item.period;
    if (item.cancellationDate) {
      duration = dayjs(item.cancellationDate).unix() - dayjs(item.openDate).unix();
    } else if (item.userCloseDate) {
      duration = dayjs(item.userCloseDate).unix() - dayjs(item.openDate).unix();
    }
    return convertDurationToHourMinutesSeconds(duration, true);
  }, [item.cancellationDate, item.openDate, item.period, item.userCloseDate]);

  const handleCopy = () => {
    copyText(window.location.origin);

    toast({
      position: 'top',
      render: ({ onClose }) => <ToastLayout title="Copied successfully" status={Status.SUCCESSS} close={onClose} />,
    });
  };

  const handleDownload = async () => {
    const sharePng = await htmlToImage.toPng(sharePngRef.current as HTMLDivElement);
    const anchor = document.createElement('a');
    anchor.href = sharePng;
    anchor.download = `${dayjs().unix()}.png`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
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
          Share Position
        </ModalHeader>
        <ModalCloseButton color="#fff" top="22px" right="32px" />
        <ModalBody>
          <Box ref={sharePngRef}>
            <Flex justifyContent={'space-between'} alignItems={'center'}>
              <Box>
                <Center justifyContent={'initial'} marginBottom={2}>
                  <Image alt="" src={`/images/icons/${item.pair}.png`} w="32px" h="32px" />
                  <p className="px-[10px] text-2xl font-semibold text-[#fff]">{item.pair && item.pair.toUpperCase()}</p>
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
                <Flex alignItems={'center'}>
                  <Text
                    fontSize={'24px'}
                    fontWeight={600}
                    textColor={item.status === TRADE_STATUS.WIN ? '#1ED768' : '#F03D3E'}
                  >
                    {addComma(divide(item.pnl, 6), 2)} USDC
                  </Text>
                  {address && advanceSetting && advanceSetting[address].isShowTradeSize && (
                    <Box marginLeft={2} paddingLeft={2} borderLeft={'1px solid #38383A'}>
                      <Text color={'#9E9E9F'} fontSize={'12px'} fontWeight={400}>
                        Trade size
                      </Text>
                      <Text color={'#fff'} fontSize={'12px'} fontWeight={400}>
                        {addComma(divide(item.tradeSize, 6), 2)} USDC
                      </Text>
                    </Box>
                  )}
                </Flex>
              </Box>
              <Box>
                <Text color={'#9E9E9F'} fontSize={'12px'} fontWeight={400} marginBottom={'8px'} textAlign={'center'}>
                  Start Trading
                </Text>
                <QRCode type="canvas" value={window.location.origin} className="!bg-white" size={85} />
              </Box>
            </Flex>
            <Grid templateColumns="repeat(3, 1fr)" marginTop={'20px'}>
              <GridItem w="100%" paddingRight="2.5">
                <Text color={'#9E9E9F'} fontSize={'12px'} fontWeight={400} marginBottom={'8px'}>
                  Start Trading
                </Text>
                <Text color={'#fff'} fontSize={'12px'} fontWeight={400}>
                  {addComma(divide(item.strike, 8), 2)} {item.pair.split('-')[1].toUpperCase()}
                </Text>
              </GridItem>
              <GridItem w="100%" paddingRight="2.5">
                <Text color={'#9E9E9F'} fontSize={'12px'} fontWeight={400} marginBottom={'8px'}>
                  Expiry Price
                </Text>
                <Text color={'#fff'} fontSize={'12px'} fontWeight={400}>
                  {addComma(divide(item.expiryPrice ?? 0, 8), 2)} {item.pair.split('-')[1].toUpperCase()}
                </Text>
              </GridItem>
              <GridItem w="100%" paddingRight="2.5">
                <Text color={'#9E9E9F'} fontSize={'12px'} fontWeight={400} marginBottom={'8px'}>
                  Duration
                </Text>
                <Text color={'#fff'} fontSize={'12px'} fontWeight={400}>
                  {duration}
                </Text>
              </GridItem>
            </Grid>
          </Box>
          <Grid templateColumns="repeat(2, 1fr)" gap={'10px'} marginTop={'20px'}>
            <Button
              borderColor="#1E3EF0"
              textColor="#1E3EF0"
              variant="outline"
              _hover={{ borderColor: '#4B65F3', textColor: '#4B65F3' }}
              _active={{ borderColor: '#122590', textColor: '#122590' }}
              w="full"
              rounded="md"
              onClick={handleCopy}
            >
              <Copy />{' '}
              <Text marginLeft={2} fontSize={'16px'} fontWeight={600}>
                Copy
              </Text>
            </Button>
            <Button
              borderColor="#1E3EF0"
              textColor="#1E3EF0"
              variant="outline"
              _hover={{ borderColor: '#4B65F3', textColor: '#4B65F3' }}
              _active={{ borderColor: '#122590', textColor: '#122590' }}
              w="full"
              rounded="md"
              onClick={handleDownload}
            >
              <Download />
              <Text marginLeft={2} fontSize={'16px'} fontWeight={600}>
                Download
              </Text>
            </Button>
          </Grid>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ShareModal;
