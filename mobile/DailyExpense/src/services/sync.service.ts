import { Q } from '@nozbe/watermelondb';
import {
  getTransactionsApi,
  pushTransactionsApi,
} from '../api/transaction.api';
import database from '../db';
import TransactionModel from '../db/model/transaction';
import { getCategoriesFromLocalDB } from '../db/operations/categoryOps';
import { saveInitialDataToLocalDB } from '../db/operations/syncOps';
import {
  getTransactionsFromLocalDB,
  saveTransactionsToLocalDB,
} from '../db/operations/transactionOps';
import { getWalletsFromLocalDB } from '../db/operations/walletOps';
import {
  getTransactionsLastSyncedAt,
  setTransactionsSyncedAt,
} from '../storage/sync.storage';
import { useCategoryStore } from '../store/useCategoryStore';
import { useDashboardStore } from '../store/useDashboardStore';
import { useTransactionStore } from '../store/useTransactionStore';
import { useWalletStore } from '../store/useWalletStore';
import {
  CreateTransactionPayload,
  SyncDataResponse,
  TransactionType,
} from '../types/transaction';
import { mapTransaction } from '../utils/mapper';
import { getAllCategoriesService } from './category.service';
import { getDashboardService } from './dashboard.service';
import { getTransactionsService } from './transaction.service';
import { getWalletsService } from './wallet.service';

export const runInitialSync = async () => {
  // Ofline First
  // GET the Data from the Local DB First
  const [localCategories, localWallets, localTxs] = await Promise.all([
    getCategoriesFromLocalDB(),
    getWalletsFromLocalDB(),
    getTransactionsFromLocalDB(),
  ]);

  console.log(`GET Initial Data from Local DB`);

  // Update the UI State
  if (localCategories.length > 0)
    useCategoryStore.setState({ categories: localCategories });
  if (localWallets.length > 0)
    useWalletStore.setState({ wallets: localWallets });
  if (localTxs.length > 0) {
    useTransactionStore.setState({ transactions: localTxs });
  }

  // Last Transactions Synced At Time
  const transactionsLastSyncedAt = getTransactionsLastSyncedAt() ?? Date.now();

  //   const [dashboardData, categories, wallets, { syncTimestamp:  data: transactions }] =
  //     await Promise.all([
  //       getDashboardService(),
  //       getAllCategoriesService(),
  //       getWalletsService(),
  //       getTransactionsService({
  //         lastSyncedAt: lastTransactionsSyncedAt
  //       }),
  //     ]);

  const [dashboardData, syncResponse] = await Promise.all([
    getDashboardService(),
    getSyncDataService({ transactionsLastSyncedAt }),
  ]);

  console.log(`GET Initial Data from server to store it on Local DB`);

  const {
    categories,
    wallets,
    transactions,
    syncTimestamp,
  } = syncResponse;

  // Save Data to Local DB
  saveInitialDataToLocalDB(categories, wallets, transactions);

  //  Save Transactions Synced At Time
  setTransactionsSyncedAt(syncTimestamp);

  // Update the UI State
  useDashboardStore.getState().updateDashboard(dashboardData);

  //   useCategoryStore.setState({ categories });
  //   useWalletStore.setState({ wallets });
  //   useTransactionStore
  //     .getState()
  //     .updateInitialTransactionsData(transactionPage1);
};

export const getSyncDataService = async (options: {
  transactionsLastSyncedAt: number;
}): Promise<SyncDataResponse> => {
  const [categories, wallets, transactionRes] = await Promise.all([
    getAllCategoriesService(),
    getWalletsService(),
    getTransactionsService({ lastSyncedAt: options.transactionsLastSyncedAt }),
  ]);

  return {
    categories,
    wallets,
    transactions: transactionRes.data,
    syncTimestamp: transactionRes.syncTimestamp,
  };
};

export const syncPendingTransactions = async () => {
  const txsCollection = database.get<TransactionModel>('transactions');
  const unsyncedTxsModels = await txsCollection
    .query([Q.where('synced', false)])
    .fetch();

  console.log(`Unsynced Transactions of Local DB: ${JSON.stringify(unsyncedTxsModels.map(model => model._raw))}`);

  if (unsyncedTxsModels.length === 0) return;

  const payloads: CreateTransactionPayload[] = unsyncedTxsModels.map(tx => ({
    id: tx.id,
    title: tx.title,
    description: tx.description,
    amount: tx.amount,
    type: tx.type as TransactionType,
    categoryId: tx.categoryId,
    walletId: tx.walletId,
    merchantName: tx.merchantName,
    date: tx.date.toDateString(),
  }));

  try {
    const response = await pushTransactionsApi(payloads);

    if (response.success && response.data) {
      const { transactions: serverTxs, syncTime: serverSyncTime } =
        response.data;

      console.log(`UnSynced Transactions of local DB Pushed to Server Database Successfully`)

      if (serverTxs) {
        await database.write(async () => {
          const localModelsMap = new Map(
            unsyncedTxsModels.map(model => [model.id, model]),
          );

          const updateOps = serverTxs.map(serverTx => {
            const localModel = localModelsMap.get(serverTx?.id ?? '');

            if (!localModel) return null;

            return localModel.prepareUpdate(record => {
              record.synced = true; // Marked as sync
              record.merchantLogo = serverTx.merchantLogo;
              record.updatedAt = new Date(serverTx.updatedAt ?? Date.now());
            });
          });

          database.batch(...updateOps.filter(Boolean));
        });

        console.log(`Created Transactions Synced Successfully in Local DB`);
      }

      // Update Last Synced At
      if (serverSyncTime) {
        setTransactionsSyncedAt(serverSyncTime);
        console.log(`New Sync Time (After pushing Unsynced Transactions): 
          ${serverSyncTime}  |  ${(new Date(serverSyncTime)).toDateString()}`)
      }
    }
  } catch (e: any) {
    console.log('Sync queued for reconnect', e);
  }
};
