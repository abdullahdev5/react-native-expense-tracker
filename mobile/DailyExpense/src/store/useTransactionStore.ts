import { create } from 'zustand';
import {
  FetchTransactionsQueryParams,
  Transaction,
  FetchTransactionsResponse,
} from '../types/transaction';
import { getTransactionsService } from '../services/transaction.service';
import { Subscription } from 'rxjs';
import {
  getLocalTransactionsCount,
  observeTransactionsFromLocalDB,
} from '../db/operations/transactionOps';

type TransactionState = {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  limit: number;
  totalItems: number;
  hasMore: boolean;
  subscription: Subscription | null;
  subscribeToTransactions: (limit?: number) => void;
  unsubscribeFromTransactions: () => void;
  addTransactionIfNotExists: (newTransaction: Transaction) => void;

  // Load Pagination
  loadMore: () => Promise<void>;
  refreshCount: () => Promise<void>;
};

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  isLoading: false,
  error: null,
  limit: 10,
  totalItems: 0,
  hasMore: true,

  subscription: null,
  subscribeToTransactions: async (limit?: number) => {
    const currentLimit = limit ?? get().limit;

    if (get().subscription) {
      get().subscription?.unsubscribe();
    }

    set({ isLoading: true });

    // 1. Fetch total count FIRST before observing
    let totalCount = get().totalItems;
    try {
      totalCount = await getLocalTransactionsCount();
      set({ totalItems: totalCount });
    } catch (e) {
      console.warn('Failed to fetch local transactions count:', e);
    }

    // 2. Subscribe after total count is available
    const newSubscription = observeTransactionsFromLocalDB(currentLimit).subscribe({
      next: transactions => {
        // Evaluate hasMore using the updated totalCount
        const hasMore = transactions.length < totalCount;

        console.log(`Transactions loaded: ${transactions.length} / Total: ${totalCount}`);

        set({
          transactions,
          isLoading: false,
          hasMore,
        });
      },
      error: (e: any) => {
        set({ error: e.message, isLoading: false });
      },
    });

    set({ subscription: newSubscription, limit: currentLimit });
  },
  // subscribeToTransactions: (limit?: number) => {
  //   const currentLimit = limit ?? get().limit;

  //   if (get().subscription) {
  //     get().subscription?.unsubscribe();
  //   }

  //   set({ isLoading: true });

  //   const newSubscription = observeTransactionsFromLocalDB(currentLimit).subscribe({
  //     next: transactions => {
  //       const total = get().totalItems;

  //       console.log(`Transactiosn from Local DB: ${JSON.stringify(transactions)}`);
  //       console.log(`Total Transactions Items: ${total}`);

  //       set({
  //         transactions,
  //         isLoading: false,
  //         hasMore: transactions.length < total
  //       });
  //     },
  //     error: (e: any) => {
  //       set({ error: e.message, isLoading: false });
  //     },
  //   });

  //   set({ subscription: newSubscription, limit: currentLimit });
  //   // Refresh the total Items count
  //   get().refreshCount();
  // },
  unsubscribeFromTransactions: () => {
    const { subscription } = get();
    if (!subscription) return;

    subscription?.unsubscribe();
    set({ subscription: null });
  },

  addTransactionIfNotExists: (newTransaction: Transaction) => {
    set(state => {
      const transactionExists = state.transactions.find(
        w => w.id === newTransaction.id,
      );
      if (transactionExists) {
        return { transactions: state.transactions };
      }

      return { transactions: [newTransaction, ...state.transactions] };
    });
  },

  loadMore: async () => {
    const { limit, hasMore, isLoading, subscribeToTransactions } = get();

    console.log(`loadMore (useTransactionsStore) | limit (${limit}) | hasMore(${hasMore}) | isLoading(${isLoading})`);

    if (!hasMore || isLoading) return;

    console.log(`Loading More Transactions from Local DB...`);

    const nextLimit = limit + 10;
    subscribeToTransactions(nextLimit);
  },

  refreshCount: async () => {
    try {
      const count = await getLocalTransactionsCount();
      const { transactions } = get();

      set({
        totalItems: count,
        hasMore: transactions.length < count,
      });
    } catch (e: any) {
      console.warn('faield to fetch local transactions count:', e);
    }
  },
}));
