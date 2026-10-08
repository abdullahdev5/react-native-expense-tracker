import { STORAGE_DATA_SYNC_KEYS } from "../constants/storageKeys"
import { storage } from "./mmkv"



export const setTransactionsSyncedAt = (lastSyncedAt: number) => {
    storage.set(STORAGE_DATA_SYNC_KEYS.transactionsLastSynedAt, lastSyncedAt);
    console.log(`lastSyncedAT (mmkv set): ${lastSyncedAt}`);
};

export const getTransactionsLastSyncedAt = (): number | null => {
    const lastSyncedAt = storage
        .getNumber(STORAGE_DATA_SYNC_KEYS.transactionsLastSynedAt)
          || null;

    console.log(`lastSyncedAt (mmkv): ${lastSyncedAt}`);

    return lastSyncedAt;
}