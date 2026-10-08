import { create } from 'zustand';
import { User } from '../types/auth';
import { getUserService } from '../services/user.service';
import { ERRORS } from '../constants/errorConstants';
import { getErrorMessage } from '../utils/error';
import { profileStorage } from '../storage/profile.storage';
import { getToken, storeToken } from '../storage/auth.storage';
import { ApiResponse } from '../types/api';

type UserState = {
  user: User | undefined;
  token: string | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | undefined;
  setUser: (user: User | undefined) => void;
  getUser: () => void; //Promise<ApiResponse<User>>;
  refreshUser: () => void;
  logout: () => void;
  updateUserSilently: (newUser: User) => void;
  setAuth: (user: User, token: string) => void;
};

const initialToken = getToken();
const initialUser = profileStorage.getUser();

export const userStore = create<UserState>(set => ({
  user: initialUser || undefined,
  token: initialToken || null,
  isLoading: false,
  isRefreshing: false,
  error: undefined,

  setUser: (user: User | undefined) => {
    set(state => {
      if (state.user === user) return state;

      return {
        user,
        isLoading: false,
        error: undefined,
      };
    });
  },

  getUser: async () => {
    set({ error: undefined });

    const res = await getUserService();

    if (!res.success) {
        console.log('getUser failed!');
    }

    if (res.data) {
        set({ error: undefined, user: res.data });
    }
  },

  refreshUser: async () => {
    set({ isRefreshing: true, error: undefined });

    const res = await getUserService();

    if (!res.success) {
      set({
        isRefreshing: false,
        error: res.message,
      });
      return;
    }

    if (res.data) {
      profileStorage.setUser(res.data);
      set({ isRefreshing: false, error: undefined, user: res.data });
    }
  },

  logout: () => {
    set({
      user: undefined,
      error: undefined,
      isLoading: false,
      token: null,
    });
  },
  updateUserSilently: (newUser: User) => {
    profileStorage.setUser(newUser);
    set({ user: newUser });
  },
  setAuth: (user: User, token: string) => {
    profileStorage.setUser(user);
    storeToken(token);
    set({ user, token });
  },
}));
