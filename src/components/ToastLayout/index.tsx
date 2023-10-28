'use client';

import { Status } from '@/types/faucet.type';
import { CloseIcon } from '@chakra-ui/icons';
import { Button, Center, Flex, Image } from '@chakra-ui/react';
import { useMemo } from 'react';

interface ToastProp {
  title: string;
  content?: string;
  status: Status;
  close: () => void;
  children?: React.ReactNode;
}

export const ToastLayout = (toastProp: ToastProp) => {
  const { title, content, status, children, close } = toastProp;

  const toastIcon = useMemo(() => {
    switch (status) {
      case Status.SUCCESSS:
        return '/images/icons/check-circle.svg';
      case Status.WARNINGG:
      case Status.INFO:
      case Status.ERROR:
        return '/images/icons/warning.svg';
    }
  }, [status]);

  const bgColor = useMemo(() => {
    switch (status) {
      case Status.SUCCESSS:
        return '#242428';
      case Status.WARNINGG:
      case Status.INFO:
      case Status.ERROR:
        return '#F03D3E';
    }
  }, [status]);

  return (
    <Flex bgColor={bgColor} paddingX="16px" paddingY="8px" rounded="4px">
      <Center>
        <Image alt="icon" src={toastIcon} width="20px" height="20px" />
      </Center>
      {children ? (
        <Flex flexDirection="column" ml="16px" width="340px" justifyContent="center">
          {children}
        </Flex>
      ) : (
        <Flex flexDirection="column" ml="16px" width="340px" justifyContent="center">
          <p className="text-[14px] font-medium text-white">{title}</p>
          {content && (
            <p className={`text-[14px] font-normal ${status === Status.SUCCESSS ? 'text-[#9E9E9F]' : 'text-white'}`}>
              {content}
            </p>
          )}
        </Flex>
      )}
      <Center>
        <Button
          onClick={close}
          type="button"
          bgColor="transparent"
          p="0"
          _hover={{
            bgColor: 'transparent',
          }}
        >
          <CloseIcon color="#ffffff" />
        </Button>
      </Center>
    </Flex>
  );
};
