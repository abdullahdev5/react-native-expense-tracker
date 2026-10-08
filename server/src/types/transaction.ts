import mongoose, { Document, Model, QueryFilter, Types } from "mongoose";

export interface ITransaction extends Document {
    userId: Types.ObjectId;
    title: string;
    description?: string | null,
    amount: number;
    categoryId: Types.ObjectId;
    type: TransactionType;
    date: Date;
    currency: string;
    walletId: Types.ObjectId;
    merchantName: string;
    merchantLogo?: string | null;
}

export interface ITransactionModel
  extends Model<ITransaction, ITransactionQueryHelpers> {

  // getWithDetails(options: {
  //   // userId: string;
  //   // id?: string;
  //   query?: Record<string, any>;
  //   page?: number;
  //   limit?: number;
  // }): Promise<TransactionResponse>;

  getWithDetails(options: {
    query: Record<string, any>;
    lastSyncedAt?: Date | number | null;
  }): Promise<any[]>;
}

export interface ITransactionQueryHelpers {
  // query(filters: QueryFilter<ITransaction>): mongoose.Query<
  //   mongoose.HydratedDocument<ITransaction>[],
  //   mongoose.HydratedDocument<ITransaction>,
  //   ITransactionQueryHelpers
  // >;
  query(filters: any): any;
  populateCategory(): any;
  populateWallet(): any;
  populateAll(): any;
}


// export interface TransactionResponse {
//   data: any[];
//   meta: {
//     total: number;
//     page: number;
//     limit: number;
//     totalPages: number;
//   }
// };

export interface TransactionResponse {
  data: any[];
  syncTimestamp: number;
}


export interface TransactionDTO {
    id: string;
    title: string;
    description?: string | null,
    amount: number;
    categoryId: string;
    type: string;
    date: string;
    currency: string;
    walletId: string;
    merchantName: string;
    merchantLogo?: string | null;
}


export interface CreateTransactionRequestDTO {
  id?: string;
  title?: string;
  description?: string | null;
  amount?: number;
  categoryId?: string;
  type?: string;
  walletId?: string;
  merchantName?: string;
  date?: string | null;
}

export interface CreateTransactionDTO {
  id: string;
  title: string;
  description?: string | null;
  amount: number;
  categoryId: string;
  type: TransactionType;
  walletId: string;
  merchantName: string;
  date: Date;
}


export type TransactionType = "income" | "expense";
export enum TransactionTypes {
  income = 'income',
  expense = 'expense'
};

export type TransactionOptions = {
  userId: string;
  query: any;
  lastSyncedAt: Date | number | null;
  includeDetails?: boolean | undefined;
}

export type TransactionsPushResponse = {
  transactions: any[];
  syncTime: number;
}

export type SupportedTransactionImportMimeType = 
  'application/json'
  | 'text/csv'
  | 'application/csv'
  | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  | 'application/pdf';