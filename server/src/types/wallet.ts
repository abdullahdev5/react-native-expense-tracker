import { Document, Types } from "mongoose";

export interface IWallet extends Document {
    userId: Types.ObjectId;
    name: string;
    type: WalletType;
    provider?: string | null;
    balance: number;
    currency: string;
    createdAt: Date;
}


export interface IWalletMethods {

    updatebalance(type: string, amount: number, session: any): Promise<IWallet>;

}

export type WalletType = 'cash' | 'bank' | 'card' | 'digital';
export enum WalletTypes {
    cash = 'cash',
    bank = 'bank',
    card = 'card',
    digital = 'digital'
};


export interface CreateWalletRequestDTO {
    name?: string;
    currency?: string;
    type?: string;
    provider?: string;
}

export interface CreateWalletDTO {
    name: string;
    currency: string;
    type: WalletType;
    provider?: string | null;
}