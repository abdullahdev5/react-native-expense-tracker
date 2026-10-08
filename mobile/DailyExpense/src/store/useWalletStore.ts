import { create } from 'zustand';
import { Wallet } from '../types/wallet';
import { getWalletsService } from '../services/wallet.service';
import { Subscription } from 'rxjs';
import { observeWalletsFromLocalDB } from '../db/operations/walletOps';

interface WalletStoreState {
  wallets: Wallet[];
  isLoading: boolean;
  error: string | null;
  isSubscribed: boolean;
  subscribeToWallets: () => Subscription;
  fetchWallets: () => Promise<void>;
  addWalletIfNotExists: (newWallet: Wallet) => void;
  updateWallet: (updatedWallet: Wallet) => void;
}

export const useWalletStore = create<WalletStoreState>((set, get) => ({
  wallets: [],
  isLoading: false,
  error: null,
  isSubscribed: false,
  subscribeToWallets: (): Subscription => {
    const subsription = observeWalletsFromLocalDB().subscribe(({
      next: (wallets) => {
        console.log(`Wallets from Local DB: ${JSON.stringify(wallets)}`);
        set({ wallets });
      },
      error: (e: any) => {
        set({ error: e.message });
      }
    }));

    set({ isSubscribed: true });

    return subsription;
  },
  fetchWallets: async (): Promise<void> => {
    set({ isLoading: true });

    try {
      const wallets = await getWalletsService();

      set({
        wallets,
        isLoading: false,
        error: null,
      });
    } catch (e: any) {
      set({ isLoading: false, error: e.message });
    }
  },
  // fetchWallets: async (): Promise<ApiResponse<Wallet[]>> => {
  //   set({ isLoading: true });
  //   const res = await getWalletsService();
  //   if (res.success && res.data) {
  //     const wallets = res.data;
  //     set({
  //       wallets,
  //       isLoading: false,
  //       error: null,
  //     });
  //   } else {
  //     set({ isLoading: false, error: res.message });
  //   }

  //   return res;
  // },
  addWalletIfNotExists: (newWallet: Wallet) => {
    set(state => {
      const walletExists = state.wallets.find(w => w.id === newWallet.id);
      if (walletExists) {
        return { wallets: state.wallets };
      }

      return { wallets: [newWallet, ...state.wallets] };
    });
  },
  updateWallet: (updatedWallet: Wallet) => {
    set(state => {
      const updatedWallets = state.wallets.map(wallet =>
        wallet.id === updatedWallet.id ? updatedWallet : wallet,
      );
      return {
        wallets: updatedWallets,
      };
    });
  },
}));
