import { map, Observable } from "@nozbe/watermelondb/utils/rx";
import database from "..";
import { Wallet } from "../../types/wallet";
import { assignWalletToModel, mapDbModelToWallet } from "../mapper";
import WalletModel from "../model/wallet";
import { Q } from "@nozbe/watermelondb";


export async function prepareWalletsOps (wallets: Wallet[]): Promise<WalletModel[]> {
  const walletsCollection = database.get<WalletModel>('wallets');
  const existingWallets = await walletsCollection.query().fetch();
  const existingWalletsMap = new Map(
    existingWallets.map(wallet => [wallet.id, wallet]),
  );

  const batchOperations = wallets.map(wallet => {
    const existingWalletModel = existingWalletsMap.get(wallet.id);

    if (existingWalletModel) {
      return existingWalletModel.prepareUpdate(record => {
        assignWalletToModel(record, wallet);
      });
    } else {
      return walletsCollection.prepareCreate(record => {
        record._raw.id = wallet.id;
        assignWalletToModel(record, wallet);
      });
    }
  });

  return batchOperations;
};

export const saveWalletsToLocalDB = async (incomingWallets: Wallet[]) => {
  if (!incomingWallets.length) return;

  await database.write(async () => {
    const walletsOps = await prepareWalletsOps(incomingWallets);
    await database.batch(...walletsOps);
  });
};

export const getWalletsFromLocalDB = async (): Promise<Wallet[]> => {
  return database
    .get<WalletModel>('wallets')
    .query(
      Q.sortBy('created_at', Q.desc)
    )
    .fetch()
    .then((models) => models.map(mapDbModelToWallet));
}

export const observeWalletsFromLocalDB = (): Observable<Wallet[]> => {
  return database
    .get<WalletModel>('wallets')
    .query(
      Q.sortBy('created_at', Q.desc)
    )
    .observe()
    .pipe(map(models => models.map(mapDbModelToWallet)));
}