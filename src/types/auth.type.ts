import { IUser } from './users.type';

interface IToken {
  token: string;
  expires: string;
}

export interface ITokens {
  access: IToken;
  refresh: IToken;
}

export interface ILoginRes {
  user: IUser;
  tokens: ITokens;
}

export interface INonce {
  address: string;
  nonce: string;
}
