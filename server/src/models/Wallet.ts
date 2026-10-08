import mongoose from "mongoose";
import { MODEL_NAMES } from "../constants/dbConstants";
import { IWallet, IWalletMethods, WalletTypes } from "../types/wallet";
import { TransactionType } from "../types/transaction";

const walletSchema = new mongoose.Schema<
  IWallet,
  mongoose.Model<IWallet, {}, IWalletMethods>,
  IWalletMethods
>(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: MODEL_NAMES.USER,
      required: true,
    },
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: Object.values(WalletTypes),
      default: 'cash',
      trim: true
    },
    provider: {
      type: String,
      default: null,
      trim: true
    },
    balance: { type: Number, default: 0 },

    currency: { type: String, default: "USD" },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (_, ret: any) {
        ret.id = ret._id.toString();

        delete ret._id;
        delete ret.__v;
        delete ret.userId;

        return ret;
      },
    },
    toObject: {
      transform: function (_, ret: any) {
        ret.id = ret._id.toString();

        delete ret._id;
        delete ret.__v;
        delete ret.userId;

        return ret;
      },
    },
  },
);

// Methods
walletSchema.methods.updatebalance = async function (
  type: string,
  amount: number,
  session: any
): Promise<IWallet> {
  if (type == "income") {
    this.balance += amount;
  } else if (type == "expense") {
    this.balance -= amount;
  }

  return await this.save({ session });
};

export const Wallet = mongoose.model<
  IWallet,
  mongoose.Model<IWallet, {}, IWalletMethods>
>(MODEL_NAMES.WALLET, walletSchema);
