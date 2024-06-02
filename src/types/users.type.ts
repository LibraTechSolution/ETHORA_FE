export interface IUser {
  address: `0x${string}`;
  banned: boolean;
  faucet: boolean;
  isRegistered: boolean;
  isApproved: boolean;
  nonce: string;
  oneCT: `0x${string}`;
  _id: string;
}
