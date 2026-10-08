import database from '..';
import { Category } from '../../types/category';
import { Transaction } from '../../types/transaction';
import { Wallet } from '../../types/wallet';
import { prepareCategoriesOps } from './categoryOps';
import { prepareTransactionsOps } from './transactionOps';
import { prepareWalletsOps } from './walletOps';


// Save Insitial Data to Local Database
export const saveInitialDataToLocalDB = async (
  categories: Category[],
  wallets: Wallet[],
  transactions: Transaction[],
) => {
  await database.write(async () => {
    
    // Categories Batch Operations
    const catsOps = await prepareCategoriesOps(categories);

    // Wallets Batch Operations
    const walletsOps = await prepareWalletsOps(wallets);

    // Transactions Batch Operations
    const txsOps = await prepareTransactionsOps(transactions);


    // Batch the operations
    await database.batch(...catsOps, ...walletsOps, ...txsOps);

    console.log(`Initial Data from server is stored in Local DB`);

  });
};
