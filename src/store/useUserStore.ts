import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { ITokens } from '@/types/auth.type';
import { IUser } from '@/types/users.type';

import { StorageStoreName } from './constants';

interface UserState {
  user: IUser | null;
  tokens: ITokens | null;
  setUser(user: IUser | null): void;
  setTokens(tokens: ITokens | null): void;
  setUserAndTokens(user: IUser | null, tokens: ITokens | null): void;
}

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      tokens: null,
      setUser: (user) => set(() => ({ user })),
      setTokens: (tokens) => set(() => ({ tokens })),
      setUserAndTokens: (user, tokens) => set(() => ({ user, tokens })),
    }),
    {
      name: StorageStoreName.USER,
    },
  ),
);

export default useUserStore;
