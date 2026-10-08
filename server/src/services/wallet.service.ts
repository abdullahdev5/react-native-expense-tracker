import { Wallet } from "../models/Wallet";
import { supabaseAdmin } from "../config/supabase";
import { BUCKET_NAMES } from "../constants/supabaseConstants";
import { CreateWalletDTO, IWallet } from "../types/wallet";
import { Document, QueryFilter, Types } from "mongoose";
import { HttpError } from "../utils/errors.util";
import { ITransaction } from "../types/transaction";
import { Transaction } from "../models/Transaction";
import { socketService } from "./socket.service";

class WalletService {

  public async addWallet(
    userId: string,
    data: CreateWalletDTO,
  ) {
    // Adding Category
    const wallet = await Wallet.create({
      userId,
      ...data
    });

    this.emitNewWallet(userId, wallet);

    console.log('Wallet is Added: ', JSON.stringify(data));

    return wallet;
  }

  public async deleteWallet(userId: string, walletId: string) {
    const userObjectId = new Types.ObjectId(userId);
    const walletObjectId = new Types.ObjectId(walletId);
    // Wallet Filter
    const walletFilter: QueryFilter<IWallet> = {
      userId: userObjectId,
      _id: walletObjectId,
    };
    // Transaction Filter
    const transactionFilter: QueryFilter<ITransaction> = {
      userId: userObjectId,
      walletId: walletObjectId,
    };

    // Filtering Wallet
    const wallet = await Wallet.findOne(walletFilter);
    // Error (Wallet not found!)
    if (!wallet) {
      throw new HttpError("unable to find the wallet to delete!");
    }

    // Deleting Wallet
    await wallet.deleteOne();

    // filter transactions related to this wallet and deleting
    const transactions = await Transaction.findOneAndDelete(transactionFilter, {
      returnDocument: "after",
    });

    return {
        wallet,
        transactions
    };
  }


  public async getAllWallets(userId: string) {
    return Wallet.find({ userId }).sort({ createdAt: -1 });
  }

  public async getWalletByID(userId: string, walletId: string) {
    return Wallet.findOne({ userId, walletId });
  }


  private emitNewWallet(userId: string, newWallet: IWallet) {
    socketService.emitToUser(userId, 'new_wallet', newWallet.toObject());
  }

  public emitWalletUpdate(userId: string, updatedWallet: IWallet) {
    socketService.emitToUser(userId, 'wallet_update', updatedWallet.toObject());
  }
}


export const walletService = new WalletService();
