import { MMKV } from "react-native-mmkv";
import { User } from "../types/auth";
import { STORAGE_PROFILE_KEYS } from "../constants/storageKeys";
import { storage } from "./mmkv";


class ProfileStorage {
    
    private storage?: MMKV;

    constructor(storage: MMKV) {
        this.storage = storage;
    }


    public setUser(user: User) {
        if (this.storage) {
            this.storage.set(STORAGE_PROFILE_KEYS.userProfile, JSON.stringify(user));
        }
    }

    public getUser(): User | undefined {
        if (this.storage) {
            const userString = this.storage.getString(STORAGE_PROFILE_KEYS.userProfile);
            if (!userString) return undefined;

            return JSON.parse(userString) as User;
        } else {
            return undefined;
        }
    }


}


export const profileStorage = new ProfileStorage(storage);