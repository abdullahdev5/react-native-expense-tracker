import ObjectID from "bson-objectid";
import {
  pushTransactionsApi,
  getTransactionsApi,
} from "../api/transaction.api";
import database from "../db";
import TransactionModel from "../db/model/transaction";
import {
  CreateTransactionPayload,
  FetchTransactionsQueryParams,
  Transaction,
  FetchTransactionsResponse,
} from "../types/transaction";
import { mapTransactionResponse } from "../utils/mapper";
import NetInfo from "@react-native-community/netinfo";
import { syncPendingTransactions } from "./sync.service";
import { getTransactionsFromLocalDB } from "@/db/operations/transactionOps";

// export const createTransactionService = async (
//   data: CreateTransactionPayload,
// ): Promise<Transaction | null> => {
//   const res = await pushTransactionsApi([data]);

//   if (!res.success) {
//     throw new Error(res.message || 'failed to create Transaction!');
//   }

//   return res.data ? mapTransaction(res.data) : null;
// };

export const createTransactionLocallyAndSync = async (
  data: CreateTransactionPayload,
) => {
  let newRecord: TransactionModel;

  const newMongoId = new ObjectID().toHexString();

  await database.write(async () => {
    newRecord = await database
      .get<TransactionModel>("transactions")
      .create((record) => {
        record._raw.id = newMongoId;
        record.title = data.title;
        record.description = data.description;
        record.amount = data.amount;
        record.type = data.type;
        record.categoryId = data.categoryId;
        record.walletId = data.walletId;
        record.merchantName = data.merchantName;
        record.date = new Date(data.date);

        record.synced = false; // Marked as unsynced
      });
  });

  console.log(
    `Transaction Created Locally:- ${JSON.stringify(newRecord!._raw)}`,
  );

  const network = await NetInfo.fetch();
  if (network.isConnected) {
    syncPendingTransactions();
  }
};

export const getTransactionsService = async (
  query: FetchTransactionsQueryParams,
): Promise<FetchTransactionsResponse> => {
  const res = await getTransactionsApi(query);

  if (!res.success || !res.data) {
    throw new Error(res.message || "No Transactions found!");
  }

  return mapTransactionResponse(res.data);
};

export const generateTransactionsCSV = async (transactions: Transaction[]): Promise<string> => {
  const headers = ["Title", "Description", "Amount", "Type", "Date"];

  const rows = transactions.map(
    (ts) => `${ts.title},${ts.description},${ts.amount},${ts.type},${ts.date}`,
  );

  const csvContent = [headers.join(","), ...rows].join("\n");

  return csvContent;
};

export const searchTransactions = (query: string): Promise<Transaction[]> => {
  return searchTransactions(query);
}


export const parseImportedTransactions = async (): Promise<Transaction[]> => {
  
}