import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { ITokens } from '@/types/auth.type';
import { IUser } from '@/types/users.type';

import { StorageStoreName } from './constants';

interface UserState {
  listWallets: {
    [key: string]: {
      user: IUser | null;
      tokens: ITokens | null;
    }
  } | null
  user: IUser | null;
  tokens: ITokens | null;
  currentWallet: string | null;
  setCurrentWallet(currentWallet: string | null): void;
  setUser(user: IUser | null): void;
  setToken(tokens: ITokens | null): void;
  setUserAndTokens(user: IUser | null, tokens: ITokens | null): void;
  deactiveAccount(): void;
}

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      listWallets: null,
      user: null,
      tokens: null,
      currentWallet: null,
      setCurrentWallet: (currentWallet) => set(() => ({ currentWallet })),
      setUser: (user) => set(() => ({ user })),
      setToken: (tokens) => set(() => ({ tokens })),
      setUserAndTokens: (user, tokens) => set((state) => ({
        listWallets: {
          ...state.listWallets,
          [user?.address ?? state.currentWallet as string]: {
            user: user,
            tokens: tokens,
          }
        },
        user: user ? user : state.user,
        tokens: tokens ? tokens : state.tokens,
        currentWallet: user ? user?.address : state.currentWallet
      })),
      deactiveAccount: () => set((state) => {
        if (state?.listWallets && state.currentWallet) {
          delete state?.listWallets[state.currentWallet]
        }
        return {
          listWallets: {
            ...state.listWallets,
          },
          user: null,
          tokens: null,
          currentWallet: null
        }
      })
    }),
    {
      name: StorageStoreName.USER,
    },
  ),
);

export default useUserStore;
