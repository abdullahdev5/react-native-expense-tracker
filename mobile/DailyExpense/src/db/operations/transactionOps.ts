import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators'
import database from '..';
import { Transaction } from '../../types/transaction';
import { assignTransactionToModel, mapDbModelToTransaction } from '../mapper';
import TransactionModel from '../model/transaction';
import { Q } from '@nozbe/watermelondb';


export async function prepareTransactionsOps (
  transactions: Transaction[],
): Promise<TransactionModel[]> {
  const txCollection = database.get<TransactionModel>('transactions');

  const existingTxs = await txCollection.query().fetch();

  const existingTxsMap = new Map(existingTxs.map(tx => [tx.id, tx]));

  const batchOperations = transactions.map(tx => {
    const existingTxModel = existingTxsMap.get(tx.id);

    if (existingTxModel) {
      return existingTxModel.prepareUpdate(record => {
        assignTransactionToModel(record, tx);
      });
    } else {
      return txCollection.prepareCreate(record => {
        record._raw.id = tx.id;
        assignTransactionToModel(record, tx);
      });
    }
  });

  return batchOperations;
};

export const saveTransactionsToLocalDB = async (
  incomingTransactions: Transaction[],
) => {
  if(!incomingTransactions.length) return;
  
  database.write(async () => {
    const txOps = await prepareTransactionsOps(incomingTransactions);
    await database.batch(...txOps);
  });
};

export const getTransactionsFromLocalDB = async (): Promise<Transaction[]> => {
  const models = await database
    .get<TransactionModel>('transactions')
    .query()
    .fetch();

    return Promise.all(models.map(mapDbModelToTransaction));
};

export const observeTransactionsFromLocalDB = (
  limit: number = 10,
): Observable<Transaction[]> => {
  return database
    .get<TransactionModel>('transactions')
    .query(Q.sortBy('date', Q.desc), Q.take(limit))
    .observe()
    .pipe(
      switchMap(models => from(Promise.all(models.map(mapDbModelToTransaction))))
    );
};

export const getLocalTransactionsCount = async (): Promise<number> => {
  return database
    .get<TransactionModel>('transactions')
    .query()
    .fetchCount();
};


export const searchTransactions = async (searchQuery: string): Promise<Transaction[]> => {
  const data = await database
    .get<TransactionModel>('transactions')
    .query(
      Q.or(
        Q.where('title', Q.like(`%${Q.sanitizeLikeString(searchQuery)}%`)),
        Q.where('description', Q.like(`%${Q.sanitizeLikeString(searchQuery)}%`))
      )
    )
    .fetch();

  return Promise.all(data.map(mapDbModelToTransaction));
};
