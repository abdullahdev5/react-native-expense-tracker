import { STORAGE_AUTH_KEYS } from '../constants/storageKeys';
import { storage } from './mmkv';

// set Token
export const storeToken = (token: string) => {
  storage.set(STORAGE_AUTH_KEYS.token, token);
};

// get Token
export const getToken = (): string | undefined => {
  return storage.getString(STORAGE_AUTH_KEYS.token);
};

// remove Token
export const removeToken = () => {
  storage.remove(STORAGE_AUTH_KEYS.token);
}
