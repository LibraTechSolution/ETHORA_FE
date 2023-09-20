import addresses, { IAddressContract } from '@/config/constants/contracts';

export function formatAddress(address: string | undefined, first = 4, last = 4) {
  return address ? address.slice(0, first) + '...' + address.slice(-last) : '';
}

export const getAddressContract = (chainId = -1): IAddressContract | undefined => {
  return addresses[chainId] ? addresses[chainId] : undefined;
};
