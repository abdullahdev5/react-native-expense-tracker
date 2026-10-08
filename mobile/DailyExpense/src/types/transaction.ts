import { Model } from '@nozbe/watermelondb';
import { Category, CategoryColor, CategoryIcon } from './category';
import { CurrencyCode } from './types';
import { AllWalletProviders, Wallet, WalletType } from './wallet';
import { Field } from 'formik';

/* Models */
export interface TransactionCategory {
  id: string;
  name: string;
  color: CategoryColor;
  icon?: CategoryIcon | null;
}

export interface TransactionWallet {
  id: string;
  name: string;
  type: WalletType;
  provider?: AllWalletProviders | null;
  currency: CurrencyCode;
}

export interface Transaction {
  id: string;
  title: string;
  description?: string | null;
  amount: number;
  categoryId: string;
  category?: TransactionCategory | null;
  type: TransactionType;
  walletId: string;
  wallet?: TransactionWallet | null;
  currency: CurrencyCode;
  date: Date;
  merchantName: string;
  merchantLogo?: string | null;
  updatedAt: Date;
}

export interface FetchTransactionsResponse {
  data: Transaction[];
  syncTimestamp: number;
};

export interface TransactionsPushResponse {
  transactions: Transaction[];
  syncTime?: number;
}



/* DTO's */

export interface TransactionCategoryDTO {
  id?: string;
  name?: string;
  color?: string;
  icon?: string;
}

export interface TransactionWalletDTO {
  id?: string;
  name?: string;
  type?: string;
  provider?: string;
  currency?: string;
}

export interface TransactionDTO {
  id?: string;
  title?: string;
  description?: string | null;
  amount?: number;
  categoryId?: string;
  category?: TransactionCategoryDTO;
  type?: string;
  walletId?: string;
  wallet?: TransactionWalletDTO;
  currency?: string;
  date?: string;
  merchantName?: string;
  merchantLogo?: string | null;
  updatedAt?: string;
}


export interface FetchTransactionsResponseDTO {
  data?: TransactionDTO[];
  syncTimestamp?: number;
};

export interface TransactionsPushResponseDTO {
  transactions?: TransactionDTO[];
  syncTime?: number;
}


/* Types */
export type TransactionType = 'income' | 'expense';

export type CreateTransactionFormValues = {
  date: string;
  categoryId: string;
  walletId: string;
  amount: string;
  title: string;
  description?: string | null;
  type: TransactionType;
  merchantName: string;
};

export type CreateTransactionPayload = {
  id?: string | null;
  date: string;
  categoryId: string;
  walletId: string;
  amount: number;
  title: string;
  description?: string | null;
  type: TransactionType;
  merchantName: string;
};

export type SyncDataResponse = {
  categories: Category[];
  wallets: Wallet[];
  transactions: Transaction[];
  syncTimestamp: number;
}


export type FetchTransactionsQueryParams = {
  includeDetails?: boolean;
  lastSyncedAt: number;
};

/* Enums */
export enum TransactionTypes {
  income = 'income',
  expense = 'expense',
}
