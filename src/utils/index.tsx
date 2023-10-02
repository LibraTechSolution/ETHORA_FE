import { appConfig } from '@/config';
// import { ItemType } from '@/constants/types';
import { isNil, omitBy } from 'lodash';
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
// export const getCdnImageUrl = (icon: string, type: ItemType) => {
//   return `${appConfig.cdnUrl}/images/icons/${type}/${icon}`;
// };

export function getAssetUrl(src: unknown) {
  return typeof src === 'string' && !src.startsWith('http') ? appConfig.basePath + src : (src as string);
}

export function getNetworkName(chainId?: number) {
  switch (chainId) {
    case 137: {
      return 'polygon';
    }

    case 80001: {
      return 'mumbai';
    }

    case 84531: {
      return 'goerli';
    }

    case 8453: {
      return 'base';
    }

    default: {
      return undefined;
    }
  }
}

export const deleteKeyNil = (params: object) => {
  return omitBy(params, isNil);
};

export const isNilOrEmpty = (val: any) => {
  return isNil(val) || val === '';
};
